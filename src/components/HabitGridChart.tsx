import React, { useState } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { useHabitStore } from '../state/habitStore';
import { Habit, HabitGridData } from '../types/habit';

interface HabitGridChartProps {
  habit: Habit;
  onDatePress?: (date: string) => void;
  theme: any;
  compact?: boolean;
  showLabels?: boolean;
  containerWidth?: number;
  noPadding?: boolean;
}

const HabitGridChart: React.FC<HabitGridChartProps> = React.memo(({ 
  habit, 
  onDatePress, 
  theme, 
  compact = false,
  showLabels = false,
  containerWidth,
  noPadding = false
}) => {
  const { getHabitEntry, toggleHabitEntry } = useHabitStore();
  const { width: screenWidth } = useWindowDimensions();
  const [layoutWidth, setLayoutWidth] = useState(0);
  
  // Calculate tile dimensions first to determine how many tiles we can fit
  const getGridDimensions = () => {
    let cardPadding;
    if (compact) {
      cardPadding = 60; // Compact mode in habit cards
    } else if (noPadding) {
      cardPadding = 80; // Detail page with container padding (mx-6 + px-4 = 48 + 32)
    } else {
      cardPadding = 32; // Default case
    }
    
    const availableWidth = layoutWidth || containerWidth || (screenWidth - cardPadding);
    const gapSize = compact ? 1 : 2;
    
    // Start with desired square tile size
    const desiredTileSize = compact ? 10 : 14;
    
    // Calculate how many tiles can fit across the width
    const tilesPerRow = Math.floor((availableWidth + gapSize) / (desiredTileSize + gapSize));
    
    // Recalculate actual tile size to perfectly fill the width
    const totalGaps = (tilesPerRow - 1) * gapSize;
    const actualTileSize = Math.floor((availableWidth - totalGaps) / tilesPerRow);
    
    return {
      tileSize: Math.max(actualTileSize, 6), // Square tiles
      gap: gapSize,
      tilesPerRow,
    };
  };
  
  const { tileSize, gap, tilesPerRow } = getGridDimensions();
  
  // Generate dates for display based on available space
  const generateGridData = (): HabitGridData[] => {
    const rowsToShow = compact ? 7 : 8; // Show 7 rows for compact (habit cards), 8 for full
    const totalTiles = tilesPerRow * rowsToShow;
    const data: HabitGridData[] = [];
    const today = new Date();
    
    for (let i = totalTiles - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const entry = getHabitEntry(habit.id, dateString);
      data.push({
        date: dateString,
        completed: entry?.completed || false,
        count: entry?.count || 0,
        intensity: entry?.completed ? 1 : 0,
      });
    }
    
    return data;
  };
  
  const gridData = generateGridData();
  const rowsCount = Math.ceil(gridData.length / tilesPerRow);
  
  // Group data by rows (not weeks anymore)
  const rowData: HabitGridData[][] = [];
  for (let row = 0; row < rowsCount; row++) {
    const rowTiles = gridData.slice(row * tilesPerRow, (row + 1) * tilesPerRow);
    rowData.push(rowTiles);
  }
  
  const handleCellPress = (date: string) => {
    if (onDatePress) {
      onDatePress(date);
    } else {
      toggleHabitEntry(habit.id, date);
    }
  };
  

  
  const getHabitTileColor = (day: HabitGridData) => {
    if (!day.completed) {
      // Light, opaque background for incomplete days
      const hex = habit.color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, 0.1)`;
    } else {
      // Bright color for completed days
      return habit.color;
    }
  };
  
  const renderTimeLabel = () => {
    if (compact || !showLabels) return null;
    
    return (
      <View className="mb-2">
        <Text 
          className="text-xs"
          style={{ color: theme.textTertiary }}
        >
          Last {Math.floor(gridData.length)} days
        </Text>
      </View>
    );
  };
  
  return (
    <View 
      className={compact || noPadding ? "" : "p-4"}
      onLayout={(event) => {
        if (compact || noPadding) {
          setLayoutWidth(event.nativeEvent.layout.width);
        }
      }}
    >
      {renderTimeLabel()}
      
      {/* Grid Container */}
      <View className="">
        {rowData.map((row, rowIndex) => (
          <View key={`${habit.id}-row-${rowIndex}`} className="flex-row" style={{ marginBottom: gap }}>
            {row.map((day, dayIndex) => (
              <Pressable
                key={`${habit.id}-${day.date}-${dayIndex}`}
                onPress={() => handleCellPress(day.date)}
                className="rounded-sm"
                style={{
                  width: tileSize,
                  height: tileSize, // Square tiles
                  backgroundColor: getHabitTileColor(day),
                  marginRight: dayIndex < row.length - 1 ? gap : 0,
                }}
              />
            ))}
          </View>
        ))}
      </View>
      
      {showLabels && (
        <View className="flex-row items-center justify-between mt-3">
          <Text className="text-xs" style={{ color: theme.textTertiary }}>
            {gridData.length} days • {tilesPerRow} per row
          </Text>
          <View className="flex-row items-center">
            <View
              className="rounded-sm mr-2"
              style={{
                width: 8,
                height: 8,
                backgroundColor: getHabitTileColor({ date: '', completed: false, count: 0 }),
              }}
            />
            <Text className="text-xs mr-3" style={{ color: theme.textTertiary }}>Missed</Text>
            <View
              className="rounded-sm mr-2"
              style={{
                width: 8,
                height: 8,
                backgroundColor: habit.color,
              }}
            />
            <Text className="text-xs" style={{ color: theme.textTertiary }}>Completed</Text>
          </View>
        </View>
      )}
    </View>
  );
});

export default HabitGridChart;