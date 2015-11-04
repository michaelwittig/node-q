var nodeq = require("../index.js");

describe("connect", function() {
	"use strict";
	describe("old API", function() {
		it("should work if enpoint is available", function(done) {
			nodeq.connect("localhost", 5000, function(err) {
				if (err) { throw err; }
				done();
			});
		});
	});
	describe("new API", function() {
		it("should work if enpoint is available", function(done) {
			nodeq.connect({host: "localhost", port: 5000}, function(err) {
				if (err) { throw err; }
				done();
			});
		});
	});
});
