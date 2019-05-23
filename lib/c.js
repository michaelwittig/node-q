var Long = require("long");
var uuid = require("node-uuid");
require("buffer-indexof-polyfill");

var typed = require("./typed.js");

var J2P32 = Math.pow(2, 32);

var UUID_NULL = "00000000-0000-0000-0000-000000000000";
var SHORT_NULL = -32768;
var SHORT_INFINITY = 32767;
var SHORT_NEG_INFINITY = 0 - SHORT_INFINITY;
var INT_NULL = -2147483648; 
var INT_INFINITY = 2147483647;
var INT_NEG_INFINITY = 0 - INT_INFINITY;
var LONG_NULL = Long.fromString("9223372036854775808", false, 10);
var LONG_INFINITY = Long.fromString("9223372036854775807", false, 10);
var LONG_NEG_INFINITY = Long.fromString("9223372036854775809", false, 10);
var ZERO_BYTE = new Buffer(1);
ZERO_BYTE.writeUInt8(0, 0);

var QTYPES2NUM = {
	"null": 101,
	"boolean": 1,
	"guid": 2,
	"byte": 4,
	"short": 5,
	"int": 6,
	"long": 7,
	"real": 8,
	"float": 9,
	"char": 10,
	"symbol": 11,
	"timestamp": 12,
	"month": 13,
	"date": 14,
	"datetime": 15,
	"timespan": 16,
	"minute": 17,
	"second": 18,
	"time": 19
};
var QTYPES2SIZE = {
	"null": 1,
	"boolean": 1,
	"guid": 16,
	"byte": 1,
	"short": 2,
	"int": 4,
	"long": 8,
	"real": 4,
	"float": 8,
	"char": 1,
	// "symbol": , // variable length
	"timestamp": 8,
	"month": 4,
	"date": 4,
	"datetime": 8,
	"timespan": 8,
	"minute": 4,
	"second": 4,
	"time": 4
};
var symbolStringRegex = /^`\S+$/;

function type2num(t) {
	var num = QTYPES2NUM[t];
	if (num === undefined) {
		throw new Error("bad type " + t);
	}
	return num;
}

function type2size(t) {
	var size = QTYPES2SIZE[t];
	if (size === undefined) {
		throw new Error("bad type " + t);
	}
	return size;
}

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

function deserialize(b, nanos2date, flipTables, emptyChar2null, long2number) {
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
	function rString(n) {
		var val = b.slice(pos, pos+n).toString('utf8');
		pos += n;
		return val;
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
	function rInt64() { // long or closest number
		if (long2number === false) {
			var low = rInt(4);
			var high = rInt(4);
			var val = new Long(low, high, false);
			if (low === 0 && high === INT_NULL) { 
				return null;
			}
			if (low === -1 && high === INT_INFINITY) {
				return Infinity;
			}
			if (low === 1 && high === INT_NULL) {
				return -Infinity;
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
		var e = b.indexOf(ZERO_BYTE, pos);
		var s = rString(e-pos);
		pos += 1; // zero byte
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
		if (t === -128) {
			throw new Error(rSymbol());
		}
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
			return rString(n);
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
	if (typed.isTyped(x)) {
		return x.type();
	}
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

function isListOfSamePrimitiveType(elements, valuetype) {
	if (valuetype === "list" || valuetype === "typedlist" || valuetype === "mixedlist" || valuetype === "string" || valuetype === "dict" || valuetype === "null") {
		return false;
	}
	return elements.every(function(x) {
		return inferType(x) === valuetype;
	});
}

function calcN(x, dt) {
	var t, vt;
	if (dt) {
		t = dt;
	} else {
		if (typed.isTyped(x)) {
			t = x.type();
			if (t === "typedlist") {
				vt = x.valuetype();
			}
			x = x.value();
		} else {
			t = inferType(x);
		}
	}
	switch (t) {
		case "null": // JavaScript only type
			return 2;
		case "symbol":
			{
				if (x === null) {
					return 2;
				}
				return 2 + Buffer.byteLength(x, 'utf8');
			}
		case "dict":
			{
				var n = 1 + 6;
				var k = Object.keys(x);
				for (var i = 0; i < k.length; i++) {
					n += 1 + k[i].length;
				}
				return n + calcN(getVals(x));
			}
		case "list":
			{
				if (x.length > 0 && (dt === null || dt === undefined)) {
					var valuetype = inferType(x[0]);
					if (isListOfSamePrimitiveType(x, valuetype)) {
						return calcN(new typed.Typed("typedlist", x.map(function(x1) {
							if (typed.isTyped(x1)) {
								return x1.value();
							} else {
								return x1;
							}
						}), valuetype));
					}
				}
				return calcN(x, "mixedlist");
			}
		case "mixedlist":
			{
				var n = 6;
				for (var i = 0; i < x.length; i++) {
					n += calcN(x[i], null);
				}
				return n;
			}
		case "typedlist":
			{
				var n = 6;
				if (vt === "symbol") {
					for (var i = 0; i < x.length; i++) {
						n += 1 + Buffer.byteLength(x[i], 'utf8');
					}
				} else {
					n += type2size(vt) * x.length;
				}
				return n;
			}
		case "string": // JavaScript only type => list of char
			{
				var n=Buffer.byteLength(x, 'utf8') + (symbolStringRegex.test(x) ? 1 : 6);
				return n;
			}
		// TODO implement calcN for table type
	}
	return 1 + type2size(t);
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
	function wlongjs(x) {
		wn(4, x.low);
		wn(4, x.high);
	}
	function wboolean(x) {
		wb(x ? 1 : 0);
	}
	function wguid(x) {
		if (x === null) {
			uuid.parse(UUID_NULL, b, pos);
		} else {
			uuid.parse(x, b, pos);
		}
		pos+=16;
	}
	function wbyte(x) {
		wb(x);
	}
	function wshort(x) {
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
	function wint(x) {
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
	function wlong(x) {
		if (x === null) {
			wub(0);
			wub(0);
			wub(0);
			wub(0);
			wub(0);
			wub(0);
			wub(0);
			wub(128);
		} else if (x === Infinity) {
			wub(255);
			wub(255);
			wub(255);
			wub(255);
			wub(255);
			wub(255);
			wub(255);
			wub(127);
		} else if (x === -Infinity) { 
			wub(1);
			wub(0);
			wub(0);
			wub(0);
			wub(0);
			wub(0);
			wub(0);
			wub(128);
		} else {
			wlongjs(x);
		}
	}
	function wreal(x) {
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
	function wfloat(x) {
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
	function wchar(x) {
		if (x === null) {
			wub(32);
		} else {
			wub(x.charCodeAt());
		}
	}
	function wstring(x) {
		pos += b.write(x, pos, 'utf8');
	}
	function wsymbol(x) {
		if (x !== null) {
			wstring(x);
		}
		wb(0);
	}
	function wtimestamp(x) {
		if (x === null) {
			wlong(null);
		} else {
			// 86400000000000 * (x.getTime() / 86400000 - 10957)
			wlong(Long.fromNumber(Long.fromString("1000000", false, 10).multiply(Long.fromNumber(x.getTime())).subtract(Long.fromString("946684800000000000", false, 10))));
		}
	}
	function wmonth(x) {
		if (x == null) {
			wn(4, INT_NULL);
		} else {
			wn(4, (x.getUTCFullYear() - 2000) * 12 + x.getUTCMonth());
		}
	}
	function wdate(x) {
		if (x == null) {
			wn(4, INT_NULL);
		} else {
			wn(4, x.getTime() / 86400000 - 10957);
		}
	}
	function wdatetime(x) {
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
	function wtimespan(x) {
		if (x === null) {
			wlong(null);
		} else {
			var nanos = (((x.getUTCHours() * 60 + x.getUTCMinutes()) * 60 + x.getUTCSeconds()) * 1000 + x.getUTCMilliseconds()) * 1000 * 1000;
			wlong(Long.fromNumber(nanos));
		}
	}
	function wminute(x) {
		if (x == null) {
			wn(4, INT_NULL);
		} else {
			wn(4, x.getUTCHours() * 60 + x.getUTCMinutes());
		}
	}
	function wsecond(x) {
		if (x == null) {
			wn(4, INT_NULL);
		} else {
			wn(4, (x.getUTCHours() * 60 + x.getUTCMinutes()) * 60 + x.getUTCSeconds());
		}
	}
	function wtime(x) {
		if (x == null) {
			wn(4, INT_NULL);
		} else {
			wn(4, ((x.getUTCHours() * 60 + x.getUTCMinutes()) * 60 + x.getUTCSeconds()) * 1000 + x.getUTCMilliseconds());
		}
	}
	function wnull() {
		wb(0);
	}

	var qtype2wfn = {
		"null": wnull,
		"boolean": wboolean,
		"guid": wguid,
		"byte": wbyte,
		"short": wshort,
		"int": wint,
		"long": wlong,
		"real": wreal,
		"float": wfloat,
		"char": wchar,
		"symbol": wsymbol,
		"timestamp": wtimestamp,
		"month": wmonth,
		"date": wdate,
		"datetime": wdatetime,
		"timespan": wtimespan,
		"minute": wminute,
		"second": wsecond,
		"time": wtime
	};

	function type2wfn(t) {
		var wfn = qtype2wfn[t];
		if (wfn === undefined) {
			throw new Error("bad type " + t);
		}
		return wfn;
	}

	function w(x, dt) {
		var t, vt;
		if (dt) {
			t = dt;
		} else {
			if (typed.isTyped(x)) {
				t = x.type();
				if (t === "typedlist") {
					vt = x.valuetype();
				}
				x = x.value();
			} else {
				t = inferType(x);
			}
		}
		switch (t) {
			case "null": // JavaScript only type
				{
					wb(101);
					wb(0);
				}
				return;
			case "dict":
				{
					var k = Object.keys(x);
					wb(99);
					wb(11);
					wb(0);
					wn(4, k.length);
					for (var i = 0; i < k.length; i++) {
						wsymbol(k[i]);
					}
					w(getVals(x));
				}
				return;
			case "list":
				{
					if (x.length > 0 && (dt === null || dt === undefined)) {
						var valuetype = inferType(x[0]);
						if (isListOfSamePrimitiveType(x, valuetype)) {
							return w(new typed.Typed("typedlist", x.map(function(x1) {
								if (typed.isTyped(x1)) {
									return x1.value();
								} else {
									return x1;
								}
							}), valuetype));
						}
					}
					return w(x, "mixedlist");
				}
			case "mixedlist":
				{
					wb(0);
					wb(0);
					wn(4, x.length);
					for (var i = 0; i < x.length; i++) {
						w(x[i], null);
					}
					return;
				}
			case "typedlist":
				{
					wb(type2num(vt));
					wb(0);
					wn(4, x.length);
					var wfn = type2wfn(vt);
					x.forEach(wfn);
				}
				return;
			case "string": // JavaScript only type => list of char
				{
					if (symbolStringRegex.test(x)) {
						w(x.substr(1), "symbol");
					} else {
						wb(10);
						wb(0);
						wn(4, Buffer.byteLength(x, 'utf8'));
						wstring(x);
					}
					return;
				}
			// TODO implement write to buffer for table type
		}
		var num = type2num(t);
		var wfn = type2wfn(t);
		wb(0-num);
		wfn(x);

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
