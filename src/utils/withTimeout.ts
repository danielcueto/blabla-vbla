/**
 * Error thrown when an operation exceeds its allowed time.
 */
export class TimeoutError extends Error {
  constructor(message?: string) {
    super(message ?? 'The operation timed out')
    this.name = 'TimeoutError'
  }
}

/**
 * Race a promise against a timeout.
 *
 * @typeParam T  The expected type of the promise result
 * @param operationPromise        The promise to execute
 * @param timeoutInMilliseconds   Maximum time to wait in milliseconds (default 8 000)
 * @returns                       The promise’s resolved value if it completes in time
 * @throws {TimeoutError}         When the timeout elapses before resolution
 *
 */
export async function withTimeout<T>(
  operationPromise: Promise<T>,
  timeoutInMilliseconds = 8_000
): Promise<T> {
  let timeoutHandle: ReturnType<typeof setTimeout> | null = null

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(
        new TimeoutError(
          `Operation exceeded time limit of ${timeoutInMilliseconds} milliseconds`
        )
      )
    }, timeoutInMilliseconds)
  })

  try {
    return await Promise.race([operationPromise, timeoutPromise])
  } finally {
    if (timeoutHandle !== null) {
      clearTimeout(timeoutHandle)
    }
  }
}
