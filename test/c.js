var c = require("../lib/c.js"),
	moment = require("moment"),
	assert = require("assert");

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
		it("deserialize_long_little_test", function() { // 1j
			assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100000000000000")), 1);
		});
		it("deserialize_long_null_little_test", function() { // 0Nj
			assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90000000000000080")), null);
		});
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
		it("deserialize_char_little_test", function() { // "a"
			assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f661")), "a");
		});
		it("deserialize_char_null_little_test default behavior", function() { // " "
			assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f620")), null);
		});
		it("deserialize_char_null_little_test emptyChar2null:=true", function() { // " "
			assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f620"), undefined, undefined, true), null);
		});
		it("deserialize_char_null_little_test emptyChar2null:=false", function() { // " "
			assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f620"), undefined, undefined, false), " ");
		});
		it("deserialize_symbol_length1_little_test", function() { // `a
			assert.equal(c.deserialize(hexstr_to_bin("010000000b000000f56100")), "a");
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
		it("deserialize_timestamp_little_test", function() { // 2014.06.23D11:34:39.412547000
			assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f4b84d1d352d045706")).getTime(), moment.utc("2014.06.23 11:34:39.412547000", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
		});
		it("deserialize_timestamp_null_little_test", function() { // 0Np
			assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f40000000000000080")), null);
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
		it("deserialize_timespan_little_test", function() { // 00:01:00.000000000
			assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f0005847f80d000000")).getTime(), moment.utc("2000.01.01 00:01:00.000", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
		});
		it("deserialize_timespan_null_little_test", function() { // 0Nn
			assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f00000000000000080")), null);
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
		it("serialize_boolean_little_test", function() { // 1b
			assert.equal(bin_to_hexstr(c.serialize(true)), "010000000a000000ff01");
		});
		it("serialize_float_little_test", function() { // 1.0f
			assert.equal(bin_to_hexstr(c.serialize(1.0)), "0100000011000000f7000000000000f03f");
		});
		it("serialize_symbol_length1_little_test", function() { // `a
			assert.equal(bin_to_hexstr(c.serialize("`a")), "010000000b000000f56100");
		});
		it("serialize_symbol_unicode_little_test", function() { // `你
			assert.equal(bin_to_hexstr(c.serialize("`你")), "010000000d000000f5e4bda000");
		});
	});
});
