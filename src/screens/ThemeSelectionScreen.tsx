import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../state/habitStore';
import { getTheme } from '../utils/theme';
import { ThemeMode } from '../types/habit';

interface ThemeSelectionScreenProps {
  navigation: any;
}

const ThemeSelectionScreen: React.FC<ThemeSelectionScreenProps> = ({ navigation }) => {
  const { settings, updateSettings } = useHabitStore();
  const theme = getTheme(settings.theme);

  const themeOptions: { value: ThemeMode; label: string }[] = [
    { value: 'system', label: 'System' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];

  const handleThemeSelect = (themeMode: ThemeMode) => {
    updateSettings({ theme: themeMode });
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center -ml-2"
          >
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </Pressable>
          
          <Text
            className="text-xl font-bold"
            style={{ color: theme.text }}
          >
            Theme
          </Text>
          
          <View className="w-10" />
        </View>

        {/* Content */}
        <View className="px-6 pt-4">
          <Text
            className="text-sm font-semibold mb-3"
            style={{ color: theme.textSecondary }}
          >
            Mode
          </Text>

          <View
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: theme.cardBackground }}
          >
            {themeOptions.map((option, index) => (
              <Pressable
                key={option.value}
                onPress={() => handleThemeSelect(option.value)}
                className="flex-row items-center justify-between px-5 py-4"
                style={{
                  borderBottomWidth: index < themeOptions.length - 1 ? 1 : 0,
                  borderBottomColor: theme.border,
                }}
              >
                <Text
                  className="text-base font-medium"
                  style={{ color: theme.text }}
                >
                  {option.label}
                </Text>

                {settings.theme === option.value && (
                  <View
                    className="w-6 h-6 rounded-full items-center justify-center"
                    style={{ backgroundColor: theme.primary }}
                  >
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ThemeSelectionScreen;
