// based on http://kx.com/q/c/c.js
// uses Node.js Buffer instead of ArrayBuffer [michaelwittig]
// added support for decompression [GMelika] 
var J2P32 = Math.pow(2, 32);

function decompress(compressedSize, b) {
	"use strict";
	var n = 0,
		r = 0,
		f = 0,
		s = 8,
		p = s,
		i = 0;
	var dst = new Buffer(compressedSize);
	var d = 12;
	var aa = new Int32Array(256);
	while (s < dst.length) {
		if (!i) {
			f = b[d++];
			i = 1;
		}
		if (f & i) {
			r = aa[b[d++]];
			dst[s++] = dst[r++];
			dst[s++] = dst[r++];
			n = 0xff & b[d++];
			for (var m = 0; m < n; m++) {
				dst[s + m] = dst[r + m];
			}
		} else {
			dst[s++] = b[d++];
		}
		while (p < (s - 1)) {
			aa[dst[p] ^ dst[p + 1]] = p++;
		}
		if (f & i) {
			p = (s += n);
		}
		i *= 2;
		if (i === 256) {
			i = 0;
		}
	}
	return dst;
}

function deserialize(b, nanos2date, flipTables, emptyChar2null) {
	"use strict";
	var pos = 8, isCompressed = (b[2] === 1);
	function rBool() {
		return rInt8() === 1;
	}
	function rChar() {
		var val = rInt8();
		if (val === 32 && emptyChar2null !== false) {
			return null;
		} else {
			return String.fromCharCode(val);
		}
	}
	function rInt8() {
		var val = b.readInt8(pos);
		pos += 1;
		return val;
	}
	function rInt(n) {
		var val;
		if (n === 1) {
			val = b.readInt8(pos);
		} else if (n === 2) {
			val = b.readInt16LE(pos);
		} else if (n === 4) {
			val = b.readInt32LE(pos);
		} else {
			throw new Error("only n = 1, 2 or 4 is supported");
		}
		pos += n;
		return val;
	}
	function rUInt8() {
		var val = b.readUInt8(pos);
		pos += 1;
		return val;
	}
	function rGuid() {
		var x = "0123456789abcdef", s = "";
		for (var i = 0; i < 16; i++) {
			var c = rUInt8();
			s += i === 4 || i === 6 || i === 8 || i === 10 ? "-" : "";
			s += x[c >> 4];
			s += x[c & 15];
		}
		if (s === "00000000-0000-0000-0000-000000000000") {
			return null;
		} else {
			return s;
		}
	}
	function rInt16() {
		var h = rInt(2);
		if (h === -32768) {
			return null;
		} else if (h === 32767) {
			return Infinity;
		} else if (h === -32767) {
			return -Infinity;
		} else {
			return h;
		}
	}
	function rInt32() {
		var i = rInt(4);
		if (i === -2147483648) {
			return null;
		} else if (i === 2147483647) {
			return Infinity;
		} else if (i === -2147483647) {
			return -Infinity;
		} else {
			return i;
		}
	}
	function rInt64() { // closest number to 64 bit int...
		var y = rInt(4);
		var x = rInt(4);
		if (x === -2147483648 && y === 0) {
			return null;
		} else if (x === 2147483647 && y === -1) {
			return Infinity;
		} else if (x === -2147483648 && y === 1) {
			return -Infinity;
		} else {
			return x * J2P32 + (y >= 0 ? y : J2P32 + y);
		}
	}
	function rFloat32() {
		var val = b.readFloatLE(pos);
		pos += 4;
		if (Number.isNaN(val)) {
			return null;
		} else {
			return val;
		}
	}
	function rFloat64() {
		var val = b.readDoubleLE(pos);
		pos += 8;
		if (Number.isNaN(val)) {
			return null;
		} else {
			return val;
		}
	}
	function rSymbol() {
		var i = pos, c, s = "";
		while ((c = rInt8()) !== 0) {
			s += String.fromCharCode(c);
		}
		if (s === "") {
			return null;
		} else {
			return s;
		}
	}
	function rTimestamp() {
		var val = rInt64();
		if (val === null) {
			return null;
		}
		if (nanos2date === false) {
			return 86400000000000 * (10957 + (val / 86400000000000));
		} else {
			return date(val / 86400000000000);
		}
	}
	function rMonth() {
		var y = rInt32();
		if (y === null) {
			return null;
		}
		var m = y % 12;
		y = 2000 + y / 12;
		return new Date(Date.UTC(y, m, 1));
	}
	function date(n) {
		return new Date(86400000 * (10957 + n));
	}
	function rDate() {
		var val = rInt32();
		return (val === null) ? null : date(val);
	}
	function rDateTime() {
		var val = rFloat64();
		return (val === null) ? null : date(val);
	}
	function rTimespan() {
		var val = rInt64();
		if (val === null) {
			return null;
		}
		if (nanos2date === false) {
			return val;
		}
		return date(val / 86400000000000);
	}
	function rSecond() {
		var val = rInt32();
		if (val === null) {
			return null;
		}
		return date(val / 86400);
	}
	function rMinute() {
		var val = rInt32();
		if (val === null) {
			return null;
		}
		return date(val / 1440);
	}
	function rTime() {
		var val = rInt32();
		if (val === null) {
			return null;
		}
		return date(val / 86400000);
	}
	function r() {
		var fns = [r, rBool, rGuid, null, rUInt8, rInt16, rInt32, rInt64, rFloat32, rFloat64, rChar, rSymbol, rTimestamp, rMonth, rDate, rDateTime, rTimespan, rMinute, rSecond, rTime];
		var i = 0, n, t = rInt8();
		if (t < 0 && t > -20) {
			return fns[-t]();
		}
		if (t > 99) {
			if (t === 100) {
				rSymbol();
				return r();
			}
			if (t < 104) {
				return rInt8() === 0 && t === 101 ? null : "func";
			}
			if (t > 105) {
				r();
			} else {
				for (n = rInt32(); i < n; i++) {
					r();
				}
			}
			return "func";
		}
		if (99 === t) {
			var flip = 98 === rUInt8();
			pos -= 1;
			var	x = r(),
				y = r(),
				o;
			if (!flip) {
				o = {};
				for (i = 0; i < x.length; i++) {
					o[x[i]] = y[i];
				}
			} else {
				o = new Array(2);
				o[0]=x;
				o[1]=y;
			}
			return o;
		}
		pos++;
		if (98 === t) {
			if (flipTables === false) {
				return r();
			} else {
				rInt8();
				var x = r();
				var y = r();
				var A = new Array(y[0].length);
				for (var j = 0; j < y[0].length; j++) {
					var o = {};
					for (var i = 0; i < x.length; i++) {
						o[x[i]] = y[i][j];
					}
					A[j] = o;
				}
				return A;
			}
		}
		n = rInt32();
		if (10 === t) {
			var s = "";
			n += pos;
			while (pos < n) {
				s += rChar();
			}
			return s;
		}
		var A = new Array(n);
		var f = fns[t];
		for (i = 0; i < n; i++) {
			A[i] = f();
		}
		return A;
	}
	if (isCompressed) {
		var compressedSize = rInt32();
		b = decompress(compressedSize, b);
		pos = 8;
	}
	return r();
}

function serialize(x) {
	"use strict";
	var pos = 0, b;
	function toType(obj) {
		return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
	}
	function getKeys(x) {
		var v = [], o;
		for (o in x) {
			if (x.hasOwnProperty(o)) {
				v.push(o);
			}
		}
		return v;
	}
	function getVals(x) {
		var v = [], o;
		for (o in x) {
			if (x.hasOwnProperty(o)) {
				v.push(x[o]);
			}
		}
		return v;
	}
	function calcN(x, dt) {
		var t = dt ? dt : toType(x);
		switch (t) {
			case 'null':
				return 2;
			case 'object':
				return 1 + calcN(getKeys(x), 'symbols') + calcN(getVals(x), null);
			case 'boolean':
				return 2;
			case 'number':
				return 9;
			case 'array':
				{
					var n = 6;
					for (var i = 0; i < x.length; i++) {
						n += calcN(x[i], null);
					}
					return n;
				}
			case 'symbols':
				{
					var n = 6;
					for (var i = 0; i < x.length; i++) {
						n += calcN(x[i], 'symbol');
					}
					return n;
				}
			case 'string':
				return x.length + (x[0] === '`' ? 1 : 6);
			case 'date':
				return 9;
			case 'symbol':
				return 2 + x.length;
		}
		throw "bad type " + t;
	}
	function wb(i) {
		b.writeInt8(i, pos);
		pos += 1;
	}
	function wf(i) {
		b.writeDoubleLE(i, pos);
		pos += 8;
	}
	function wn(n, i) {
		if (n === 1) {
			b.writeInt8(i, pos);
		} else if (n === 2) {
			b.writeInt16LE(i, pos);
		} else if (n === 4) {
			b.writeInt32LE(i, pos);
		} else {
			throw new Error("only n = 1, 2 or 4 is supported");
		}
		pos += n;
	}
	function w(x, dt) {
		var t = dt ? dt : toType(x);
		switch (t) {
			case 'null':
				{
					wb(101);
					wb(0);
				}
				break;
			case 'boolean':
				{
					wb(-1);
					wb(x ? 1 : 0);
				}
				break;
			case 'number':
				{
					wb(-9);
					wf(x);
				}
				break;
			case 'date':
				{
					wb(-15);
					wf(((x.getTime() - (new Date(x)).getTimezoneOffset() * 60000) / 86400000) - 10957);
				}
				break;
			case 'symbol':
				{
					wb(-11);
					for (var i = 0; i < x.length; i++) {
						wb(x[i].charCodeAt());
					}
					wb(0);
				}
				break;
			case 'string':
				if (x[0] === '`') {
					w(x.substr(1), 'symbol');
				} else {
					wb(10);
					wb(0);
					wn(4, x.length);
					for (var i = 0; i < x.length; i++) {
						wb(x[i].charCodeAt());
					}
				}
				break;
			case 'object':
				{
					wb(99);
					w(getKeys(x), 'symbols');
					w(getVals(x), null);
				}
				break;
			case 'array':
				{
					wb(0);
					wb(0);
					wn(4, x.length);
					for (var i = 0; i < x.length; i++) {
						w(x[i], null);
					}
				}
				break;
			case 'symbols':
				{
					wb(0);
					wb(0);
					wn(4, x.length);
					for (var i = 0; i < x.length; i++) {
						w(x[i], 'symbol');
					}
				}
				break;
		}
	}
	var n = calcN(x, null);
	b = new Buffer(8 + n);
	wb(1);
	wb(0);
	wb(0);
	wb(0);
	wn(4, b.length);
	w(x, null);
	return b;
}

exports.deserialize = deserialize;
exports.serialize = serialize;
