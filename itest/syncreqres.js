var nodeq = require("../index.js"),
	assert = require("assert-plus");

describe("syncreqres", function() {
	"use strict";
	var con;
	before(function(done) {
		nodeq.connect("localhost", 5000, function(err, c) {
			if (err) throw err;
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
	it("evaluate q", function(done) {
		con.k("sum 1 2 3", function(err, res) {
			if (err) throw err;
			assert.equal(res, 6, "res");
			done();
		});
	});
	it("evaluate function with one parameter", function(done) {
		con.k("sum", [1, 2, 3], function(err, res) {
			if (err) throw err;
			assert.equal(res, 6, "res");
			done();
		});
	});
});
