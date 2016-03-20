var c = require("../lib/c.js"),
  typed = require("../lib/typed.js"),
  moment = require("moment"),
  assert = require("assert"),
  Long = require("long");

function hexstr_to_bin(str) {
  "use strict";
  return new Buffer(str, "hex");
}

function bin_to_hexstr(b) {
  "use strict";
  return b.toString("hex");
}

// use -18! in q to get the compressed byte representation

describe("compress", function() {
  "use strict";
  describe("deserialize", function() {
    describe("little", function() {
      describe("list", function() {
        it("booleans", function() {
          assert.equal(c.deserialize(hexstr_to_bin("01000100680000001e270000000100102700000101ff00ff00ff00ff00ff00ff00ff00ff00ffff00ff00ff00ff00ff00ff00ff00ff00ffff00ff00ff00ff00ff00ff00ff00ff00ffff00ff00ff00ff00ff00ff00ff00ff00ff7f00ff00ff00ff00ff00ff00ff00e6")).length, 10000);
        });
        it("guid", function() {
          assert.equal(c.deserialize(hexstr_to_bin("01000100b60000008e3e0000000200e803000042d8008ac824e2f268a5be80629cacef657f4252ffef42ffecffc6ff10fff2cdff1bffdcffbffeff30ff43ff8aff1aff3dff4252ffef42ffecffc6ff10fff2cdff1bffdcffbffeff30ff43ff8aff1aff3dff4252ffef42ffecffc6ff10fff2cdff1bffdcffbffeff30ff43ff8aff1aff3dff4252ffef42ffecffc6ff10fff2cdff1bffdcffbffeff30ff43ff8aff1aff3dff4252ff6f42ffecffc6ff10fff2cdff1b26")).length, 1000);
        });
        it("byte", function() {
          assert.equal(c.deserialize(hexstr_to_bin("01000100680000001e270000000400102700000101ff00ff00ff00ff00ff00ff00ff00ff00ffff00ff00ff00ff00ff00ff00ff00ff00ffff00ff00ff00ff00ff00ff00ff00ff00ffff00ff00ff00ff00ff00ff00ff00ff00ff7f00ff00ff00ff00ff00ff00ff00e6")).length, 10000);
        });
        it("short", function() {
          assert.equal(c.deserialize(hexstr_to_bin("01000100110100002e4e0000800500102700000101ffaa0101ff0101ff0101ff0101ffaa0101ff0101ff0101ff0101ffaa0101ff0101ff0101ff0101ffaa0101ff0101ff0101ff0101ffaa0101ff0101ff0101ff0101ffaa0101ff0101ff0101ff0101ffaa0101ff0101ff0101ff0101ffaa0101ff0101ff0101ff0101ffaa0101ff0101ff0101ff0101ffaa0101ff0101ff0101ff0101ffaa0101ff0101ff0101ff0101ffaa0101ff0101ff0101ff0101ffaa0101ff0101ff0101ff0101ffaa0101ff0101ff0101ff0101ffaa0101ff0101ff0101ff0101ffaa0101ff0101ff0101ff0101ffaa0101ff0101ff0101ff0101ffaa0101ff0101ff0101ff0101ffaa0101ff0101ff0101ff0101ff02010183")).length, 10000);
        });
        it("integer", function() {
          assert.equal(c.deserialize(hexstr_to_bin("0100010054000000ae0f0000800600e8030000010000be0001ff00ff000001ff00000001ffef00ff000001ff00000001ff00ff0000fb01ff00000001ff00ff000001ff0000be0001ff00ff000001ff0000000172")).length, 1000);
        });
        it("long", function() {
          assert.equal(c.deserialize(hexstr_to_bin("01000100da0000004e1f0000800700e8030000010000ff000301ff0003000001ff0000000301ffff0003000001ff0000000301ff00030000ff01ff0000000301ff0003000001ff0000ff000301ff0003000001ff0000000301ffff0003000001ff0000000301ff00030000ff01ff0000000301ff0003000001ff0000ff000301ff0003000001ff0000000301ffff0003000001ff0000000301ff00030000ff01ff0000000301ff0003000001ff0000ff000301ff0003000001ff0000000301ffff0003000001ff0000000301ff000300000f01ff000000030146")).length, 1000);
        });
        it("real", function() {
          assert.equal(c.deserialize(hexstr_to_bin("010001003b000000ae0f0000400800e8030000000080fa3f00ff00bfff3fff00ff80ffbfffff3fff00ff80ffbfff3fff00ff80ffbfff033fff008a")).length, 1000);
        });
        it("float", function() {
          assert.equal(c.deserialize(hexstr_to_bin("01000100720000004e1f0000400900e80300000004f0be3f00ff0003cfff3fff000300cfffff3fff00ff0003cfff3fff0003f0ffcfffff3fff00ff0003cfff3fff0003f0ffcfffff3fff00ff0003cfff3fff0003f0ffcfffff3fff00ff0003cfff3fff0003f0ffcfff0f3fff00ff0003cfe0")).length, 1000);
        });
        //it("char", function() { no compression?
        //});
        it("symbol", function() {
          assert.equal(c.deserialize(hexstr_to_bin("010001002d000000de070000800b00e80300006161ffaa6161ff6161ff6161ff6161ff2a6161ff6161ff6161bf")).length, 1000);
        });
        it("timestamp", function() {
          assert.equal(c.deserialize(hexstr_to_bin("01000100600000004e1f0000000c00e8030000c087c0ff599c3c1a0747ff78ffffa6ffc5ffa0ff26ff1dffc7ff47ff78ffffa6ffc5ffa0ff26ff1dffc7ff47ff78ffffa6ffc5ffa0ff26ff1dffc7ff47ff78ff3fa6ffc5ffa0ff26ff1dffc717")).length, 1000);
        });
        it("month", function() {
          assert.equal(c.deserialize(hexstr_to_bin("010001008c0000004e1f0000000900e80300006666f10001789f4000010000e7ffdfffff26ff00000001e7ffdfff26ff00010000ffe7ffdfff26ff00000001e7ffdfff26ffff00010000e7ffdfff26ff00000001e7ffffdfff26ff00010000e7ffdfff26ff0000ff0001e7ffdfff26ff00010000e7ffdfffff26ff00000001e7ffdfff26ff0001000001e7e1")).length, 1000);
        });
        it("date", function() {
          assert.equal(c.deserialize(hexstr_to_bin("0100010037000000ae0f0000000e00e80300000b15ff00ff0bff1eff15ff00ff0bff1eff15ffff00ff0bff1eff15ff00ff0bff1eff158d")).length, 1000);
        });
        it("datetime", function() {
          assert.equal(c.deserialize(hexstr_to_bin("01000100600000004e1f0000000f00e8030000facfc04b237ea7b44035ff84ffff68ff5dffd9ff13fff4ffbaff35ff84ffff68ff5dffd9ff13fff4ffbaff35ff84ffff68ff5dffd9ff13fff4ffbaff35ff84ff3f68ff5dffd9ff13fff4ffba17")).length, 1000);
        });
        it("minute", function() {
          assert.equal(c.deserialize(hexstr_to_bin("0100010054000000ae0f0000801100e8030000010000be0001ff00ff000001ff00000001ffef00ff000001ff00000001ff00ff0000fb01ff00000001ff00ff000001ff0000be0001ff00ff000001ff0000000172")).length, 1000);
        });
        it("second", function() {
          assert.equal(c.deserialize(hexstr_to_bin("0100010054000000ae0f0000801200e8030000010000be0001ff00ff000001ff00000001ffef00ff000001ff00000001ff00ff0000fb01ff00000001ff00ff000001ff0000be0001ff00ff000001ff0000000172")).length, 1000);
        });
        it("time", function() {
          assert.equal(c.deserialize(hexstr_to_bin("0100010054000000ae0f0000801300e8030000010000be0001ff00ff000001ff00000001ffef00ff000001ff00000001ff00ff0000fb01ff00000001ff00ff000001ff0000be0001ff00ff000001ff0000000172")).length, 1000);
        });
      });
      it("dict", function() {
        assert.equal(Object.keys(c.deserialize(hexstr_to_bin("0100010099010000055e000000630b00060000006100006200630064006514006600000006020900f4a60100010003f03f000300cfffff3fff00ff0003cfff3fff0003f0ffcfffff3fff00ff0003cfff3fff0003f0ffcfffff3fff00ff0003cf6809ff0001cf680001ff0001cfff3fff00010001cfff3fff0001ff0001cfff3fff00010001cfff3fff0001ff0001cfff3fff00010001cfff3fff0001ff0001cfff3fff09ff00ff0000cfff3fffff00000002cfff3fff00020000cfff3fffff00000002cfff3fff00020000cfff3fffff00000002cfff3fff00020000cfff3f6fff09ff0000f0ffcfff3f6f00010001cfffff3fff00010001cfff3fff00010001cfffff3fff00010001cfff3fff00010001cfffff3fff00010001cfff3fff09ff00ff0000ffcfff3fff00000002cfff3fff00020000ffcfff3fff00000002cfff3fff00020000ffcfff3fff00000002cfff3fff00020000ffcfff3f6f09ff0000f0ffcfff3f6f0001ff0001cfff3fff00010001cfff3fff0001ff0001cfff3fff00010001cfff3fff00017f0001cfff3fff00010001cfff3fff"))).length, 6);
      });
      it("table", function() {
        assert.equal(c.deserialize(hexstr_to_bin("0100010008010000a73e0000006200630b00020000380061006200000002020900cce80300000004f03f00ff0003f7cfff3fff000300cfff3fff00ff0003ffcfff3fff0003f0ffcfff3fff00ff0003ffcfff3fff0003f0ffcfff3fff00ff0003ffcfff3fff0003f0ffcfff3fff00ff0003ffcfff3fff0003f0ffcfff3fff00ff0003ffcfe009ff0001cfe000010001cfff3fffff00010001cfff3fff00010001cfff3fffff00010001cfff3fff00010001cfff3fffff00010001cfff3fff00010001cfff3fffff00010001cfff3fff00010001cfff3fffff00010001cfff3fff00010001cfff3fffff00010001cfff3fff00010001cfff3fff7f00010001cfff3fff00010001cfe8")).length, 1000);
      });
    });
  });
});
