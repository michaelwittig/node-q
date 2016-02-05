var bignum = require("bignum");
var uuid = require("node-uuid");

var typed = require("./typed.js");

var J2P32 = Math.pow(2, 32);

var UUID_NULL = "00000000-0000-0000-0000-000000000000";
var SHORT_NULL = -32768;
var SHORT_INFINITY = 32767;
var SHORT_NEG_INFINITY = 0 - SHORT_INFINITY;
var INT_NULL = -2147483648; 
var INT_INFINITY = 2147483647;
var INT_NEG_INFINITY = 0 - INT_INFINITY;
var LONG_NULL = bignum("9223372036854775808");

// added support for decompression [GMelika] 
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

function deserialize(b, nanos2date, flipTables, emptyChar2null, long2bignum) {
	"use strict";
	var pos = 8, isCompressed = (b[2] === 1);
	function rBool() {
		return rInt8() === 1;
	}
	function rChar() {
		var val = rUInt8();
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
		if (s === UUID_NULL) {
			return null;
		} else {
			return s;
		}
	}
	function rInt16() {
		var h = rInt(2);
		if (h === SHORT_NULL) {
			return null;
		} else if (h === SHORT_INFINITY) {
			return Infinity;
		} else if (h === SHORT_NEG_INFINITY) {
			return -Infinity;
		} else {
			return h;
		}
	}
	function rInt32() {
		var i = rInt(4);
		if (i === INT_NULL) {
			return null;
		} else if (i === INT_INFINITY) {
			return Infinity;
		} else if (i === INT_NEG_INFINITY) {
			return -Infinity;
		} else {
			return i;
		}
	}
	function rInt64() { // bignum or closest number to 64 bit int
		if (long2bignum === true) {
			var val = bignum.fromBuffer(b.slice(pos, pos+8), {endian: "little", size: 8});
			pos += 8;
			if (val.eq(LONG_NULL)) { // TODO Infinity support?
				return null;
			}
			return val;
		} else {
			var y = rInt(4);
			var x = rInt(4);
			if (x === INT_NULL && y === 0) {
				return null;
			} else if (x === 2147483647 && y === -1) {
				return Infinity;
			} else if (x === -2147483648 && y === 1) {
				return -Infinity;
			} else {
				return x * J2P32 + (y >= 0 ? y : J2P32 + y);
			}
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
		var c, s = "";
		while ((c = rUInt8()) !== 0) {
			s += String.fromCharCode(c);
		}
		if (s === "") {
			return null;
		} else {
			return decodeURIComponent(escape(s));
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
			return decodeURIComponent(escape(s));
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

function inferType(x) {
	if (x === null) {
		return "null";
	}
	if (typeof x === "number") {
		return "float";
	}
	if (x instanceof Date) {
		return "datetime";
	}
	if (typeof x === "boolean") {
		return "boolean";
	}
	if (Array.isArray(x)) {
		return "list";
	}
	if (typeof x === "string") {
		return "string";
	}
	if (typeof x === "object") {
		return "dict";
	}
}

function calcN(x, dt) {
	var t;
	if (dt) {
		t = dt;
	} else {
		if (typed.isTyped(x)) {
			t = x.type();
			x = x.value();
		} else {
			t = inferType(x);
		}
	}
	switch (t) {
		case 'null': // JavaScript only type
			return 2;
		case 'boolean':
			return 2;
		case 'guid':
			return 17;
		case 'byte':
			return 2;
		case 'short':
			return 3;
		case 'int':
			return 5;
		case 'long':
			return 9;
		case 'real':
			return 5;
		case 'float':
			return 9;
		case 'char':
			return 2;
		case 'symbol':
			{
				if (x === null) {
					return 2;
				}
				var encx = unescape(encodeURIComponent(x));
				return 2 + encx.length;
			}
		case 'timestamp':
			return 9;
		case 'month':
			return 5;
		case 'date':
			return 5;
		case 'datetime':
			return 9;
		case 'timespan':
			return 9;
		case 'minute':
			return 5;
		case 'second':
			return 5;
		case 'time':
			return 5;
		case 'dict':
			{
				var n = 1 + 6;
				var k = Object.keys(x);
				for (var i = 0; i < k.length; i++) {
					var encx = unescape(encodeURIComponent(k[i]));
					n += 1 + encx.length;
				}
				return n + calcN(getVals(x), "list");
			}
		case 'list':
			{
				var n = 6;
				for (var i = 0; i < x.length; i++) {
					n += calcN(x[i], null);
				}
				return n;
			}
		case 'string': // JavaScript only type => list of char
			{
				var encx = unescape(encodeURIComponent(x));
				var n=encx.length + (encx[0] === '`' ? 1 : 6);
				return n;
			}
		// TODO table
	}
	throw new Error("bad type " + t);
}

function getVals(x) { // can be replaces with Object.values someday
	var v = [], o;
	for (o in x) {
		if (x.hasOwnProperty(o)) {
			v.push(x[o]);
		}
	}
	return v;
}

function serialize(x) {
	"use strict";
	var pos = 0, b;
	function wb(i) {
		b.writeInt8(i, pos);
		pos += 1;
	}
	function wub(i) {
		b.writeUInt8(i, pos);
		pos += 1;
	}
	function wr(i) {
		b.writeFloatLE(i, pos);
		pos += 4;
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
	function wbig(i) {
		var bl = i.toBuffer({endian: "little", size: 8});
		bl.copy(b, pos);
		pos += 8;
	}
	function w(x, dt) {
		var t;
		if (dt) {
			t = dt;
		} else {
			if (typed.isTyped(x)) {
				t = x.type();
				x = x.value();
			} else {
				t = inferType(x);
			}
		}
		switch (t) {
			case 'null': // JavaScript only type
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
			case 'guid':
			 	{
			 		wb(-2);
			 		if (x === null) {
			 			uuid.parse(UUID_NULL, b, pos);
			 		} else {
						uuid.parse(x, b, pos);
					}
					pos+=16;
			 	}
			 	break;
			case 'byte':
				{
					wb(-4);
					wb(x);
				}
				break;
			case 'short':
				{
					wb(-5);
					if (x === null) {
						wn(2, SHORT_NULL);
					} else if (x === Infinity) {
						wn(2, SHORT_INFINITY);
					} else if (x === -Infinity) {
						wn(2, SHORT_NEG_INFINITY);
					} else {
						wn(2, x);
					}
				}
				break;
			case 'int':
				{
					wb(-6);
					if (x === null) {
						wn(4, INT_NULL);
					} else if (x === Infinity) {
						wn(4, INT_INFINITY);
					} else if (x === -Infinity) {
						wn(4, INT_NEG_INFINITY);
					} else {
						wn(4, x);
					}
				}
				break;
			case 'long':
				{
					wb(-7); // TODO Infinity support?
					if (x === null) {
						wbig(LONG_NULL);
					} else if (x === Infinity) {
						throw new Error("long Infinity not supported");
					} else if (x === -Infinity) { 
						throw new Error("long -Infinity not supported");
					} else {
						wbig(x);
					}
				}
				break;
			case 'real':
				{
					wb(-8);
					if (x === null) {
						wub(0);
						wub(0);
						wub(192);
						wub(255);
					} else if (x === Infinity) {
						wub(0);
						wub(0);
						wub(128);
						wub(127);
					} else if (x === -Infinity) { 
						wub(0);
						wub(0);
						wub(128);
						wub(255);
					} else {
						wr(x);
					}
				}
				break;
			case 'float':
				{
					wb(-9);
					if (x === null) {
						wub(0);
						wub(0);
						wub(0);
						wub(0);
						wub(0);
						wub(0);
						wub(248);
						wub(255);
					} else if (x === Infinity) {
						wub(0);
						wub(0);
						wub(0);
						wub(0);
						wub(0);
						wub(0);
						wub(240);
						wub(127);
					} else if (x === -Infinity) { 
						wub(0);
						wub(0);
						wub(0);
						wub(0);
						wub(0);
						wub(0);
						wub(240);
						wub(255);
					} else {
						wf(x);
					}
				}
				break;
			case 'char':
				{
					wb(-10);
					if (x === null) {
						wub(32);
					} else {
						wub(x.charCodeAt());
					}
				}
				break;
			case 'symbol':
				{
					wb(-11);
					if (x !== null) {
						x = unescape(encodeURIComponent(x));
						for (var i = 0; i < x.length; i++) {
							wub(x[i].charCodeAt());
						}
					}
					wb(0);
				}
				break;
			case 'timestamp':
				{
					wb(-12);
					if (x === null) {
						wbig(LONG_NULL);
					} else {
						wbig(bignum(86400000000000 * (x.getTime() / 86400000 - 10957)));
					}
				}
				break;
			case 'month':
				{
					wb(-13);
					if (x == null) {
						wn(4, INT_NULL);
					} else {
						wn(4, (x.getUTCFullYear() - 2000) * 12 + x.getUTCMonth());
					}
				}
			break;
			case 'date':
				{
					wb(-14);
					if (x == null) {
						wn(4, INT_NULL);
					} else {
						wn(4, x.getTime() / 86400000 - 10957);
					}
				}
			break;
			case 'datetime':
				{
					wb(-15);
					if (x === null) {
						wub(0);
						wub(0);
						wub(0);
						wub(0);
						wub(0);
						wub(0);
						wub(248);
						wub(255);
					} else {
						wf(x.getTime() / 86400000 - 10957);
					}
				}
				break;
			case 'timespan':
				{
					wb(-16);
					if (x === null) {
						wbig(LONG_NULL);
					} else {
						var nanos = (((x.getUTCHours() * 60 + x.getUTCMinutes()) * 60 + x.getUTCSeconds()) * 1000 + x.getUTCMilliseconds()) * 1000 * 1000;
						wbig(bignum(nanos));
					}
				}
				break;
			case 'minute':
				{
					wb(-17);
					if (x == null) {
						wn(4, INT_NULL);
					} else {
						wn(4, x.getUTCHours() * 60 + x.getUTCMinutes());
					}
				}
				break;
			case 'second':
				{
					wb(-18);
					if (x == null) {
						wn(4, INT_NULL);
					} else {
						wn(4, (x.getUTCHours() * 60 + x.getUTCMinutes()) * 60 + x.getUTCSeconds());
					}
				}
				break;
			case 'time':
				{
					wb(-19);
					if (x == null) {
						wn(4, INT_NULL);
					} else {
						wn(4, ((x.getUTCHours() * 60 + x.getUTCMinutes()) * 60 + x.getUTCSeconds()) * 1000 + x.getUTCMilliseconds());
					}
				}
				break;
			case 'dict':
				{
					var k = Object.keys(x);
					wb(99);
					wb(11);
					wb(0);
					wn(4, k.length);
					for (var i = 0; i < k.length; i++) {
						var chars = unescape(encodeURIComponent(k[i]));
						for (var j = 0; j < chars.length; j++) {
							wub(chars[j].charCodeAt());
						}
						wub(0);
					}
					w(getVals(x), "list");
				}
				break;
			case 'list':
				{
					wb(0);
					wb(0);
					wn(4, x.length);
					for (var i = 0; i < x.length; i++) {
						w(x[i], null);
					}
				}
				break;
			case 'string': // JavaScript only type => list of char
				{
					if (x[0] === '`') {
						w(x.substr(1), 'symbol');
					} else {
						x = unescape(encodeURIComponent(x));
						wb(10);
						wb(0);
						wn(4, x.length);
						for (var i = 0; i < x.length; i++) {
							wub(x[i].charCodeAt());
						}
					}
					break;
				}
			// TODO table
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
