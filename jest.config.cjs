module.exports = {
  preset: 'react-native',
  setupFiles: [
    'react-native-gesture-handler/jestSetup.js',
    '<rootDir>/src/jest-setup.js'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-gesture-handler)/)'
  ],
  moduleFileExtensions: ['ts','tsx','js','jsx','json','node'],
  moduleNameMapper: {
    '^@env$': '<rootDir>/src/jest-setup.js'
  }
};