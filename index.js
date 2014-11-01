var libc = require("./lib/c.js");
var net = require("net");
var events = require("events");
var util = require("util");

var impl, toBuffer, toArrayBuffer;
try {
	var memcpy = require("memcpy"); // optional dependency
	toBuffer = function(ab) {
		"use strict";
		var buffer = new Buffer(ab.byteLength);
		memcpy(buffer, ab);
		return buffer;
	};
	toArrayBuffer = function(buffer) {
		"use strict";
		var ab = new ArrayBuffer(buffer.length);
		memcpy(ab, buffer);
		return ab;
	};
	impl = "memcpy";
} catch (err) {
	toBuffer = function(ab) {
		"use strict";
		var buffer = new Buffer(ab.byteLength),
			view = new Uint8Array(ab),
			i;
		for (i = 0; i < buffer.length; i += 1) {
			buffer[i] = view[i];
		}
		return buffer;
	};
	toArrayBuffer = function(buffer) {
		"use strict";
		var ab = new ArrayBuffer(buffer.length),
			view = new Uint8Array(ab),
			i;
		for (i = 0; i < buffer.length; i += 1) {
			view[i] = buffer[i];
		}
		return ab;
	};
	impl = "js";
}

function Connection(socket) {
	"use strict";
	events.EventEmitter.call(this);
	this.socket = socket;
	this.nextRequestNo = 1;
	this.nextResponseNo = 1;
	var self = this;
	this.socket.on("end", function() {
		self.emit("end");
	});
	this.socket.on("timeout", function() {
		self.emit("timeout");
	});
	this.socket.on("error", function(err) {
		self.emit("error", err);
	});
	this.socket.on("close", function(had_error) {
		self.emit("close", had_error);
	});
}
util.inherits(Connection, events.EventEmitter);
Connection.prototype.listen = function() {
	"use strict";
	var self = this;
	this.chunk = new Buffer(0);
	this.socket.on("data", function(inbuffer) {
		var buffer,
			length, // current msg length
			ab, // array buffer
			o, // deserialized object
			err, // deserialize error
			type,
			responseNo;

		if (self.chunk.length !== 0) {
			buffer = new Buffer(self.chunk.length + inbuffer.length);
			self.chunk.copy(buffer);
			inbuffer.copy(buffer, self.chunk.length);
		} else {
			buffer = inbuffer;
		}

		while (buffer.length >= 8) {
			length = buffer.readUInt32LE(4);
			if (buffer.length >= length) {
				type = buffer.readInt8(8);
				if (type === -128) { // error type
					o = undefined;
					err = new Error("error " + buffer.toString("ascii", 9, length - 1));
				} else {
					ab = toArrayBuffer(buffer.slice(0, length));
					try {
						o = libc.deserialize(ab);
						err = undefined;
					} catch (e) {
						o = null;
						err = e;
					}
				}
				if (buffer.readUInt8(1) === 2) { // MsgType: 2 := response
					responseNo = self.nextResponseNo;
					self.nextResponseNo += 1;
					self.emit("response:" + responseNo, err, o);
				} else {
					if (err === undefined && Array.isArray(o) && o[0] === "upd") {
						self.emit("upd", o[1], o[2]);
					}
				}
				if (buffer.length > length) {
					buffer = buffer.slice(length);
				} else {
					buffer = new Buffer(0);
				}
			} else {
				break;
			}
		}

		self.chunk = buffer;
	});
};
Connection.prototype.auth = function(auth, cb) {
	"use strict";
	var n = Buffer.byteLength(auth, "ascii"),
		b = new Buffer(n + 2),
		self = this;
	b.write(auth, 0, n, "ascii"); // auth (username:password)
	b.writeUInt8(0x1, n); // capability byte (compression, timestamp, timespan) http://code.kx.com/wiki/Reference/ipcprotocol#Handshake
	b.writeUInt8(0x0, n+1); // zero terminated
	this.socket.write(b);
	this.socket.once("data", function(buffer) {
		if (buffer.length === 1) {
			if (buffer[0] >= 1) { // capability byte must support at least (compression, timestamp, timespan) http://code.kx.com/wiki/Reference/ipcprotocol#Handshake
				self.listen();
				cb();
			} else {
				cb(new Error("Invalid capability byte from server"));
			}	
		} else {
			cb(new Error("Invalid auth response from server"));
		}
	});
};
Connection.prototype.k = function(s, x, y, z, cb) {
	"use strict";
	cb = arguments[arguments.length - 1];
	var self = this,
		payload,
		ab, // array buffer
		b,
		requestNo = this.nextRequestNo;
	this.nextRequestNo += 1;
	if (arguments.length === 2) {
		payload = s;
	} else if (arguments.length === 3) {
		payload = [s, x];
	} else if (arguments.length === 4) {
		payload = [s, x, y];
	} else if (arguments.length === 5) {
		payload = [s, x, y, z];
	} else {
		throw new Error("only two to five arguments allowed");
	}
	ab = libc.serialize(payload);
	b = toBuffer(ab);
	b.writeUInt8(0x1, 1); // MsgType: 1 := sync
	this.socket.write(b, function() {
		self.once("response:" + requestNo, function(err, o) {
			cb(err, o);
		});
	});
};
Connection.prototype.ks = function(s, x, y, z, cb) {
	"use strict";
	cb = arguments[arguments.length - 1];
	var payload,
		ab, // array buffer
		b;
	if (arguments.length === 2) {
		payload = s;
	} else if (arguments.length === 3) {
		payload = [s, x];
	} else if (arguments.length === 4) {
		payload = [s, x, y];
	} else if (arguments.length === 5) {
		payload = [s, x, y, z];
	} else {
		throw new Error("only two to five arguments allowed");
	}
	ab = libc.serialize(payload);
	b = toBuffer(ab);
	this.socket.write(b, function() {
		cb();
	});
};
Connection.prototype.close = function(cb) {
	"use strict";
	this.socket.once("close", function() {
		if (cb) {
			cb();
		}
	});
	this.socket.end();
};

function connect(host, port, user, password, cb) {
	"use strict";
	var auth,
		errorcb,
		closecb,
		socket,
		error = false,
		close = false;
	cb = arguments[arguments.length -1];
	if (arguments.length === 3) {
		auth = "anonymous";
	} else if (arguments.length === 5) {
		auth = user + ":" + password;
	} else {
		throw new Error("only three or five arguments allowed");
	}
	errorcb = function(err) {
		error = true;
		cb(err);
	};
	closecb = function() {
		close = true;
		cb(new Error("Connection closes (wrong auth?)"));
	};
	socket = net.connect(port, host, function() {
		socket.removeListener("error", errorcb);
		if (error === false) {
			socket.once("close", closecb);
			var con = new Connection(socket);
			con.auth(auth, function() {
				socket.removeListener("close", closecb);
				if (close === false) {
					cb(undefined, con);
				}
			});
		}
	});
	socket.once("error", errorcb);
}
exports.connect = connect;

exports.impl = impl;
