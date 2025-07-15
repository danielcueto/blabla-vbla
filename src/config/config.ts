import { Platform } from 'react-native'
import {
  REACT_NATIVE_API_BASE_URL,
  DEVELOPMENT_ANDROID_API_BASE_URL,
  DEVELOPMENT_IOS_API_BASE_URL,
  NODE_ENV,
  REQUEST_TIMEOUT,
  CAMERA_SNAPSHOT_TIMEOUT,
  ASYNC_OP_TIMEOUT,
  SNAPSHOT_QUALITY,
} from '@env'

/**
 * Elige la URL de desarrollo según la plataforma,
 * ahora ambas vienen de variables de entorno.
 */
function getDefaultDevHost(): string {
  return Platform.OS === 'android'
    ? DEVELOPMENT_ANDROID_API_BASE_URL
    : DEVELOPMENT_IOS_API_BASE_URL
}

/**
 * Base URL para peticiones a la API.
 * - En producción: toma REACT_NATIVE_API_BASE_URL.
 * - En desarrollo: toma la URL adecuada para el emulador/simulador.
 */
export const API_BASE_URL: string = 
  NODE_ENV === 'production'
    ? REACT_NATIVE_API_BASE_URL
    : getDefaultDevHost()

/**
 * Flag si estamos en entorno distinto a producción.
 */
export const IS_DEVELOPMENT_MODE = NODE_ENV !== 'production'

/**
 * Timeouts (milisegundos).
 */
export const REQUEST_TIMEOUT_MS = parseInt(REQUEST_TIMEOUT, 10) || 15000
export const CAMERA_SNAPSHOT_TIMEOUT_MS = parseInt(CAMERA_SNAPSHOT_TIMEOUT, 10) || 8000
export const ASYNC_OPERATION_TIMEOUT_MS = parseInt(ASYNC_OP_TIMEOUT, 10) || 8000

/**
 * Calidad de snapshots de cámara (0–100).
 */
export const CAMERA_SNAPSHOT_QUALITY_PERCENT = parseInt(SNAPSHOT_QUALITY, 10) || 100

/**
 * En producción, forzar HTTPS.
 */
if (NODE_ENV === 'production' && !API_BASE_URL.startsWith('https://')) {
  throw new Error(
    '[config] API_BASE_URL must start with "https://" in production mode.'
  )
}
