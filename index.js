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
	console.log("fallback");
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
	this.activeRequestResponse = false;
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
			err; // deserialize error

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
				ab = toArrayBuffer(buffer.slice(0, length));
				try {
					o = libc.deserialize(ab);
					err = undefined;
				} catch (e) {
					o = null;
					err = e;
				}
				if (buffer.readUInt8(1) === 2) { // MsgType: 2 := response
					if (self.activeRequestResponse === true) {
						self.emit("res", err, o);
					}
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
Connection.prototype.auth = function(cb) {
	"use strict";
	var b = new Buffer(11),
		self = this;
	b.write("anonymous", 0, 9, "ascii"); // auth (username:password)
	b.writeUInt8(0x3, 9); // 3
	b.writeUInt8(0x0, 10); // zero terminated
	this.socket.write(b);
	this.socket.once("data", function(buffer) {
		if (buffer.length === 1) { // capability byte
			self.listen();
			cb();
		} else {
			cb(new Error("Invalid auth response from server"));
		}
	});
};
Connection.prototype.k = function(s, x, y, z, cb) {
	"use strict";
	if (this.activeRequestResponse === true) {
		throw new Error("Only one request at a time");
	}
	this.activeRequestResponse = true;
	cb = arguments[arguments.length -1];
	var self = this,
		payload,
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
	b.writeUInt8(0x1, 1); // MsgType: 1 := sync
	this.socket.write(b, function() {
		self.once("res", function(err, o) {
			self.activeRequestResponse = false;
			cb(err, o);
		});
	});
};
Connection.prototype.ks = function(s, x, y, z, cb) {
	"use strict";
	cb = arguments[arguments.length -1];
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

function connect(host, port, cb) {
	"use strict";
	function errorcb(err) {
		cb(err);
	}
	var socket = net.connect(port, host, function() {
		socket.removeListener("error", errorcb);
		var con = new Connection(socket);
		con.auth(function() {
			cb(undefined, con);
		});
	});
	socket.once("error", errorcb);
}
exports.connect = connect;

exports.impl = impl;
