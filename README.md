# AssureSnaps 
##  Getting Started

### Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **React Native CLI**: `npm install -g react-native-cli`
- **Android Studio** (for Android development)
- **Xcode** (for iOS development - macOS only)
- **CocoaPods** (for iOS dependencies): `gem install cocoapods`

### 📱 Platform Setup

#### Android Setup
1. Install Android Studio
2. Configure Android SDK (API level 31 or higher)
3. Create an Android Virtual Device (AVD) or connect a physical device
4. Enable USB Debugging on your device

#### iOS Setup (macOS only)
1. Install Xcode from App Store
2. Install Xcode Command Line Tools: `xcode-select --install`
3. Install CocoaPods: `gem install cocoapods`

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd app
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Install iOS dependencies** (iOS only)
   ```bash
   cd ios
   pod install
   cd ..
   ```

## ⚙️ Environment Configuration

### Environment Variables Setup

1. **Create environment file**
   ```bash
   # Copy the example file and rename it
   cp src/config/.env.example src/config/.env
   # On Windows: copy src/config/.env.example src/config/.env
   ```

2. **Configure environment variables**
   Edit your `src/config/.env` file with your specific values:

   ```env
   # API Configuration
   # Main API base URL for production
   REACT_NATIVE_API_BASE_URL=https://your-api-server.com/api

   # Development URLs for different platforms
   DEVELOPMENT_ANDROID_API_BASE_URL=http://10.0.2.2:3000/api
   DEVELOPMENT_IOS_API_BASE_URL=http://localhost:3000/api

   # Environment Configuration
   NODE_ENV=development

   # Timeout Settings (in milliseconds)
   REQUEST_TIMEOUT=10000
   CAMERA_SNAPSHOT_TIMEOUT=5000
   ASYNC_OP_TIMEOUT=8000

   # Camera Settings
   SNAPSHOT_QUALITY=0.8
   ```

### Environment File Structure

```
app/
├── src/
│   ├── config/
│   │   ├── .env                    # Main environment file (DO NOT COMMIT)
│   │   ├── .env.example           # Example file (commit to repo)
│   │   └── config.ts              # Configuration loader
```

### Important Notes

- **Android Emulator**: Use `10.0.2.2` instead of `localhost` for API calls
- **iOS Simulator**: Use `localhost` for local development
- **Physical Devices**: Use your computer's IP address (e.g., `192.168.1.100:3000/api`)


## 🏃‍♂️ Running the Application

### Development Mode

#### Start Metro Bundler
```bash
npm start
# or
yarn start
```

#### Run on Android
```bash
npm run android
# or
yarn android
```

#### Run on iOS
```bash
npm run ios
# or
yarn ios
```

### Production Build

#### Android APK
```bash
cd android
./gradlew assembleRelease
```

#### iOS Archive
```bash
cd ios
xcodebuild -workspace AssuresoftSnaps.xcworkspace -scheme AssuresoftSnaps archive
```

## 🧪 Testing

### Run All Tests
```bash
npm test
# or
yarn test
```

## Troubleshooting

### Common Issues

#### Metro bundler issues
```bash
# Clear cache
npm start -- --reset-cache
# or
yarn start --reset-cache
```

#### Android build issues
```bash
cd android
./gradlew clean
cd ..
npm run android
```

#### iOS build issues
```bash
cd ios
pod install
cd ..
npm run ios
```

#### Environment variables not loading
- Ensure `.env` file is in the `src/config/` directory
- Restart Metro bundler after changing environment variables
- Check that variable names match exactly (case-sensitive)


## 📋 Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Metro bundler |
| `npm run android` | Run on Android device/emulator |
| `npm run ios` | Run on iOS device/simulator |
| `npm test` | Run tests |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
