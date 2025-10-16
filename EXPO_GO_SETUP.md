# Expo Go Development Setup

This Habit Hero app has been configured for Expo Go compatibility. Follow these steps to run the app in Expo Go.

## Prerequisites

1. Install Expo Go app on your mobile device:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Ensure you have Node.js and bun installed on your development machine.

## Development Commands

### Start Development Server
```bash
# Start with Expo Go (recommended for development)
bun run start:go

# Start with cache cleared
bun run start:go-clear

# Standard start (shows QR code for Expo Go)
bun run start

# Clear cache and start
bun run start:clear
```

### Health Checks
```bash
# Check for compatibility issues
bun run doctor

# Check dependency versions
bun run check-deps
```

## Connecting to Expo Go

1. Start the development server:
   ```bash
   bun run start:go
   ```

2. On your mobile device:
   - **iOS**: Open Camera app and scan the QR code
   - **Android**: Open Expo Go app and scan the QR code

3. The app will load in Expo Go on your device

## Features Available in Expo Go

✅ **Working Features:**
- Habit tracking and management
- Dashboard with statistics
- Settings and theme switching
- Navigation between screens
- Data persistence with AsyncStorage
- Notifications (basic)
- Camera access (via expo-camera)
- Audio recording (via expo-av)

❌ **Removed for Expo Go Compatibility:**
- Custom native security checks
- Advanced chart libraries (Victory Native)
- Native vision camera features
- MMKV storage
- Skia graphics
- iOS-specific native modules

## Troubleshooting

### Common Issues

1. **Metro bundler cache issues**
   ```bash
   bun run start:clear
   ```

2. **Dependency version conflicts**
   ```bash
   bun run check-deps
   npx expo install --fix
   ```

3. **Asset loading issues**
   - Ensure all assets are in the correct format
   - Check that asset paths in app.json are correct

4. **Network connectivity**
   - Ensure your development machine and mobile device are on the same network
   - Try using tunnel mode: `npx expo start --tunnel`

### Development Tips

- Use the shake gesture in Expo Go to access the developer menu
- Enable "Fast Refresh" for instant code updates
- Use the console in your development environment to see logs
- Test on both iOS and Android devices when possible

## Production Build

When ready for production, you'll need to create a development build or use EAS Build:

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure and build
eas build:configure
eas build --platform all
```

## Environment Variables

The app uses environment variables for API keys. In Expo Go, these are loaded from the `.env` file in the project root.

Make sure to set:
- `EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY`
- `EXPO_PUBLIC_VIBECODE_ANTHROPIC_API_KEY`
- Other API keys as needed

## Support

If you encounter issues:
1. Check the Expo Go logs in the app
2. Review the Metro bundler output
3. Run `bun run doctor` to check for configuration issues
4. Consult the [Expo documentation](https://docs.expo.dev/)