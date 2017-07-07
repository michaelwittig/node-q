/// <reference types="long" />

/**
 * Explicit serialization to KDB is possible using the Typed API.
 */
export declare class Typed {
  /**
   * A private constructor is used to prevent inheritance.
   */
  private constructor();
  /**
   * Name of the type to serialize as.
   */
  readonly type: string;
  /**
   * The JavaScript value of the Typed object.
   */
  readonly value: any;
  /**
   * When the type is a list, this property returns the type of values within the list.
   */
  readonly valueType: string | undefined;
}

/* Primitive wrapper methods */

/**
 * Explicitly wrap the specified value as a boolean.
 * @param value The value to wrap.
 */
export declare function boolean(value: boolean): Typed;
/**
 * Explicitly wrap the specified value as a guid.
 * @param value The value to wrap.
 */
export declare function guid(value: string): Typed;
/**
 * Explicitly wrap the specified value as a byte.
 * @param value The value to wrap.
 */
export declare function byte(value: number): Typed;
/**
 * Explicitly wrap the specified value as a short.
 * @param value The value to wrap.
 */
export declare function short(value: number): Typed;
/**
 * Explicitly wrap the specified value as a int.
 * @param value The value to wrap.
 */
export declare function int(value: number): Typed;
/**
 * Explicitly wrap the specified value as a long.
 * @param value The value to wrap.
 */
export declare function long(value: Long): Typed;
/**
 * Explicitly wrap the specified value as a real.
 * @param value The value to wrap.
 */
export declare function real(value: number): Typed;
/**
 * Explicitly wrap the specified value as a float.
 * @param value The value to wrap.
 */
export declare function float(value: number): Typed;
/**
 * Explicitly wrap the specified value as a char.
 * @param value The value to wrap.
 */
export declare function char(value: string): Typed;
/**
 * Explicitly wrap the specified value as a symbol.
 * @param value The value to wrap.
 */
export declare function symbol(value: string): Typed;
/**
 * Explicitly wrap the specified value as a timestamp.
 * @param value The value to wrap.
 */
export declare function timestamp(value: Date): Typed;
/**
 * Explicitly wrap the specified value as a month.
 * @param value The value to wrap.
 */
export declare function month(value: Date): Typed;
/**
 * Explicitly wrap the specified value as a date.
 * @param value The value to wrap.
 */
export declare function date(value: Date): Typed;
/**
 * Explicitly wrap the specified value as a datetime.
 * @param value The value to wrap.
 */
export declare function datetime(value: Date): Typed;
/**
 * Explicitly wrap the specified value as a timespan.
 * @param value The value to wrap.
 */
export declare function timespan(value: Date): Typed;
/**
 * Explicitly wrap the specified value as a minute.
 * @param value The value to wrap.
 */
export declare function minute(value: Date): Typed;
/**
 * Explicitly wrap the specified value as a second.
 * @param value The value to wrap.
 */
export declare function second(value: Date): Typed;
/**
 * Explicitly wrap the specified value as a time.
 * @param value The value to wrap.
 */
export declare function time(value: Date): Typed;

/* Array wrapper methods */

/**
 * Explicitly wrap the specified array as a typed list of booleans.
 * @param value The array to wrap.
 */
export declare function booleans(value: boolean[] | ReadonlyArray<boolean>): Typed;
/**
 * Explicitly wrap the specified array as a typed list of guids.
 * @param value The array to wrap.
 */
export declare function guids(value: string[] | ReadonlyArray<string>): Typed;
/**
 * Explicitly wrap the specified array as a typed list of bytes.
 * @param value The array to wrap.
 */
export declare function bytes(value: number[] | ReadonlyArray<number>): Typed;
/**
 * Explicitly wrap the specified array as a typed list of shorts.
 * @param value The array to wrap.
 */
export declare function shorts(value: number[] | ReadonlyArray<number>): Typed;
/**
 * Explicitly wrap the specified array as a typed list of ints.
 * @param value The array to wrap.
 */
export declare function ints(value: number[] | ReadonlyArray<number>): Typed;
/**
 * Explicitly wrap the specified array as a typed list of longs.
 * @param value The array to wrap.
 */
export declare function longs(value: Long[] | ReadonlyArray<Long>): Typed;
/**
 * Explicitly wrap the specified array as a typed list of reals.
 * @param value The array to wrap.
 */
export declare function reals(value: number[] | ReadonlyArray<number>): Typed;
/**
 * Explicitly wrap the specified array as a typed list of floats.
 * @param value The array to wrap.
 */
export declare function floats(value: number[] | ReadonlyArray<number>): Typed;
/**
 * Explicitly wrap the specified array as a typed list of chars.
 * @param value The array to wrap.
 */
export declare function chars(value: string[] | ReadonlyArray<string>): Typed;
/**
 * Explicitly wrap the specified array as a typed list of symbols.
 * @param value The array to wrap.
 */
export declare function symbols(value: string[] | ReadonlyArray<string>): Typed;
/**
 * Explicitly wrap the specified array as a typed list of timestamps.
 * @param value The array to wrap.
 */
export declare function timestamps(value: Date[] | ReadonlyArray<Date>): Typed;
/**
 * Explicitly wrap the specified array as a typed list of months.
 * @param value The array to wrap.
 */
export declare function months(value: Date[] | ReadonlyArray<Date>): Typed;
/**
 * Explicitly wrap the specified array as a typed list of dates.
 * @param value The array to wrap.
 */
export declare function dates(value: Date[] | ReadonlyArray<Date>): Typed;
/**
 * Explicitly wrap the specified array as a typed list of datetimes.
 * @param value The array to wrap.
 */
export declare function datetimes(value: Date[] | ReadonlyArray<Date>): Typed;
/**
 * Explicitly wrap the specified array as a typed list of timespans.
 * @param value The array to wrap.
 */
export declare function timespans(value: Date[] | ReadonlyArray<Date>): Typed;
/**
 * Explicitly wrap the specified array as a typed list of mibutes.
 * @param value The array to wrap.
 */
export declare function minutes(value: Date[] | ReadonlyArray<Date>): Typed;
/**
 * Explicitly wrap the specified array as a typed list of seconds.
 * @param value The array to wrap.
 */
export declare function seconds(value: Date[] | ReadonlyArray<Date>): Typed;
/**
 * Explicitly wrap the specified array as a typed list of times.
 * @param value The array to wrap.
 */
export declare function times(value: Date[] | ReadonlyArray<Date>): Typed;
/**
 * Gets a value indicating if the specified value is a Typed wrapper.
 * @param value The value to test for being a Typed wrapper.
 */
export declare function isTyped(value: any): value is Typed;
