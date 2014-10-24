[![Build Status](https://secure.travis-ci.org/cinovo/node-q.png)](http://travis-ci.org/cinovo/node-q)
[![NPM version](https://badge.fury.io/js/node-q.png)](http://badge.fury.io/js/node-q)
[![NPM dependencies](https://david-dm.org/cinovo/node-q.png)](https://david-dm.org/cinovo/node-q)

# node-q

Q interfacing with Node.js based on [c.js](http://kx.com/q/c/c.js).

## Installation

```
npm install node-q
```

## Usage

### Create Connection

```javascript
var nodeq = require("node-q");
nodeq.connect("localhost", 5000, function(err, con) {
	if (err) throw err;
	console.log("connected");
	// interact with con like demonstrated below
});
```

#### Create Connection with user and password auth

```javascript
var nodeq = require("node-q");
nodeq.connect("localhost", 5000, "user", "password", function(err, con) {
	if (err) throw err;
	console.log("connected");
	// interact with con like demonstrated below
});

### Execute Q code and receive result

```javascript
con.k("sum 1 2 3", function(err, res) {
	if (err) throw err;
	console.log("result", res);
});
```

### Execute function with parameters and receive result

```javascript
con.k("sum", [1, 2, 3], function(err, res) {
	if (err) throw err;
	console.log("result", res);
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

## API

### impl

String (e.g. "memcpy" or "js")

### connect(host, port, [user, password,] cb)

* `host`: String (e. g. "localhost")
* `port`: Number (e. g. 5000)
* `user`: String (optional)
* `password`: String (optional)
* `cb`: Function(`err`, `con`)
	* `err`: `Error` or `undefined`
	* `conn`: `Connection` or `undefined`

### Connection

Is an [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter).

#### k(s, [x, [y, [z,]]] cb)

Sync request/response.

* `s`: String
* `x`: Object (optional)
* `y`: Object (optional)
* `z`: Object (optional)
* `cb`: Function(`err`, `res`)
	* `err`: `Error` or `undefined`
	* `res`: `Object` or `undefined`

#### ks(s, [x, [y, [z,]]] cb)

Async request.

* `s`: String
* `x`: Object (optional)
* `y`: Object (optional)
* `z`: Object (optional)
* `cb`: Function(`err`)
	* `err`: `Error` or `undefined`

#### close(cb)

* `cb`: Function(`err`)
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

	make jslint

### Unit Tests

	make mocha

### Integration Test

Assumes running kdb+tick process on localhost:5000!

	make mochait

### Circular depdendencies

	make circular
