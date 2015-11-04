var nodeq = require("../index.js"),
	assert = require("assert");

describe("connect", function() {
	"use strict";
	describe("old API", function() {
		it("should fail if enpoint is unavailable", function(done){
			nodeq.connect("localhost", 9999, function(err) {
				if (err) {
					done();
				} else {
					assert.fail("no err");
				}
			});
		});
	});
	describe("new API", function() {
		it("should fail if enpoint is unavailable", function(done){
			nodeq.connect({host: "localhost", port: 9999}, function(err) {
				if (err) {
					done();
				} else {
					assert.fail("no err");
				}
			});
		});
	});
});
