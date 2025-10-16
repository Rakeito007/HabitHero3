import React, { useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../state/habitStore';
import { getTheme } from '../utils/theme';
import SwipeableHabitCard from '../components/SwipeableHabitCard';
import SwipeHint from '../components/SwipeHint';
import { useProFeatures } from '../utils/proFeatures';

interface DashboardScreenProps {
  navigation: any;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { habits, settings } = useHabitStore();
  const theme = useMemo(() => getTheme(settings.theme), [settings.theme]);
  const [showSwipeHint, setShowSwipeHint] = React.useState(false);
  const [showAnalytics, setShowAnalytics] = React.useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);
  
  // Memoize expensive filtering and sorting - MOVED UP
  const activeHabits = useMemo(() => 
    habits
      .filter(habit => !habit.archived)
      .sort((a, b) => a.order - b.order),
    [habits]
  );
  
  const { canAccessAnalytics, canAddUnlimitedHabits, maxHabitsForFree } = useProFeatures();
  

  
  // Calculate detailed analytics data
  const analyticsData = useMemo(() => {
    const totalHabits = activeHabits.length;
    const { entries } = useHabitStore.getState();
    const today = new Date().toISOString().split('T')[0];
    const completedToday = entries.filter(e => e.completed && e.date === today).length;
    
    // Calculate date ranges
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    
    // Weekly and monthly data
    const weekEntries = entries.filter(e => new Date(e.date) >= weekAgo);
    const monthEntries = entries.filter(e => new Date(e.date) >= monthAgo);
    const weeklyRate = weekEntries.length > 0 ? 
      Math.round((weekEntries.filter(e => e.completed).length / weekEntries.length) * 100) : 0;
    const monthlyRate = monthEntries.length > 0 ? 
      Math.round((monthEntries.filter(e => e.completed).length / monthEntries.length) * 100) : 0;
    
    // Streak calculations
    let totalStreaks = 0;
    let longestStreak = 0;
    let activeStreaks = 0;
    const habitStats: Array<{
      name: string;
      currentStreak: number;
      completionRate: number;
      color: string;
    }> = [];
    
    activeHabits.forEach(habit => {
      const stats = useHabitStore.getState().getHabitStats(habit.id);
      totalStreaks += stats.currentStreak;
      longestStreak = Math.max(longestStreak, stats.longestStreak);
      if (stats.currentStreak > 0) activeStreaks++;
      
      habitStats.push({
        name: habit.name,
        currentStreak: stats.currentStreak,
        completionRate: stats.completionRate,
        color: habit.color
      });
    });
    
    // Last 7 days completion pattern
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const dayEntries = entries.filter(e => e.date === dateString);
      const completed = dayEntries.filter(e => e.completed).length;
      const total = Math.max(dayEntries.length, totalHabits);
      
      last7Days.push({
        date: dateString,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      });
    }
    
    // Best and worst performing habits
    const sortedHabits = [...habitStats].sort((a, b) => b.completionRate - a.completionRate);
    const bestHabit = sortedHabits[0];
    const worstHabit = sortedHabits[sortedHabits.length - 1];
    
    // Total completed entries
    const totalCompletedEntries = entries.filter(e => e.completed).length;
    
    return {
      // Basic stats
      totalHabits,
      completedToday,
      totalStreaks,
      completionRate: totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0,
      
      // Extended stats
      weeklyRate,
      monthlyRate,
      longestStreak,
      activeStreaks,
      totalCompletedEntries,
      
      // Habit performance
      habitStats: sortedHabits,
      bestHabit,
      worstHabit,
      
      // Timeline data
      last7Days
    };
  }, [activeHabits]);

  // Show swipe hint for new users
  React.useEffect(() => {
    if (activeHabits.length > 0) {
      const timer = setTimeout(() => setShowSwipeHint(true), 500);
      return () => clearTimeout(timer);
    }
  }, [activeHabits.length]);
    
  const handleAddHabit = useCallback(() => {
    if (canAddUnlimitedHabits || activeHabits.length < maxHabitsForFree) {
      navigation.navigate('AddHabit');
    } else {
      setShowUpgradeModal(true);
    }
  }, [navigation, canAddUnlimitedHabits, activeHabits.length, maxHabitsForFree]);
  
  const handleAnalyticsPress = useCallback(() => {
    if (canAccessAnalytics) {
      setShowAnalytics(true);
    } else {
      setShowUpgradeModal(true);
    }
  }, [canAccessAnalytics]);
  
  const handleHabitPress = useCallback((habitId: string) => {
    navigation.navigate('HabitDetail', { habitId });
  }, [navigation]);
  
  const handleSettingsPress = useCallback(() => {
    navigation.navigate('Settings', { showSubscriptionPlans: false });
  }, [navigation]);
  

  
  const handleProPress = useCallback(() => {
    navigation.navigate('Settings', { showSubscriptionPlans: true });
  }, [navigation]);
  

  
  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-6">
          <View>
            <Text 
              className="text-2xl font-bold"
              style={{ color: theme.text }}
            >
              Habit Hero
            </Text>
          </View>
          
          <View className="flex-row">
            <Pressable
              onPress={handleProPress}
              className="px-3 py-1.5 rounded-full items-center justify-center mr-4"
              style={{ 
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: '#fff'
              }}
            >
              <Text className="text-xs font-bold" style={{ color: '#fff' }}>
                PRO
              </Text>
            </Pressable>
            
            <Pressable
              onPress={handleAnalyticsPress}
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ 
                backgroundColor: '#000',
                borderWidth: 1,
                borderColor: '#fff',
                opacity: canAccessAnalytics ? 1 : 0.6
              }}
            >
              <Ionicons 
                name="bar-chart-outline" 
                size={18} 
                color="#fff" 
              />
              {!canAccessAnalytics && (
                <View 
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full items-center justify-center"
                  style={{ backgroundColor: '#FFD700' }}
                >
                  <Ionicons name="lock-closed" size={8} color="#000" />
                </View>
              )}
            </Pressable>
            
            <Pressable
              onPress={handleSettingsPress}
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: theme.surface }}
            >
              <Ionicons 
                name="settings-outline" 
                size={20} 
                color={theme.text} 
              />
            </Pressable>
            
            <Pressable
              onPress={handleAddHabit}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: '#000' }}
            >
              <Ionicons name="add" size={24} color="white" />
            </Pressable>
          </View>
        </View>
        
        {/* Habits List */}
        <ScrollView 
          className="flex-1 px-6 pt-4" 
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
        >
          {/* Show swipe hint for first-time users */}
          {activeHabits.length > 0 && (
            <SwipeHint theme={theme} visible={showSwipeHint} />
          )}
          {activeHabits.length === 0 ? (
                <View className="items-center justify-center py-20">
                  <Ionicons 
                    name="leaf-outline" 
                    size={64} 
                    color={theme.textTertiary} 
                  />
                  <Text 
                    className="text-lg font-medium mt-4 mb-2"
                    style={{ color: theme.text }}
                  >
                    No habits yet
                  </Text>
                  <Text 
                    className="text-center px-8 mb-6"
                    style={{ color: theme.textSecondary }}
                  >
                    Start building better habits by adding your first one
                  </Text>
                  
                  <Pressable
                    onPress={handleAddHabit}
                    className="px-8 py-3 rounded-full"
                    style={{ backgroundColor: '#000' }}
                  >
                    <Text className="text-white font-medium text-center">
                      Add Your First Habit
                    </Text>
                  </Pressable>
                </View>
          ) : (
            <>
              {activeHabits.map((habit) => (
                <SwipeableHabitCard
                  key={habit.id}
                  habit={habit}
                  theme={theme}
                  onPress={() => handleHabitPress(habit.id)}
                />
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
      
      {/* Analytics Modal */}
      <Modal
        visible={showAnalytics}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAnalytics(false)}
      >
        <View className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <View 
            className="flex-1 mt-16 rounded-t-3xl"
            style={{ backgroundColor: '#fff' }}
          >
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View className="flex-row items-center justify-between p-6 pb-4">
                <View>
                  <Text className="text-2xl font-bold" style={{ color: '#000' }}>
                    Analytics
                  </Text>
                  <Text className="text-sm" style={{ color: '#666' }}>
                    Your habit insights
                  </Text>
                </View>
                <Pressable
                  onPress={() => setShowAnalytics(false)}
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: '#f8f8f8' }}
                >
                  <Ionicons name="close" size={20} color="#000" />
                </Pressable>
              </View>
              
              {/* Quick Stats */}
              <View className="px-6 mb-6">
                <Text className="text-lg font-semibold mb-3" style={{ color: '#000' }}>
                  Overview
                </Text>
                <View className="flex-row flex-wrap justify-between">
                  <View className="w-[48%] p-4 rounded-xl mb-3" style={{ backgroundColor: '#000' }}>
                    <Text className="text-2xl font-bold" style={{ color: '#fff' }}>
                      {analyticsData.completedToday}/{analyticsData.totalHabits}
                    </Text>
                    <Text className="text-sm" style={{ color: '#ccc' }}>
                      Today's Progress
                    </Text>
                  </View>
                  
                  <View className="w-[48%] p-4 rounded-xl mb-3" style={{ backgroundColor: '#f8f8f8' }}>
                    <Text className="text-2xl font-bold" style={{ color: '#000' }}>
                      {analyticsData.completionRate}%
                    </Text>
                    <Text className="text-sm" style={{ color: '#666' }}>
                      Daily Rate
                    </Text>
                  </View>
                  
                  <View className="w-[48%] p-4 rounded-xl" style={{ backgroundColor: '#f8f8f8' }}>
                    <Text className="text-2xl font-bold" style={{ color: '#000' }}>
                      {analyticsData.longestStreak}
                    </Text>
                    <Text className="text-sm" style={{ color: '#666' }}>
                      Best Streak
                    </Text>
                  </View>
                  
                  <View className="w-[48%] p-4 rounded-xl" style={{ backgroundColor: '#f8f8f8' }}>
                    <Text className="text-2xl font-bold" style={{ color: '#000' }}>
                      {analyticsData.totalCompletedEntries}
                    </Text>
                    <Text className="text-sm" style={{ color: '#666' }}>
                      Total Done
                    </Text>
                  </View>
                </View>
              </View>
              
              {/* 7-Day Progress Chart */}
              <View className="px-6 mb-6">
                <Text className="text-lg font-semibold mb-3" style={{ color: '#000' }}>
                  Last 7 Days
                </Text>
                <View 
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: '#f8f8f8' }}
                >
                  <View className="flex-row items-end justify-between h-20">
                    {analyticsData.last7Days.map((day, index) => (
                      <View key={index} className="items-center flex-1">
                        <View 
                          className="w-6 rounded-t mb-2"
                          style={{ 
                            height: Math.max(day.percentage * 0.6, 4),
                            backgroundColor: day.percentage === 100 ? '#000' : '#ccc'
                          }}
                        />
                        <Text className="text-xs" style={{ color: '#666' }}>
                          {day.day}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <View className="flex-row justify-between mt-2">
                    <Text className="text-xs" style={{ color: '#666' }}>
                      Week: {analyticsData.weeklyRate}%
                    </Text>
                    <Text className="text-xs" style={{ color: '#666' }}>
                      Month: {analyticsData.monthlyRate}%
                    </Text>
                  </View>
                </View>
              </View>
              
              {/* Habit Performance */}
              <View className="px-6 mb-6">
                <Text className="text-lg font-semibold mb-3" style={{ color: '#000' }}>
                  Habit Performance
                </Text>
                {analyticsData.habitStats.slice(0, 5).map((habit, index) => (
                  <View 
                    key={index}
                    className="flex-row items-center justify-between p-3 rounded-xl mb-2"
                    style={{ backgroundColor: '#f8f8f8' }}
                  >
                    <View className="flex-row items-center flex-1">
                      <View 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: habit.color }}
                      />
                      <Text className="flex-1 font-medium" style={{ color: '#000' }}>
                        {habit.name}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-sm mr-2" style={{ color: '#666' }}>
                        {habit.completionRate}%
                      </Text>
                      <View className="flex-row items-center">
                        <Ionicons name="flame" size={14} color="#ff6b35" />
                        <Text className="text-sm ml-1" style={{ color: '#000' }}>
                          {habit.currentStreak}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
              
              {/* Performance Insights */}
              {analyticsData.bestHabit && analyticsData.worstHabit && (
                <View className="px-6 mb-6">
                  <Text className="text-lg font-semibold mb-3" style={{ color: '#000' }}>
                    Insights
                  </Text>
                  
                  <View className="p-4 rounded-xl mb-3" style={{ backgroundColor: '#e8f5e8' }}>
                    <Text className="font-semibold mb-1" style={{ color: '#2d5a2d' }}>
                      🎯 Top Performer
                    </Text>
                    <Text className="text-sm" style={{ color: '#2d5a2d' }}>
                      {analyticsData.bestHabit.name} is crushing it with {analyticsData.bestHabit.completionRate}% completion rate!
                    </Text>
                  </View>
                  
                  {analyticsData.worstHabit.completionRate < 50 && (
                    <View className="p-4 rounded-xl mb-3" style={{ backgroundColor: '#fff3e0' }}>
                      <Text className="font-semibold mb-1" style={{ color: '#8b4513' }}>
                        💡 Room for Growth
                      </Text>
                      <Text className="text-sm" style={{ color: '#8b4513' }}>
                        Consider breaking down "{analyticsData.worstHabit.name}" into smaller steps.
                      </Text>
                    </View>
                  )}
                  
                  <View className="p-4 rounded-xl" style={{ backgroundColor: '#f0f8ff' }}>
                    <Text className="font-semibold mb-1" style={{ color: '#1e3a8a' }}>
                      📈 Progress Update
                    </Text>
                    <Text className="text-sm" style={{ color: '#1e3a8a' }}>
                      You have {analyticsData.activeStreaks} active streaks going. Keep up the momentum!
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Upgrade Required Modal */}
      <Modal
        visible={showUpgradeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUpgradeModal(false)}
      >
        <View className="flex-1 items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <View 
            className="mx-6 p-6 rounded-2xl"
            style={{ backgroundColor: '#fff' }}
          >
            <View className="items-center mb-6">
              <View 
                className="w-16 h-16 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: '#FFD700' }}
              >
                <Ionicons name="lock-closed" size={32} color="#000" />
              </View>
              <Text className="text-2xl font-bold text-center" style={{ color: '#000' }}>
                PRO Feature
              </Text>
              <Text className="text-sm text-center mt-2" style={{ color: '#666' }}>
                {!canAccessAnalytics && showAnalytics ? 'Detailed Analytics' : 
                 !canAddUnlimitedHabits ? `Habit Limit (${activeHabits.length}/${maxHabitsForFree})` : 
                 'Premium Feature'}
              </Text>
            </View>
            
            <View className="mb-6">
              <Text className="text-base font-medium mb-3" style={{ color: '#000' }}>
                ✨ Unlock with PRO:
              </Text>
              <View className="space-y-2">
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
                  <Text className="ml-2 text-sm" style={{ color: '#000' }}>
                    Unlimited habits
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
                  <Text className="ml-2 text-sm" style={{ color: '#000' }}>
                    Detailed analytics & insights
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
                  <Text className="ml-2 text-sm" style={{ color: '#000' }}>
                    Data export & backup
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
                  <Text className="ml-2 text-sm" style={{ color: '#000' }}>
                    Priority support
                  </Text>
                </View>
              </View>
            </View>
            
            <View className="flex-row space-x-3">
              <Pressable
                onPress={() => setShowUpgradeModal(false)}
                className="flex-1 py-3 rounded-full"
                style={{ backgroundColor: '#f5f5f5' }}
              >
                <Text className="text-center font-medium" style={{ color: '#000' }}>
                  Maybe Later
                </Text>
              </Pressable>
              
              <Pressable
                onPress={() => {
                  setShowUpgradeModal(false);
                  navigation.navigate('Settings', { showSubscriptionPlans: true });
                }}
                className="flex-1 py-3 rounded-full"
                style={{ backgroundColor: '#000' }}
              >
                <Text className="text-center font-bold" style={{ color: '#fff' }}>
                  Upgrade Now
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DashboardScreen;