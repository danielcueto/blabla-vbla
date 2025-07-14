// src/config/config.ts
import { Platform } from 'react-native'

/**
 * Default host for development.
 * - Android emulator: http://10.0.2.2:3000
 * - iOS simulator:   http://localhost:3000
 */
const DEFAULT_DEVELOPMENT_HOST = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000'
  : 'http://localhost:3000'

/**
 * Base URL for API requests.
 * In production, set REACT_NATIVE_API_BASE_URL in your environment variables.
 * Falls back to DEFAULT_DEVELOPMENT_HOST in development.
 */
export const API_BASE_URL: string =
  process.env.REACT_NATIVE_API_BASE_URL ?? DEFAULT_DEVELOPMENT_HOST

/**
 * Indicates whether the app is running in development mode.
 * Useful for enabling debug logs or mock data.
 */
export const IS_DEVELOPMENT_MODE: boolean =
  process.env.NODE_ENV !== 'production'

/**
 * Global request timeout in milliseconds.
 */
export const REQUEST_TIMEOUT_MILLISECONDS = 15_000

/**
 * Maximum time to wait for a camera snapshot, in milliseconds.
 */
export const CAMERA_SNAPSHOT_TIMEOUT_MILLISECONDS = 8_000

/**
 * Default timeout for generic async operations, in milliseconds.
 */
export const ASYNC_OPERATION_TIMEOUT_MILLISECONDS = 8_000

/**
 * Quality percentage for camera snapshots (0–100).
 */
export const CAMERA_SNAPSHOT_QUALITY_PERCENT = 100

// Optional: enforce HTTPS in production
if (!IS_DEVELOPMENT_MODE && !API_BASE_URL.startsWith('https://')) {
  throw new Error(
    '[config] API_BASE_URL must start with "https://" in production'
  )
}
