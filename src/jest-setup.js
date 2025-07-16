require('react-native-gesture-handler/jestSetup.js');
/* global jest */
jest.mock('react-native-reanimated', () => ({
  default: {
    View: 'Animated.View',
    Text: 'Animated.Text',
    ScrollView: 'Animated.ScrollView',
    createAnimatedComponent: (component) => component,
  },
  useSharedValue: jest.fn(() => ({ value: 0 })),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn((value) => value),
  withSpring: jest.fn((value) => value),
  withDecay: jest.fn((value) => value),
  runOnJS: jest.fn((fn) => fn),
  interpolate: jest.fn(),
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));
// Mock de variables de entorno (@env)
jest.mock('@env', () => ({
  REACT_NATIVE_API_BASE_URL: 'http://localhost:3000',
  DEVELOPMENT_ANDROID_API_BASE_URL: 'http://localhost:3000',
  DEVELOPMENT_IOS_API_BASE_URL: 'http://localhost:3000',
  NODE_ENV: 'development',
  REQUEST_TIMEOUT: '15000',
  CAMERA_SNAPSHOT_TIMEOUT: '8000',
  ASYNC_OP_TIMEOUT: '8000',
  SNAPSHOT_QUALITY: '100',
  GALLERY_PICK_TIMEOUT_MS: '3000',
  EDGE_BUTTON_SIZE: '48',
  CONTROLS_VERTICAL_OFFSET_RATIO: '0.08',
}));
// ----------------- MÓDULOS NATIVE -----------------
jest.mock('react-native-device-info', () => ({
  isEmulatorSync: jest.fn(() => false),
}));
jest.mock('react-native-vision-camera', () => {
  const React = require('react');
  const MockCamera = React.forwardRef((props, ref) =>
    React.createElement(React.Fragment, null, props.children),
  );
  MockCamera.displayName = 'MockCamera';
  return {
    __esModule: true,
    Camera: MockCamera,
    useCameraDevices: jest.fn(() => ({ back: {}, front: {} })),
    useFrameProcessor: jest.fn(),
  };
});
jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: { show: jest.fn(), hide: jest.fn() },
}));
jest.mock('react-native-vector-icons/FontAwesome5', () => ({
  __esModule: true,
  default: 'FAIcon',
}));
jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: 'FontAwesomeIcon',
}));
jest.mock('@fortawesome/free-solid-svg-icons', () => ({
  faEye: {},
  faEyeSlash: {},
}));
// ----------------- UTILS -----------------
jest.mock('./utils/detectSimulator', () => ({
  __esModule: true,
  isSimulator: jest.fn(() => false),
}));
