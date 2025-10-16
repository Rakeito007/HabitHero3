import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  Modal, 
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit } from '../types/habit';
import { useHabitStore } from '../state/habitStore';
import { getTheme } from '../utils/theme';

interface HabitCalendarModalProps {
  visible: boolean;
  habit: Habit | null;
  onClose: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onShare: () => void;
}

const { height: screenHeight } = Dimensions.get('window');

const HabitCalendarModal: React.FC<HabitCalendarModalProps> = ({
  visible,
  habit,
  onClose,
  onEdit,
  onArchive,
  onShare
}) => {
  const { settings } = useHabitStore();
  const theme = getTheme(settings.theme);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  if (!habit) return null;

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const getNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const isDateCompleted = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const entry = useHabitStore.getState().getHabitEntry(habit.id, dateString);
    return entry?.completed || false;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  }

  const handleArchive = () => {
    Alert.alert(
      'Archive Habit',
      `Are you sure you want to archive "${habit.name}"? You can restore it later from settings.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Archive', 
          style: 'destructive',
          onPress: onArchive
        }
      ]
    );
  };

  const handleShare = () => {
    const stats = useHabitStore.getState().getHabitStats(habit.id);
    const shareText = `I've been working on "${habit.name}" and have a ${stats.currentStreak} day streak! 🎉\n\nTrack your habits with Habit Hero!`;
    
    // In a real implementation, you'd use expo-sharing here
    Alert.alert(
      'Share Progress',
      shareText,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: onShare }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        {/* Backdrop */}
        <Pressable 
          className="flex-1" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={onClose}
        />
        
        {/* Modal Content */}
        <View 
          className="rounded-t-3xl"
          style={{ 
            backgroundColor: theme.background,
            maxHeight: screenHeight * 0.8,
            minHeight: screenHeight * 0.6
          }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b" style={{ borderBottomColor: theme.border }}>
            <View className="flex-row items-center">
              <View 
                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: habit.color + '20' }}
              >
                <Ionicons 
                  name={habit.icon as any} 
                  size={16} 
                  color={habit.color} 
                />
              </View>
              <View>
                <Text className="text-lg font-semibold" style={{ color: theme.text }}>
                  {habit.name}
                </Text>
                <Text className="text-sm" style={{ color: theme.textSecondary }}>
                  {habit.description}
                </Text>
              </View>
            </View>
            
            <Pressable onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </Pressable>
          </View>

          {/* Action Buttons */}
          <View className="flex-row items-center justify-around p-4 border-b" style={{ borderBottomColor: theme.border }}>
            <Pressable 
              onPress={onEdit}
              className="flex-row items-center px-4 py-2 rounded-xl"
              style={{ backgroundColor: theme.surface }}
            >
              <Ionicons name="pencil" size={18} color={theme.text} />
              <Text className="text-sm font-medium ml-2" style={{ color: theme.text }}>
                Edit
              </Text>
            </Pressable>

            <Pressable 
              onPress={handleArchive}
              className="flex-row items-center px-4 py-2 rounded-xl"
              style={{ backgroundColor: theme.surface }}
            >
              <Ionicons name="trash" size={18} color={theme.text} />
              <Text className="text-sm font-medium ml-2" style={{ color: theme.text }}>
                Archive
              </Text>
            </Pressable>

            <Pressable 
              onPress={handleShare}
              className="flex-row items-center px-4 py-2 rounded-xl"
              style={{ backgroundColor: theme.surface }}
            >
              <Ionicons name="share" size={18} color={theme.text} />
              <Text className="text-sm font-medium ml-2" style={{ color: theme.text }}>
                Share
              </Text>
            </Pressable>
          </View>

          {/* Calendar */}
          <ScrollView className="flex-1">
            <View className="p-6">
              {/* Month Navigation */}
              <View className="flex-row items-center justify-between mb-6">
                <Pressable onPress={getPreviousMonth} className="p-2">
                  <Ionicons name="chevron-back" size={24} color={theme.text} />
                </Pressable>
                
                <Text className="text-xl font-bold" style={{ color: theme.text }}>
                  {getMonthName(currentMonth)}
                </Text>
                
                <Pressable onPress={getNextMonth} className="p-2">
                  <Ionicons name="chevron-forward" size={24} color={theme.text} />
                </Pressable>
              </View>

              {/* Calendar Grid */}
              <View>
                {/* Day Headers */}
                <View className="flex-row mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <View key={day} className="flex-1 items-center py-2">
                      <Text className="text-sm font-medium" style={{ color: theme.textSecondary }}>
                        {day}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Calendar Days */}
                <View className="flex-row flex-wrap">
                  {days.map((date, index) => {
                    if (!date) {
                      return <View key={index} className="w-[14.28%] aspect-square" />;
                    }

                    const completed = isDateCompleted(date);
                    const today = isToday(date);

                    return (
                      <Pressable
                        key={index}
                        className="w-[14.28%] aspect-square items-center justify-center"
                        onPress={() => {
                          // Toggle completion for this date
                          const dateString = date.toISOString().split('T')[0];
                          useHabitStore.getState().toggleHabitEntry(habit.id, dateString);
                        }}
                      >
                        <View
                          className="w-8 h-8 rounded-full items-center justify-center"
                          style={{
                            backgroundColor: completed ? habit.color : 'transparent',
                            borderWidth: today ? 2 : 0,
                            borderColor: today ? habit.color : 'transparent'
                          }}
                        >
                          <Text
                            className="text-sm font-medium"
                            style={{
                              color: completed ? 'white' : (today ? habit.color : theme.text)
                            }}
                          >
                            {date.getDate()}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default HabitCalendarModal;
