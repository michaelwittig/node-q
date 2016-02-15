var nodeq = require("../index.js"),
  assert = require("assert");

describe("unicode", function() {
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
  describe("string", function() {
    it("count", function(done) {
      con.k("count", "你好", function(err, res) {
        if (err) { throw err; }
        assert.equal(res, 6, "res");
        done();
      });
    });
    it("value", function(done) {
      con.k('s: "你好"; s', function(err, res) {
        if (err) { throw err; }
        assert.equal(res, "你好", "res");
        done();
      });
    });
  });
  describe("symbol", function() {
    it("count", function(done) {
      con.k("count", "`你好", function(err, res) {
        if (err) { throw err; }
        assert.equal(res, 1, "res");
        done();
      });
    });
    it("value", function(done) {
      con.k('s: `$"你好"; s', function(err, res) {
        if (err) { throw err; }
        assert.equal(res, "你好", "res");
        done();
      });
    });
  });
  describe("symbols", function() {
    it("count", function(done) {
      con.k("count", ["`你好", "`你好", "`你好"], function(err, res) {
        if (err) { throw err; }
        assert.equal(res, 3, "res");
        done();
      });
    });
    it("values", function(done) {
      con.k('s: (`$"你好";`$"你好";`$"你好"); s', function(err, res) {
        if (err) { throw err; }
        assert.deepEqual(res, ["你好", "你好", "你好"], "res");
        done();
      });
    });
  });
});
