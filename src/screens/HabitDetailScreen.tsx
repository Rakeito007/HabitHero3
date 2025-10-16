import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../state/habitStore';
import { getTheme } from '../utils/theme';
import HabitGridChart from '../components/HabitGridChart';
import HabitInsights from '../components/HabitInsights';

interface HabitDetailScreenProps {
  navigation: any;
  route: any;
}

const HabitDetailScreen: React.FC<HabitDetailScreenProps> = ({ navigation, route }) => {
  const { habitId } = route.params;
  const { habits, entries, getHabitStats, deleteHabit, updateHabit, settings } = useHabitStore();
  const theme = getTheme(settings.theme);
  
  const habit = habits.find(h => h.id === habitId);
  const stats = habit ? getHabitStats(habit.id) : null;
  
  if (!habit || !stats) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: theme.background }}>
        <Text style={{ color: theme.text }}>Habit not found</Text>
      </View>
    );
  }
  
  const handleEdit = () => {
    navigation.navigate('EditHabit', { habitId });
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteHabit(habitId);
            navigation.goBack();
          },
        },
      ]
    );
  };
  
  const handleArchive = () => {
    updateHabit(habitId, { archived: !habit.archived });
    navigation.goBack();
  };
  
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Unknown';
    }
    
    // Use a more reliable date formatting method
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    };
    
    try {
      return dateObj.toLocaleDateString('en-US', options);
    } catch (error) {
      // Fallback formatting if toLocaleDateString fails
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
    }
  };
  
  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </Pressable>
          
          <View className="flex-row">
            <Pressable
              onPress={handleEdit}
              className="w-10 h-10 rounded-full items-center justify-center mr-2"
              style={{ backgroundColor: theme.surface }}
            >
              <Ionicons name="pencil-outline" size={20} color={theme.text} />
            </Pressable>
            
            <Pressable
              onPress={handleDelete}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: theme.surface }}
            >
              <Ionicons name="trash-outline" size={20} color={theme.error} />
            </Pressable>
          </View>
        </View>
        
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Habit Info */}
          <View className="px-6 pb-6">
            <View className="flex-row items-center mb-4">
              <View 
                className="w-16 h-16 rounded-full items-center justify-center mr-4 flex-shrink-0"
                style={{ backgroundColor: habit.color + '20' }}
              >
                <Ionicons 
                  name={habit.icon as any} 
                  size={32} 
                  color={habit.color} 
                />
              </View>
              
              <View className="flex-1 min-w-0">
                <Text 
                  className="text-2xl font-bold"
                  style={{ color: theme.text }}
                  numberOfLines={2}
                >
                  {habit.name}
                </Text>
                {habit.description && (
                  <Text 
                    className="text-base mt-1"
                    style={{ color: theme.textSecondary }}
                    numberOfLines={3}
                  >
                    {habit.description}
                  </Text>
                )}
                <Text 
                  className="text-sm mt-1 capitalize"
                  style={{ color: theme.textTertiary }}
                  numberOfLines={2}
                >
                  {habit.targetFrequency} • Created {formatDate(habit.createdAt)}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Statistics */}
          <View 
            className="mx-6 rounded-xl mb-6 overflow-hidden"
            style={{ backgroundColor: theme.cardBackground }}
          >
            <View className="p-6">
              <Text 
                className="text-lg font-semibold mb-4"
                style={{ color: theme.text }}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                Statistics
              </Text>
              
              <View className="flex-row justify-between">
                <View className="items-center flex-1">
                  <Text 
                    className="text-2xl font-bold"
                    style={{ color: habit.color }}
                    numberOfLines={1}
                  >
                    {stats.currentStreak}
                  </Text>
                  <Text 
                    className="text-sm mt-1 text-center"
                    style={{ color: theme.textSecondary }}
                    numberOfLines={1}
                  >
                    Current
                  </Text>
                </View>
                
                <View className="items-center flex-1">
                  <Text 
                    className="text-2xl font-bold"
                    style={{ color: theme.text }}
                    numberOfLines={1}
                  >
                    {stats.longestStreak}
                  </Text>
                  <Text 
                    className="text-sm mt-1 text-center"
                    style={{ color: theme.textSecondary }}
                    numberOfLines={1}
                  >
                    Best
                  </Text>
                </View>
                
                <View className="items-center flex-1">
                  <Text 
                    className="text-2xl font-bold"
                    style={{ color: theme.text }}
                    numberOfLines={1}
                  >
                    {stats.totalCompletions}
                  </Text>
                  <Text 
                    className="text-sm mt-1 text-center"
                    style={{ color: theme.textSecondary }}
                    numberOfLines={1}
                  >
                    Total
                  </Text>
                </View>
                
                <View className="items-center flex-1">
                  <Text 
                    className="text-2xl font-bold"
                    style={{ color: theme.text }}
                    numberOfLines={1}
                  >
                    {stats.completionRate}%
                  </Text>
                  <Text 
                    className="text-sm mt-1 text-center"
                    style={{ color: theme.textSecondary }}
                    numberOfLines={1}
                  >
                    Success
                  </Text>
                </View>
              </View>
              
              {stats.lastCompleted && (
                <View className="mt-4 pt-4" style={{ borderTopColor: theme.border, borderTopWidth: 1 }}>
                  <Text 
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                    numberOfLines={1}
                  >
                    Last completed: {formatDate(stats.lastCompleted)}
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Chart */}
          <View 
            className="mx-6 rounded-xl mb-6 overflow-hidden"
            style={{ backgroundColor: theme.cardBackground }}
          >
            <View className="p-4 pb-2">
              <Text 
                className="text-lg font-semibold"
                style={{ color: theme.text }}
                numberOfLines={1}
              >
                Activity Chart
              </Text>
              <Text 
                className="text-sm mt-1"
                style={{ color: theme.textSecondary }}
                numberOfLines={2}
              >
                Your progress over time
              </Text>
            </View>
            
            <View className="px-4 pb-4">
              <HabitGridChart 
                habit={habit} 
                theme={theme} 
                compact={false}
                showLabels={true}
                noPadding={true}
              />
            </View>
          </View>
          
          {/* AI Insights */}
          <View className="mx-6 mb-6">
            <HabitInsights 
              habit={habit}
              entries={entries.filter(e => e.habitId === habit.id)}
              theme={theme}
            />
          </View>
          
          {/* Actions */}
          <View className="px-6 pb-6">
            <Pressable
              onPress={handleArchive}
              className="flex-row items-center justify-center py-4 px-6 rounded-xl mb-3"
              style={{ backgroundColor: theme.surface }}
            >
              <Ionicons 
                name={habit.archived ? "folder-open-outline" : "archive-outline"} 
                size={20} 
                color={theme.text} 
                style={{ marginRight: 8 }}
              />
              <Text 
                className="text-base font-medium flex-1"
                style={{ color: theme.text }}
                numberOfLines={1}
              >
                {habit.archived ? 'Unarchive Habit' : 'Archive Habit'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HabitDetailScreen;