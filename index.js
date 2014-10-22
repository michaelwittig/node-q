var c = require("./lib/c.js");
var net = require("net");
var events = require("events");

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

function connect(host, port) {
	var emitter = new events.EventEmitter();
	var ready = false;
	var socket = net.connect(port, host, function() {
		var b = new Buffer(11);
		b.write("anonymous", 0, 9, "ascii"); // auth (username:password)
		b.writeUInt8(0x3, 9); // 3
		b.writeUInt8(0x0, 10); // zero terminated
		socket.write(b, function() {
			ready = true;
			emitter.emit("ready");
		});
	});
	socket.on("data", function(buffer) {
		// TODO read header length and then wait until complete message is received
		var ab = toArrayBuffer(buffer);
		var o;
		var err;
		try {
			o = c.deserialize(ab);
			err = undefined;
		} catch (e) {
			o = null;
			err = e;
		}
		socket.emit("o", err, o);
		if (err === undefined && Array.isArray(o) && o[0] === "upd") {
			emitter.emit("upd", o[1], o[2]);
		}
	});
	socket.on("end", function() {
		console.log("end");
	});
	socket.on("timeout", function() {
		console.log("timeout");
	});
	socket.on("error", function(err) {
		console.log("error", err);
	});
	socket.on("close", function(had_error) {
		console.log("close", had_error);
		connected = false;
	});

	return {
		"k": function k(s, x, y, z, cb) {
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
			if (ready === false) {
				var args = arguments;
				setTimeout(function() {
					k.apply(socket, args);
				}, 500);
			} else {
				var ab = c.serialize(payload); // array buffer
				var b = toBuffer(ab);
				b.writeUInt8(0x1, 1); // MsgType: 1 := sync
				socket.write(b, function() {
					socket.once("o", function(err, o) {
						cb(err, o);
					});
				});
			}
		},
		"ks": function ks(s, x, y, z, cb) {
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
			if (ready === false) {
				var args = arguments;
				setTimeout(function() {
					ks.apply(socket, args);
				}, 500);
			} else {
				var ab = c.serialize(payload); // array buffer
				var b = toBuffer(ab);
				socket.write(b, function() {
					cb();
				});
			}
		},
		"close": function(cb) {
			socket.once("close", function() {
				if (cb) {
					cb();
				}
			});
			socket.end();
		},
		"addListener": emitter.addListener,
		"on": emitter.on,
		"once": emitter.once,
		"removeListener": emitter.removeListener,
		"removeAllListeners": emitter.removeAllListeners,
		"listeners": emitter.listeners,
		"socket": socket
	}
}
exports.connect = connect;
