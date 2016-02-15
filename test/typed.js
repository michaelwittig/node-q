var typed = require("../lib/typed.js"),
  assert = require("assert");

describe("typed", function() {
  describe("toString", function() {
    it("int", function() {
      assert.equal(typed.int(1) + "", "int(1)");
    });
    it("ints", function() {
      assert.equal(typed.ints([1, 2, 3]) + "", "list[int](1,2,3)");
    });
  });
});
