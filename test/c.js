var c = require("../lib/c.js"),
	typed = require("../lib/typed.js"),
	moment = require("moment"),
	assert = require("assert"),
	bignum = require("bignum");

function hexstr_to_bin(str) {
	"use strict";
	return new Buffer(str, "hex");
}

function bin_to_hexstr(b) {
	"use strict";
	return b.toString("hex");
}

describe("c", function() {
	"use strict";
	describe("deserialize", function() {
		it("deserialize_boolean_little_test", function() { // 1b
			assert.equal(c.deserialize(hexstr_to_bin("010000000a000000ff01")), true);
		});
		it("deserialize_guid_little_test", function() { // 0a369037-75d3-b24d-6721-5a1d44d4bed5
			assert.equal(c.deserialize(hexstr_to_bin("0100000019000000fe0a36903775d3b24d67215a1d44d4bed5")), "0a369037-75d3-b24d-6721-5a1d44d4bed5");
		});
		it("deserialize_guid_null_little_test", function() { // 0Ng
			assert.equal(c.deserialize(hexstr_to_bin("0100000019000000fe00000000000000000000000000000000")), null);
		});
		it("deserialize_byte_little_test", function() { // 0x01
			assert.equal(c.deserialize(hexstr_to_bin("010000000a000000fc01")), "1");
		});
		it("deserialize_short_little_test", function() { // 1h
			assert.equal(c.deserialize(hexstr_to_bin("010000000b000000fb0100")), 1);
		});
		it("deserialize_short_null_little_test", function() { // 0Nh
			assert.equal(c.deserialize(hexstr_to_bin("010000000b000000fb0080")), null);
		});
		it("deserialize_integer_little_test", function() { // 1i
			assert.equal(c.deserialize(hexstr_to_bin("010000000d000000fa01000000")), 1);
		});
		it("deserialize_integer_null_little_test", function() { // 0Ni
			assert.equal(c.deserialize(hexstr_to_bin("010000000d000000fa00000080")), null);
		});
		describe("long2bignum", function() {
			describe("default", function() {
				it("deserialize_long_little_test", function() { // 1j
					assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100000000000000")), 1);
				});
				it("deserialize_long_null_little_test", function() { // 0Nj
					assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90000000000000080")), null);
				});
			});
			describe("true", function() {
				it("deserialize_long_little_test", function() { // 1j
					assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100000000000000"), undefined, undefined, undefined, true).toNumber(), 1);
				});
				it("deserialize_long_null_little_test", function() { // 0Nj
					assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90000000000000080"), undefined, undefined, undefined, true), null);
				});
			});
			describe("false", function() {
				it("deserialize_long_little_test", function() { // 1j
					assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100000000000000"), undefined, undefined, undefined, false), 1);
				});
				it("deserialize_long_null_little_test", function() { // 0Nj
					assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90000000000000080"), undefined, undefined, undefined, false), null);
				});
			});
		})
		it("deserialize_real_little_test", function() { // 1.0e
			assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f80000803f")), 1.0);
		});
		it("deserialize_real_null_little_test", function() { // 0Ne
			assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f80000c0ff")), null);
		});
		it("deserialize_float_little_test", function() { // 1.0f
			assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f7000000000000f03f")), 1.0);
		});
		it("deserialize_float_null_little_test", function() { // 0Nf
			assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f7000000000000f8ff")), null);
		});
		describe("emptyChar2null", function() {
			describe("default", function() {
				it("deserialize_char_little_test", function() { // "a"
					assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f661")), "a");
				});
				it("deserialize_char_null_little_test", function() { // " "
					assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f620")), null);
				});
			});
			describe("true", function() {
				it("deserialize_char_little_test", function() { // "a"
					assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f661"), undefined, undefined, true), "a");
				});
				it("deserialize_char_null_little_test", function() { // " "
					assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f620"), undefined, undefined, true), null);
				});
			});
			describe("false", function() {
				it("deserialize_char_little_test", function() { // "a"
					assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f661"), undefined, undefined, false), "a");
				});
				it("deserialize_char_null_little_test", function() { // " "
					assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f620"), undefined, undefined, false), " ");
				});
			});
		});
		it("deserialize_symbol_null_little_test", function() { // `
			assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f500")), null);
		});
		it("deserialize_symbol_length2_little_test", function() { // `ab
			assert.equal(c.deserialize(hexstr_to_bin("010000000c000000f5616200")), "ab");
		});
		it("deserialize_symbol_length3_little_test", function() { // `abc
			assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f561626300")), "abc");
		});
		it("deserialize_symbol_length4_little_test", function() { // `abcd
			assert.equal(c.deserialize(hexstr_to_bin("010000000e000000f56162636400")), "abcd");
		});
		it("deserialize_symbol_length5_little_test", function() { // `abcde
			assert.equal(c.deserialize(hexstr_to_bin("010000000f000000f5616263646500")), "abcde");
		});
		it("deserialize_symbol_unicode_little_test", function() { // `$"你"
			assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f5e4bda000")), "你");
		});
		it("deserialize_string_unicode_little_test", function() { // "ab"
			assert.equal(c.deserialize(hexstr_to_bin("01000000100000000a00020000006162")), "ab");
		});
		it("deserialize_string_unicode_little_test", function() { // "你好"
			assert.equal(c.deserialize(hexstr_to_bin("01000000140000000a0006000000e4bda0e5a5bd")), "你好");
		});
		describe("nanos2date", function() {
			describe("default", function() {
				it("deserialize_timestamp_little_test", function() { // 2014.06.23D11:34:39.412547000
					assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f4b84d1d352d045706")).getTime(), moment.utc("2014.06.23 11:34:39.412547000", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
				});
				it("deserialize_timestamp_null_little_test", function() { // 0Np
					assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f40000000000000080")), null);
				});
				it("deserialize_timespan_little_test", function() { // 00:01:00.000000000
					assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f0005847f80d000000")).getTime(), moment.utc("2000.01.01 00:01:00.000", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
				});
				it("deserialize_timespan_null_little_test", function() { // 0Nn
					assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f00000000000000080")), null);
				});
			});
			describe("true", function() {
				it("deserialize_timestamp_little_test", function() { // 2014.06.23D11:34:39.412547000
					assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f4b84d1d352d045706"), true).getTime(), moment.utc("2014.06.23 11:34:39.412547000", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
				});
				it("deserialize_timestamp_null_little_test", function() { // 0Np
					assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f40000000000000080"), true), null);
				});
				it("deserialize_timespan_little_test", function() { // 00:01:00.000000000
					assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f0005847f80d000000"), true).getTime(), moment.utc("2000.01.01 00:01:00.000", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
				});
				it("deserialize_timespan_null_little_test", function() { // 0Nn
					assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f00000000000000080"), true), null);
				});
			});
			describe("false", function() {
				it("deserialize_timestamp_little_test", function() { // 2014.06.23D11:34:39.412547000
					assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f4b84d1d352d045706"), false), 1403523279412547000);
				});
				it("deserialize_timestamp_null_little_test", function() { // 0Np
					assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f40000000000000080"), false), null);
				});
				it("deserialize_timespan_little_test", function() { // 00:01:00.000000000
					assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f0005847f80d000000"), false), 60000000000);
				});
				it("deserialize_timespan_null_little_test", function() { // 0Nn
					assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f00000000000000080"), false), null);
				});
			});
		});
		it("deserialize_month_201401_little_test", function() { // 2014.01m
			assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f3a8000000")).getTime(), moment.utc("2014.01", "YYYY.MM").toDate().getTime());
		});
		it("deserialize_month_null_little_test", function() { // 0Nm
			assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f300000080")), null);
		});
		it("deserialize_month_199501_little_test", function() { // 1995.01m
			assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f3c4ffffff")).getTime(), moment.utc("1995.01", "YYYY.MM").toDate().getTime());
		});
		it("deserialize_date_20140101_little_test", function() { // 2014.01.01
			assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f2fa130000")).getTime(), moment.utc("2014.01.91", "YYYY.MM").toDate().getTime());
		});
		it("deserialize_date_null_little_test", function() { // 0Nd
			assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f200000080")), null);
		});
		it("deserialize_date_19950101_little_test", function() { // 1995.01.01
			assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f2def8ffff")).getTime(), moment.utc("1995.01.01", "YYYY.MM").toDate().getTime());
		});
		it("deserialize_datetime_little_test", function() { // 2014.06.23T11:49:31.533
			assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f1facf4b237ea7b440")).getTime(), moment.utc("2014.06.23 11:49:31.533", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
		});
		it("deserialize_datetime_null_little_test", function() { // 0Nz
			assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f1000000000000f8ff")), null);
		});
		it("deserialize_minute_little_test", function() { // 00:01
			assert.equal(c.deserialize(hexstr_to_bin("010000000d000000ef01000000")).getTime(), moment.utc("2000.01.01 00:01:00.000", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
		});
		it("deserialize_minute_null_little_test", function() { // 0Nu
			assert.equal(c.deserialize(hexstr_to_bin("010000000d000000ef00000080")), null);
		});
		it("deserialize_second_little_test", function() { // 00:00:01
			assert.equal(c.deserialize(hexstr_to_bin("010000000d000000ee01000000")).getTime(), moment.utc("2000.01.01 00:00:01.000", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
		});
		it("deserialize_second_null_little_test", function() { // 0Nv
			assert.equal(c.deserialize(hexstr_to_bin("010000000d000000ee00000080")), null);
		});
		it("deserialize_time_little_test", function() { // 00:00:00.001
			assert.equal(c.deserialize(hexstr_to_bin("010000000d000000ed01000000")).getTime(), moment.utc("2000.01.01 00:00:00.001", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
		});
		it("deserialize_time_null_little_test", function() { // 0Nt
			assert.equal(c.deserialize(hexstr_to_bin("010000000d000000ed00000080")), null);
		});
	});
	describe("serialize", function() {
		describe("infer type", function() {
			describe("little", function() {
				it("Boolean", function() {
					assert.equal(bin_to_hexstr(c.serialize(true)), "010000000a000000ff01");
				});
				it("symbol length 1", function() {
					assert.equal(bin_to_hexstr(c.serialize("`a")), "010000000b000000f56100");
				});
				it("symbol unicode", function() {
					assert.equal(bin_to_hexstr(c.serialize("`你")), "010000000d000000f5e4bda000");
				});
				it("symbol length 2", function() { // `ab
					assert.equal(bin_to_hexstr(c.serialize("`ab")), "010000000c000000f5616200");
				});
				it("symbol length 3", function() { // `abc
					assert.equal(bin_to_hexstr(c.serialize("`abc")), "010000000d000000f561626300");
				});
				it("symbol length 4", function() { // `abcd
					assert.equal(bin_to_hexstr(c.serialize("`abcd")), "010000000e000000f56162636400");
				});
				it("symbol length 5", function() { // `abcde
					assert.equal(bin_to_hexstr(c.serialize("`abcde")), "010000000f000000f5616263646500");
				});
				it("String", function() {
					assert.equal(bin_to_hexstr(c.serialize("abc")), "01000000110000000a0003000000616263");
				});
				it("Number", function() {
					assert.equal(bin_to_hexstr(c.serialize(1.0)), "0100000011000000f7000000000000f03f");
				});
				it("Date", function() {
					assert.equal(bin_to_hexstr(c.serialize(new Date("2014-06-23T11:49:31.533"))), "0100000011000000f1facf4b237ea7b440");
				});
				it("Object", function() {
					assert.equal(bin_to_hexstr(c.serialize({a: 1, b: true, c: 3})), "010000002f000000630b0003000000610062006300000003000000f7000000000000f03fff01f70000000000000840");
				});
				it("Array", function() {
					assert.equal(bin_to_hexstr(c.serialize([1, true, 3])), "0100000022000000000003000000f7000000000000f03fff01f70000000000000840");
				});
				it("Null", function() {
					assert.equal(bin_to_hexstr(c.serialize(null)), "010000000a0000006500");
				});
				it("Infinity", function() {
					assert.equal(bin_to_hexstr(c.serialize(Infinity)), "0100000011000000f7000000000000f07f");
				});
				it("-Infinity", function() {
					assert.equal(bin_to_hexstr(c.serialize(-Infinity)), "0100000011000000f7000000000000f0ff");
				});
				// TODO list
				// TODO dict
				// TODO table + flipTables
			});
		});
		describe("typed", function() {
			describe("little", function() {
				it("boolean", function() { // 1b
					assert.equal(bin_to_hexstr(c.serialize(typed.boolean(true))), "010000000a000000ff01");
				});
				it("guid", function() { // 0a369037-75d3-b24d-6721-5a1d44d4bed5
					assert.equal(bin_to_hexstr(c.serialize(typed.guid("0a369037-75d3-b24d-6721-5a1d44d4bed5"))), "0100000019000000fe0a36903775d3b24d67215a1d44d4bed5");
				});
				it("guid null", function() { // 0Ng
					assert.equal(bin_to_hexstr(c.serialize(typed.guid(null))), "0100000019000000fe00000000000000000000000000000000");
				});
				it("byte", function() { // 0x01
					assert.equal(bin_to_hexstr(c.serialize(typed.byte(1))), "010000000a000000fc01");
				});
				it("short", function() { // 1h
					assert.equal(bin_to_hexstr(c.serialize(typed.short(1))), "010000000b000000fb0100");
				});
				it("short null", function() { // 0Nh
					assert.equal(bin_to_hexstr(c.serialize(typed.short(null))), "010000000b000000fb0080");
				});
				it("integer", function() { // 1i
					assert.equal(bin_to_hexstr(c.serialize(typed.int(1))), "010000000d000000fa01000000");
				});
				it("integer null", function() { // 0Ni
					assert.equal(bin_to_hexstr(c.serialize(typed.int(null))), "010000000d000000fa00000080");
				});
				it("long", function() { // 1j
					assert.equal(bin_to_hexstr(c.serialize(typed.long(bignum("1")))), "0100000011000000f90100000000000000");
				});
				it("long null", function() { // 0Nj
					assert.equal(bin_to_hexstr(c.serialize(typed.long(null))), "0100000011000000f90000000000000080");
				});
				it("real", function() { // 1.0e
					assert.equal(bin_to_hexstr(c.serialize(typed.real(1.0))), "010000000d000000f80000803f");
				});
				it("real null", function() { // 0Ne
					assert.equal(bin_to_hexstr(c.serialize(typed.real(null))), "010000000d000000f80000c0ff");
				});
				it("float", function() { // 1.0f
					assert.equal(bin_to_hexstr(c.serialize(typed.float(1.0))), "0100000011000000f7000000000000f03f");
				});
				it("float null", function() { // 0Nf
					assert.equal(bin_to_hexstr(c.serialize(typed.float(null))), "0100000011000000f7000000000000f8ff");
				});
				it("char", function() { // "a"
					assert.equal(bin_to_hexstr(c.serialize(typed.char("a"))), "010000000a000000f661");
				});
				it("char null", function() { // " "
					assert.equal(bin_to_hexstr(c.serialize(typed.char(null))), "010000000a000000f620");
				});
				it("symbol length 1", function() { // `a
					assert.equal(bin_to_hexstr(c.serialize(typed.symbol("a"))), "010000000b000000f56100");
				});
				it("symbol unicode", function() { // `你
					assert.equal(bin_to_hexstr(c.serialize(typed.symbol("你"))), "010000000d000000f5e4bda000");
				});
				it("symbol null", function() { // `
					assert.equal(bin_to_hexstr(c.serialize(typed.symbol(null))), "010000000a000000f500");
				});
				it("symbol length 2", function() { // `ab
					assert.equal(bin_to_hexstr(c.serialize(typed.symbol("ab"))), "010000000c000000f5616200");
				});
				it("symbol length 3", function() { // `abc
					assert.equal(bin_to_hexstr(c.serialize(typed.symbol("abc"))), "010000000d000000f561626300");
				});
				it("symbol length 4", function() { // `abcd
					assert.equal(bin_to_hexstr(c.serialize(typed.symbol("abcd"))), "010000000e000000f56162636400");
				});
				it("symbol length 5", function() { // `abcde
					assert.equal(bin_to_hexstr(c.serialize(typed.symbol("abcde"))), "010000000f000000f5616263646500");
				});
				it("timestamp", function() { // 2014.06.23D11:34:39.412000000
					assert.equal(bin_to_hexstr(c.serialize(typed.timestamp(new Date("2014-06-23T11:34:39.412000000")))), "0100000011000000f400f514352d045706");
				});
				it("timestamp null", function() { // 0Np
					assert.equal(bin_to_hexstr(c.serialize(typed.timestamp(null))), "0100000011000000f40000000000000080");
				});
				it("month 201401", function() { // 2014.01m
					 assert.equal(bin_to_hexstr(c.serialize(typed.month(new Date("2014-01-01")))), "010000000d000000f3a8000000");
				});
				it("month null", function() { // 0Nm
					 assert.equal(bin_to_hexstr(c.serialize(typed.month(null))), "010000000d000000f300000080");
				});
				it("month 199501", function() { // 1995.01m
					 assert.equal(bin_to_hexstr(c.serialize(typed.month(new Date("1995-01-01")))), "010000000d000000f3c4ffffff");
				});
				it("date 20140101", function() { // 2014.01.01
					assert.equal(bin_to_hexstr(c.serialize(typed.date(new Date("2014-01-01")))), "010000000d000000f2fa130000");
				});
				it("date null", function() { // 0Nd
					assert.equal(bin_to_hexstr(c.serialize(typed.date(null))), "010000000d000000f200000080");
				});
				it("date 19950101", function() { // 1995.01.01
					assert.equal(bin_to_hexstr(c.serialize(typed.date(new Date("1995-01-01")))), "010000000d000000f2def8ffff");
				});
				it("datetime", function() { // 2014.06.23T11:49:31.533
					assert.equal(bin_to_hexstr(c.serialize(typed.datetime(new Date("2014-06-23T11:49:31.533")))), "0100000011000000f1facf4b237ea7b440");
				});
				it("datetime null", function() { // 0Nz
					assert.equal(bin_to_hexstr(c.serialize(typed.datetime(null))), "0100000011000000f1000000000000f8ff");
				});
				it("timespan", function() { // 00:01:00.000000000
					assert.equal(bin_to_hexstr(c.serialize(typed.timespan(new Date("2000-01-01T00:01:00.000")))), "0100000011000000f0005847f80d000000");
				});
				it("timespan null", function() { // 0Nn
					assert.equal(bin_to_hexstr(c.serialize(typed.timespan(null))), "0100000011000000f00000000000000080");
				});
				it("minute", function() { // 00:01
					assert.equal(bin_to_hexstr(c.serialize(typed.minute(new Date("2000-01-01T00:01:00.000")))), "010000000d000000ef01000000");
				});
				it("minute null", function() { // 0Nu
					assert.equal(bin_to_hexstr(c.serialize(typed.minute(null))), "010000000d000000ef00000080");
				});
				it("second", function() { // 00:00:01
					assert.equal(bin_to_hexstr(c.serialize(typed.second(new Date("2000-01-01T00:00:01.000")))), "010000000d000000ee01000000");
				});
				it("second null", function() { // 0Nv
					assert.equal(bin_to_hexstr(c.serialize(typed.second(null))), "010000000d000000ee00000080");
				});
				it("time", function() { // 00:00:00.001
					assert.equal(bin_to_hexstr(c.serialize(typed.time(new Date("2000-01-01T00:00:00.001")))), "010000000d000000ed01000000");
				});
				it("time null", function() { // 0Nt
					assert.equal(bin_to_hexstr(c.serialize(typed.time(null))), "010000000d000000ed00000080");
				});
				// TODO list vs typed list
				/*
				it("serialize_boolean_vector_little_test", function() { //
					?assertEqual(bin_to_hexstr(serialize(async, serialize_booleans([true, false]))), "01000000100000000100020000000100").
				});
				it("serialize_guid_vector_little_test", function() { //
					?assertEqual(bin_to_hexstr(serialize(async, serialize_guids([<<10, 54, 144, 55, 117, 211, 178, 77, 103, 33, 90, 29, 68, 212, 190, 213>>, <<10, 54, 144, 55, 117, 211, 178, 77, 103, 33, 90, 29, 68, 212, 190, 213>>]))), "010000002e0000000200020000000a36903775d3b24d67215a1d44d4bed50a36903775d3b24d67215a1d44d4bed5").
				});
				it("serialize_byte_vector_little_test", function() { //
					?assertEqual(bin_to_hexstr(serialize(async, serialize_bytes([<<0>>, <<1>>, <<2>>, <<3>>, <<4>>]))), "01000000130000000400050000000001020304").
				});
				it("serialize_short_vector_little_test", function() { //
						?assertEqual(bin_to_hexstr(serialize(async, serialize_shorts([1, 2, 3]))), "0100000014000000050003000000010002000300").
				});
				it("serialize_integer_vector_1item_little_test() ->
					?assertEqual(bin_to_hexstr(serialize(async, serialize_ints([1]))), "010000001200000006000100000001000000").
				});
				it("serialize_integer_vector_little_test", function() { //
					?assertEqual(bin_to_hexstr(serialize(async, serialize_ints([1, 2, 3]))), "010000001a000000060003000000010000000200000003000000").
				});
				it("serialize_long_vector_little_test", function() { //
					?assertEqual(bin_to_hexstr(serialize(async, serialize_longs([1, 2, 3]))), "0100000026000000070003000000010000000000000002000000000000000300000000000000").
				});
				it("serialize_real_vector_little_test", function() { //
					?assertEqual(bin_to_hexstr(serialize(async, serialize_reals([1.0, 2.0, 3.0]))), "010000001a0000000800030000000000803f0000004000004040").
				});
				it("serialize_float_vector_little_test", function() { //
					?assertEqual(bin_to_hexstr(serialize(async, serialize_floats([1.0, 2.0, 3.0]))), "0100000026000000090003000000000000000000f03f00000000000000400000000000000840").
				});
				it("serialize_char_vector_little_test", function() { //
					?assertEqual(bin_to_hexstr(serialize(async, serialize_chars([<<"a">>, <<"b">>, <<"c">>]))), "01000000110000000a0003000000616263").
				});
				it("serialize_string_little_test", function() { //
					?assertEqual(bin_to_hexstr(serialize(async, serialize_string(<<"abc">>))), "01000000110000000a0003000000616263").
				});
				it("serialize_symbol_vector_little_test", function() { //
					?assertEqual(bin_to_hexstr(serialize(async, serialize_symbols([a, ab, abc]))), "01000000170000000b0003000000610061620061626300").
				});
				it("serialize_timestamp_vector_little_test", function() { // (2014.01.01D12:00:00.000000000;2014.01.02D12:00:00.000000000;2014.01.03D12:00:00.000000000)
					?assertEqual(bin_to_hexstr(serialize(async, serialize_timestamps([441892800000000000, 441979200000000000, 442065600000000000]))), "01000000260000000c00030000000080cd0c29eb210600801c9ebd39220600806b2f52882206").
				});
				it("serialize_month_vector_little_test", function() { // (1995.01m;1995.02m;1995.03m)
					?assertEqual(bin_to_hexstr(serialize(async, serialize_months([-60,-59, -58]))), "010000001a0000000d0003000000c4ffffffc5ffffffc6ffffff").
				});
				it("serialize_date_vector_little_test", function() { // (2014.01.01;2014.01.02;2014.01.03)
					?assertEqual(bin_to_hexstr(serialize(async, serialize_dates([5114, 5115, 5116]))), "010000001a0000000e0003000000fa130000fb130000fc130000").
				});
				it("serialize_datetime_vector_little_test", function() { // (2014.06.23T11:49:31.533;2014.06.23T11:49:31.534;2014.06.23T11:49:31.535)
					?assertEqual(bin_to_hexstr(serialize(async, serialize_datetimes([4662535674435194874,4662535674435207600, 4662535674435220326]))), "01000000260000000f0003000000facf4b237ea7b440b0014c237ea7b44066334c237ea7b440").
				});
				it("serialize_timespan_vector_little_test", function() { // (00:01:00.000000000;00:02:00.000000000;00:03:00.000000000)
					?assertEqual(bin_to_hexstr(serialize(async, serialize_timespans([60000000000, 120000000000, 180000000000]))), "0100000026000000100003000000005847f80d00000000b08ef01b0000000008d6e829000000").
				});
				it("serialize_minute_vector_little_test", function() { // (00:01;00:02;00:03)
					?assertEqual(bin_to_hexstr(serialize(async, serialize_minutes([1, 2, 3]))), "010000001a000000110003000000010000000200000003000000").
				});
				it("serialize_second_vector_little_test", function() { // (00:00:01;00:00:02;00:00:03)
					?assertEqual(bin_to_hexstr(serialize(async, serialize_seconds([1, 2, 3]))), "010000001a000000120003000000010000000200000003000000").
				});
				it("serialize_time_vector_little_test", function() { // (00:00:00.001;00:00:00.002;00:00:00.003)
					?assertEqual(bin_to_hexstr(serialize(async, serialize_times([1, 2, 3]))), "010000001a000000130003000000010000000200000003000000").
				});
				it("serialize_generallist_with_vectors_little_test", function() { // `byte$enlist til 5
					?assertEqual(bin_to_hexstr(serialize(async, serialize_generallist([serialize_bytes([<<0>>, <<1>>, <<2>>, <<3>>, <<4>>])]))), "01000000190000000000010000000400050000000001020304").
				});
				it("serialize_generallist_with_atoms_little_test", function() { // (1l;1b;`a)
					?assertEqual(bin_to_hexstr(serialize(async, serialize_generallist([serialize_long(1), serialize_boolean(true), serialize_symbol(a)]))), "010000001c000000000003000000f90100000000000000ff01f56100").
				});
				*/
				// TODO dict
				// TODO table
			});
		});
	});
});
