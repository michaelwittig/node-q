var assert = require("./assert.js");

function Typed(type, value, valuetype) {
  "use strict";
  this._type = type;
  this._value = value;
  this._valuetype = valuetype;
}
Typed.prototype.type = function() {
  "use strict";
  return this._type;
};
Typed.prototype.value = function() {
  "use strict";
  return this._value;
};
Typed.prototype.valuetype = function() {
  "use strict";
  if (this._type !== "typedlist") {
    throw new Error("only available for type typedlist");
  }
  return this._valuetype;
};
Typed.prototype.toString = function() {
  "use strict";
  if (this._type === "typedlist") {
    return "list[" + this._valuetype + "](" + this._value + ")";
  }
  return this._type + "(" + this._value + ")";
};

function listOf(assertfn, values, valuetype) {
  "use strict";
  assert.array(values, "array");
  values.forEach(function(v) {
    assertfn(v, assertfn.name);
  });
  return new Typed("typedlist", values, valuetype);
}

exports.boolean = function(boolean) {
  "use strict";
  assert.bool(boolean, "boolean");
  return new Typed("boolean", boolean);
};
exports.booleans = function(booleans) {
  "use strict";
  return listOf(assert.bool, booleans, "boolean");
};

exports.guid = function(string) {
  "use strict";
  if (string !== null) {
    assert.string(string, "string");
  }
  return new Typed("guid", string);
};
exports.guids = function(strings) {
  "use strict";
  return listOf(assert.string, strings, "guid");
};

exports.byte = function(number) {
  "use strict";
  assert.number(number, "number");
  return new Typed("byte", number);
};
exports.bytes = function(numbers) {
  "use strict";
  return listOf(assert.number, numbers, "byte");
};

exports.short = function(number) {
  "use strict";
  if (number !== null) {
    assert.number(number, "number");
  }
  return new Typed("short", number);
};
exports.shorts = function(numbers) {
  "use strict";
  return listOf(assert.number, numbers, "short");
};

exports.int = function(number) {
  "use strict";
  if (number !== null) {
    assert.number(number, "number");
  }
  return new Typed("int", number);
};
exports.ints = function(numbers) {
  "use strict";
  return listOf(assert.number, numbers, "int");
};

exports.long = function(long) {
  "use strict";
  if (long !== null && long !== Infinity && long !== -Infinity) {
    assert.long(long, "long");
  }
  return new Typed("long", long);
};
exports.longs = function(longs) {
  "use strict";
  return listOf(assert.long, longs, "long");
};

exports.real = function(number) {
  "use strict";
  if (number !== null) {
    assert.number(number, "number");
  }
  return new Typed("real", number);
};
exports.reals = function(numbers) {
  "use strict";
  return listOf(assert.number, numbers, "real");
};

exports.float = function(number) {
  "use strict";
  if (number !== null) {
    assert.number(number, "number");
  }
  return new Typed("float", number);
};
exports.floats = function(numbers) {
  "use strict";
  return listOf(assert.number, numbers, "float");
};

exports.char = function(string) {
  "use strict";
  if (string !== null) {
    assert.string(string, "string");
  }
  return new Typed("char", string);
};
exports.chars = function(strings) {
  "use strict";
  return listOf(assert.string, strings, "char");
};

exports.symbol = function(string) {
  "use strict";
  if (string !== null) {
    assert.string(string, "string");
  }
  return new Typed("symbol", string);
};
exports.symbols = function(strings) {
  "use strict";
  return listOf(assert.string, strings, "symbol");
};

exports.timestamp = function(date) {
  "use strict";
  if (date !== null) {
    assert.date(date, "date");
  }
  return new Typed("timestamp", date);
};
exports.timestamps = function(dates) {
  "use strict";
  return listOf(assert.date, dates, "timestamp");
};

exports.month = function(date) {
  "use strict";
  if (date !== null) {
    assert.date(date, "date");
  }
  return new Typed("month", date);
};
exports.months = function(dates) {
  "use strict";
  return listOf(assert.date, dates, "month");
};

exports.date = function(date) {
  "use strict";
  if (date !== null) {
    assert.date(date, "date");
  }
  return new Typed("date", date);
};
exports.dates = function(dates) {
  "use strict";
  return listOf(assert.date, dates, "date");
};

exports.datetime = function(date) {
  "use strict";
  if (date !== null) {
    assert.date(date, "date");
  }
  return new Typed("datetime", date);
};
exports.datetimes = function(dates) {
  "use strict";
  return listOf(assert.date, dates, "datetime");
};

exports.timespan = function(date) {
  "use strict";
  if (date !== null) {
    assert.date(date, "date");
  }
  return new Typed("timespan", date);
};
exports.timespans = function(dates) {
  "use strict";
  return listOf(assert.date, dates, "timespan");
};

exports.minute = function(date) {
  "use strict";
  if (date !== null) {
    assert.date(date, "date");
  }
  return new Typed("minute", date);
};
exports.minutes = function(dates) {
  "use strict";
  return listOf(assert.date, dates, "minute");
};

exports.second = function(date) {
  "use strict";
  if (date !== null) {
    assert.date(date, "date");
  }
  return new Typed("second", date);
};
exports.seconds = function(dates) {
  "use strict";
  return listOf(assert.date, dates, "second");
};

exports.time = function(date) {
  "use strict";
  if (date !== null) {
    assert.date(date, "date");
  }
  return new Typed("time", date);
};
exports.times = function(dates) {
  "use strict";
  return listOf(assert.date, dates, "time");
};

exports.mixedlist = function(values) {
  "use strict";
  assert.array(values, "array");
  return new Typed("mixedlist", values);
};

exports.dict = function(object) {
  "use strict";
  assert.object(object, "object");
  return new Typed("dict", object);
};

// TODO expose typed table as soon as implemented
/*exports.table = function(array) {
  "use strict";
  assert.array(array, "array");
  return new Typed("table", array);
};*/

exports.Typed = Typed;
exports.isTyped = function(val) {
  "use strict";
  return (val instanceof Typed);
};
