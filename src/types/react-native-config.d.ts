declare module 'react-native-config' {
  export interface NativeConfig {
    REACT_NATIVE_API_BASE_URL?: string;
    DEVELOPMENT_ANDROID_API_BASE_URL?: string;
    DEVELOPMENT_IOS_API_BASE_URL?: string;
    NODE_ENV?: string;
    REQUEST_TIMEOUT?: string;
    CAMERA_SNAPSHOT_TIMEOUT?: string;
    ASYNC_OP_TIMEOUT?: string;
    SNAPSHOT_QUALITY?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
