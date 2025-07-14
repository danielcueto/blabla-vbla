module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: './src/config/.env',
        safe: false,
        allowUndefined: true
      }
    ],
    'react-native-reanimated/plugin'
  ]
}