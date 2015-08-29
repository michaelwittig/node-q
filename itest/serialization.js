var nodeq = require("../index.js"),
  assert = require("assert-plus"),
  async = require("async");

describe("deserialization", function() {
  "use strict";
  var con;
  before(function(done) {
    nodeq.connect({host: "localhost", port: 5000}, function(err, c) {
      if (err) { throw err; }
      con = c;
      c.k("testType: {type x};", function(err, res) {
        if (err) { throw err; }
        c.k("testValue: {x};", function(err, res) {
          if (err) { throw err; }
          done();
        });
      });
    });
  });
  after(function(done) {
    con.close(function() {
      con = undefined;
      done();
    });
  });
  describe("Boolean", function() {
    it("type", function(done) {
      con.k("testType", true, function(err, res) {
        if (err) { throw err; }
        assert.equal(res, -1, "res");
        done();
      });
    });
    it("value", function(done) {
      con.k("testValue", true, function(err, res) {
        if (err) { throw err; }
        assert.equal(res, true, "res");
        done();
      });
    });
  });
  describe("String", function() {
    describe("starting with `", function() {
      it("type", function(done) {
        con.k("testType", "`a", function(err, res) {
          if (err) { throw err; }
          assert.equal(res, -11, "res");
          done();
        });
      });
      it("value", function(done) {
        con.k("testValue", "`a", function(err, res) {
          if (err) { throw err; }
          assert.equal(res, "a", "res");
          done();
        });
      });
    });
    describe("single char", function() {
      it("type", function(done) {
        con.k("testType", "a", function(err, res) {
          if (err) { throw err; }
          assert.equal(res, 10, "res");
          done();
        });
      });
      it("value", function(done) {
        con.k("testValue", "a", function(err, res) {
          if (err) { throw err; }
          assert.equal(res, "a", "res");
          done();
        });
      });
    });
    describe("string", function() {
      it("type", function(done) {
        con.k("testType", "abc", function(err, res) {
          if (err) { throw err; }
          assert.equal(res, 10, "res");
          done();
        });
      });
      it("value", function(done) {
        con.k("testValue", "abc", function(err, res) {
          if (err) { throw err; }
          assert.equal(res, "abc", "res");
          done();
        });
      });
    });
  });
  describe("Number", function() {
    it("type", function(done) {
      con.k("testType", 1, function(err, res) {
        if (err) { throw err; }
        assert.equal(res, -9, "res");
        done();
      });
    });
    it("value", function(done) {
      con.k("testValue", 1, function(err, res) {
        if (err) { throw err; }
        assert.equal(res, 1, "res");
        done();
      });
    });
  });
  /*describe("Date", function() {
    describe("year 2015", function() {
      it("type", function(done) {
        con.k("testType", new Date(2015, 0, 1, 0, 0, 0, 0), function(err, res) {
          if (err) { throw err; }
          assert.equal(res, -15, "res");
          done();
        });
      });
      it("value", function(done) {
        con.k("testValue", new Date(2015, 0, 1, 0, 0, 0, 0), function(err, res) {
          if (err) { throw err; }
          assert.equal(res.getTime(), new Date(2015, 0, 1, 0, 0, 0, 0).getTime(), "res");
          done();
        });
      });
    });
    describe("year 2000", function() {
      it("type", function(done) {
        con.k("testType", new Date(2000, 0, 1, 0, 0, 0, 0), function(err, res) {
          if (err) { throw err; }
          assert.equal(res, -15, "res");
          done();
        });
      });
      it("value", function(done) {
        con.k("testValue", new Date(2000, 0, 1, 0, 0, 0, 0), function(err, res) {
          if (err) { throw err; }
          assert.equal(res.getTime(), new Date(2000, 0, 1, 0, 0, 0, 0).getTime(), "res");
          done();
        });
      });
    });
    describe("year 1995", function() {
      it("type", function(done) {
        con.k("testType", new Date(1995, 0, 1, 0, 0, 0, 0), function(err, res) {
          if (err) { throw err; }
          assert.equal(res, -15, "res");
          done();
        });
      });
      it("value", function(done) {
        con.k("testValue", new Date(1995, 0, 1, 0, 0, 0, 0), function(err, res) {
          if (err) { throw err; }
          assert.equal(res.getTime(), new Date(1995, 0, 1, 0, 0, 0, 0).getTime(), "res");
          done();
        });
      });
    });
  });*/
  describe("Object", function() {
    it("type", function(done) {
      con.k("testType", {a: 1, b: 2, c: 3}, function(err, res) {
        if (err) { throw err; }
        assert.equal(res, 99, "res");
        done();
      });
    });
    it("value", function(done) {
      con.k("testValue", {a: 1, b: 2, c: 3}, function(err, res) {
        if (err) { throw err; }
        assert.deepEqual(res, {a: 1, b: 2, c: 3}, "res");
        done();
      });
    });
  });
  describe("Array", function() {
    it("type", function(done) {
      con.k("testType", [1, 2, 3], function(err, res) {
        if (err) { throw err; }
        assert.equal(res, 9, "res");
        done();
      });
    });
    it("value", function(done) {
      con.k("testValue", [1, 2, 3], function(err, res) {
        if (err) { throw err; }
        assert.deepEqual(res, [1, 2, 3], "res");
        done();
      });
    });
  });
});
