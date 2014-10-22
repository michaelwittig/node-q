# node-q

Q interfacing with Node.js based on [c.js](http://kx.com/q/c/c.js).

## Installation

	npm install node -q

## Usage

### Create Connection

	connect("localhost", 5000, function(err, con) {
		if (err) throw err;
		console.log("connected");
		// interact with con like demonstrated below
	});

### Execute Q code and receive result

	con.k("sum 1 2 3", function(err, res) {
		if (err) throw err;
		console.log("result", res);
	});

### Execute function with parameters and receive result

	con.k("sum", [1, 2, 3], function(err, res) {
		if (err) throw err;
		console.log("result", res);
	});

### Async execute Q code

	con.ks("show 1 2 3", function(err) {
		if (err) throw err;
	});

### Async execute function with parameters

	con.ks("show", [1, 2, 3], function(err) {
		if (err) throw err;
	});

### Subscribe to kdb+tick

	con.on("upd", function(table, data) {
		console.log(table, data);
	});

	con.ks(".u.sub[`;`]", function(err) { // subscribe to all tables and all symbols
		if (err) throw err;
	});

### Close connection

	con.close(function() {
		console.log("con closed");
	});

## API

### connect(host, port, cb)

* `host`: String (e. g. "localhost")
* `port`: Number (e. g. 5000)
* `cb`: Function(`err`, `con`)
	* `err`: `Error` or `undefined`
	* `conn`: `Connection` or `undefined`

### Connection

Is an EventEmitter.

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
