module.exports = {
  preset: 'react-native',
  setupFiles: [
    '<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js',
    '<rootDir>/src/jest-setup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(' +
    '@react-native|' +
    'react-native|' +
    '@react-navigation|' +
    'react-native-toast-message|' +
    'react-native-vision-camera|' +
    'react-native-gesture-handler|' +
    'react-native-vector-icons|' +
    '@testing-library/react-hooks' + 
    ')/)',
  ],
  moduleNameMapper: {
    '^react-native-gesture-handler/jestSetup$': '<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js',
  },

};
