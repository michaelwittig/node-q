var assert = require("./assert.js");

function Typed(type, value) {
  "use strict";
  this._type = type;
  this._value = value;
}
Typed.prototype.type = function() {
  "use strict";
  return this._type;
};
Typed.prototype.value = function() {
  "use strict";
  return this._value;
};

exports.boolean = function(boolean) {
  "use strict";
  assert.bool(boolean, "boolean");
  return new Typed("boolean", boolean);
};
exports.guid = function(string) {
  "use strict";
  if (string !== null) {
    assert.string(string, "string");
  }
  return new Typed("guid", string);
};
exports.byte = function(number) {
  "use strict";
  assert.number(number, "number");
  return new Typed("byte", number);
};
exports.short = function(number) {
  "use strict";
  if (number !== null) {
    assert.number(number, "number");
  }
  return new Typed("short", number);
};
exports.int = function(number) {
  "use strict";
  if (number !== null) {
    assert.number(number, "number");
  }
  return new Typed("int", number);
};
exports.long = function(bignum) {
  "use strict";
  if (bignum !== null) {
    assert.bignum(bignum, "bignum");
  }
  return new Typed("long", bignum);
};
exports.real = function(number) {
  "use strict";
  if (number !== null) {
    assert.number(number, "number");
  }
  return new Typed("real", number);
};
exports.float = function(number) {
  "use strict";
  if (number !== null) {
    assert.number(number, "number");
  }
  return new Typed("float", number);
};
exports.char = function(string) {
  "use strict";
  if (string !== null) {
    assert.string(string, "string");
  }
  return new Typed("char", string);
};
exports.symbol = function(string) {
  "use strict";
  if (string !== null) {
    assert.string(string, "string");
  }
  return new Typed("symbol", string);
};
exports.timestamp = function(date) {
  "use strict";
  if (date !== null) {
    assert.date(date, "date");
  }
  return new Typed("timestamp", date);
};
exports.month = function(date) {
  "use strict";
  if (date !== null) {
    assert.date(date, "date");
  }
  return new Typed("month", date);
};
exports.date = function(date) {
  "use strict";
  if (date !== null) {
    assert.date(date, "date");
  }
  return new Typed("date", date);
};
exports.datetime = function(date) {
  "use strict";
  if (date !== null) {
    assert.date(date, "date");
  }
  return new Typed("datetime", date);
};
exports.timespan = function(date) {
  "use strict";
  if (date !== null) {
    assert.date(date, "date");
  }
  return new Typed("timespan", date);
};
exports.minute = function(date) {
  "use strict";
  if (date !== null) {
    assert.date(date, "date");
  }
  return new Typed("minute", date);
};
exports.second = function(date) {
  "use strict";
  if (date !== null) {
    assert.date(date, "date");
  }
  return new Typed("second", date);
};
exports.time = function(date) {
  "use strict";
  if (date !== null) {
    assert.date(date, "date");
  }
  return new Typed("time", date);
};

exports.dict = function(object) {
  "use strict";
  assert.object(object, "object");
  return new Typed("dict", object);
};
exports.list = function(array) {
  "use strict";
  assert.array(array, "array");
  return new Typed("list", array);
};
exports.table = function(array) {
  "use strict";
  assert.array(array, "array");
  return new Typed("table", array);
};


exports.isTyped = function(val) {
  "use strict";
  return (val instanceof Typed);
};
