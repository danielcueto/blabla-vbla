import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import useCapturePhoto from '../useCapturePhoto'
import { TimeoutError } from '../../../utils/withTimeout'
import {
  CAMERA_SNAPSHOT_TIMEOUT_MS,
  CAMERA_SNAPSHOT_QUALITY_PERCENT,
} from '../../../config/config'
import type { Camera } from 'react-native-vision-camera'

describe('useCapturePhoto hook', () => {
  let mockCameraInstance: { takeSnapshot: jest.Mock }
  let cameraRef: React.MutableRefObject<Camera | null>

  beforeEach(() => {
    mockCameraInstance = { takeSnapshot: jest.fn() }
    cameraRef = { current: mockCameraInstance as unknown as Camera }
    jest.clearAllMocks()
  })

  it('should return a file URI when snapshot succeeds', async () => {
    mockCameraInstance.takeSnapshot.mockResolvedValue({ path: 'photo.jpg' })

    const { result } = renderHook(() => useCapturePhoto(cameraRef))

    let returnedUri: string | null = null
    await act(async () => {
      returnedUri = await result.current.capturePhoto()
    })

    expect(returnedUri).toBe('file://photo.jpg')
    expect(result.current.isCapturing).toBe(false)
    expect(result.current.captureError).toBeNull()
    expect(mockCameraInstance.takeSnapshot).toHaveBeenCalledWith({
      quality: CAMERA_SNAPSHOT_QUALITY_PERCENT,
    })
  })

  it('should return null and set an error when camera ref is missing', async () => {
    cameraRef.current = null

    const { result } = renderHook(() => useCapturePhoto(cameraRef))

    let returnedUri: string | null = null
    await act(async () => {
      returnedUri = await result.current.capturePhoto()
    })

    expect(returnedUri).toBeNull()
    expect(result.current.isCapturing).toBe(false)
    expect(result.current.captureError).toMatch(/reference is not available/i)
  })

  it('should handle snapshot timeout without waiting real time', async () => {
    jest.useFakeTimers()
    mockCameraInstance.takeSnapshot.mockImplementation(
      () =>
        new Promise((_res, rej) =>
          setTimeout(
            () => rej(new TimeoutError('timeout')),
            CAMERA_SNAPSHOT_TIMEOUT_MS + 1
          )
        )
    )

    const { result } = renderHook(() => useCapturePhoto(cameraRef))

    let returnedUri: string | null = null
    await act(async () => {
      const promise = result.current.capturePhoto()
      jest.advanceTimersByTime(CAMERA_SNAPSHOT_TIMEOUT_MS + 1)
      returnedUri = await promise
    })

    expect(returnedUri).toBeNull()
    expect(result.current.isCapturing).toBe(false)
    expect(result.current.captureError).toMatch(
      /time limit of \d+ milliseconds/
    )
    jest.useRealTimers()
  })

  it('should report an error when snapshot resolves without a path', async () => {
    mockCameraInstance.takeSnapshot.mockResolvedValue({} as any)

    const { result } = renderHook(() => useCapturePhoto(cameraRef))

    let returnedUri: string | null = null
    await act(async () => {
      returnedUri = await result.current.capturePhoto()
    })

    expect(returnedUri).toBeNull()
    expect(result.current.isCapturing).toBe(false)
    expect(result.current.captureError).toBe(
      'Failed to obtain a valid snapshot path'
    )
  })
})
