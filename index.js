var libc = require("./lib/c.js");
var net = require("net");
var events = require("events");
var util = require("util");

function toBuffer(ab) {
	"use strict";
	var buffer = new Buffer(ab.byteLength),
		view = new Uint8Array(ab),
		i;
	for (i = 0; i < buffer.length; i += 1) {
		buffer[i] = view[i];
	}
	return buffer;
}

function toArrayBuffer(buffer) {
	"use strict";
	var ab = new ArrayBuffer(buffer.length),
		view = new Uint8Array(ab),
		i;
	for (i = 0; i < buffer.length; i += 1) {
		view[i] = buffer[i];
	}
	return ab;
}

function Connection(socket) {
	"use strict";
	events.EventEmitter.call(this);
	this.socket = socket;
	this.activeRequestResponse = false;
	var self = this;
	this.socket.on("data", function(buffer) {
		var ab = toArrayBuffer(buffer),
			o,
			err;
		try {
			o = libc.deserialize(ab);
			err = undefined;
		} catch (e) {
			o = null;
			err = e;
		}
		if (self.activeRequestResponse === true) {
			self.emit("res", err, o);
		} else {
			if (err === undefined && Array.isArray(o) && o[0] === "upd") {
				self.emit("upd", o[1], o[2]);
			}
		}
	});
	this.socket.on("end", function() {
		console.log("end");
	});
	this.socket.on("timeout", function() {
		console.log("timeout");
	});
	this.socket.on("error", function(err) {
		console.log("error", err);
	});
	this.socket.on("close", function(had_error) {
		console.log("close", had_error);
	});
}
util.inherits(Connection, events.EventEmitter);
Connection.prototype.auth = function(cb) {
	"use strict";
	if (this.activeRequestResponse === true) {
		throw new Error("Only one request at a time");
	}
	this.activeRequestResponse = true;
	var b = new Buffer(11),
		self = this;
	b.write("anonymous", 0, 9, "ascii"); // auth (username:password)
	b.writeUInt8(0x3, 9); // 3
	b.writeUInt8(0x0, 10); // zero terminated
	this.socket.write(b, function() {
		self.once("res", function(err) {
			self.activeRequestResponse = false;
			cb(err);
		});
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
