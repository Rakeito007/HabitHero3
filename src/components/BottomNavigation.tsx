import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTheme } from '../utils/theme';
import { useHabitStore } from '../state/habitStore';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  activeTab, 
  onTabPress 
}) => {
  const { settings } = useHabitStore();
  const theme = getTheme(settings.theme);

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'grid-outline',
      activeIcon: 'grid'
    },
    {
      id: 'habits',
      label: 'Habits',
      icon: 'list-outline',
      activeIcon: 'list'
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: 'analytics-outline',
      activeIcon: 'analytics'
    }
  ];

  return (
    <View 
      className="flex-row items-center justify-around py-3 px-4 border-t"
      style={{ 
        backgroundColor: theme.background,
        borderTopColor: theme.border
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabPress(tab.id)}
            className="flex-1 items-center py-2"
          >
            <View className="items-center">
              {/* Icon with dots pattern like HabitKit */}
              <View className="relative mb-1">
                <Ionicons
                  name={isActive ? (tab.activeIcon as any) : (tab.icon as any)}
                  size={24}
                  color={isActive ? theme.primary : theme.textSecondary}
                />
                
                {/* Dots pattern below icon */}
                <View className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                  <View className="flex-row space-x-1">
                    <View 
                      className="w-1 h-1 rounded-full"
                      style={{ 
                        backgroundColor: isActive ? theme.primary : theme.textTertiary 
                      }}
                    />
                    <View 
                      className="w-1 h-1 rounded-full"
                      style={{ 
                        backgroundColor: isActive ? theme.primary : theme.textTertiary 
                      }}
                    />
                    <View 
                      className="w-1 h-1 rounded-full"
                      style={{ 
                        backgroundColor: isActive ? theme.primary : theme.textTertiary 
                      }}
                    />
                  </View>
                </View>
              </View>
              
              <Text 
                className="text-xs font-medium"
                style={{ 
                  color: isActive ? theme.primary : theme.textSecondary 
                }}
              >
                {tab.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

export default BottomNavigation;
