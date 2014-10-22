var c = require("./lib/c.js");
var net = require("net");
var memcpy = require("memcpy");

function toBuffer(ab) {
	var buffer = new Buffer(ab.byteLength);
	var view = new Uint8Array(ab);
	for (var i = 0; i < buffer.length; ++i) {
		buffer[i] = view[i];
	}
	return buffer;
}

function toArrayBuffer(buffer) {
	var ab = new ArrayBuffer(buffer.length);
	var view = new Uint8Array(ab);
	for (var i = 0; i < buffer.length; ++i) {
		view[i] = buffer[i];
	}
	return ab;
}

function connect(host, port) {
	var ready = false;
	var socket = net.connect(port, host, function() {
		var b = new Buffer(11);
		b.write("anonymous", 0, 9, "ascii"); // auth (username:password)
		b.writeUInt8(0x3, 9); // 3
		b.writeUInt8(0x0, 10); // zero terminated
		socket.write(b, function() {
			ready = true;
			socket.emit("ready");
		});
	});
	socket.on("data", function(buffer) {
		var ab = toArrayBuffer(buffer);
		var o = c.deserialize(ab);
		socket.emit("o", o);
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
					socket.once("o", function(o) {
						cb(undefined, o);
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
					if (cb) {
						cb();
					}
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
		"socket": socket
	}
}
exports.connect = connect;

var con = connect("localhost", 5000);

con.k("sum 1 2 3", function(err, res) {
	console.log("k", [err, res]);
});

con.k("sum", [1, 2, 3], function(err, res) {
	console.log("k", [err, res]);
});

con.ks("show 1 2 3", function(err) {
	console.log("ks", err);
});

con.ks("show", [1, 2, 3], function(err) {
	console.log("ks", err);
});

setTimeout(function() {
	con.close(function() {
		console.log("closed");
	});
}, 10 * 1000);
