var nodeq = require("../index.js"),
	assert = require("assert-plus");

describe("subs", function() {
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
	it("subscribe all", function(done) {
		con.once("upd", function(table, data) {
			assert.string(table, "table");
			assert.arrayOfObject(data, "data");
			done();
		});
		con.ks(".u.sub[`;`]", function(err) {
			if (err) throw err;
		});
	});
});
