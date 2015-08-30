[![Build Status](https://secure.travis-ci.org/michaelwittig/node-q.png)](http://travis-ci.org/michaelwittig/node-q)
[![NPM version](https://badge.fury.io/js/node-q.png)](http://badge.fury.io/js/node-q)
[![NPM dependencies](https://david-dm.org/michaelwittig/node-q.png)](https://david-dm.org/michaelwittig/node-q)

# node-q

Q interfacing with Node.js. Supports [decompression](http://code.kx.com/wiki/Reference/ipcprotocol#Compression). Can deserialize all q data types (including `guid`) to JavaScript. Can serialize all JavaScript data types to q.

## Installation

```
npm install node-q
```

## Usage

### Create Connection

```javascript
var nodeq = require("node-q");
nodeq.connect({host: "localhost", port: 5000}, function(err, con) {
	if (err) throw err;
	console.log("connected");
	// interact with con like demonstrated below
});
```

#### Create Connection with user and password auth

```javascript
var nodeq = require("node-q");
nodeq.connect({host: "localhost", port: "localhost", 5000, user: "user", password: "password"}, function(err, con) {
	if (err) throw err;
	console.log("connected");
	// interact with con like demonstrated below
});
```

### Execute Q code and receive result

```javascript
con.k("sum 1 2 3", function(err, res) {
	if (err) throw err;
	console.log("result", res); // 6
});
```

### Execute function with parameter and receive result

```javascript
con.k("sum", [1, 2, 3], function(err, res) {
	if (err) throw err;
	console.log("result", res); // 6
});
```

### Execute function with parameters and receive result

```javascript
con.k("cor", [1, 2, 3], [4, 5, 6], function(err, res) {
	if (err) throw err;
	console.log("result", res); // 1
});
```

### Async execute Q code

```javascript
con.ks("show 1 2 3", function(err) {
	if (err) throw err;
});
```

### Async execute function with parameters

```javascript
con.ks("show", [1, 2, 3], function(err) {
	if (err) throw err;
});
```

### Subscribe to kdb+tick

```javascript
con.on("upd", function(table, data) {
	console.log(table, data);
});

con.ks(".u.sub[`;`]", function(err) { // subscribe to all tables and all symbols
	if (err) throw err;
});
```

### Close connection

```javascript
con.close(function() {
	console.log("con closed");
});
```

## Types

Q has many more [data types](http://code.kx.com/wiki/Reference/Datatypes) than JavaScript. Therefore you need to know how types are converted.

### From q to JavaScript (deserialization)

| q type | JavaScript type | Null | +Infinity | -Infinity |
| ------ | --------------- | ---- | --------- | --------- |
| boolean | [Boolean](https://developer.mozilla.org/docs/Glossary/Boolean) | | | |
| guid | [String](https://developer.mozilla.org/docs/Glossary/String) | [Null](https://developer.mozilla.org/docs/Glossary/Null) | | |
| byte | [Number](https://developer.mozilla.org/docs/Glossary/Number) | | | |
| short | [Number](https://developer.mozilla.org/docs/Glossary/Number) | [Null](https://developer.mozilla.org/docs/Glossary/Null) | [Infinity](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Infinity) | -[Infinity](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Infinity) |
| int | [Number](https://developer.mozilla.org/docs/Glossary/Number) | [Null](https://developer.mozilla.org/docs/Glossary/Null) | [Infinity](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Infinity) | -[Infinity](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Infinity) |
| long | [Number](https://developer.mozilla.org/docs/Glossary/Number) | [Null](https://developer.mozilla.org/docs/Glossary/Null) | [Infinity](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Infinity) | -[Infinity](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Infinity) |
| real | [Number](https://developer.mozilla.org/docs/Glossary/Number) | [Null](https://developer.mozilla.org/docs/Glossary/Null) | [Infinity](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Infinity) | -[Infinity](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Infinity) |
| float | [Number](https://developer.mozilla.org/docs/Glossary/Number) | [Null](https://developer.mozilla.org/docs/Glossary/Null) | [Infinity](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Infinity) | -[Infinity](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Infinity) |
| char | [String](https://developer.mozilla.org/docs/Glossary/String) | [Null](https://developer.mozilla.org/docs/Glossary/Null) | | |
| symbol | [String](https://developer.mozilla.org/docs/Glossary/String) | [Null](https://developer.mozilla.org/docs/Glossary/Null) | | |
| timestamp | [Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) <sup>[1](#types-footnote1), [2](#types-footnote2)</sup> | [Null](https://developer.mozilla.org/docs/Glossary/Null) | | |
| month | [Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) <sup>[2](#types-footnote2)</sup> | [Null](https://developer.mozilla.org/docs/Glossary/Null) | | |
| date | [Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) <sup>[2](#types-footnote2)</sup> | [Null](https://developer.mozilla.org/docs/Glossary/Null) | | |
| datetime | [Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) <sup>[2](#types-footnote2)</sup> | [Null](https://developer.mozilla.org/docs/Glossary/Null) | | |
| timespan | [Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) <sup>[1](#types-footnote1), [2](#types-footnote2), [3](#types-footnote3)</sup> | [Null](https://developer.mozilla.org/docs/Glossary/Null) | | |
| minute | [Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) <sup>[2](#types-footnote2), [3](#types-footnote3)</sup> | [Null](https://developer.mozilla.org/docs/Glossary/Null) | | |
| second | [Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) <sup>[2](#types-footnote2), [3](#types-footnote3)</sup> | [Null](https://developer.mozilla.org/docs/Glossary/Null) | | |
| time | [Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) <sup>[2](#types-footnote2), [3](#types-footnote3)</sup> | [Null](https://developer.mozilla.org/docs/Glossary/Null) | | |

* <a name="types-footnote1">1</a>: q comes with nanoseconds precision. JavaScript only with milliseconds. You can disable `nanos2date` deserialization during `connect(params, cb)` to get the nanoseconds timestamp as a plain [Number](https://developer.mozilla.org/docs/Glossary/Number).
* <a name="types-footnote2">2</a>: think about running your Node.js process with `TZ=UTC node ...` to run in UTC timezone. q doesn't know timezones.
* <a name="types-footnote3">3</a>: date is set to `2000-01-01` in the Date object. Only evaluate the time part.

#### dict

```
q) (`a`b`c)!(1 2 3i)
```

becomes [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)


```javascript
{
	a: 1,
	b: 2,
	c: 3
}
```

#### list

```
q) 1 2 3i
```

becomes [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)

```javascript
[1, 2, 3]
```

#### table

```
q) ([] sym:`a`b`c; size:(1 2 3i))
```

becomes [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) of [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) per row.

```javascript
[
	{sym: "a", size: 1},
	{sym: "b", size: 2},
	{sym: "c", size: 3}
]
```

You can disable `flipTables` during `connect(params, cb)` to get a table as an [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) with an [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) per column.

```javascript
{
	sym: ["a", "b", "c"],
	size: [1, 2, 3]
}
```

### From JavaScript to q (serialization)

| JavaScript type | q type |
| --------------- | ------ |
| [Boolean](https://developer.mozilla.org/docs/Glossary/Boolean) | boolean |
| [String](https://developer.mozilla.org/docs/Glossary/String) starting with ` | symbol |
| [String](https://developer.mozilla.org/docs/Glossary/String) | list[char] |
| [Number](https://developer.mozilla.org/docs/Glossary/Number) | float |
| [Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | datetime |
| [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) | dict |
| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)[*] | list[*] |
| [Null](https://developer.mozilla.org/docs/Glossary/Null) | unary primitive |
| [Infinity](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Infinity) | float |
| -[Infinity](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Infinity) | float |

## API

### connect(params, cb)

* `params`: Object
	* `host`: String (e. g. "localhost")
	* `port`: Number (e. g. 5000)
	* `user`: String (optional)
	* `password`: String (optional)
	* `socketNoDelay` : Boolean (optional, see http://nodejs.org/api/net.html#net_socket_setnodelay_nodelay)
	* `socketTimeout`: Number (optional, see http://nodejs.org/api/net.html#net_socket_settimeout_timeout_callback)
	* `nanos2date`: Boolean (optional, default: true)
	* `flipTables`: Boolean (optional, default: true)
* `cb`: Function(`err`, `con`)
	* `err`: `Error` or `undefined`
	* `conn`: `Connection` or `undefined`

### @deprecated connect(host, port, [user, password,] cb)

This is deprecated. Please use the new, mor flexible API above!

* `host`: String (e. g. "localhost")
* `port`: Number (e. g. 5000)
* `user`: String (optional)
* `password`: String (optional)

### Connection

Is an [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter).

#### k(s, [x, [y, [z, [...,] ] ] ] cb)

Sync request/response.

* `s`: String
* `x`: Object (optional)
* `y`: Object (optional)
* `z`: Object (optional)
* `...`: Object (optional)
* `cb`: Function(`err`, `res`)
	* `err`: `Error` or `undefined`
	* `res`: `Object` or `undefined`

#### ks(s, [x, [y, [z, [...,] ] ] ] cb)

Async request.

* `s`: String
* `x`: Object (optional)
* `y`: Object (optional)
* `z`: Object (optional)
* `...`: Object (optional)
* `cb`: Function(`err`)
	* `err`: `Error` or `undefined`

#### close(cb)

* `cb`: Function(`err`) (optional)
	* `err`: `Error` or `undefined`

#### Events

##### upd(table, data)

If you use kdb+tick and subscribe like `con.ks(".u.sub[`;`]", function(err) { throw err; })` you will receive all Updates via `upd` Event.

* `table`: String (e.g. trades)
* `data`: Object (table represented in JavaScript are Arrays of Objects)

##### error(err)

If the socket emit an `error` event.

* `err`: `Error`

##### end()

If the socket emit an `end` event.

##### timeout()

If the socket emit a `timeout` event.

##### close(had_error)

If the socket emit a `close` event.

* `had_error`: Boolean (true if the socket had a transmission error)

## Contribution

If you want to create a Pull-Request please make sure that `make test` runs without failures.

If you have a kdb+tick setup please also run `make mochait`.

### Code Style

	make jshint

### Unit Tests

	make mocha

### Integration Test

Assumes running kdb+tick process on localhost:5000!

	make mochait

### Circular depdendencies

	make circular
