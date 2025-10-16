import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreenExpo from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import RootNavigator from "./src/navigation/RootNavigator";
import { useHabitStore } from "./src/state/habitStore";
import { getTheme } from "./src/utils/theme";
import NotificationManager from "./src/components/NotificationManager";
import SplashScreen from "./src/components/SplashScreen";
import { simpleSecurityManager } from "./src/security/SimpleSecurityManager";
import ErrorBoundary from "./src/components/ErrorBoundary";

// Keep the native splash screen visible while we load resources
SplashScreenExpo.preventAutoHideAsync();

/*
IMPORTANT NOTICE: DO NOT REMOVE
There are already environment keys in the project. 
Before telling the user to add them, check if you already have access to the required keys through bash.
Directly access them with process.env.${key}

Correct usage:
process.env.EXPO_PUBLIC_VIBECODE_{key}
//directly access the key

Incorrect usage:
import { OPENAI_API_KEY } from '@env';
//don't use @env, its depreicated

Incorrect usage:
import Constants from 'expo-constants';
const openai_api_key = Constants.expoConfig.extra.apikey;
//don't use expo-constants, its depreicated

*/

export default function App() {
  const { settings } = useHabitStore();
  const theme = getTheme(settings.theme);
  const [securityInitialized, setSecurityInitialized] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  
  // Load Ionicons font using useFonts hook
  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
  });

  // Handle font loading error
  useEffect(() => {
    if (fontError) {
      console.error("Font loading error:", fontError);
      // Continue anyway - fonts might still work
    }
  }, [fontError]);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize security
        await simpleSecurityManager.initialize();
        setSecurityInitialized(true);
        
        // Wait minimum time for splash
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Initialize sample data if needed
        if (settings.hasCompletedOnboarding) {
          const { initializeSampleData } = await import("./src/utils/sampleData");
          initializeSampleData();
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, [settings.hasCompletedOnboarding]);

  // Safety timeout: if fonts don't load after 10 seconds, proceed anyway
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!fontsLoaded && !appIsReady) {
        console.warn("Font loading timeout - proceeding anyway");
        setAppIsReady(true);
      }
    }, 10000);
    
    return () => clearTimeout(timeout);
  }, [fontsLoaded, appIsReady]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      // Hide the splash screen once app is ready and fonts are loaded
      await SplashScreenExpo.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  // Show splash screen while loading
  // Only require appIsReady and securityInitialized - fonts can load in background
  if (!appIsReady || !securityInitialized) {
    return <SplashScreen theme={theme} />;
  }
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <NavigationContainer>
          <NotificationManager>
            <ErrorBoundary>
              <RootNavigator />
            </ErrorBoundary>
          </NotificationManager>
          <StatusBar style={settings.theme === "light" ? "dark" : "light"} />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
