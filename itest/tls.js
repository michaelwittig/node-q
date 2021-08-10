var nodeq = require("../index.js"),
    assert = require("assert");

describe("tls", function() {
	"use strict";
  it("should fail if endpoint expects tls and we don't set useTLS to true", function(done) {
    nodeq.connect({host: "localhost", port: 6000}, function(err) {
      assert.ok(err);
      done();
    });
  });
  
  it("should connect successfully if useTLS is true", function(done) {
    nodeq.connect({host: "localhost", port: 6000, useTLS: true}, function(err) {
      if (err) {
        throw err;
      }
      done();
    });
  });

  it("should fail if useTLS is true and endpoint doesn't expect it", function(done) {
    nodeq.connect({host: "localhost", port: 5000, useTLS: true}, function(err) {
      assert.ok(err);
      done();
    });
  });
});
