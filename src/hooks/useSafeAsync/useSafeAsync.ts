// src/hooks/useSafeAsync/useSafeAsync.ts
import { useState } from 'react'
import type { AsyncFunction } from '../../types/common'
import { withTimeout } from '../../utils/withTimeout'
import { REQUEST_TIMEOUT_MS } from '../../config/config'

/**
 * The result returned by `useSafeAsync`.
 *
 * @template T  The return type of the async function
 */
export interface SafeAsyncResult<T> {
  /**
   * Executes the provided async operation with a timeout.
   *
   * @param functionArguments  Arguments to pass to `asyncOperation`
   * @returns                  The value of type T, or null if an error occurred
   */
  executeAsyncOperation: (...functionArguments: unknown[]) => Promise<T | null>
  /** True while `executeAsyncOperation` is in progress */
  isOperationInProgress: boolean
  /** Error message if `executeAsyncOperation` failed, otherwise null */
  operationErrorMessage: string | null
}

/**
 * Safely runs an async operation with a timeout and captures any errors.
 *
 * @template T                        The return type of the async function `asyncOperation`
 * @param asyncOperation              The async function to execute
 * @param timeoutInMilliseconds       Maximum time to wait in milliseconds
 * @returns                            An object with `executeAsyncOperation`, `isOperationInProgress`, and `operationErrorMessage`
 */
export default function useSafeAsync<T>(
  asyncOperation: AsyncFunction<unknown[], T>,
  timeoutInMilliseconds = REQUEST_TIMEOUT_MS
): SafeAsyncResult<T> {
  const [isOperationInProgress, setIsOperationInProgress] = useState(false)
  const [operationErrorMessage, setOperationErrorMessage] = useState<string | null>(null)

  async function executeAsyncOperation(
    ...functionArguments: unknown[]
  ): Promise<T | null> {
    setIsOperationInProgress(true)
    setOperationErrorMessage(null)
    try {
      const result = await withTimeout(
        asyncOperation(...(functionArguments as any)),
        timeoutInMilliseconds
      )
      return result
    } catch (error: unknown) {
      const message = error instanceof Error
        ? error.message
        : 'An unexpected error occurred'
      setOperationErrorMessage(message)
      return null
    } finally {
      setIsOperationInProgress(false)
    }
  }

  return { executeAsyncOperation, isOperationInProgress, operationErrorMessage }
}
