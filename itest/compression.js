var nodeq = require("../index.js"),
	assert = require("assert"),
	os = require("os");

describe("compression", function() {
	"use strict";
	var con;
	before(function(done) {
		nodeq.connect({host: os.hostname(), port: 5000}, function(err, c) {
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
	it("uncompress result", function(done) {
		con.k("til 1000000", function(err, res) {
			if (err) { throw err; }
			assert.equal(res.length, 1000000, "res.length");
			done();
		});
	});
});
