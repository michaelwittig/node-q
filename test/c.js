var c = require("../lib/c.js"),
	typed = require("../lib/typed.js"),
	moment = require("moment"),
	assert = require("assert"),
	Long = require("long");

function hexstr_to_bin(str) {
	"use strict";
	return new Buffer(str, "hex");
}

function bin_to_hexstr(b) {
	"use strict";
	return b.toString("hex");
}

// use -8! in q to get the byte representation

describe("c", function() {
	"use strict";
	describe("deserialize", function() {
		describe("little", function() {
			describe("primitives", function() {
				it("boolean", function() { // 1b
					assert.equal(c.deserialize(hexstr_to_bin("010000000a000000ff01")), true);
				});
				describe("guid", function() {
					it("guid", function() { // 0a369037-75d3-b24d-6721-5a1d44d4bed5
						assert.equal(c.deserialize(hexstr_to_bin("0100000019000000fe0a36903775d3b24d67215a1d44d4bed5")), "0a369037-75d3-b24d-6721-5a1d44d4bed5");
					});
					it("null", function() { // 0Ng
						assert.equal(c.deserialize(hexstr_to_bin("0100000019000000fe00000000000000000000000000000000")), null);
					});
				});
				it("byte", function() { // 0x01
					assert.equal(c.deserialize(hexstr_to_bin("010000000a000000fc01")), "1");
				});
				describe("short", function() {
					it("1", function() { // 1h
						assert.equal(c.deserialize(hexstr_to_bin("010000000b000000fb0100")), 1);
					});
					it("-1", function() { // -1h
						assert.equal(c.deserialize(hexstr_to_bin("010000000b000000fbffff")), -1);
					});
					it("null", function() { // 0Nh
						assert.equal(c.deserialize(hexstr_to_bin("010000000b000000fb0080")), null);
					});
					it("Infinity", function() { // 0wh
						assert.equal(c.deserialize(hexstr_to_bin("010000000b000000fbff7f")), Infinity);
					});
					it("-Infinity", function() { // -0wh
						assert.equal(c.deserialize(hexstr_to_bin("010000000b000000fb0180")), -Infinity);
					});
				});
				describe("integer", function() {
					it("1", function() { // 1i
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000fa01000000")), 1);
					});
					it("-1", function() { // -1i
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000faffffffff")), -1);
					});
					it("null", function() { // 0Ni
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000fa00000080")), null);
					});
					it("Infinity", function() { // 0wi
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000faffffff7f")), Infinity);
					});
					it("-Infinity", function() { // -0wi
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000fa01000080")), -Infinity);
					});
				});
				describe("long", function() {
					describe("long2number", function() {
						describe("default", function() {
							it("1", function() { // 1j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100000000000000")), 1);
							});
							it("-1", function() { // -1j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f9ffffffffffffffff")), -1);
							});
							it("2147483647", function() { // 2147483647j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f9ffffff7f00000000")), 2147483647);
							});
							it("2147483648", function() { // 2147483648j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90000008000000000")), 2147483648);
							});
							it("2147483649", function() { // 2147483649j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100008000000000")), 2147483649);
							});
							it("4294967295", function() { // 4294967295j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f9ffffffff00000000")), 4294967295);
							});
							it("4294967296", function() { // 4294967296j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90000000001000000")), 4294967296);
							});
							it("4294967297", function() { // 4294967297j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100000001000000")), 4294967297);
							});
							it("null", function() { // 0Nj
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90000000000000080")), null);
							});
							it("Infinity", function() { // 0wj
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f9ffffffffffffff7f")), Infinity);
							});
							it("-Infinity", function() { // -0wj
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100000000000080")), -Infinity);
							});
						});
						describe("false", function() {
							it("1", function() { // 1j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100000000000000"), undefined, undefined, undefined, false).toNumber(), 1);
							});
							it("-1", function() { // -1j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f9ffffffffffffffff"), undefined, undefined, undefined, false).toNumber(), -1);
							});
							it("2147483647", function() { // 2147483647j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f9ffffff7f00000000"), undefined, undefined, undefined, false).toNumber(), 2147483647);
							});
							it("2147483648", function() { // 2147483648j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90000008000000000"), undefined, undefined, undefined, false).toNumber(), 2147483648);
							});
							it("2147483649", function() { // 2147483649j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100008000000000"), undefined, undefined, undefined, false).toNumber(), 2147483649);
							});
							it("4294967295", function() { // 4294967295j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f9ffffffff00000000"), undefined, undefined, undefined, false).toNumber(), 4294967295);
							});
							it("4294967296", function() { // 4294967296j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90000000001000000"), undefined, undefined, undefined, false).toNumber(), 4294967296);
							});
							it("4294967297", function() { // 4294967297j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100000001000000"), undefined, undefined, undefined, false).toNumber(), 4294967297);
							});
							it("null", function() { // 0Nj
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90000000000000080"), undefined, undefined, undefined, false), null);
							});
							it("Infinity", function() { // 0wj
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f9ffffffffffffff7f"), undefined, undefined, undefined, false), Infinity);
							});
							it("-Infinity", function() { // -0wj
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100000000000080"), undefined, undefined, undefined, false), -Infinity);
							});
						});
						describe("true", function() {
							it("1", function() { // 1j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100000000000000"), undefined, undefined, undefined, true), 1);
							});
							it("-1", function() { // -1j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f9ffffffffffffffff"), undefined, undefined, undefined, true), -1);
							});
							it("2147483647", function() { // 2147483647j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f9ffffff7f00000000"), undefined, undefined, undefined, true), 2147483647);
							});
							it("2147483648", function() { // 2147483648j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90000008000000000"), undefined, undefined, undefined, true), 2147483648);
							});
							it("2147483649", function() { // 2147483649j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100008000000000"), undefined, undefined, undefined, true), 2147483649);
							});
							it("4294967295", function() { // 4294967295j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f9ffffffff00000000"), undefined, undefined, undefined, true), 4294967295);
							});
							it("4294967296", function() { // 4294967296j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90000000001000000"), undefined, undefined, undefined, true), 4294967296);
							});
							it("4294967297", function() { // 4294967297j
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100000001000000"), undefined, undefined, undefined, true), 4294967297);
							});
							it("null", function() { // 0Nj
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90000000000000080"), undefined, undefined, undefined, true), null);
							});
							it("Infinity", function() { // 0wj
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f9ffffffffffffff7f"), undefined, undefined, undefined, true), Infinity);
							});
							it("-Infinity", function() { // -0wj
								assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f90100000000000080"), undefined, undefined, undefined, true), -Infinity);
							});
						});
					});
				});
				describe("real", function() {
					it("1", function() { // 1e
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f80000803f")), 1.0);
					});
					it("-1", function() { // -1e
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f8000080bf")), -1.0);
					});
					it("null", function() { // 0Ne
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f80000c0ff")), null);
					});
					it("Infinity", function() { // 0we
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f80000807f")), Infinity);
					});
					it("-Infinity", function() { // -0we
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f8000080ff")), -Infinity);
					});
				});
				describe("float", function() {
					it("1", function() { // 1f
						assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f7000000000000f03f")), 1.0);
					});
					it("-1", function() { // -1f
						assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f7000000000000f0bf")), -1.0);
					});
					it("null", function() { // 0Nf
						assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f7000000000000f8ff")), null);
					});
					it("Infinity", function() { // 0wf
						assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f7000000000000f07f")), Infinity);
					});
					it("-Infinity", function() { // -0wf
						assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f7000000000000f0ff")), -Infinity);
					});
				});
				describe("char", function() {
					describe("emptyChar2null", function() {
						describe("default", function() {
							it("a", function() { // "a"
								assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f661")), "a");
							});
							it("null", function() { // " "
								assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f620")), null);
							});
						});
						describe("true", function() {
							it("a", function() { // "a"
								assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f661"), undefined, undefined, true), "a");
							});
							it("null", function() { // " "
								assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f620"), undefined, undefined, true), null);
							});
						});
						describe("false", function() {
							it("a", function() { // "a"
								assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f661"), undefined, undefined, false), "a");
							});
							it("null", function() { // " "
								assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f620"), undefined, undefined, false), " ");
							});
						});
					});
				});
				describe("symbol", function() {
					it("length 1", function() { // `a
						assert.equal(c.deserialize(hexstr_to_bin("010000000b000000f56100")), "a");
					});
					it("null", function() { // `
						assert.equal(c.deserialize(hexstr_to_bin("010000000a000000f500")), null);
					});
					it("length 2", function() { // `ab
						assert.equal(c.deserialize(hexstr_to_bin("010000000c000000f5616200")), "ab");
					});
					it("length 3", function() { // `abc
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f561626300")), "abc");
					});
					it("length 4", function() { // `abcd
						assert.equal(c.deserialize(hexstr_to_bin("010000000e000000f56162636400")), "abcd");
					});
					it("lenth 5", function() { // `abcde
						assert.equal(c.deserialize(hexstr_to_bin("010000000f000000f5616263646500")), "abcde");
					});
					it("unicode length 1", function() { // `$"你"
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f5e4bda000")), "你");
					});
					it("unicode length 2", function() { // `$"你好"
						assert.equal(c.deserialize(hexstr_to_bin("0100000010000000f5e4bda0e5a5bd00")), "你好");
					});
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
				describe("month", function() {
					it("201401", function() { // 2014.01m
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f3a8000000")).getTime(), moment.utc("2014.01", "YYYY.MM").toDate().getTime());
					});
					it("null", function() { // 0Nm
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f300000080")), null);
					});
					it("199501", function() { // 1995.01m
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f3c4ffffff")).getTime(), moment.utc("1995.01", "YYYY.MM").toDate().getTime());
					});
				});
				describe("date", function() {
					it("20140101", function() { // 2014.01.01
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f2fa130000")).getTime(), moment.utc("2014.01.91", "YYYY.MM").toDate().getTime());
					});
					it("null", function() { // 0Nd
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f200000080")), null);
					});
					it("19950101", function() { // 1995.01.01
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000f2def8ffff")).getTime(), moment.utc("1995.01.01", "YYYY.MM").toDate().getTime());
					});
				});
				describe("datetime", function() {
					it("datetime", function() { // 2014.06.23T11:49:31.533
						assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f1facf4b237ea7b440")).getTime(), moment.utc("2014.06.23 11:49:31.533", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
					});
					it("null", function() { // 0Nz
						assert.equal(c.deserialize(hexstr_to_bin("0100000011000000f1000000000000f8ff")), null);
					});
				});
				describe("minute", function() {
					it("00:01", function() { // 00:01
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000ef01000000")).getTime(), moment.utc("2000.01.01 00:01:00.000", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
					});
					it("null", function() { // 0Nu
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000ef00000080")), null);
					});
				});
				describe("second", function() {
					it("00:00:01", function() { // 00:00:01
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000ee01000000")).getTime(), moment.utc("2000.01.01 00:00:01.000", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
					});
					it("null", function() { // 0Nv
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000ee00000080")), null);
					});
				});
				describe("time", function() {
					it("00:00:00.001", function() { // 00:00:00.001
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000ed01000000")).getTime(), moment.utc("2000.01.01 00:00:00.001", "YYYY.MM.DD HH:mm:ss.SSS").toDate().getTime());
					});
					it("null", function() { // 0Nt
						assert.equal(c.deserialize(hexstr_to_bin("010000000d000000ed00000080")), null);
					});
				});
			});
			describe("list", function() {
				it("empty", function() {
					assert.deepEqual(c.deserialize(hexstr_to_bin("010000000e000000000000000000")), []);
				});
				it("generic", function() { // (1j;1b;3h)
					assert.deepEqual(c.deserialize(hexstr_to_bin("010000001c000000000003000000f90100000000000000ff01fb0300")), [1, true, 3]);
				});
				it("null", function() { // (::;::;::)
					assert.deepEqual(c.deserialize(hexstr_to_bin("0100000014000000000003000000650065006500")), [null, null, null]);
				});
				describe("list of list", function() {
					it("same types", function() { // enlist (1f;2f;3f)
						assert.deepEqual(c.deserialize(hexstr_to_bin("010000002c000000000001000000090003000000000000000000f03f00000000000000400000000000000840")), [[1, 2, 3]]);
					});
					it("different types", function() { // enlist (1f;1b;3h)
						assert.deepEqual(c.deserialize(hexstr_to_bin("0100000022000000000001000000000003000000f7000000000000f03fff01fb0300")), [[1, true, 3]]);
					});
				});
				describe("boolean", function() {
					it("single", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("010000000f00000001000100000001")), [true]);
					});
					it("multi", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("0100000011000000010003000000010001")), [true, false, true]);
					});
				});
				describe("guid", function() {
					it("single", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("010000001e000000020001000000daedb4cc85f44ba0e3083c62191c0865")), ["daedb4cc-85f4-4ba0-e308-3c62191c0865"]);
					});
					it("multi", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("010000003e000000020003000000ca3b0039fc23f2892c3769d4a24fe17cc73d1b400fce85c1a78fb653c8c6d022f4f58976d8cad4c10db7d102c6f91025")), ["ca3b0039-fc23-f289-2c37-69d4a24fe17c", "c73d1b40-0fce-85c1-a78f-b653c8c6d022", "f4f58976-d8ca-d4c1-0db7-d102c6f91025"]);
					});
				});
				describe("byte", function() {
					it("single", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("010000000f00000004000100000001")), [1]);
					});
					it("multi", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("0100000011000000040003000000010203")), [1, 2, 3]);
					});
				});
				describe("short", function() {
					it("single", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("01000000100000000500010000000100")), [1]);
					});
					it("multi", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("0100000014000000050003000000010002000300")), [1, 2, 3]);
					});
				});
				describe("int", function() {
					it("single", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("010000001200000006000100000001000000")), [1]);
					});
					it("multi", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("010000001a000000060003000000010000000200000003000000")), [1, 2, 3]);
					});
				});
				describe("long", function() {
					it("single", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("01000000160000000700010000000100000000000000")), [1]);
					});
					it("multi", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("0100000026000000070003000000010000000000000002000000000000000300000000000000")), [1, 2, 3]);
					});
				});
				describe("real", function() {
					it("single", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("01000000120000000800010000000000803f")), [1]);
					});
					it("multi", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("010000001a0000000800030000000000803f0000004000004040")), [1, 2, 3]);
					});
				});
				describe("float", function() {
					it("single", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("0100000016000000090001000000000000000000f03f")), [1]);
					});
					it("multi", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("0100000026000000090003000000000000000000f03f00000000000000400000000000000840")), [1, 2, 3]);
					});
				});
				describe("char", function() {
					it("single", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("010000000f0000000a000100000061")), "a");
					});
					it("multi", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("01000000100000000a00020000006162")), "ab");
					});
					it("unicode", function() { // "你好"
						assert.deepEqual(c.deserialize(hexstr_to_bin("01000000140000000a0006000000e4bda0e5a5bd")), "你好");
					});
				});
				describe("symbol", function() {
					it("single", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("01000000100000000b00010000006100")), ["a"]);
					});
					it("multi", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("01000000170000000b0003000000610061620061626300")), ["a", "ab", "abc"]);
					});
				});
				describe("timestamp", function() {
					describe("nanos2date", function() {
						describe("default", function() {
							it("single", function() { // 2014.06.23D11:34:39.412547000
								assert.deepEqual(c.deserialize(hexstr_to_bin("01000000160000000c0001000000b84d1d352d045706")), [new Date("2014-06-23T11:34:39.412")]);
							});
							it("multi", function() { // 2014.06.23D11:34:39.412547000
								assert.deepEqual(c.deserialize(hexstr_to_bin("01000000260000000c0003000000b84d1d352d045706b84d5f3c96396006b84df0d493bd6906")), [new Date("2014-06-23T11:34:39.412"), new Date("2014-07-23T11:34:39.412"), new Date("2014-08-23T11:34:39.412")]);
							});
						});
						describe("true", function() {
							it("single", function() { // 2014.06.23D11:34:39.412547000
								assert.deepEqual(c.deserialize(hexstr_to_bin("01000000160000000c0001000000b84d1d352d045706"), true), [new Date("2014-06-23T11:34:39.412")]);
							});
							it("multi", function() { // 2014.06.23D11:34:39.412547000
								assert.deepEqual(c.deserialize(hexstr_to_bin("01000000260000000c0003000000b84d1d352d045706b84d5f3c96396006b84df0d493bd6906"), true), [new Date("2014-06-23T11:34:39.412"), new Date("2014-07-23T11:34:39.412"), new Date("2014-08-23T11:34:39.412")]);
							});
						});
						describe("false", function() {
							it("single", function() { // 2014.06.23D11:34:39.412547000
								assert.deepEqual(c.deserialize(hexstr_to_bin("01000000160000000c0001000000b84d1d352d045706"), false), [1403523279412547000]);
							});
							it("multi", function() { // 2014.06.23D11:34:39.412547000
								assert.deepEqual(c.deserialize(hexstr_to_bin("01000000260000000c0003000000b84d1d352d045706b84d5f3c96396006b84df0d493bd6906"), false), [1403523279412547000, 1406115279412547000, 1408793679412547000]);
							});
						});
					});
				});
				describe("month", function() {
					it("single", function() { // 1997.01m
						assert.deepEqual(c.deserialize(hexstr_to_bin("01000000120000000d0001000000dcffffff")), [new Date("1997-01-01T00:00:00.000")]);
					});
					it("multi", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("010000001a0000000d0003000000dcffffffe8fffffff4ffffff")), [new Date("1997-01-01T00:00:00.000"), new Date("1998-01-01T00:00:00.000"), new Date("1999-01-01T00:00:00.000")]);
					});
				});
				describe("date", function() {
					it("single", function() { // 1997.01.01
						assert.deepEqual(c.deserialize(hexstr_to_bin("01000000120000000e0001000000b9fbffff")), [new Date("1997-01-01T00:00:00.000")]);
					});
					it("multi", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("010000001a0000000e0003000000b9fbffff26fdffff93feffff")), [new Date("1997-01-01T00:00:00.000"), new Date("1998-01-01T00:00:00.000"), new Date("1999-01-01T00:00:00.000")]);
					});
				});
				describe("datetime", function() {
					it("single", function() { // 2001.01.01T00:00:00.000
						assert.deepEqual(c.deserialize(hexstr_to_bin("01000000160000000f00010000000000000000e07640")), [new Date("2001-01-01T00:00:00.000")]);
					});
					it("multi", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("01000000260000000f00030000000000000000e076400000000000d078400000000000907a40")), [new Date("2001-01-01T00:00:00.000"), new Date("2001-02-01T00:00:00.000"), new Date("2001-03-01T00:00:00.000")]);
					});
				});
				describe("timespan", function() {
					describe("nanos2date", function() {
						describe("default", function() {
							it("single", function() { // 00:01:00.000000000
								assert.deepEqual(c.deserialize(hexstr_to_bin("0100000016000000100001000000005847f80d000000")), [new Date("2000-01-01T00:01:00.000")]);
							});
							it("multi", function() { // 00:01:00.000000000
								assert.deepEqual(c.deserialize(hexstr_to_bin("0100000026000000100003000000005847f80d00000000b08ef01b0000000008d6e829000000")), [new Date("2000-01-01T00:01:00.000"), new Date("2000-01-01T00:02:00.000"), new Date("2000-01-01T00:03:00.000")]);
							});
						});
						describe("true", function() {
							it("single", function() { // 00:01:00.000000000
								assert.deepEqual(c.deserialize(hexstr_to_bin("0100000016000000100001000000005847f80d000000"), true), [new Date("2000-01-01T00:01:00.000")]);
							});
							it("multi", function() { // 00:01:00.000000000
								assert.deepEqual(c.deserialize(hexstr_to_bin("0100000026000000100003000000005847f80d00000000b08ef01b0000000008d6e829000000"), true), [new Date("2000-01-01T00:01:00.000"), new Date("2000-01-01T00:02:00.000"), new Date("2000-01-01T00:03:00.000")]);
							});
						});
						describe("false", function() {
							it("single", function() { // 00:01:00.000000000
								assert.deepEqual(c.deserialize(hexstr_to_bin("0100000016000000100001000000005847f80d000000"), false), [60000000000]);
							});
							it("multi", function() { // 00:01:00.000000000
								assert.deepEqual(c.deserialize(hexstr_to_bin("0100000026000000100003000000005847f80d00000000b08ef01b0000000008d6e829000000"), false), [60000000000, 120000000000, 180000000000]);
							});
						});
					});
				});
				describe("minute", function() {
					it("single", function() { // 00:01
						assert.deepEqual(c.deserialize(hexstr_to_bin("010000001200000011000100000001000000")), [new Date("2000-01-01T00:01:00.000")]);
					});
					it("multi", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("010000001a000000110003000000010000000200000003000000")), [new Date("2000-01-01T00:01:00.000"), new Date("2000-01-01T00:02:00.000"), new Date("2000-01-01T00:03:00.000")]);
					});
				});
				describe("second", function() {
					it("single", function() { // 00:00:01
						assert.deepEqual(c.deserialize(hexstr_to_bin("010000001200000012000100000001000000")), [new Date("2000-01-01T00:00:01.000")]);
					});
					it("multi", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("010000001a000000120003000000010000000200000003000000")), [new Date("2000-01-01T00:00:01.000"), new Date("2000-01-01T00:00:02.000"), new Date("2000-01-01T00:00:03.000")]);
					});
				});
				describe("time", function() {
					it("single", function() { // 00:00:00.001
						assert.deepEqual(c.deserialize(hexstr_to_bin("010000001200000013000100000001000000")), [new Date("2000-01-01T00:00:00.001")]);
					});
					it("multi", function() {
						assert.deepEqual(c.deserialize(hexstr_to_bin("010000001a000000130003000000010000000200000003000000")), [new Date("2000-01-01T00:00:00.001"), new Date("2000-01-01T00:00:00.002"), new Date("2000-01-01T00:00:00.003")]);
					});
				});
			});
			describe("dict", function() {
				it("empty", function() {
					assert.deepEqual(c.deserialize(hexstr_to_bin("010000001500000063000000000000000000000000")), {});
				});
				it("single entry", function() {
					assert.deepEqual(c.deserialize(hexstr_to_bin("010000001f000000630b000100000061000700010000000100000000000000")), {a: 1});
				});
				it("multiple entries same type", function() {
					assert.deepEqual(c.deserialize(hexstr_to_bin("0100000033000000630b0003000000610062006300070003000000010000000000000002000000000000000300000000000000")), {a: 1, b: 2, c: 3});
				});
				it("multiple entries different types", function() {
					assert.deepEqual(c.deserialize(hexstr_to_bin("010000002f000000630b0003000000610062006300000003000000f90100000000000000ff01f70000000000000840")), {a: 1, b: true, c: 3});
				});
				it("multiple entries, null values", function() {
					assert.deepEqual(c.deserialize(hexstr_to_bin("0100000021000000630b0003000000610062006300000003000000650065006500")), {a: null, b: null, c: null});
				});
			});
			describe("table", function() {
				describe("flipTables", function() {
					describe("default", function() {
						it("multiple rows", function() {
							assert.deepEqual(c.deserialize(hexstr_to_bin("01000000620000006200630b0003000000610062006300000003000000070003000000010000000000000002000000000000000300000000000000010003000000010001090003000000000000000000f03f00000000000000400000000000000840")), [{a: 1, b: true, c: 1}, {a: 2, b: false, c: 2}, {a: 3, b: true, c: 3}]);
						});
						it("no rows", function() {
							assert.deepEqual(c.deserialize(hexstr_to_bin("010000002f0000006200630b0003000000610062006300000003000000070000000000010000000000090000000000")), []);
						});
					});
					describe("true", function() {
						it("multiple rows", function() {
							assert.deepEqual(c.deserialize(hexstr_to_bin("01000000620000006200630b0003000000610062006300000003000000070003000000010000000000000002000000000000000300000000000000010003000000010001090003000000000000000000f03f00000000000000400000000000000840"), undefined, true), [{a: 1, b: true, c: 1}, {a: 2, b: false, c: 2}, {a: 3, b: true, c: 3}]);
						});
						it("no rows", function() {
							assert.deepEqual(c.deserialize(hexstr_to_bin("010000002f0000006200630b0003000000610062006300000003000000070000000000010000000000090000000000"), undefined, true), []);
						});
					});
					describe("false", function() {
						it("multiple rows", function() {
							assert.deepEqual(c.deserialize(hexstr_to_bin("01000000620000006200630b0003000000610062006300000003000000070003000000010000000000000002000000000000000300000000000000010003000000010001090003000000000000000000f03f00000000000000400000000000000840"), undefined, false), {a: [1, 2, 3], b: [true, false, true], c: [1, 2, 3]});
						});
						it("no rows", function() {
							assert.deepEqual(c.deserialize(hexstr_to_bin("010000002f0000006200630b0003000000610062006300000003000000070000000000010000000000090000000000"), undefined, false), {a: [], b: [], c: []});
						});
					});
				});
			});
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
				it("symbol unicode length 1", function() {
					assert.equal(bin_to_hexstr(c.serialize("`你")), "010000000d000000f5e4bda000");
				});
				it("symbol unicode length 2", function() {
					assert.equal(bin_to_hexstr(c.serialize("`你好")), "0100000010000000f5e4bda0e5a5bd00");
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
				describe("Object", function() {
					it("one key", function() {
						assert.equal(bin_to_hexstr(c.serialize({a: 1})), "010000001f000000630b00010000006100090001000000000000000000f03f");
					});
					it("one key, null value", function() {
						assert.equal(bin_to_hexstr(c.serialize({a: null})), "0100000019000000630b000100000061000000010000006500");
					});
					it("multiple keys, same value type", function() {
						assert.equal(bin_to_hexstr(c.serialize({a: 1, b: 2, c: 3})), "0100000033000000630b0003000000610062006300090003000000000000000000f03f00000000000000400000000000000840");
					});
					it("multiple keys, different value types", function() {
						assert.equal(bin_to_hexstr(c.serialize({a: 1, b: true, c: 3})), "010000002f000000630b0003000000610062006300000003000000f7000000000000f03fff01f70000000000000840");
					});
					it("multiple keys, null value", function() {
						assert.equal(bin_to_hexstr(c.serialize({a: null, b: null, c: null})), "0100000021000000630b0003000000610062006300000003000000650065006500");
					});
				});
				describe("Array", function() {
					it("empty", function() {
						assert.equal(bin_to_hexstr(c.serialize([])), "010000000e000000000000000000");
					});
					it("one element", function() {
						assert.equal(bin_to_hexstr(c.serialize([1])), "0100000016000000090001000000000000000000f03f");
					});
					it("multiple elements, same types", function() {
						assert.equal(bin_to_hexstr(c.serialize([1, 2, 3])), "0100000026000000090003000000000000000000f03f00000000000000400000000000000840");
					});
					it("multiple elements, different types", function() {
						assert.equal(bin_to_hexstr(c.serialize([1, true, 3])), "0100000022000000000003000000f7000000000000f03fff01f70000000000000840");
					});
					it("Array of Array same type", function() {
						assert.equal(bin_to_hexstr(c.serialize([[1, 2, 3]])), "010000002c000000000001000000090003000000000000000000f03f00000000000000400000000000000840");
					});
					it("Array of Array different types", function() {
						assert.equal(bin_to_hexstr(c.serialize([[1, true, 3]])), "0100000028000000000001000000000003000000f7000000000000f03fff01f70000000000000840");
					});
					it("one null", function() {
						assert.equal(bin_to_hexstr(c.serialize([null])), "01000000100000000000010000006500");
					});
					it("three nulls", function() {
						assert.equal(bin_to_hexstr(c.serialize([null, null, null])), "0100000014000000000003000000650065006500");
					});
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
			});
		});
		describe("typed", function() {
			describe("little", function() {
				describe("primitives", function() {
					it("boolean", function() { // 1b
						assert.equal(bin_to_hexstr(c.serialize(typed.boolean(true))), "010000000a000000ff01");
					});
					describe("guid", function() {
						it("guid", function() { // 0a369037-75d3-b24d-6721-5a1d44d4bed5
							assert.equal(bin_to_hexstr(c.serialize(typed.guid("0a369037-75d3-b24d-6721-5a1d44d4bed5"))), "0100000019000000fe0a36903775d3b24d67215a1d44d4bed5");
						});
						it("null", function() { // 0Ng
							assert.equal(bin_to_hexstr(c.serialize(typed.guid(null))), "0100000019000000fe00000000000000000000000000000000");
						});
					});
					it("byte", function() { // 0x01
						assert.equal(bin_to_hexstr(c.serialize(typed.byte(1))), "010000000a000000fc01");
					});
					describe("short", function() {
						it("1", function() { // 1h
							assert.equal(bin_to_hexstr(c.serialize(typed.short(1))), "010000000b000000fb0100");
						});
						it("-1", function() { // -1h
							assert.equal(bin_to_hexstr(c.serialize(typed.short(-1))), "010000000b000000fbffff");
						});
						it("null", function() { // 0Nh
							assert.equal(bin_to_hexstr(c.serialize(typed.short(null))), "010000000b000000fb0080");
						});
						it("Infinity", function() { // 0wh
							assert.equal(bin_to_hexstr(c.serialize(typed.short(Infinity))), "010000000b000000fbff7f");
						});
						it("-Infinity", function() { // -0wh
							assert.equal(bin_to_hexstr(c.serialize(typed.short(-Infinity))), "010000000b000000fb0180");
						});
					});
					describe("integer", function() {
						it("1", function() { // 1i
							assert.equal(bin_to_hexstr(c.serialize(typed.int(1))), "010000000d000000fa01000000");
						});
						it("-1", function() { // -1i
							assert.equal(bin_to_hexstr(c.serialize(typed.int(-1))), "010000000d000000faffffffff");
						});
						it("null", function() { // 0Ni
							assert.equal(bin_to_hexstr(c.serialize(typed.int(null))), "010000000d000000fa00000080");
						});
						it("Infinity", function() { // 0wi
							assert.equal(bin_to_hexstr(c.serialize(typed.int(Infinity))), "010000000d000000faffffff7f");
						});
						it("-Infinity", function() { // -0wi
							assert.equal(bin_to_hexstr(c.serialize(typed.int(-Infinity))), "010000000d000000fa01000080");
						});
					});
					describe("long", function() {
						it("1", function() { // 1j
							assert.equal(bin_to_hexstr(c.serialize(typed.long(Long.fromString("1", false, 10)))), "0100000011000000f90100000000000000");
						});
						it("-1", function() { // -1j
							assert.equal(bin_to_hexstr(c.serialize(typed.long(Long.fromString("-1", false, 10)))), "0100000011000000f9ffffffffffffffff");
						});
						it("2147483647", function() { // 2147483647j
							assert.equal(bin_to_hexstr(c.serialize(typed.long(Long.fromString("2147483647", false, 10)))), "0100000011000000f9ffffff7f00000000");
						});
						it("2147483648", function() { // 2147483648j
							assert.equal(bin_to_hexstr(c.serialize(typed.long(Long.fromString("2147483648", false, 10)))), "0100000011000000f90000008000000000");
						});
						it("2147483649", function() { // 2147483649j
							assert.equal(bin_to_hexstr(c.serialize(typed.long(Long.fromString("2147483649", false, 10)))), "0100000011000000f90100008000000000");
						});
						it("4294967295", function() { // 4294967295j
							assert.equal(bin_to_hexstr(c.serialize(typed.long(Long.fromString("4294967295", false, 10)))), "0100000011000000f9ffffffff00000000");
						});
						it("4294967296", function() { // 4294967296j
							assert.equal(bin_to_hexstr(c.serialize(typed.long(Long.fromString("4294967296", false, 10)))), "0100000011000000f90000000001000000");
						});
						it("4294967297", function() { // 4294967297j
							assert.equal(bin_to_hexstr(c.serialize(typed.long(Long.fromString("4294967297", false, 10)))), "0100000011000000f90100000001000000");
						});
						it("null", function() { // 0Nj
							assert.equal(bin_to_hexstr(c.serialize(typed.long(null))), "0100000011000000f90000000000000080");
						});
						it("Infinity", function() { // 0wj
							assert.equal(bin_to_hexstr(c.serialize(typed.long(Infinity))), "0100000011000000f9ffffffffffffff7f");
						});
						it("-Infinity", function() { // -0wj
							assert.equal(bin_to_hexstr(c.serialize(typed.long(-Infinity))), "0100000011000000f90100000000000080");
						});
					});
					describe("real", function() {
						it("1", function() { // 1e
							assert.equal(bin_to_hexstr(c.serialize(typed.real(1.0))), "010000000d000000f80000803f");
						});
						it("-1", function() { // -1e
							assert.equal(bin_to_hexstr(c.serialize(typed.real(-1.0))), "010000000d000000f8000080bf");
						});
						it("null", function() { // 0Ne
							assert.equal(bin_to_hexstr(c.serialize(typed.real(null))), "010000000d000000f80000c0ff");
						});
						it("Infinity", function() { // 0we
							assert.equal(bin_to_hexstr(c.serialize(typed.real(Infinity))), "010000000d000000f80000807f");
						});
						it("-Infinity", function() { // -0we
							assert.equal(bin_to_hexstr(c.serialize(typed.real(-Infinity))), "010000000d000000f8000080ff");
						});
					});
					describe("float", function() {
						it("1", function() { // 1f
							assert.equal(bin_to_hexstr(c.serialize(typed.float(1.0))), "0100000011000000f7000000000000f03f");
						});
						it("-1", function() { // -1f
							assert.equal(bin_to_hexstr(c.serialize(typed.float(-1.0))), "0100000011000000f7000000000000f0bf");
						});
						it("null", function() { // 0Nf
							assert.equal(bin_to_hexstr(c.serialize(typed.float(null))), "0100000011000000f7000000000000f8ff");
						});
						it("Infinity", function() { // 0wf
							assert.equal(bin_to_hexstr(c.serialize(typed.float(Infinity))), "0100000011000000f7000000000000f07f");
						});
						it("-Infinity", function() { // -0wf
							assert.equal(bin_to_hexstr(c.serialize(typed.float(-Infinity))), "0100000011000000f7000000000000f0ff");
						});
					});
					describe("char", function() {
						it("a", function() { // "a"
							assert.equal(bin_to_hexstr(c.serialize(typed.char("a"))), "010000000a000000f661");
						});
						it("null", function() { // " "
							assert.equal(bin_to_hexstr(c.serialize(typed.char(null))), "010000000a000000f620");
						});
					});
					describe("symbol", function() {
						it("length 1", function() { // `a
							assert.equal(bin_to_hexstr(c.serialize(typed.symbol("a"))), "010000000b000000f56100");
						});
						it("unicode", function() { // `你
							assert.equal(bin_to_hexstr(c.serialize(typed.symbol("你"))), "010000000d000000f5e4bda000");
						});
						it("null", function() { // `
							assert.equal(bin_to_hexstr(c.serialize(typed.symbol(null))), "010000000a000000f500");
						});
						it("length 2", function() { // `ab
							assert.equal(bin_to_hexstr(c.serialize(typed.symbol("ab"))), "010000000c000000f5616200");
						});
						it("length 3", function() { // `abc
							assert.equal(bin_to_hexstr(c.serialize(typed.symbol("abc"))), "010000000d000000f561626300");
						});
						it("length 4", function() { // `abcd
							assert.equal(bin_to_hexstr(c.serialize(typed.symbol("abcd"))), "010000000e000000f56162636400");
						});
						it("length 5", function() { // `abcde
							assert.equal(bin_to_hexstr(c.serialize(typed.symbol("abcde"))), "010000000f000000f5616263646500");
						});
					});
					describe("timestamp", function() {
						it("timestamp", function() { // 2014.06.23D11:34:39.412000000
							assert.equal(bin_to_hexstr(c.serialize(typed.timestamp(new Date("2014-06-23T11:34:39.412000000")))), "0100000011000000f400f514352d045706");
						});
						it("null", function() { // 0Np
							assert.equal(bin_to_hexstr(c.serialize(typed.timestamp(null))), "0100000011000000f40000000000000080");
						});
					});	
					describe("month", function() {
						it("201401", function() { // 2014.01m
							 assert.equal(bin_to_hexstr(c.serialize(typed.month(new Date("2014-01-01")))), "010000000d000000f3a8000000");
						});
						it("null", function() { // 0Nm
							 assert.equal(bin_to_hexstr(c.serialize(typed.month(null))), "010000000d000000f300000080");
						});
						it("199501", function() { // 1995.01m
							 assert.equal(bin_to_hexstr(c.serialize(typed.month(new Date("1995-01-01")))), "010000000d000000f3c4ffffff");
						});
					});
					describe("date", function() {
						it("20140101", function() { // 2014.01.01
							assert.equal(bin_to_hexstr(c.serialize(typed.date(new Date("2014-01-01")))), "010000000d000000f2fa130000");
						});
						it("null", function() { // 0Nd
							assert.equal(bin_to_hexstr(c.serialize(typed.date(null))), "010000000d000000f200000080");
						});
						it("19950101", function() { // 1995.01.01
							assert.equal(bin_to_hexstr(c.serialize(typed.date(new Date("1995-01-01")))), "010000000d000000f2def8ffff");
						});
					});
					describe("datetime", function() {
						it("datetime", function() { // 2014.06.23T11:49:31.533
							assert.equal(bin_to_hexstr(c.serialize(typed.datetime(new Date("2014-06-23T11:49:31.533")))), "0100000011000000f1facf4b237ea7b440");
						});
						it("null", function() { // 0Nz
							assert.equal(bin_to_hexstr(c.serialize(typed.datetime(null))), "0100000011000000f1000000000000f8ff");
						});
					});
					describe("timespan", function() {
						it("timespan", function() { // 00:01:00.000000000
							assert.equal(bin_to_hexstr(c.serialize(typed.timespan(new Date("2000-01-01T00:01:00.000")))), "0100000011000000f0005847f80d000000");
						});
						it("null", function() { // 0Nn
							assert.equal(bin_to_hexstr(c.serialize(typed.timespan(null))), "0100000011000000f00000000000000080");
						});
					});
					describe("minute", function() {
						it("minute", function() { // 00:01
							assert.equal(bin_to_hexstr(c.serialize(typed.minute(new Date("2000-01-01T00:01:00.000")))), "010000000d000000ef01000000");
						});
						it("null", function() { // 0Nu
							assert.equal(bin_to_hexstr(c.serialize(typed.minute(null))), "010000000d000000ef00000080");
						});
					});
					describe("second", function() {
						it("second", function() { // 00:00:01
							assert.equal(bin_to_hexstr(c.serialize(typed.second(new Date("2000-01-01T00:00:01.000")))), "010000000d000000ee01000000");
						});
						it("null", function() { // 0Nv
							assert.equal(bin_to_hexstr(c.serialize(typed.second(null))), "010000000d000000ee00000080");
						});
					});
					describe("time", function() {
						it("time", function() { // 00:00:00.001
							assert.equal(bin_to_hexstr(c.serialize(typed.time(new Date("2000-01-01T00:00:00.001")))), "010000000d000000ed01000000");
						});
						it("null", function() { // 0Nt
							assert.equal(bin_to_hexstr(c.serialize(typed.time(null))), "010000000d000000ed00000080");
						});
					});
				});
				describe("list", function() {
					describe("generic", function() {
						it("two values", function() {
							assert.equal(bin_to_hexstr(c.serialize([typed.boolean(true), typed.float(1)])), "0100000019000000000002000000ff01f7000000000000f03f");
						});
						it("three values", function() { // (1l;1b;`a)
							assert.equal(bin_to_hexstr(c.serialize([typed.long(Long.fromString("1", false, 10)), typed.boolean(true), typed.symbol("a")])), "010000001c000000000003000000f90100000000000000ff01f56100");
						});
						it("list of list", function() {
							assert.equal(bin_to_hexstr(c.serialize([typed.bytes([0, 1, 2, 3, 4])])), "01000000190000000000010000000400050000000001020304");
						});
					});
					describe("typed", function() {
						it("boolean", function() {
							assert.equal(bin_to_hexstr(c.serialize(typed.booleans([true, false]))), "01000000100000000100020000000100");
						});
						it("guid", function() {
							assert.equal(bin_to_hexstr(c.serialize(typed.guids(["0a369037-75d3-b24d-6721-5a1d44d4bed5", "0a369037-75d3-b24d-6721-5a1d44d4bed5"]))), "010000002e0000000200020000000a36903775d3b24d67215a1d44d4bed50a36903775d3b24d67215a1d44d4bed5");
						});
						it("byte", function() {
							assert.equal(bin_to_hexstr(c.serialize(typed.bytes([0, 1, 2, 3, 4]))), "01000000130000000400050000000001020304");
						});
						it("short", function() {
							assert.equal(bin_to_hexstr(c.serialize(typed.shorts([1, 2, 3]))), "0100000014000000050003000000010002000300");
						});
						it("1 integer", function() {
							assert.equal(bin_to_hexstr(c.serialize(typed.ints([1]))), "010000001200000006000100000001000000");
						});
						it("3 integers", function() {
							assert.equal(bin_to_hexstr(c.serialize(typed.ints([1, 2, 3]))), "010000001a000000060003000000010000000200000003000000");
						});
						it("long", function() { //
							assert.equal(bin_to_hexstr(c.serialize(typed.longs([Long.fromString("1", false, 10), Long.fromString("2", false, 10), Long.fromString("3", false, 10)]))), "0100000026000000070003000000010000000000000002000000000000000300000000000000");
						});
						it("real", function() { //
							assert.equal(bin_to_hexstr(c.serialize(typed.reals([1.0, 2.0, 3.0]))), "010000001a0000000800030000000000803f0000004000004040");
						});
						it("float", function() { //
							assert.equal(bin_to_hexstr(c.serialize(typed.floats([1.0, 2.0, 3.0]))), "0100000026000000090003000000000000000000f03f00000000000000400000000000000840");
						});
						it("char", function() { //
							assert.equal(bin_to_hexstr(c.serialize(typed.chars(["a", "b", "c"]))), "01000000110000000a0003000000616263");
						});
						it("symbol", function() { //
							assert.equal(bin_to_hexstr(c.serialize(typed.symbols(["a", "ab", "abc"]))), "01000000170000000b0003000000610061620061626300");
						});
						it("timestamp", function() { // (2014.01.01D12:00:00.000000000;2014.01.02D12:00:00.000000000;2014.01.03D12:00:00.000000000)
							assert.equal(bin_to_hexstr(c.serialize(typed.timestamps([new Date("2014-01-01T12:00:00.000000000"), new Date("2014-01-02T12:00:00.00000000"), new Date("2014-01-03T12:00:00.000000000")]))), "01000000260000000c00030000000080cd0c29eb210600801c9ebd39220600806b2f52882206");
						});
						it("month", function() { // (1995.01m;1995.02m;1995.03m)
							assert.equal(bin_to_hexstr(c.serialize(typed.months([new Date("1995-01-01"), new Date("1995-02-01"), new Date("1995-03-01")]))), "010000001a0000000d0003000000c4ffffffc5ffffffc6ffffff");
						});
						it("date", function() { // (2014.01.01;2014.01.02;2014.01.03)
							assert.equal(bin_to_hexstr(c.serialize(typed.dates([new Date("2014-01-01"), new Date("2014-01-02"), new Date("2014-01-03")]))), "010000001a0000000e0003000000fa130000fb130000fc130000");
						});
						it("datetime", function() { // (2014.06.23T11:49:31.533;2014.06.23T11:49:31.534;2014.06.23T11:49:31.535)
							assert.equal(bin_to_hexstr(c.serialize(typed.datetimes([new Date("2014-06-23T11:49:31.533"), new Date("2014-06-23T11:49:31.534"), new Date("2014-06-23T11:49:31.535")]))), "01000000260000000f0003000000facf4b237ea7b440b0014c237ea7b44066334c237ea7b440");
						});
						it("timespan", function() { // (00:01:00.000000000;00:02:00.000000000;00:03:00.000000000)
							assert.equal(bin_to_hexstr(c.serialize(typed.timespans([new Date("2000-01-01T00:01:00.000"), new Date("2000-01-01T00:02:00.000"), new Date("2000-01-01T00:03:00.000")]))), "0100000026000000100003000000005847f80d00000000b08ef01b0000000008d6e829000000");
						});
						it("minute", function() { // (00:01;00:02;00:03)
							assert.equal(bin_to_hexstr(c.serialize(typed.minutes([new Date("2000-01-01T00:01:00.000"), new Date("2000-01-01T00:02:00.000"), new Date("2000-01-01T00:03:00.000")]))), "010000001a000000110003000000010000000200000003000000");
						});
						it("second", function() { // (00:00:01;00:00:02;00:00:03)
							assert.equal(bin_to_hexstr(c.serialize(typed.seconds([new Date("2000-01-01T00:00:01.000"), new Date("2000-01-01T00:00:02.000"), new Date("2000-01-01T00:00:03.000")]))), "010000001a000000120003000000010000000200000003000000");
						});
						it("time", function() { // (00:00:00.001;00:00:00.002;00:00:00.003)
							assert.equal(bin_to_hexstr(c.serialize(typed.times([new Date("2000-01-01T00:00:00.001"), new Date("2000-01-01T00:00:00.002"), new Date("2000-01-01T00:00:00.003")]))), "010000001a000000130003000000010000000200000003000000");
						});
					});
				});
				it("mixedlist", function() { // (1j;1b;3h)
					assert.equal(bin_to_hexstr(c.serialize(typed.mixedlist([typed.long(Long.fromString("1", false, 10)), typed.boolean(true), typed.short(3)]))), "010000001c000000000003000000f90100000000000000ff01fb0300");
				});
				describe("dict", function() {
					it("one key", function() {
						assert.equal(bin_to_hexstr(c.serialize(typed.dict({a: typed.byte(1)}))), "0100000018000000630b0001000000610004000100000001");
					});
					it("multiple keys, same value type", function() {
						assert.equal(bin_to_hexstr(c.serialize(typed.dict({a: typed.long(Long.fromString("1", false, 10)), b: typed.long(Long.fromString("2", false, 10)), c: typed.long(Long.fromString("3", false, 10))}))), "0100000033000000630b0003000000610062006300070003000000010000000000000002000000000000000300000000000000");
					});
					it("multiple keys, different value types", function() {
						assert.equal(bin_to_hexstr(c.serialize(typed.dict({a: typed.long(Long.fromString("1", false, 10)), b: typed.boolean(true), c: typed.float(3)}))), "010000002f000000630b0003000000610062006300000003000000f90100000000000000ff01f70000000000000840");
					});
				});
				// TODO test serialize table
			});
		});
	});
});
