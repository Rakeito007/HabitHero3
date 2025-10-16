import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Habit } from '../types/habit';

// App Group identifier for sharing data between app and widget
const APP_GROUP_ID = 'group.com.vibecode.habithero';

interface WidgetData {
  habits: Habit[];
  todayEntries: { [habitId: string]: boolean };
  lastUpdated: string;
}

class WidgetService {
  private static instance: WidgetService;
  
  public static getInstance(): WidgetService {
    if (!WidgetService.instance) {
      WidgetService.instance = new WidgetService();
    }
    return WidgetService.instance;
  }

  /**
   * Update widget data with current habits and today's entries
   */
  async updateWidgetData(habits: Habit[], todayEntries: { [habitId: string]: boolean }) {
    try {
      if (Platform.OS !== 'ios') {
        console.warn('Widgets only supported on iOS');
        return;
      }

      const widgetData: WidgetData = {
        habits: habits.filter(habit => !habit.archived).slice(0, 5), // Limit to 5 habits for widget
        todayEntries,
        lastUpdated: new Date().toISOString()
      };

      // Store in AsyncStorage for widget access
      await AsyncStorage.setItem('@habit_hero_widget_data', JSON.stringify(widgetData));
      
      // Also store in shared group preferences if available
      await this.storeInSharedGroup(widgetData);
      
      console.log('Widget data updated successfully');
    } catch (error) {
      console.error('Failed to update widget data:', error);
    }
  }

  /**
   * Store data in shared app group (for widget access)
   */
  private async storeInSharedGroup(data: WidgetData) {
    try {
      // This would use react-native-shared-group-preferences in a real implementation
      // For now, we'll use AsyncStorage as a fallback
      await AsyncStorage.setItem('@habit_hero_shared_data', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to store in shared group:', error);
    }
  }

  /**
   * Get widget data for display
   */
  async getWidgetData(): Promise<WidgetData | null> {
    try {
      const data = await AsyncStorage.getItem('@habit_hero_widget_data');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get widget data:', error);
      return null;
    }
  }

  /**
   * Toggle habit completion from widget
   */
  async toggleHabitFromWidget(habitId: string): Promise<boolean> {
    try {
      // This would trigger the main app to update the habit
      // In a real implementation, you'd use App Groups and UserDefaults
      const today = new Date().toISOString().split('T')[0];
      
      // Store the toggle request for the main app to process
      await AsyncStorage.setItem('@habit_hero_widget_toggle', JSON.stringify({
        habitId,
        date: today,
        timestamp: Date.now()
      }));

      return true;
    } catch (error) {
      console.error('Failed to toggle habit from widget:', error);
      return false;
    }
  }

  /**
   * Get today's completion status for a habit
   */
  async getTodayCompletionStatus(habitId: string): Promise<boolean> {
    try {
      const data = await this.getWidgetData();
      return data?.todayEntries[habitId] || false;
    } catch (error) {
      console.error('Failed to get completion status:', error);
      return false;
    }
  }

  /**
   * Get habits for widget display
   */
  async getHabitsForWidget(): Promise<Habit[]> {
    try {
      const data = await this.getWidgetData();
      return data?.habits || [];
    } catch (error) {
      console.error('Failed to get habits for widget:', error);
      return [];
    }
  }

  /**
   * Check if widget is available on this device
   */
  isWidgetSupported(): boolean {
    return Platform.OS === 'ios';
  }

  /**
   * Get widget configuration options
   */
  getWidgetConfig() {
    return {
      appGroupId: APP_GROUP_ID,
      widgetName: 'Habit Hero',
      widgetDescription: 'Track your daily habits',
      supportedSizes: ['small', 'medium', 'large'],
      updateInterval: 15 * 60 * 1000, // 15 minutes
    };
  }
}

export const widgetService = WidgetService.getInstance();
