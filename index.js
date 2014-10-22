var libc = require("./lib/c.js");
var net = require("net");
var events = require("events");
var util = require("util");

function toBuffer(ab) {
	var buffer = new Buffer(ab.byteLength);
	var view = new Uint8Array(ab);
	for (var i = 0; i < buffer.length; i += 1) {
		buffer[i] = view[i];
	}
	return buffer;
}

function toArrayBuffer(buffer) {
	var ab = new ArrayBuffer(buffer.length);
	var view = new Uint8Array(ab);
	for (var i = 0; i < buffer.length; i += 1) {
		view[i] = buffer[i];
	}
	return ab;
}

function Connection(socket) {
	events.EventEmitter.call(this);
	this.socket = socket;
	var self = this;
	this.socket.on("data", function(buffer) {
		// TODO read header length and then wait until complete message is received
		var ab = toArrayBuffer(buffer);
		var o;
		var err;
		try {
			o = libc.deserialize(ab);
			err = undefined;
		} catch (e) {
			o = null;
			err = e;
		}
		self.emit("o", err, o);
		if (err === undefined && Array.isArray(o) && o[0] === "upd") {
			self.emit("upd", o[1], o[2]);
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
	var b = new Buffer(11);
	b.write("anonymous", 0, 9, "ascii"); // auth (username:password)
	b.writeUInt8(0x3, 9); // 3
	b.writeUInt8(0x0, 10); // zero terminated
	var self = this;
	this.socket.write(b, function() {
		self.once("o", function(err, o) {
			cb(err);
		});
	});
}
Connection.prototype.k = function(s, x, y, z, cb) {
	cb = arguments[arguments.length -1];
	var payload;
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
	var ab = libc.serialize(payload); // array buffer
	var b = toBuffer(ab);
	b.writeUInt8(0x1, 1); // MsgType: 1 := sync
	var self = this;
	this.socket.write(b, function() {
		self.once("o", function(err, o) {
			cb(err, o);
		});
	});
}
Connection.prototype.ks = function(s, x, y, z, cb) {
	cb = arguments[arguments.length -1];
	var payload;
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
	var ab = libc.serialize(payload); // array buffer
	var b = toBuffer(ab);
	this.socket.write(b, function() {
		cb();
	});
}
Connection.prototype.close = function(cb) {
	this.socket.once("close", function() {
		if (cb) {
			cb();
		}
	});
	this.socket.end();
}

function connect(host, port, cb) {
	var emitter = new events.EventEmitter();
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
