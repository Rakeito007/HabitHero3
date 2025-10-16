import React, { useState } from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabitStore } from '../state/habitStore';

interface SplashScreenProps {
  theme: any;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ theme }) => {
  // Built-in placeholder logo to avoid asset issues until real PNGs are uploaded
  const defaultLogoDataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAIUlEQVR4nO3BMQEAAADCoPdPbQ43oAAAAAAAAAAAAAAAAPgGi58AATkKYY0AAAAASUVORK5CYII=";
  const { settings } = useHabitStore();

  const logoLight = require("../../assets/app-logo-light.png");
  const logoDark = require("../../assets/app-logo-dark.png");
  const logoDefault = require("../../assets/app-logo.png");
  const logoUrl = "https://images.composerapi.com/9502E08E-BC5B-4061-9B37-A17FE8DC753F.jpg";
  const [displaySource, setDisplaySource] = useState<any>({ uri: logoUrl });
  const [usedDefaultOnce, setUsedDefaultOnce] = useState(false);

  React.useEffect(() => {
    setDisplaySource({ uri: logoUrl });
    setUsedDefaultOnce(false);
  }, [settings.theme]);

  return (
    <SafeAreaView 
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: theme.background }}
    >
      <View className="items-center">
        {/* App Logo */}
          <View 
          className="w-40 h-40 rounded-3xl items-center justify-center mb-6"
          style={{ backgroundColor: theme.surface }}
        >
          <Image
            source={displaySource}
            style={{ width: 160, height: 160, borderRadius: 24 }}
            resizeMode="contain"
            onError={() => {
              if (!usedDefaultOnce) {
                setDisplaySource(logoDefault);
                setUsedDefaultOnce(true);
              } else {
                setDisplaySource({ uri: defaultLogoDataUri } as any);
              }
            }}
          />
        </View>
        
        {/* App Name */}
        <Text 
          className="text-3xl font-bold mb-2"
          style={{ color: theme.text }}
        >
          Habit Hero
        </Text>
        
        <Text 
          className="text-lg mb-8"
          style={{ color: theme.textSecondary }}
        >
          Building Better Habits
        </Text>
        
        {/* Loading Indicator */}
        <ActivityIndicator 
          size="large" 
          color={theme.primary}
        />
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
