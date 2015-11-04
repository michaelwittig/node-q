var nodeq = require("../index.js"),
	assert = require("assert");

describe("deserialization", function() {
	"use strict";
	var con;
	before(function(done) {
		nodeq.connect({host: "localhost", port: 5000}, function(err, c) {
			if (err) { throw err; }
			con = c;
			done();
		});
	});
	after(function(done) {
		con.close(function() {
			con = undefined;
			done();
		});
	});
	describe("boolean", function() {
		it("true", function(done) {
			con.k("1b", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, true, "res");
				done();
			});
		});
		it("false", function(done) {
			con.k("0b", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, false, "res");
				done();
			});
		});
	});
	describe("guid", function() {
		it("null", function(done) {
			con.k("0Ng", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, null, "res");
				done();
			});
		});
		it("random", function(done) {
			con.k("rand 0Ng", function(err, res) {
				if (err) { throw err; }
				assert.equal(typeof res, "string", "res");
				done();
			});
		});
	});
	describe("byte", function() {
		it("255", function(done) {
			con.k("0xff", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, 255, "res");
				done();
			});
		});
		it("1", function(done) {
			con.k("0x01", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, 1, "res");
				done();
			});
		});
		it("0", function(done) {
			con.k("0x00", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, 0, "res");
				done();
			});
		});
	});
	describe("short", function() {
		it("null", function(done) {
			con.k("0Nh", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, null, "res");
				done();
			});
		});
		it("+infinity", function(done) {
			con.k("0Wh", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, Infinity, "res");
				done();
			});
		});
		it("-infinity", function(done) {
			con.k("-0Wh", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, -Infinity, "res");
				done();
			});
		});
		it("1", function(done) {
			con.k("1h", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, 1, "res");
				done();
			});
		});
		it("0", function(done) {
			con.k("0h", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, 0, "res");
				done();
			});
		});
		it("-1", function(done) {
			con.k("-1h", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, -1, "res");
				done();
			});
		});
	});
	describe("int", function() {
		it("null", function(done) {
			con.k("0Ni", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, null, "res");
				done();
			});
		});
		it("+infinity", function(done) {
			con.k("0Wi", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, Infinity, "res");
				done();
			});
		});
		it("-infinity", function(done) {
			con.k("-0Wi", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, -Infinity, "res");
				done();
			});
		});
		it("1", function(done) {
			con.k("1i", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, 1, "res");
				done();
			});
		});
		it("0", function(done) {
			con.k("0i", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, 0, "res");
				done();
			});
		});
		it("-1", function(done) {
			con.k("-1i", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, -1, "res");
				done();
			});
		});
	});
	describe("long", function() {
		it("null", function(done) {
			con.k("0Nj", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, null, "res");
				done();
			});
		});
		it("+infinity", function(done) {
			con.k("0Wj", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, Infinity, "res");
				done();
			});
		});
		it("-infinity", function(done) {
			con.k("-0Wj", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, -Infinity, "res");
				done();
			});
		});
		it("1", function(done) {
			con.k("1j", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, 1, "res");
				done();
			});
		});
		it("0", function(done) {
			con.k("0j", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, 0, "res");
				done();
			});
		});
		it("-1", function(done) {
			con.k("-1j", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, -1, "res");
				done();
			});
		});
	});
	describe("real", function() {
		it("null", function(done) {
			con.k("0Ne", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, null, "res");
				done();
			});
		});
		it("+infinity", function(done) {
			con.k("0We", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, Infinity, "res");
				done();
			});
		});
		it("-infinity", function(done) {
			con.k("-0We", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, -Infinity, "res");
				done();
			});
		});
		it("1", function(done) {
			con.k("1.0e", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, 1, "res");
				done();
			});
		});
		it("0", function(done) {
			con.k("0e", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, 0, "res");
				done();
			});
		});
		it("-1", function(done) {
			con.k("-1e", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, -1, "res");
				done();
			});
		});
	});
	describe("float", function() {
		it("null", function(done) {
			con.k("0Nf", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, null, "res");
				done();
			});
		});
		it("+infinity", function(done) {
			con.k("0Wf", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, Infinity, "res");
				done();
			});
		});
		it("-infinity", function(done) {
			con.k("-0Wf", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, -Infinity, "res");
				done();
			});
		});
		it("1", function(done) {
			con.k("1f", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, 1, "res");
				done();
			});
		});
		it("0", function(done) {
			con.k("0f", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, 0, "res");
				done();
			});
		});
		it("-1", function(done) {
			con.k("-1f", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, -1, "res");
				done();
			});
		});
	});
	describe("char", function() {
		it("null", function(done) {
			con.k('" "', function(err, res) {
				if (err) { throw err; }
				assert.equal(res, null, "res");
				done();
			});
		});
		it("a", function(done) {
			con.k('"a"', function(err, res) {
				if (err) { throw err; }
				assert.equal(res, "a", "res");
				done();
			});
		});
	});
	describe("symbol", function() {
		it("null", function(done) {
			con.k("s: `; s", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, null, "res");
				done();
			});
		});
		it("`a", function(done) {
			con.k("s: `a; s", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, "a", "res");
				done();
			});
		});
		it("`abc", function(done) {
			con.k("s: `abc; s", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, "abc", "res");
				done();
			});
		});
	});
	describe("timestamp", function() {
		it("null", function(done) {
			con.k("0Np", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, null, "res");
				done();
			});
		});
		it("2015.01.01D00:00:00.000000000", function(done) {
			con.k("2015.01.01D00:00:00.000000000", function(err, res) {
				if (err) { throw err; }
				assert.equal(res.getTime(), new Date(2015, 0, 1, 0, 0, 0, 0).getTime(), "res");
				done();
			});
		});
		it("1995.01.01D00:00:00.000000000", function(done) {
			con.k("1995.01.01D00:00:00.000000000", function(err, res) {
				if (err) { throw err; }
				assert.equal(res.getTime(), new Date(1995, 0, 1, 0, 0, 0, 0).getTime(), "res");
				done();
			});
		});
	});
	describe("month", function() {
		it("null", function(done) {
			con.k("0Nm", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, null, "res");
				done();
			});
		});
		it("2015.01", function(done) {
			con.k("2015.01m", function(err, res) {
				if (err) { throw err; }
				assert.equal(res.getTime(), new Date(2015, 0, 1, 0, 0, 0, 0).getTime(), "res");
				done();
			});
		});
		it("1995.01", function(done) {
			con.k("1995.01m", function(err, res) {
				if (err) { throw err; }
				assert.equal(res.getTime(), new Date(1995, 0, 1, 0, 0, 0, 0).getTime(), "res");
				done();
			});
		});
	});
	describe("date", function() {
		it("null", function(done) {
			con.k("0Nd", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, null, "res");
				done();
			});
		});
		it("2015.01.01", function(done) {
			con.k("2015.01.01", function(err, res) {
				if (err) { throw err; }
				assert.equal(res.getTime(), new Date(2015, 0, 1, 0, 0, 0, 0).getTime(), "res");
				done();
			});
		});
		it("1995.01.01", function(done) {
			con.k("1995.01.01", function(err, res) {
				if (err) { throw err; }
				assert.equal(res.getTime(), new Date(1995, 0, 1, 0, 0, 0, 0).getTime(), "res");
				done();
			});
		});
	});
	describe("datetime", function() {
		it("null", function(done) {
			con.k("0Nz", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, null, "res");
				done();
			});
		});
		it("2015.01.01T00:00:00.000", function(done) {
			con.k("2015.01.01T00:00:00.000", function(err, res) {
				if (err) { throw err; }
				assert.equal(res.getTime(), new Date(2015, 0, 1, 0, 0, 0, 0).getTime(), "res");
				done();
			});
		});
		it("1995.01.01T00:00:00.000", function(done) {
			con.k("1995.01.01T00:00:00.000", function(err, res) {
				if (err) { throw err; }
				assert.equal(res.getTime(), new Date(1995, 0, 1, 0, 0, 0, 0).getTime(), "res");
				done();
			});
		});
	});
	describe("timespan", function() {
		it("null", function(done) {
			con.k("0Nn", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, null, "res");
				done();
			});
		});
		it("0D00:00:00.000000000", function(done) {
			con.k("0D00:00:00.000000000", function(err, res) {
				if (err) { throw err; }
				assert.equal(res.getTime(), new Date(2000, 0, 1, 0, 0, 0, 0).getTime(), "res");
				done();
			});
		});
		it("0D00:00:00.000000000", function(done) {
			con.k("0D00:00:00.000000000", function(err, res) {
				if (err) { throw err; }
				assert.equal(res.getTime(), new Date(2000, 0, 1, 0, 0, 0, 0).getTime(), "res");
				done();
			});
		});
	});
	describe("minute", function() {
		it("null", function(done) {
			con.k("0Nu", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, null, "res");
				done();
			});
		});
		it("00:00", function(done) {
			con.k("00:00", function(err, res) {
				if (err) { throw err; }
				assert.equal(res.getTime(), new Date(2000, 0, 1, 0, 0, 0, 0).getTime(), "res");
				done();
			});
		});
		it("00:01", function(done) {
			con.k("00:01", function(err, res) {
				if (err) { throw err; }
				assert.equal(res.getTime(), new Date(2000, 0, 1, 0, 1, 0, 0).getTime(), "res");
				done();
			});
		});
	});
	describe("second", function() {
		it("null", function(done) {
			con.k("0Nv", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, null, "res");
				done();
			});
		});
		it("00:00:00", function(done) {
			con.k("00:00:00", function(err, res) {
				if (err) { throw err; }
				assert.equal(res.getTime(), new Date(2000, 0, 1, 0, 0, 0, 0).getTime(), "res");
				done();
			});
		});
		it("00:00:01", function(done) {
			con.k("00:00:01", function(err, res) {
				if (err) { throw err; }
				assert.equal(res.getTime(), new Date(2000, 0, 1, 0, 0, 1, 0).getTime(), "res");
				done();
			});
		});
	});
	describe("time", function() {
		it("null", function(done) {
			con.k("0Nt", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, null, "res");
				done();
			});
		});
		it("00:00:00.000", function(done) {
			con.k("00:00:00.000", function(err, res) {
				if (err) { throw err; }
				assert.equal(res.getTime(), new Date(2000, 0, 1, 0, 0, 0, 0).getTime(), "res");
				done();
			});
		});
		it("00:00:01", function(done) {
			con.k("00:00:00.001", function(err, res) {
				if (err) { throw err; }
				assert.equal(res.getTime(), new Date(2000, 0, 1, 0, 0, 0, 1).getTime(), "res");
				done();
			});
		});
	});
	describe("dict", function() {
		it("empty", function(done) {
			con.k("()!()", function(err, res) {
				if (err) { throw err; }
				assert.deepEqual(res, {}, "res");
				done();
			});
		});
		it("single", function(done) {
			con.k("(enlist `a)!(enlist 1i)", function(err, res) {
				if (err) { throw err; }
				assert.deepEqual(res, {a: 1}, "res");
				done();
			});
		});
		it("multi", function(done) {
			con.k("(`a`b`c)!(1 2 3i)", function(err, res) {
				if (err) { throw err; }
				assert.deepEqual(res, {a: 1, b: 2, c: 3}, "res");
				done();
			});
		});
	});
	describe("list", function() {
		it("empty", function(done) {
			con.k("()", function(err, res) {
				if (err) { throw err; }
				assert.deepEqual(res, [], "res");
				done();
			});
		});
		it("single", function(done) {
			con.k("enlist 1i", function(err, res) {
				if (err) { throw err; }
				assert.deepEqual(res, [1], "res");
				done();
			});
		});
		it("multi", function(done) {
			con.k("1 2 3i", function(err, res) {
				if (err) { throw err; }
				assert.deepEqual(res, [1, 2, 3], "res");
				done();
			});
		});
	});
	describe("table", function() {
		it("empty", function(done) {
			con.k("([] sym:`int$(); size:`$())", function(err, res) {
				if (err) { throw err; }
				assert.deepEqual(res, [], "res");
				done();
			});
		});
		it("single", function(done) {
			con.k("([] sym:enlist `a; size:enlist 1i)", function(err, res) {
				if (err) { throw err; }
				assert.deepEqual(res, [{sym: "a", size: 1}], "res");
				done();
			});
		});
		it("multi", function(done) {
			con.k("([] sym:`a`b`c; size:(1 2 3i))", function(err, res) {
				if (err) { throw err; }
				assert.deepEqual(res, [{sym: "a", size: 1}, {sym: "b", size: 2}, {sym: "c", size: 3}], "res");
				done();
			});
		});
	});
});
