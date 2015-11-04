function optional(fun) {
  "use strict";
  return function(val, message) {
    if (val === null || val === undefined) {
      return;
    }
    return fun(val, message);
  };
}

function string(val, message) {
  "use strict";
  if (typeof val !== "string") {
    throw new Error(message);
  }
  return;
}
exports.string = string;
exports.optionalString = optional(string);

function func(val, message) {
  "use strict";
  if (typeof val !== "function") {
    throw new Error(message);
  }
  return;
}
exports.func = func;
exports.optionalFunc = optional(func);

function bool(val, message) {
  "use strict";
  if (typeof val !== "boolean") {
    throw new Error(message);
  }
  return;
}
exports.bool = bool;
exports.optionalBool = optional(bool);

function object(val, message) {
  "use strict";
  if (typeof val !== "object") {
    throw new Error(message);
  }
  return;
}
exports.object = object;
exports.optionalObject = optional(object);

function number(val, message) {
  "use strict";
  if (typeof val !== "number") {
    throw new Error(message);
  }
  return;
}
exports.number = number;
exports.optionalNumber = optional(number);
