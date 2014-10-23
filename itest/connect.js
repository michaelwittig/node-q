var nodeq = require("../index.js"),
	assert = require("assert-plus");

describe("connect", function() {
	"use strict";
	it("should work if enpoint is available", function(done) {
		nodeq.connect("localhost", 5000, function(err) {
			if (err) {
				throw err;
			} else {
				done();
			}
		});
	});
});
