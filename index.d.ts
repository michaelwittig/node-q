/// <reference types="node" />

import * as events from 'events';

/**
 * A standard node.js callback after an asynchronous call with no return value.
 * @param error - This parameter will be undefined if the call was successful, or an error if not.
 */
export declare type AsyncCallback = (error: Error | undefined) => void;

/**
 * A standard node.js callback after an asynchronous call with a return value.
 * @param error - This parameter will be undefined if the call was successful, or an error if not.
 * @param value - This parameter will be undefined if the call was not successful, or the return value if it was successful.
 */
export declare type AsyncValueCallback<T = any> = (error: Error | undefined, value: T | undefined) => void;

/**
 * The events that can be raised by the Connection class and the event listener types.
 */
export declare interface ConnectionEvents {
  /**
   * Raised when the connection is closed.
   * @param hadError - Whether or not it was closed due to an error.
   */
  close: (hadError: boolean) => void;
  /**
   * Raised when the connection is ended.
   */
  end: () => void;
  /**
   * Raised when an error is encountered.
   * @param error - The error encountered.
   */
  error: (error: Error) => void;
  /**
   * Raised when the connection times out.
   */
  timeout: () => void;
  /**
   * Raised by KDB as an update. Includes the table name and typically one more piece of data indicating the updates (though optionally more than one).
   */
  upd: (tableName: string, ...data: any[]) => void;
}

/**
 * Class representing the KDB connection.
 */
export declare class Connection extends events.EventEmitter {
  /**
   * A private constructor is used to prevent inheritance.
   */
  private constructor();
  /**
   * Adds an event listener for events of the specified type.
   * @param type The event type.
   * @param listener The event listener to add.
   */
  addListener<T extends keyof ConnectionEvents>(type: T, listener: ConnectionEvents[T]): this;
  /**
   * Closes this connection.
   * @param callback Optional callback to be invoked when the close operation has finished.
   */
  close(callback?: () => void): void;
  /**
   * Listen to a handle.
   * @param callback The callback to be invoked when the results are available or an error is to be reported.
   */
  k(callback: AsyncValueCallback): void;
  /**
   * Execute a statement synchronously against KDB and return the result when available via the callback.
   * @param statement The statement to execute against KDB.
   * @param callback The callback to be invoked when the results are available or an error is to be reported.
   */
  k(statement: string, callback: AsyncValueCallback): void;
  /**
   * Execute a statement synchronously against KDB that takes a single parameter and return the result when available via the callback.
   * @param statement The statement to execute against KDB.
   * @param parameter The parameter to pass to KDB.
   * @param callback The callback to be invoked when the results are available or an error is to be reported.
   */
  k(statement: string, parameter: any, callback: AsyncValueCallback): void;
  /**
   * Execute a statement synchronously against KDB that takes an arbitrary number of parameters.  The last element in the rest array must be an AsyncValueCallback.
   * @param statement The statement to execute against KDB.
   * @param parametersEndingInCallback The parameters to pass to KDB, with the last element being the callback to be invoked when the results are available or an error is to be reported.
   */
  k(statement: string, ...parametersEndingInCallback: any[]): void;
  /**
   * Execute a statement asynchronously against KDB with no return value, and return a callback indicating the message was received by KDB successfuly.
   * @param statement The statement to execute against KDB.
   * @param callback The callback to be invoked when the statement is received by KDB or an error is to be reported.
   */
  ks(statement: string, callback: AsyncCallback): void;
  /**
   * Execute a statement asynchronously against KDB with a single parameter and no return value, and return a callback indicating the message was received by KDB successfuly.
   * @param statement The statement to execute against KDB.
   * @param callback The callback to be invoked when the statement is received by KDB or an error is to be reported.
   */
  ks(statement: string, parameter: any, callback: AsyncCallback): void;
  /**
   * Execute a statement asynchronously against KDB that takes an arbitrary number of parameters and has no return value.  The last element in the rest array must be an AsyncCallback.
   * @param statement The statement to execute against KDB.
   * @param parametersEndingInCallback The parameters to pass to KDB, with the last element being the callback to be invoked when the statement is received by KDB or an error is to be reported.
   */
  ks(statement: string, ...parametersEndingInCallback: any[]): void;
  /**
   * Gets the number of listeners for the specified event type.
   * @param type The event type.
   */
  listenerCount(type: keyof ConnectionEvents): number;
  /**
   * Gets the collection of listeners for the specified event type.
   * @param type The event type.
   */
  listeners<T extends keyof ConnectionEvents>(type: T): ConnectionEvents[T][];
  /**
   * Adds an event listener for events of the specified type.
   * @param type The event type.
   * @param listener The event listener to add.
   */
  on<T extends keyof ConnectionEvents>(type: T, listener: ConnectionEvents[T]): this;
  /**
   * Adds an event listener for only the next time an event of the specified type is invoked.
   * @param type The event type.
   * @param listener The event listener to add.
   */
  once<T extends keyof ConnectionEvents>(type: T, listener: ConnectionEvents[T]): this;
  /**
   * Adds an event listener for events of the specified type, but add it at the beginning of the collection of listeners for the event type.
   * @param type The event type.
   * @param listener The event listener to add.
   */
  prependListener<T extends keyof ConnectionEvents>(type: T, listener: ConnectionEvents[T]): this;
  /**
   * Adds an event listener for only the next time events of the specified type are raised, but add it at the beginning of the collection of listeners for the event type.
   * @param type The event type.
   * @param listener The event listener to add.
   */
  prependOnceListener<T extends keyof ConnectionEvents>(type: T, listener: ConnectionEvents[T]): this;
  /**
   * Removes all listeners from all events.
   */
  removeAllListeners(): this;
  /**
   * Removes all listeners from the specified event type.
   * @param type The event type.
   */
  removeAllListeners(type: keyof ConnectionEvents): this;
  /**
   * Removes the specified listener from the collection of listeners associated with the type.
   * @param type The event type.
   * @param listener The listener to remove.
   */
  removeListener<T extends keyof ConnectionEvents>(type: T, listener: ConnectionEvents[T]): this;
}

/**
 * Connection parameters.
 */
export declare interface ConnectionParameters {
  /**
   * The KDB host to connect to.
   */
  host?: string;
  /**
   * The port on the KDB host to connect to.
   */
  port?: number;
  /**
   * Optional - The user to authenticate as to KDB.
   */
  user?: string;
  /**
   * Optional - The password to use to authenticate to KDB.
   */
  password?: string;
  /**
   * Set the socket to no-delay. See https://nodejs.org/api/net.html#net_socket_setnodelay_nodelay
   */
  socketNoDelay?: boolean;
  /**
   * Sets the socket to timeout after the number of milliseconds of inactivity. See https://nodejs.org/api/net.html#net_socket_settimeout_timeout_callback
   */
  socketTimeout?: number;
  /**
   * Should this connection convert KDB nanoseconds to JavaScript Date objects (defaults to true).
   */
  nanos2date?: boolean;
  /**
   * Should this connection flip tables (defaults to true).
   */
  flipTables?: boolean;
  /**
   * Should this connection convert empty char fields to null (defaults to true).
   */
  emptyChar2null?: boolean;
  /**
   * Should this connection convert KDB longs to JavaScript Number types (defaults to true).
   * Specifying false will cause KDB longs to be returned using long.js.
   */
  long2number?: boolean;
  /**
   * Connect with Unix Domain Sockets rather than TCP
   */
  unixSocket?: string;
}

/**
 * Attempt to connect to KDB using the specified connection parameters, and return the connection when it is established.
 * @param parameters The connection parameters.
 * @param callback Callback to be invoked when the connection is (or fails to be) established.
 */
export declare function connect(parameters: ConnectionParameters, callback: AsyncValueCallback<Connection>): void;
/**
 * Attempt to connect to an unauthenticated KDB instance using the specified host and port, and return the connection when it is established.
 * @param host The KDB host to connect to.
 * @param port The port on the host to connect to.
 * @param callback Callback to be invoked when the connection is (or fails to be) established.
 */
export declare function connect(host: string, port: number, callback: AsyncValueCallback<Connection>): void;
/**
 * Attempt to connect to a KDB instance using the specified host, port, username and password, and return the connection when it is established.
 * @param host The KDB host to connect to.
 * @param port The port on the host to connect to.
 * @param user The user to authenticate to KDB with.
 * @param password The password to use to authenticate to KDB.
 * @param callback Callback to be invoked when the connection is (or fails to be) established.
 */
export declare function connect(host: string, port: number, user: string, password: string, callback: AsyncValueCallback<Connection>): void;
/**
 * Attempt to connect to KDB using Unix Domain Sockets, and return the connection when it is established.
 * @param unixSocket Path to KDB Unix Domain Socket (Doesn't support abstract namespace sockets: KDB3.5+ on Linux)
 * @param callback Callback to be invoked when the connection is (or fails to be) established.
 */
export declare function connect(unixSocket: string, callback: AsyncValueCallback<Connection>): void;
/**
 * Brings in the Typed wrapper APIs.
 */
export * from './lib/typed';
