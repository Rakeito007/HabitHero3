import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colorGroups } from '../utils/theme';

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  theme: any;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  selectedColor, 
  onColorSelect, 
  theme 
}) => {
  const [activeGroup, setActiveGroup] = useState<keyof typeof colorGroups>('vibrant');

  const colorGroupLabels = {
    vibrant: 'Vibrant',
    pastel: 'Pastel',
    muted: 'Muted',
    dark: 'Dark'
  };

  return (
    <View>
      {/* Group Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        <View className="flex-row space-x-1.5">
          {Object.keys(colorGroups).map((group) => (
            <Pressable
              key={group}
              onPress={() => setActiveGroup(group as keyof typeof colorGroups)}
              className="px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: activeGroup === group 
                  ? theme.primary 
                  : theme.surface,
              }}
            >
              <Text 
                className="text-xs font-medium"
                style={{
                  color: activeGroup === group 
                    ? 'white' 
                    : theme.text
                }}
                numberOfLines={1}
              >
                {colorGroupLabels[group as keyof typeof colorGroupLabels]}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Color Grid */}
      <View className="flex-row flex-wrap">
        {colorGroups[activeGroup].map((color) => (
          <Pressable
            key={color}
            onPress={() => onColorSelect(color)}
            className="w-12 h-12 rounded-full items-center justify-center m-1"
            style={{ 
              backgroundColor: color,
              borderWidth: selectedColor === color ? 3 : 1,
              borderColor: selectedColor === color ? theme.text : theme.border
            }}
          >
            {selectedColor === color && (
              <Ionicons 
                name="checkmark" 
                size={20} 
                color={
                  // Use white checkmark for dark colors, dark for light colors
                  activeGroup === 'dark' || 
                  (activeGroup === 'vibrant' && ['#007AFF', '#5856D6', '#191970'].includes(color))
                    ? 'white' 
                    : theme.text
                } 
              />
            )}
          </Pressable>
        ))}
      </View>

      {/* Color Count Info */}
      <View className="mt-3 items-center">
        <Text 
          className="text-xs"
          style={{ color: theme.textTertiary }}
        >
          {colorGroups[activeGroup].length} {colorGroupLabels[activeGroup].toLowerCase()} colors available
        </Text>
      </View>
    </View>
  );
};

export default ColorPicker;