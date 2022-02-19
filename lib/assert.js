"use strict";
var Long = require("long");

function optional(fun) {
  return function(val, message) {
    if (val === null || val === undefined) {
      return;
    }
    return fun(val, message);
  };
}

function string(val, message) {
  if (typeof val !== "string") {
    throw new Error(message);
  }
}
exports.string = string;
exports.optionalString = optional(string);

function func(val, message) {
  if (typeof val !== "function") {
    throw new Error(message);
  }
}
exports.func = func;
exports.optionalFunc = optional(func);

function bool(val, message) {
  if (typeof val !== "boolean") {
    throw new Error(message);
  }
}
exports.bool = bool;
exports.optionalBool = optional(bool);

function object(val, message) {
  if (typeof val !== "object") {
    throw new Error(message);
  }
}
exports.object = object;
exports.optionalObject = optional(object);

function number(val, message) {
  if (typeof val !== "number") {
    throw new Error(message);
  }
}
exports.number = number;
exports.optionalNumber = optional(number);

function date(val, message) {
  if (!(val instanceof Date)) {
    throw new Error(message);
  }
}
exports.date = date;
exports.optionalDate = optional(date);

function array(val, message) {
  if (!Array.isArray(val)) {
    throw new Error(message);
  }
}
exports.array = array;
exports.optionalArray = optional(array);

function long(val, message) {
  if (!Long.isLong(val)) {
    throw new Error(message);
  }
}
exports.long = long;
exports.optionalLong = optional(long);
