/**
 * A generic asynchronous function that returns a value of type ReturnType.
 *
 * @typeParam Arguments    Tuple of parameter types for the function
 * @typeParam ReturnType   The type that the returned promise resolves to
 *
 * @example
 * // A fetch function taking (url: string, timeout: number) and returning Data
 * type FetchDataFunction = AsyncFunction<[string, number], Data>
 */
export type AsyncFunction<
  Arguments extends unknown[] = unknown[],
  ReturnType = unknown
> = (...args: Arguments) => Promise<ReturnType>
