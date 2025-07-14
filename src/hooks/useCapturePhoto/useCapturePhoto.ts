import { useState } from 'react'
import type { RefObject } from 'react'
import { Camera } from 'react-native-vision-camera'
import { withTimeout } from '../../utils/withTimeout'
import {
  CAMERA_SNAPSHOT_TIMEOUT_MILLISECONDS,
  CAMERA_SNAPSHOT_QUALITY_PERCENT,
} from '../../config/config'

/**
 * Result of using useCapturePhoto.
 *
 * @property capturePhoto     Function that captures a photo and returns its URI or null.
 * @property isCapturing      True while a capture operation is in progress.
 * @property captureError     Error message if capture failed, else null.
 */
export interface CapturePhotoResult {
  capturePhoto: () => Promise<string | null>
  isCapturing: boolean
  captureError: string | null
}

/**
 * Hook that captures a photo using the Vision Camera component.
 *
 * @param cameraReference  A RefObject pointing to the Camera component instance.
 * @returns                An object with:
 *   - capturePhoto:    Async function returning the file URI or null on error.
 *   - isCapturing:     Boolean flag indicating capture in progress.
 *   - captureError:    Last error message, or null if none.
 */
export default function useCapturePhoto(
  cameraReference: RefObject<Camera | null>
): CapturePhotoResult {
  const [isCapturing, setIsCapturing] = useState(false)
  const [captureError, setCaptureError] = useState<string | null>(null)

  async function capturePhoto(): Promise<string | null> {
    setIsCapturing(true)
    setCaptureError(null)

    try {
      const cameraInstance = cameraReference.current
      if (!cameraInstance) {
        throw new Error('Camera component reference is not available')
      }

      const photoSnapshot = await withTimeout(
        cameraInstance.takeSnapshot({ quality: CAMERA_SNAPSHOT_QUALITY_PERCENT }),
        CAMERA_SNAPSHOT_TIMEOUT_MILLISECONDS
      )

      if (!photoSnapshot?.path) {
        throw new Error('Failed to obtain a valid snapshot path')
      }

      return `file://${photoSnapshot.path}`
    } catch (error: unknown) {
      const message = error instanceof Error
        ? error.message
        : 'An unexpected error occurred during photo capture'
      setCaptureError(message)
      return null
    } finally {
      setIsCapturing(false)
    }
  }

  return {
    capturePhoto,
    isCapturing,
    captureError,
  }
}
