var nodeq = require("../index.js"),
	async = require("async"),
	assert = require("assert-plus");

describe("subs", function() {
	"use strict";
	var con;
	before(function(done) {
		nodeq.connect({host: "localhost", port: 5000}, function(err, c) {
			if (err) { throw err; }
			async.each([
				'system "l tick/u.q"',
				"trade: ([] sym:`$(); time:`timestamp$())",
				".u.init[]",
				".z.ts: {[] trade::0#trade; trade,::(`a;.z.p); .u.pub[`trade;trade]}",
				'system "t 500"'
			], function(q, cb) {
				c.k(q, cb);
			}, function(err) {
				if (err) { throw err; }
				con = c;
				done();
			});
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
			if (err) { throw err; }
		});
	});
});
