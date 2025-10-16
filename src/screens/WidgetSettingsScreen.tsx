import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  Alert,
  Linking,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../state/habitStore';
import { getTheme } from '../utils/theme';
import { widgetService } from '../services/widgetService';

interface WidgetSettingsScreenProps {
  navigation: any;
}

const WidgetSettingsScreen: React.FC<WidgetSettingsScreenProps> = ({ navigation }) => {
  const { habits, settings } = useHabitStore();
  const theme = getTheme(settings.theme);
  const [widgetData, setWidgetData] = useState<any>(null);
  const [isWidgetSupported, setIsWidgetSupported] = useState(false);

  useEffect(() => {
    checkWidgetSupport();
    loadWidgetData();
  }, []);

  const checkWidgetSupport = () => {
    const supported = widgetService.isWidgetSupported();
    setIsWidgetSupported(supported);
  };

  const loadWidgetData = async () => {
    try {
      const data = await widgetService.getWidgetData();
      setWidgetData(data);
    } catch (error) {
      console.error('Failed to load widget data:', error);
    }
  };

  const handleUpdateWidget = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const todayEntries: { [habitId: string]: boolean } = {};
      
      // Get today's entries for all habits
      habits.forEach(habit => {
        const entry = useHabitStore.getState().getHabitEntry(habit.id, today);
        todayEntries[habit.id] = entry?.completed || false;
      });

      await widgetService.updateWidgetData(habits, todayEntries);
      await loadWidgetData();
      
      Alert.alert(
        'Widget Updated',
        'Your widget has been updated with the latest habit data.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to update widget:', error);
      Alert.alert(
        'Update Failed',
        'Unable to update widget. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleOpenWidgetSettings = () => {
    if (Platform.OS === 'ios') {
      // Open iOS Settings to add widget
      Linking.openURL('App-prefs:root=General&path=ManagedConfigurationList');
    }
  };

  const handleAddWidgetInstructions = () => {
    Alert.alert(
      'How to Add Widget',
      '1. Long press on your home screen\n2. Tap the "+" button in the top corner\n3. Search for "Habit Hero"\n4. Select the widget size you prefer\n5. Tap "Add Widget"',
      [{ text: 'Got it!' }]
    );
  };

  const renderWidgetPreview = () => {
    if (!widgetData) return null;

    return (
      <View className="p-4 rounded-xl mb-4" style={{ backgroundColor: theme.surface }}>
        <Text className="text-lg font-semibold mb-3" style={{ color: theme.text }}>
          Widget Preview
        </Text>
        
        <View className="p-3 rounded-lg" style={{ backgroundColor: theme.background }}>
          <Text className="text-sm font-medium mb-2" style={{ color: theme.text }}>
            Today's Habits
          </Text>
          
          {widgetData.habits.slice(0, 3).map((habit: any) => (
            <View key={habit.id} className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center flex-1">
                <View 
                  className="w-6 h-6 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: habit.color + '20' }}
                >
                  <Ionicons 
                    name={habit.icon as any} 
                    size={12} 
                    color={habit.color} 
                  />
                </View>
                <Text className="text-sm flex-1" style={{ color: theme.text }}>
                  {habit.name}
                </Text>
              </View>
              
              <View 
                className="w-6 h-6 rounded-full items-center justify-center"
                style={{ 
                  backgroundColor: widgetData.todayEntries[habit.id] ? habit.color : theme.border 
                }}
              >
                {widgetData.todayEntries[habit.id] && (
                  <Ionicons name="checkmark" size={12} color="white" />
                )}
              </View>
            </View>
          ))}
          
          {widgetData.habits.length > 3 && (
            <Text className="text-xs mt-2" style={{ color: theme.textSecondary }}>
              +{widgetData.habits.length - 3} more habits
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (!isWidgetSupported) {
    return (
      <View className="flex-1" style={{ backgroundColor: theme.background }}>
        <SafeAreaView className="flex-1">
          <View className="flex-row items-center justify-between px-6 py-4 border-b" style={{ borderBottomColor: theme.border }}>
            <Pressable onPress={() => navigation.goBack()} className="p-2">
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </Pressable>
            <Text className="text-lg font-semibold" style={{ color: theme.text }}>
              Widget Settings
            </Text>
            <View style={{ width: 32 }} />
          </View>
          
          <View className="flex-1 items-center justify-center px-6">
            <Ionicons name="phone-portrait-outline" size={64} color={theme.textSecondary} />
            <Text className="text-xl font-semibold mt-4 mb-2" style={{ color: theme.text }}>
              Widgets Not Supported
            </Text>
            <Text className="text-center text-base" style={{ color: theme.textSecondary }}>
              Widgets are only available on iOS devices. Please use an iPhone or iPad to access this feature.
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b" style={{ borderBottomColor: theme.border }}>
          <Pressable onPress={() => navigation.goBack()} className="p-2">
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </Pressable>
          <Text className="text-lg font-semibold" style={{ color: theme.text }}>
            Widget Settings
          </Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView className="flex-1 px-6 py-4">
          {/* Widget Status */}
          <View className="p-4 rounded-xl mb-6" style={{ backgroundColor: theme.surface }}>
            <View className="flex-row items-center mb-3">
              <Ionicons name="phone-portrait" size={24} color={theme.primary} />
              <Text className="text-lg font-semibold ml-3" style={{ color: theme.text }}>
                iOS Widget
              </Text>
            </View>
            
            <Text className="text-sm mb-4" style={{ color: theme.textSecondary }}>
              Add a Habit Hero widget to your home screen for quick habit tracking without opening the app.
            </Text>

            {widgetData && (
              <View className="flex-row items-center mb-3">
                <Ionicons name="checkmark-circle" size={20} color={theme.success} />
                <Text className="text-sm ml-2" style={{ color: theme.success }}>
                  Widget data is up to date
                </Text>
              </View>
            )}
          </View>

          {/* Widget Preview */}
          {renderWidgetPreview()}

          {/* Actions */}
          <View className="space-y-3">
            <Pressable
              onPress={handleUpdateWidget}
              className="py-4 px-6 rounded-xl items-center"
              style={{ backgroundColor: theme.primary }}
            >
              <Text className="text-white font-semibold text-base">
                Update Widget Data
              </Text>
            </Pressable>

            <Pressable
              onPress={handleAddWidgetInstructions}
              className="py-4 px-6 rounded-xl items-center border"
              style={{ 
                backgroundColor: theme.surface,
                borderColor: theme.border
              }}
            >
              <Text className="font-semibold text-base" style={{ color: theme.text }}>
                How to Add Widget
              </Text>
            </Pressable>

            <Pressable
              onPress={handleOpenWidgetSettings}
              className="py-4 px-6 rounded-xl items-center border"
              style={{ 
                backgroundColor: theme.surface,
                borderColor: theme.border
              }}
            >
              <Text className="font-semibold text-base" style={{ color: theme.text }}>
                Open iOS Settings
              </Text>
            </Pressable>
          </View>

          {/* Widget Features */}
          <View className="mt-8 p-4 rounded-xl" style={{ backgroundColor: theme.surface }}>
            <Text className="text-lg font-semibold mb-3" style={{ color: theme.text }}>
              Widget Features
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={20} color={theme.success} />
                <Text className="text-sm ml-3" style={{ color: theme.text }}>
                  Quick habit completion tracking
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={20} color={theme.success} />
                <Text className="text-sm ml-3" style={{ color: theme.text }}>
                  View today's progress at a glance
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={20} color={theme.success} />
                <Text className="text-sm ml-3" style={{ color: theme.text }}>
                  Automatic updates every 15 minutes
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={20} color={theme.success} />
                <Text className="text-sm ml-3" style={{ color: theme.text }}>
                  Multiple widget sizes available
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default WidgetSettingsScreen;
