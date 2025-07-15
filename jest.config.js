import 'react-native-gesture-handler/jestSetup';
/* global jest */

// ----------------- MÓDULOS NATIVE -----------------

jest.mock('react-native-device-info', () => ({
  isEmulatorSync: jest.fn(() => false),
}));

jest.mock('react-native-vision-camera', () => {
  const React = require('react');
  const MockCamera = React.forwardRef((props, ref) =>
    React.createElement(React.Fragment, null, props.children)
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
  default: {
    show: jest.fn(),
    hide: jest.fn(),
  },
}));

jest.mock('react-native-vector-icons/FontAwesome5', () => ({
  __esModule: true,
  default: 'FAIcon',
}));

// ----------------- HOOKS CUSTOM -----------------
// Ajusta la ruta según tu estructura real en src/hooks/...
jest.mock('../src/hooks/useEnsureCameraPermission', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    hasPermission: true,
    requestPermission: jest.fn(),
  })),
}));

jest.mock('../src/hooks/useCapturePhoto', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    capture: jest.fn(),
    loading: false,
  })),
}));

// ----------------- UTILS -----------------
// Si tu archivo se llama detectSimulator.ts en utils:
jest.mock('../src/utils/detectSimulator', () => ({
  __esModule: true,
  isSimulator: jest.fn(() => false),
}));