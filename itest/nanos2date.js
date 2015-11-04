var nodeq = require("../index.js"),
	assert = require("assert");

describe("nanos2date", function() {
	"use strict";
	describe("default", function() {
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
		it("timestamp", function(done) {
			con.k("2011.10.10D14:48:00.000000000", function(err, res) {
				if (err) { throw err; }
				assert.equal(res.getTime(), 1318258080000, "res");
				done();
			});
		});
	});
	describe("true", function() {
		var con;
		before(function(done) {
			nodeq.connect({host: "localhost", port: 5000, nanos2date: true}, function(err, c) {
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
		it("timestamp", function(done) {
			con.k("2011.10.10D14:48:00.000000000", function(err, res) {
				if (err) { throw err; }
				assert.equal(res.getTime(), 1318258080000, "res");
				done();
			});
		});
	});
	describe("false", function() {
		var con;
		before(function(done) {
			nodeq.connect({host: "localhost", port: 5000, nanos2date: false}, function(err, c) {
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
		it("timestamp", function(done) {
			con.k("2011.10.10D14:48:00.000000000", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, 1318258080000000000, "res");
				done();
			});
		});
		it("timespan 1 nano", function(done) {
			con.k("0D00:00:00.000000001", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, 1, "res");
				done();
			});
		});
		it("timespan 1 day", function(done) {
			con.k("1D00:00:00.000000000", function(err, res) {
				if (err) { throw err; }
				assert.equal(res, 24 * 60 * 60 * 1000 * 1000 * 1000, "res");
				done();
			});
		});
	});
});
