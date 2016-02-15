var nodeq = require("../index.js"),
  async = require("async"),
  assert = require("assert");

describe("issue 18", function() {
  "use strict";
  var con;
  before(function(done) {
    nodeq.connect({host: "localhost", port: 5000}, function(err, c) {
      if (err) { throw err; }
      async.each([
        "numtests:100; timerange:10D; freq:0D00:05",
        "testid:(til numtests)!000000999999+numtests?20",
        "fcn:numtests*fc:`long$timerange%freq",
        "tests:([]time:(-0D00:00:10 + fcn?0D00:00:20)+fcn#(.z.p - timerange)+freq*til fc; test:raze fc#'key testid; testin:fcn?16741128383987; testout:fcn?16741128383987)"
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
  it("keyed table", function(done) {
    con.k("select min testin by test from tests", function(err, res) {
      if (err) { throw err; }
      assert.equal(res[0].length, 100, "res[0].length");
      assert.equal(res[1].length, 100, "res[1].length");
      done();
    });
  });
});
