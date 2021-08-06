var nodeq = require("../index.js"),
    assert = require("assert")

describe("tls", function() {
	"use strict"
  it("should fail if endpoint expects tls and we don't set useTLS to true", function(done) {
    nodeq.connect({host: "localhost", port: 6000}, function(err) {
      assert.ok(err)
      done()
    });
  });
  
  it("should connect successfully if useTLS is true", function(done) {
    nodeq.connect({host: "localhost", port: 6000, useTLS: true}, function(err) {
      if (err) { throw err }
      done()
    });
  })
});
