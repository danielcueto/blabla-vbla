import { Platform } from 'react-native';
import {
  REACT_NATIVE_API_BASE_URL,
  DEVELOPMENT_ANDROID_API_BASE_URL,
  DEVELOPMENT_IOS_API_BASE_URL,
  NODE_ENV,
  REQUEST_TIMEOUT,
  CAMERA_SNAPSHOT_TIMEOUT,
  ASYNC_OP_TIMEOUT,
  SNAPSHOT_QUALITY,
  GALLERY_PICK_TIMEOUT_MS as GALLERY_PICK_TIMEOUT_MS_STRING,
  EDGE_BUTTON_SIZE as EDGE_BUTTON_SIZE_STRING,
  CONTROLS_VERTICAL_OFFSET_RATIO as CONTROLS_VERTICAL_OFFSET_RATIO_STRING,
} from '@env';

/**
 * Selects the development host URL based on the platform.
 */
function getDefaultDevHost(): string {
  return Platform.OS === 'android'
    ? DEVELOPMENT_ANDROID_API_BASE_URL
    : DEVELOPMENT_IOS_API_BASE_URL;
}

/**
 * Base URL for API requests.
 * Uses production URL in production mode, otherwise the dev host.
 */
export const API_BASE_URL: string =
  NODE_ENV === 'production'
    ? REACT_NATIVE_API_BASE_URL
    : getDefaultDevHost();

/**
 * Flag indicating development mode.
 */
export const IS_DEVELOPMENT_MODE: boolean = NODE_ENV !== 'production';

/**
 * Global request timeout (ms).
 */
export const REQUEST_TIMEOUT_MS: number =
  parseInt(REQUEST_TIMEOUT, 10) || 15000;

/**
 * Camera snapshot timeout (ms).
 */
export const CAMERA_SNAPSHOT_TIMEOUT_MS: number =
  parseInt(CAMERA_SNAPSHOT_TIMEOUT, 10) || 8000;

/**
 * Generic async operation timeout (ms).
 */
export const ASYNC_OPERATION_TIMEOUT_MS: number =
  parseInt(ASYNC_OP_TIMEOUT, 10) || 8000;

/**
 * Camera snapshot quality percentage (0–100).
 */
export const CAMERA_SNAPSHOT_QUALITY_PERCENT: number =
  parseInt(SNAPSHOT_QUALITY, 10) || 100;

/**
 * Gallery picker timeout (ms), from env.
 */
export const GALLERY_PICK_TIMEOUT_MS: number =
  Number(GALLERY_PICK_TIMEOUT_MS_STRING) || 3000;

/**
 * Allowed photo MIME types.
 */
export const VALID_PHOTO_MIME_TYPES: string[] = [
  'image/jpeg',
  'image/png',
];

/**
 * Size (px) for edge buttons like gallery & placeholder.
 */
export const EDGE_BUTTON_SIZE: number =
  Number(EDGE_BUTTON_SIZE_STRING) || 48;

/**
 * Vertical offset ratio for bottom controls (fraction of height).
 */
export const CONTROLS_VERTICAL_OFFSET_RATIO: number =
  Number(CONTROLS_VERTICAL_OFFSET_RATIO_STRING) || 0.08;

// Enforce HTTPS in production
if (NODE_ENV === 'production' && !API_BASE_URL.startsWith('https://')) {
  throw new Error(
    '[config] API_BASE_URL must start with "https://" in production mode.'
  );
}
