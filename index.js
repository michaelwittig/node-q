"use strict";
const libc = require("./lib/c.js");
const net = require("net");
const events = require("events");
const assert = require("./lib/assert.js");
const typed = require("./lib/typed.js");

class Connection extends events.EventEmitter {
	constructor (socket, nanos2date, flipTables, emptyChar2null, long2number) {
		super();
		this.socket = socket;
		this.nanos2date = nanos2date;
		this.flipTables = flipTables;
		this.emptyChar2null = emptyChar2null;
		this.long2number = long2number;
		this.nextRequestNo = 1;
		this.nextResponseNo = 1;
		this.socket.on("end", () => this.emit("end"));
		this.socket.on("timeout", () => this.emit("timeout"));
		this.socket.on("error", (err) => this.emit("error", err));
		this.socket.on("close", (had_error) => this.emit("close", had_error));
	}

	listen() {
		this.chunk = Buffer.alloc(0);
		this.socket.on("data", (inbuffer) => {
			let buffer,
				length, // current msg length
				o, // deserialized object
				err, // deserialize error
				responseNo;

			if (this.chunk.length !== 0) {
				buffer = Buffer.alloc(this.chunk.length + inbuffer.length);
				this.chunk.copy(buffer);
				inbuffer.copy(buffer, this.chunk.length);
			} else {
				buffer = inbuffer;
			}
			while (buffer.length >= 8) {
				length = buffer.readUInt32LE(4);
				if (buffer.length >= length) {
					try {
						o = libc.deserialize(buffer, this.nanos2date, this.flipTables, this.emptyChar2null, this.long2number);
						err = undefined;
					} catch (e) {
						o = null;
						err = e;
					}
					if (buffer.readUInt8(1) === 2) { // MsgType: 2 := response
						responseNo = this.nextResponseNo;
						this.nextResponseNo += 1;
						this.emit("response:" + responseNo, err, o);
					} else {
						if (err === undefined && Array.isArray(o) && o[0] === "upd") {
							this.emit(o);
						} else {
							responseNo = this.nextResponseNo;
							this.nextResponseNo += 1;
							this.emit("response:" + responseNo, err, o);
						}
					}
					if (buffer.length > length) {
						buffer = buffer.slice(length);
					} else {
						buffer = Buffer.alloc(0);
					}
				} else {
					break;
				}
			}

			this.chunk = buffer;
		});
	}

	auth(auth, cb) {
		const n = Buffer.byteLength(auth, "ascii"),
			b = Buffer.alloc(n + 2);
		b.write(auth, 0, n, "ascii"); // auth (username:password)
		b.writeUInt8(0x3, n); // capability byte (compression, timestamp, timespan) http://code.kx.com/wiki/Reference/ipcprotocol#Handshake
		b.writeUInt8(0x0, n+1); // zero terminated
		this.socket.write(b);
		this.socket.once("data", (buffer) => {
			if (buffer.length === 1) {
				if (buffer[0] >= 1) { // capability byte must support at least (compression, timestamp, timespan) http://code.kx.com/wiki/Reference/ipcprotocol#Handshake
					this.listen();
					cb();
				} else {
					cb(new Error("Invalid capability byte from server"));
				}
			} else {
				cb(new Error("Invalid auth response from server"));
			}
		});
	}

	k(...params) {
		const cb = params.pop();
		assert.func(cb, "cb");
		let payload;
		const requestNo = this.nextRequestNo;
		this.nextRequestNo += 1;
		if (params.length === 0) {
			// Listen for async responses
			this.once("response:" + requestNo, function(err, o) {
				cb(err, o);
			});
		} else {
			const s = params.shift();
			assert.string(s, "s");
			if (params.length === 0) {
				payload = s;
			} else {
				payload = [s, ...params];
			}
			const b = libc.serialize(payload);
			b.writeUInt8(0x1, 1); // MsgType: 1 := sync
			this.socket.write(b, () => {
				this.once("response:" + requestNo, function(err, o) {
					cb(err, o);
				});
			});
		}
	}

	ks(s, ...params) {
		assert.string(s, "s");
		const cb = params.pop();
		assert.func(cb, "cb");
		let payload;
		if (params.length === 0) {
			payload = s;
		} else {
			payload = [s, ...params];
		}
		const b = libc.serialize(payload);
		this.socket.write(b, function() {
			cb();
		});
	}

	close(cb) {
		assert.optionalFunc(cb, "cb");
		this.socket.once("close", function() {
			if (cb) {
				cb();
			}
		});
		this.socket.end();
	}
}


function connect(...params) {
	const cb = params.pop();

	let auth,
		socket,
		error = false,
		close = false,
		config;

	if (params.length === 1 && typeof params[0] === "object") {
		[config] = params;
	} else {
		config = {};
		if (params.length === 1) {
			[config.unixSocket] = params;
		} else if (params.length === 2) {
			[config.host, config.port] = params;
		} else if (params.length === 4) {
			[config.host, config.port, config.user, config.password] = params;
		} else {
			throw new Error("only two, three or five arguments allowed");
		}
	}
	assert.object(config, "params");
	assert.optionalString(config.host, "params.host");
	assert.optionalNumber(config.port, "params.port");
	assert.optionalString(config.user, "params.user");
	assert.optionalString(config.password, "password");
	assert.optionalBool(config.socketNoDelay, "params.socketNoDelay");
	assert.optionalNumber(config.socketTimeout, "params.socketTimeout");
	assert.optionalBool(config.nanos2date, "params.nanos2date");
	assert.optionalBool(config.flipTables, "params.flipTables");
	assert.optionalBool(config.emptyChar2null, "params.emptyChar2null");
	assert.optionalBool(config.long2number, "params.long2number");
	assert.optionalString(config.unixSocket, "params.unixSocket");
	if (config.user !== undefined) {
		assert.string(config.password, "password");
		auth = config.user + ":" + config.password;
	} else {
		auth = "anonymous";
	}
	assert.func(cb, "cb");
	const errorcb = function(err) {
		error = true;
		cb(err);
	};
	const closecb = function() {
		close = true;
		cb(new Error("Connection closes (wrong auth?)"));
	};
	const socketArgs = [];
	if (config.unixSocket) {
		socketArgs.push(config.unixSocket);
	}
	else {
		socketArgs.push(config.port, config.host);
	}
	socketArgs.push(function() {
		socket.removeListener("error", errorcb);
		if (error === false) {
			socket.once("close", closecb);
			const con = new Connection(socket, config.nanos2date, config.flipTables, config.emptyChar2null, config.long2number);
			con.auth(auth, function() {
				socket.removeListener("close", closecb);
				if (close === false) {
					cb(undefined, con);
				}
			});
		}
	});
	socket = net.connect.apply(null, socketArgs);
	if (config.socketTimeout !== undefined) {
		socket.setTimeout(config.socketTimeout);
	}
	if (config.socketNoDelay !== undefined) {
		socket.setNoDelay(config.socketNoDelay);
	}
	socket.once("error", errorcb);
}
exports.connect = connect;

// export typed API
Object.keys(typed).forEach(function(k) {
	if (/^[a-z]*$/.test(k[0])) {
		exports[k] = typed[k];
	}
});
