var nodeq = require("../index.js");

describe("asyncreq", function() {
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
	it("execute q", function(done) {
		con.ks("show 1 2 3", function(err) {
			if (err) { throw err; }
			done();
		});
	});
	it("execute function with one parameter", function(done) {
		con.k("show", [1, 2, 3], function(err) {
			if (err) { throw err; }
			done();
		});
	});
});
