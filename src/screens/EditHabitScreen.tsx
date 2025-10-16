import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../state/habitStore';
import { getTheme, habitColors } from '../utils/theme';
import { cn } from '../utils/cn';
import ColorPicker from '../components/ColorPicker';

interface EditHabitScreenProps {
  navigation: any;
  route: any;
}

const HABIT_ICONS = [
  'fitness-outline',
  'water-outline',
  'book-outline',
  'musical-notes-outline',
  'bed-outline',
  'restaurant-outline',
  'heart-outline',
  'leaf-outline',
  'barbell-outline',
  'walk-outline',
  'bicycle-outline',
  'car-outline',
  'airplane-outline',
  'phone-portrait-outline',
  'laptop-outline',
  'camera-outline',
  'brush-outline',
  'game-controller-outline',
  'headset-outline',
  'home-outline',
  'business-outline',
  'school-outline',
  'library-outline',
  'medical-outline',
  'cash-outline',
  'gift-outline',
  'star-outline',
  'flash-outline',
  'sunny-outline',
  'moon-outline',
];

const FREQUENCIES = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
];

const EditHabitScreen: React.FC<EditHabitScreenProps> = ({ navigation, route }) => {
  const { habitId } = route.params;
  const { habits, updateHabit, settings } = useHabitStore();
  const theme = getTheme(settings.theme);
  
  const habit = habits.find(h => h.id === habitId);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(habitColors[0]);
  const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0]);
  const [selectedFrequency, setSelectedFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description || '');
      setSelectedColor(habit.color);
      setSelectedIcon(habit.icon);
      setSelectedFrequency(habit.targetFrequency);
    }
  }, [habit]);
  
  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });
    
    return () => {
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, []);
  
  if (!habit) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: theme.background }}>
        <Text style={{ color: theme.text }}>Habit not found</Text>
      </View>
    );
  }
  
  const handleSave = () => {
    if (!name.trim()) return;
    
    updateHabit(habitId, {
      name: name.trim(),
      description: description.trim() || undefined,
      icon: selectedIcon,
      color: selectedColor,
      targetFrequency: selectedFrequency,
    });
    
    navigation.goBack();
  };
  
  const handleCancel = () => {
    navigation.goBack();
  };
  
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  
  return (
    <Pressable 
      className="flex-1" 
      style={{ backgroundColor: theme.background }}
      onPress={dismissKeyboard}
    >
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <Pressable onPress={handleCancel}>
            <Text 
              className="text-lg"
              style={{ color: theme.primary }}
            >
              Cancel
            </Text>
          </Pressable>
          
          <Text 
            className="text-lg font-semibold"
            style={{ color: theme.text }}
          >
            Edit Habit
          </Text>
          
          <Pressable 
            onPress={handleSave}
            disabled={!name.trim()}
            className={cn(
              "px-4 py-2 rounded-full",
              name.trim() ? "" : "opacity-50"
            )}
            style={{ backgroundColor: theme.primary }}
          >
            <Text className="text-white font-medium">Save</Text>
          </Pressable>
        </View>
        
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {/* Preview */}
          <View 
            className="rounded-xl p-4 mb-6"
            style={{ backgroundColor: theme.cardBackground }}
          >
            <View className="flex-row items-center">
              <View 
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: selectedColor + '20' }}
              >
                <Ionicons 
                  name={selectedIcon as any} 
                  size={24} 
                  color={selectedColor} 
                />
              </View>
              
              <View className="flex-1">
                <Text 
                  className="text-lg font-semibold"
                  style={{ color: theme.text }}
                >
                  {name || 'Habit Name'}
                </Text>
                <Text 
                  className="text-sm mt-1"
                  style={{ color: theme.textSecondary }}
                >
                  {description || 'Add description...'}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Form */}
          <View className="space-y-6">
            {/* Name */}
            <View>
              <Text 
                className="text-sm font-medium mb-2"
                style={{ color: theme.text }}
              >
                Habit Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter habit name"
                placeholderTextColor={theme.textTertiary}
                className="text-base p-4 rounded-xl"
                style={{ 
                  backgroundColor: theme.surface,
                  color: theme.text,
                  borderColor: theme.border,
                  borderWidth: 1
                }}
              />
            </View>
            
            {/* Description */}
            <View>
              <Text 
                className="text-sm font-medium mb-2"
                style={{ color: theme.text }}
              >
                Description (Optional)
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Add a description"
                placeholderTextColor={theme.textTertiary}
                multiline
                numberOfLines={3}
                className="text-base p-4 rounded-xl"
                style={{ 
                  backgroundColor: theme.surface,
                  color: theme.text,
                  borderColor: theme.border,
                  borderWidth: 1,
                  textAlignVertical: 'top'
                }}
              />
            </View>
            
            {/* Frequency */}
            <View>
              <Text 
                className="text-sm font-medium mb-3"
                style={{ color: theme.text }}
              >
                Frequency
              </Text>
              <View className="flex-row space-x-3">
                {FREQUENCIES.map((freq) => (
                  <Pressable
                    key={freq.id}
                    onPress={() => setSelectedFrequency(freq.id as any)}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-xl items-center",
                      selectedFrequency === freq.id ? "" : ""
                    )}
                    style={{
                      backgroundColor: selectedFrequency === freq.id 
                        ? theme.primary 
                        : theme.surface,
                      borderColor: theme.border,
                      borderWidth: 1
                    }}
                  >
                    <Text 
                      className="font-medium"
                      style={{
                        color: selectedFrequency === freq.id 
                          ? 'white' 
                          : theme.text
                      }}
                    >
                      {freq.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            
            {/* Color Selection */}
            <View>
              <Text 
                className="text-sm font-medium mb-3"
                style={{ color: theme.text }}
              >
                Color
              </Text>
              <ColorPicker
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
                theme={theme}
              />
            </View>
            
            {/* Icon Selection */}
            {!isKeyboardVisible && (
              <View>
                <Text 
                  className="text-sm font-medium mb-3"
                  style={{ color: theme.text }}
                >
                  Icon
                </Text>
                <View className="flex-row flex-wrap">
                  {HABIT_ICONS.map((icon, index) => (
                    <Pressable
                      key={icon}
                      onPress={() => setSelectedIcon(icon)}
                      className={cn(
                        "w-12 h-12 rounded-xl items-center justify-center m-1",
                        selectedIcon === icon ? "" : ""
                      )}
                      style={{
                        backgroundColor: selectedIcon === icon 
                          ? selectedColor + '20' 
                          : theme.surface,
                        borderColor: selectedIcon === icon 
                          ? selectedColor 
                          : theme.border,
                        borderWidth: 1
                      }}
                    >
                      <Ionicons 
                        name={icon as any} 
                        size={20} 
                        color={selectedIcon === icon ? selectedColor : theme.textSecondary} 
                      />
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
          
          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </Pressable>
  );
};

export default EditHabitScreen;