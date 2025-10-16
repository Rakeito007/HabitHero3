import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit } from '../types/habit';
import { useHabitStore } from '../state/habitStore';
import HabitGridChart from './HabitGridChart';
import { showHabitNotification } from './NotificationManager';

interface HabitCardProps {
  habit: Habit;
  theme: any;
  onPress?: () => void;
  showChart?: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  theme, 
  onPress, 
  showChart = true 
}) => {
  const { getHabitStats, toggleHabitEntry, getHabitEntry } = useHabitStore();
  const stats = getHabitStats(habit.id);
  
  const today = new Date().toISOString().split('T')[0];
  const todayEntry = getHabitEntry(habit.id, today);
  const isCompletedToday = todayEntry?.completed || false;
  
  const handleToggleToday = () => {
    const wasCompleted = isCompletedToday;
    toggleHabitEntry(habit.id, today);
    
    // Show notification when habit is completed
    if (!wasCompleted) {
      const newStats = getHabitStats(habit.id);
      showHabitNotification(
        'Great job!',
        `${habit.name} completed! Current streak: ${newStats.currentStreak + 1}`,
        habit.color
      );
    }
  };
  
  return (
    <Pressable
      onPress={onPress}
      className="rounded-xl p-4 mb-4"
      style={{ backgroundColor: theme.cardBackground }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View 
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: habit.color + '20' }}
          >
            <Ionicons 
              name={habit.icon as any} 
              size={20} 
              color={habit.color} 
            />
          </View>
          
          <View className="flex-1">
            <Text 
              className="text-lg font-semibold"
              style={{ color: theme.text }}
            >
              {habit.name}
            </Text>
            {habit.description && (
              <Text 
                className="text-sm mt-1"
                style={{ color: theme.textSecondary }}
              >
                {habit.description}
              </Text>
            )}
          </View>
        </View>
        
        <Pressable
          onPress={handleToggleToday}
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{ 
            backgroundColor: isCompletedToday ? habit.color : theme.border 
          }}
        >
          {isCompletedToday && (
            <Ionicons name="checkmark" size={16} color="white" />
          )}
        </Pressable>
      </View>
      
      {/* Stats */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <View className="items-center mr-6">
            <Text 
              className="text-lg font-bold"
              style={{ color: theme.text }}
            >
              {stats.currentStreak}
            </Text>
            <Text 
              className="text-xs"
              style={{ color: theme.textSecondary }}
            >
              Current
            </Text>
          </View>
          
          <View className="items-center mr-6">
            <Text 
              className="text-lg font-bold"
              style={{ color: theme.text }}
            >
              {stats.longestStreak}
            </Text>
            <Text 
              className="text-xs"
              style={{ color: theme.textSecondary }}
            >
              Best
            </Text>
          </View>
          
          <View className="items-center">
            <Text 
              className="text-lg font-bold"
              style={{ color: theme.text }}
            >
              {stats.completionRate}%
            </Text>
            <Text 
              className="text-xs"
              style={{ color: theme.textSecondary }}
            >
              Success
            </Text>
          </View>
        </View>
      </View>
      
      {/* Grid Chart - fills entire bottom section */}
      {showChart && (
        <View className="mt-2 -mx-4 -mb-4 p-3" style={{ backgroundColor: theme.surface }}>
          <HabitGridChart 
            habit={habit} 
            theme={theme} 
            compact={true}
            showLabels={false}
          />
        </View>
      )}
    </Pressable>
  );
};

export default HabitCard;