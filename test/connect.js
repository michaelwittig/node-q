var nodeq = require("../index.js"),
	assert = require("assert-plus");

describe("connect", function() {
	"use strict";
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
