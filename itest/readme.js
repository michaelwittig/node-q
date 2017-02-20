var nodeq = require("../index.js"),
  async = require("async"),
  assert = require("assert");

describe("readme", function() {
  "use strict";
  var con;
  before(function(done) {
    nodeq.connect({host: "localhost", port: 5000}, function(err, c) {
      if (err) {
        done(err);
      } else {
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
      }
    });
  });
  after(function(done) {
    con.close(done);
  });
  it("Execute Q code and receive result", function(done) {
    con.k("sum 1 2 3", function(err, res) {
      if (err) {
        done(err);
      } else {
        assert.equal(res, 6);
        done();
      }
    });
  });
  it("Execute function with one parameter and receive result", function(done) {
    con.k("sum", [1, 2, 3], function(err, res) {
      if (err) {
        done(err);
      } else {
        assert.equal(res, 6);
        done();
      }
    });
  });
  it("Execute function with two parameters and receive result", function(done) {
    con.k("cor", [1, 2, 3], [4, 5, 6], function(err, res) {
      if (err) {
        done(err);
      } else {
        assert.equal(res, 1);
        done();
      }
    });
  });
  it("Async execute Q code", function(done) {
    con.ks("show 1 2 3", done);
  });
  it("Async execute function with parameters", function(done) {
    con.ks("show", [1, 2, 3], done);
  });
  it("Async execute and get async response", function(done) {
    con.ks("show 1;neg[.z.w][33]", function(err) {
      if (err) {
        throw err;
      }
    });
    con.k(function(err, res) {
      if (err) {
        done(err);
      } else {
        assert.equal(res, 33);
        done();
      }
    });
  });
  it("Subscribe to kdb+tick", function(done) {
    con.once("upd", function(table, data) {
      assert.equal(table, "trade");
      assert.equal(data[0].sym, "a");
      done();
    });
    con.ks(".u.sub[`;`]", function(err) {
      if (err) {
        done(err);
      }
    });
  });
  describe("typed", function() {
    it("short", function(done) {
      con.k("type", nodeq.short(1), function(err, res) {
       if (err) {
          done(err);
        } else {
          assert.equal(res, -5);
          done();
        }
      });
    });
    it("shorts", function(done) {
      con.k("type", nodeq.shorts([1, 2, 3]), function(err, res) {
        if (err) {
          done(err);
        } else {
          assert.equal(res, 5);
          done();
        }
      });
    });
  });
});
