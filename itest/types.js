var nodeq = require("../index.js"),
	assert = require("assert-plus"),
	async = require("async");

describe("types", function() {
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
				assert.string(res, "res");
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

	});
	describe("date", function() {

	});
	describe("datetime", function() {

	});
	describe("timespan", function() {

	});
	describe("minute", function() {

	});
	describe("second", function() {

	});
	describe("time", function() {

	});
});
