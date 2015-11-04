var nodeq = require("../index.js"),
  assert = require("assert");

describe("emptyChar2null", function() {
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
    it("null", function(done) {
      con.k('" "', function(err, res) {
        if (err) { throw err; }
        assert.equal(res, null, "res");
        done();
      });
    });
  });
  describe("true", function() {
    var con;
    before(function(done) {
      nodeq.connect({host: "localhost", port: 5000, emptyChar2null: true}, function(err, c) {
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
    it("null", function(done) {
      con.k('" "', function(err, res) {
        if (err) { throw err; }
        assert.equal(res, null, "res");
        done();
      });
    });
  });
  describe("false", function() {
    var con;
    before(function(done) {
      nodeq.connect({host: "localhost", port: 5000, emptyChar2null: false}, function(err, c) {
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
    it("null", function(done) {
      con.k('" "', function(err, res) {
        if (err) { throw err; }
        assert.equal(res, " ", "res");
        done();
      });
    });
  });
});
