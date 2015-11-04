var nodeq = require("../index.js"),
  assert = require("assert");

describe("flipTables", function() {
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
    it("empty", function(done) {
      con.k("([] sym:`int$(); size:`$())", function(err, res) {
        if (err) { throw err; }
        assert.deepEqual(res, [], "res");
        done();
      });
    });
    it("single", function(done) {
      con.k("([] sym:enlist `a; size:enlist 1i)", function(err, res) {
        if (err) { throw err; }
        assert.deepEqual(res, [{sym: "a", size: 1}], "res");
        done();
      });
    });
    it("multi", function(done) {
      con.k("([] sym:`a`b`c; size:(1 2 3i))", function(err, res) {
        if (err) { throw err; }
        assert.deepEqual(res, [{sym: "a", size: 1}, {sym: "b", size: 2}, {sym: "c", size: 3}], "res");
        done();
      });
    });
  });
  describe("true", function() {
    var con;
    before(function(done) {
      nodeq.connect({host: "localhost", port: 5000, flipTables: true}, function(err, c) {
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
    it("empty", function(done) {
      con.k("([] sym:`int$(); size:`$())", function(err, res) {
        if (err) { throw err; }
        assert.deepEqual(res, [], "res");
        done();
      });
    });
    it("single", function(done) {
      con.k("([] sym:enlist `a; size:enlist 1i)", function(err, res) {
        if (err) { throw err; }
        assert.deepEqual(res, [{sym: "a", size: 1}], "res");
        done();
      });
    });
    it("multi", function(done) {
      con.k("([] sym:`a`b`c; size:(1 2 3i))", function(err, res) {
        if (err) { throw err; }
        assert.deepEqual(res, [{sym: "a", size: 1}, {sym: "b", size: 2}, {sym: "c", size: 3}], "res");
        done();
      });
    });
  });
  describe("false", function() {
    var con;
    before(function(done) {
      nodeq.connect({host: "localhost", port: 5000, flipTables: false}, function(err, c) {
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
    it("empty", function(done) {
      con.k("([] sym:`int$(); size:`$())", function(err, res) {
        if (err) { throw err; }
        assert.deepEqual(res, {sym: [], size: []}, "res");
        done();
      });
    });
    it("single", function(done) {
      con.k("([] sym:enlist `a; size:enlist 1i)", function(err, res) {
        if (err) { throw err; }
        assert.deepEqual(res, {sym: ["a"], size: [1]}, "res");
        done();
      });
    });
    it("multi", function(done) {
      con.k("([] sym:`a`b`c; size:(1 2 3i))", function(err, res) {
        if (err) { throw err; }
        assert.deepEqual(res, {sym: ["a", "b", "c"], size: [1, 2, 3]}, "res");
        done();
      });
    });
  });
});
