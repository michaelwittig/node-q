var c = require("../lib/c.js"),
	moment = require("moment"),
	assert = require("assert-plus");

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
			assert.equal(true, c.deserialize(hexstr_to_bin("010000000a000000ff01")));
		});
		it("deserialize_guid_little_test", function() { // 0a369037-75d3-b24d-6721-5a1d44d4bed5
			assert.equal("0a369037-75d3-b24d-6721-5a1d44d4bed5", c.deserialize(hexstr_to_bin("0100000019000000fe0a36903775d3b24d67215a1d44d4bed5")));
		});
		it("deserialize_guid_null_little_test", function() { // 0Ng
  		assert.equal(null, c.deserialize(hexstr_to_bin("0100000019000000fe00000000000000000000000000000000")));
  	});
		it("deserialize_byte_little_test", function() { // 0x01
			assert.equal("1", c.deserialize(hexstr_to_bin("010000000a000000fc01")));
		});
		it("deserialize_short_little_test", function() { // 1h
			assert.equal(1, c.deserialize(hexstr_to_bin("010000000b000000fb0100")));
		});
		it("deserialize_short_null_little_test", function() { // 0Nh
			assert.equal(null, c.deserialize(hexstr_to_bin("010000000b000000fb0080")));
		});
		it("deserialize_integer_little_test", function() { // 1i
			assert.equal(1, c.deserialize(hexstr_to_bin("010000000d000000fa01000000")));
		});
		it("deserialize_integer_null_little_test", function() { // 0Ni
			assert.equal(null, c.deserialize(hexstr_to_bin("010000000d000000fa00000080")));
		});
		it("deserialize_long_little_test", function() { // 1j
			assert.equal(1, c.deserialize(hexstr_to_bin("0100000011000000f90100000000000000")));
		});
		it("deserialize_long_null_little_test", function() { // 0Nj
			assert.equal(null, c.deserialize(hexstr_to_bin("0100000011000000f90000000000000080")));
		});
		it("deserialize_real_little_test", function() { // 1.0e
			assert.equal(1.0, c.deserialize(hexstr_to_bin("010000000d000000f80000803f")));
		});
		it("deserialize_real_null_little_test", function() { // 0Ne
			assert.equal(null, c.deserialize(hexstr_to_bin("010000000d000000f80000c0ff")));
		});
		it("deserialize_float_little_test", function() { // 1.0f
			assert.equal(1.0, c.deserialize(hexstr_to_bin("0100000011000000f7000000000000f03f")));
		});
		it("deserialize_float_null_little_test", function() { // 0Nf
			assert.equal(null, c.deserialize(hexstr_to_bin("0100000011000000f7000000000000f8ff")));
		});
		it("deserialize_char_little_test", function() { // "a"
			assert.equal("a", c.deserialize(hexstr_to_bin("010000000a000000f661")));
		});
		it("deserialize_char_null_little_test", function() { // " "
			assert.equal(null, c.deserialize(hexstr_to_bin("010000000a000000f620"))); // no null value specified
		});
		it("deserialize_symbol_length1_little_test", function() { // `a
			assert.equal("a", c.deserialize(hexstr_to_bin("010000000b000000f56100")));
		});
		it("deserialize_symbol_null_little_test", function() { // `
			assert.equal(null, c.deserialize(hexstr_to_bin("010000000a000000f500")));
		});
		it("deserialize_symbol_length2_little_test", function() { // `ab
			assert.equal("ab", c.deserialize(hexstr_to_bin("010000000c000000f5616200")));
		});
		it("deserialize_symbol_length3_little_test", function() { // `abc
			assert.equal("abc", c.deserialize(hexstr_to_bin("010000000d000000f561626300")));
		});
		it("deserialize_symbol_length4_little_test", function() { // `abcd
			assert.equal("abcd", c.deserialize(hexstr_to_bin("010000000e000000f56162636400")));
		});
		it("deserialize_symbol_length5_little_test", function() { // `abcde
			assert.equal("abcde", c.deserialize(hexstr_to_bin("010000000f000000f5616263646500")));
		});
		it("deserialize_timestamp_little_test", function() { // 2014.06.23D11:34:39.412547000
			assert.equal(moment.utc("2014.06.23 11:34:39.412547000", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime(), c.deserialize(hexstr_to_bin("0100000011000000f4b84d1d352d045706")).getTime());
		});
		it("deserialize_timestamp_null_little_test", function() { // 0Np
			assert.equal(null, c.deserialize(hexstr_to_bin("0100000011000000f40000000000000080")));
		});
		it("deserialize_month_201401_little_test", function() { // 2014.01m
			assert.equal(moment.utc("2014.01", "YYYY.MM").toDate().getTime(), c.deserialize(hexstr_to_bin("010000000d000000f3a8000000")).getTime());
		});
		it("deserialize_month_null_little_test", function() { // 0Nm
			assert.equal(null, c.deserialize(hexstr_to_bin("010000000d000000f300000080")));
		});
		it("deserialize_month_199501_little_test", function() { // 1995.01m
			assert.equal(moment.utc("1995.01", "YYYY.MM").toDate().getTime(), c.deserialize(hexstr_to_bin("010000000d000000f3c4ffffff")).getTime());
		});
		it("deserialize_date_20140101_little_test", function() { // 2014.01.01
			assert.equal(moment.utc("2014.01.91", "YYYY.MM").toDate().getTime(), c.deserialize(hexstr_to_bin("010000000d000000f2fa130000")).getTime());
		});
		it("deserialize_date_null_little_test", function() { // 0Nd
			assert.equal(null, c.deserialize(hexstr_to_bin("010000000d000000f200000080")));
		});
		it("deserialize_date_19950101_little_test", function() { // 1995.01.01
			assert.equal(moment.utc("1995.01.01", "YYYY.MM").toDate().getTime(), c.deserialize(hexstr_to_bin("010000000d000000f2def8ffff")).getTime());
		});
		it("deserialize_datetime_little_test", function() { // 2014.06.23T11:49:31.533
			assert.equal(moment.utc("2014.06.23 11:49:31.533", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime(), c.deserialize(hexstr_to_bin("0100000011000000f1facf4b237ea7b440")).getTime());
		});
		it("deserialize_datetime_null_little_test", function() { // 0Nz
			assert.equal(null, c.deserialize(hexstr_to_bin("0100000011000000f1000000000000f8ff")));
		});
		it("deserialize_timespan_little_test", function() { // 00:01:00.000000000
			assert.equal(moment.utc("2000.01.01 00:01:00.000", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime(), c.deserialize(hexstr_to_bin("0100000011000000f0005847f80d000000")).getTime());
		});
		it("deserialize_timespan_null_little_test", function() { // 0Nn
			assert.equal(null, c.deserialize(hexstr_to_bin("0100000011000000f00000000000000080")));
		});
		it("deserialize_minute_little_test", function() { // 00:01
			assert.equal(moment.utc("2000.01.01 00:01:00.000", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime(), c.deserialize(hexstr_to_bin("010000000d000000ef01000000")).getTime());
		});
		it("deserialize_minute_null_little_test", function() { // 0Nu
			assert.equal(null, c.deserialize(hexstr_to_bin("010000000d000000ef00000080")));
		});
		it("deserialize_second_little_test", function() { // 00:00:01
			assert.equal(moment.utc("2000.01.01 00:00:01.000", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime(), c.deserialize(hexstr_to_bin("010000000d000000ee01000000")).getTime());
		});
		it("deserialize_second_null_little_test", function() { // 0Nv
			assert.equal(null, c.deserialize(hexstr_to_bin("010000000d000000ee00000080")));
		});
		it("deserialize_time_little_test", function() { // 00:00:00.001
			assert.equal(moment.utc("2000.01.01 00:00:00.001", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime(),  c.deserialize(hexstr_to_bin("010000000d000000ed01000000")).getTime());
		});
		it("deserialize_time_null_little_test", function() { // 0Nt
			assert.equal(null, c.deserialize(hexstr_to_bin("010000000d000000ed00000080")));
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
	});
});
