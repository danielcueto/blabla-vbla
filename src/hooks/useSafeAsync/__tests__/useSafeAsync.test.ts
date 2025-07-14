import { renderHook, act } from '@testing-library/react-hooks'
import useSafeAsync from '../useSafeAsync'
import { TimeoutError } from '../../../utils/withTimeout'
import { REQUEST_TIMEOUT_MILLISECONDS } from '../../../config/config'

describe('useSafeAsync hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return result when operation succeeds', async () => {
    const asyncOp = jest.fn().mockResolvedValue(42)
    const { result } = renderHook(() => useSafeAsync<number>(asyncOp, 100))

    let output: number | null = null
    await act(async () => {
      output = await result.current.executeAsyncOperation('x', 123)
    })

    expect(output).toBe(42)
    expect(asyncOp).toHaveBeenCalledWith('x', 123)
    expect(result.current.isOperationInProgress).toBe(false)
    expect(result.current.operationErrorMessage).toBeNull()
  })

  it('should return null and set error when operation rejects', async () => {
    const asyncOp = jest.fn().mockRejectedValue(new Error('failed'))
    const { result } = renderHook(() => useSafeAsync<number>(asyncOp, 100))

    let output: number | null = null
    await act(async () => {
      output = await result.current.executeAsyncOperation()
    })

    expect(output).toBeNull()
    expect(result.current.isOperationInProgress).toBe(false)
    expect(result.current.operationErrorMessage).toBe('failed')
  })

  it('should handle timeout error message', async () => {
    jest.useFakeTimers()
    const asyncOp = jest.fn().mockImplementation(
      () =>
        new Promise((_res, rej) =>
          setTimeout(
            () => rej(new TimeoutError('timeout occurred')),
            REQUEST_TIMEOUT_MILLISECONDS + 10
          )
        )
    )
    const { result } = renderHook(() =>
      useSafeAsync<number>(asyncOp, REQUEST_TIMEOUT_MILLISECONDS)
    )

    let output: number | null = null
    await act(async () => {
      const p = result.current.executeAsyncOperation()
      jest.advanceTimersByTime(REQUEST_TIMEOUT_MILLISECONDS + 10)
      output = await p
    })

    expect(output).toBeNull()
    expect(result.current.operationErrorMessage).toMatch(
      /time limit of \d+ milliseconds/
    )
    expect(result.current.isOperationInProgress).toBe(false)
    jest.useRealTimers()
  })
})
