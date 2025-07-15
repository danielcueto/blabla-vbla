declare module '@env' {
  export const REACT_NATIVE_API_BASE_URL: string;
  export const DEVELOPMENT_ANDROID_API_BASE_URL: string;
  export const DEVELOPMENT_IOS_API_BASE_URL: string;
  export const NODE_ENV: 'development' | 'production';
  export const REQUEST_TIMEOUT: string;
  export const CAMERA_SNAPSHOT_TIMEOUT: string;
  export const ASYNC_OP_TIMEOUT: string;
  export const SNAPSHOT_QUALITY: string;
  export const GALLERY_PICK_TIMEOUT_MS: string;
  export const EDGE_BUTTON_SIZE: string;
  export const CONTROLS_VERTICAL_OFFSET_RATIO: string;
}
