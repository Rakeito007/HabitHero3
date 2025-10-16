import React, { useRef, useMemo, useCallback } from 'react';
import { View, Text, Pressable, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { Habit } from '../types/habit';
import { useHabitStore } from '../state/habitStore';
import HabitGridChart from './HabitGridChart';
import { showSuccessNotification, showHabitNotification } from './NotificationManager';

interface SwipeableHabitCardProps {
  habit: Habit;
  theme: any;
  onPress?: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
  showChart?: boolean;
}

const SwipeableHabitCard: React.FC<SwipeableHabitCardProps> = ({ 
  habit, 
  theme, 
  onPress, 
  onEdit,
  onArchive,
  showChart = true,
}) => {
  const { getHabitStats, toggleHabitEntry, getHabitEntry, deleteHabit, entries } = useHabitStore();
  
  // Ensure we re-render when entries change
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayEntry = useMemo(() => getHabitEntry(habit.id, today), [habit.id, today, entries]);
  const isCompletedToday = useMemo(() => todayEntry?.completed || false, [todayEntry]);
  const stats = useMemo(() => getHabitStats(habit.id), [habit.id, entries]);
  
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  
  const handleToggleToday = useCallback(() => {
    // Toggle habit completion
    
    const wasCompleted = isCompletedToday;
    
    try {
      toggleHabitEntry(habit.id, today);
      
      if (!wasCompleted) {
        // Small delay to ensure state is updated before getting new stats
        setTimeout(() => {
          const newStats = getHabitStats(habit.id);
          showHabitNotification(
            'Great job!',
            `${habit.name} completed! Current streak: ${newStats.currentStreak + 1}`,
            habit.color
          );
        }, 100);
      }
    } catch (error) {
      console.error('Failed to toggle habit entry:', error);
    }
  }, [habit.id, habit.name, habit.color, today, isCompletedToday, toggleHabitEntry, getHabitStats]);

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const handleStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX: translation, velocityX } = event.nativeEvent;
      
      // Determine if swipe is significant enough for delete
      const shouldDelete = translation < -120 || (translation < -50 && velocityX < -500);
      
      if (shouldDelete) {
        // Animate to delete position
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: -400,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          confirmDelete();
        });
      } else {
        // Snap back to original position
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
          Animated.spring(opacity, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
        ]).start();
      }
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            // Reset animation
            translateX.setValue(0);
            opacity.setValue(1);
            scale.setValue(1);
          },
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteHabit(habit.id);
            showSuccessNotification(
              'Habit Deleted',
              `${habit.name} has been removed from your habits.`
            );
          },
        },
      ]
    );
  };

  // Calculate swipe progress for delete indicator
  const deleteIndicatorOpacity = translateX.interpolate({
    inputRange: [-200, -80, 0],
    outputRange: [1, 0.6, 0],
    extrapolate: 'clamp',
  });

  const deleteIndicatorScale = translateX.interpolate({
    inputRange: [-200, -80, 0],
    outputRange: [1.2, 0.8, 0.5],
    extrapolate: 'clamp',
  });

  const handleCardPress = useCallback(() => {
    if (onPress) {
      onPress();
    }
  }, [onPress]);

  return (
    <View className="mb-4">{/* Delete Background */}
      <Animated.View
        className="absolute right-0 top-0 bottom-0 flex-row items-center justify-end px-6 rounded-xl"
        style={{
          backgroundColor: theme.error,
          opacity: deleteIndicatorOpacity,
          left: 0,
        }}
      >
        <Animated.View
          className="items-center"
          style={{
            transform: [{ scale: deleteIndicatorScale }],
          }}
        >
          <Ionicons name="trash-outline" size={28} color="white" />
          <Text className="text-white text-xs font-medium mt-1">Delete</Text>
        </Animated.View>
      </Animated.View>

      {/* Main Card */}
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleStateChange}
        activeOffsetX={[-30, 30]}
        failOffsetY={[-20, 20]}
        minPointers={1}
        maxPointers={1}
      >
        <Animated.View
          style={{
            transform: [{ translateX }, { scale }],
            opacity,
          }}
        >
          <Pressable
            onPress={handleCardPress}
            className="rounded-xl p-4"
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
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ 
                  backgroundColor: 'transparent',
                  zIndex: 10,
                }}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              >
                <View
                  className="w-8 h-8 rounded-full items-center justify-center"
                  style={{ 
                    backgroundColor: isCompletedToday ? habit.color : theme.border,
                  }}
                >
                  {isCompletedToday && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
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
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default SwipeableHabitCard;