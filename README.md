# React Native Cross-Platform Template

A template for building React Native apps that work on Web, iOS, and Android using Expo.

## Features

- ✅ Expo Router for navigation
- ✅ TypeScript support
- ✅ Cross-platform compatibility (Web, iOS, Android)
- ✅ Tab navigation
- ✅ Modal support
- ✅ Dark/Light theme support
- ✅ Responsive design

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app (for testing on mobile)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

### Running on Different Platforms

#### Web
```bash
npm run web
```
Opens the app in your default browser at http://localhost:8081

#### iOS
```bash
npm run ios
```
Requires:
- macOS
- Xcode
- iOS Simulator

Or use the Expo Go app on your iOS device:
1. Install Expo Go from the App Store
2. Scan the QR code from the terminal

#### Android
```bash
npm run android
```
Requires:
- Android Studio
- Android SDK

Or use the Expo Go app on your Android device:
1. Install Expo Go from the Play Store
2. Scan the QR code from the terminal

## Project Structure

```
├── app/              # Expo Router pages and layouts
│   ├── (tabs)/       # Tab navigation screens
│   ├── _layout.tsx   # Root layout
│   └── +html.tsx     # Web HTML entry point
├── assets/           # Images, fonts, and icons
├── components/       # Reusable UI components
├── constants/        # App constants (colors, sizes, etc.)
├── src/              # Additional source code
│   ├── components/   # Custom components
│   ├── screens/      # Screen components
│   ├── services/     # API and data services
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   └── types/        # TypeScript type definitions
├── app.json          # Expo configuration
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run in web browser

## Platform-Specific Considerations

### Web
- Uses Metro bundler
- Generates static files for production
- Responsive design using flexbox

### Mobile
- Uses native navigation
- Supports gestures and animations
- Access to native device features

## Adding New Screens

1. Create a new file in `app/(tabs)/` for tab screens
2. Create a new file in `app/` for standalone screens
3. Export and configure the screen in the appropriate layout file

## Using Platform-Specific Code

```typescript
import { Platform } from 'react-native';

const styles = {
  container: {
    padding: Platform.OS === 'web' ? 20 : 10,
  },
};
```

## Build for Production

### Web
```bash
npx expo export -p web
```

### Mobile
```bash
npx expo build:android
npx expo build:ios
```

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/)

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License