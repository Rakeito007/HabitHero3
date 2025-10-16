import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit, HabitEntry } from '../types/habit';
import { HabitInsight } from '../types/achievements';
import { AchievementService } from '../services/achievementService';

interface HabitInsightsProps {
  habit: Habit;
  entries: HabitEntry[];
  theme: any;
}

const HabitInsights: React.FC<HabitInsightsProps> = ({ habit, entries, theme }) => {
  const [insights, setInsights] = useState<HabitInsight[]>([]);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  useEffect(() => {
    // Generate AI-powered insights for this specific habit
    const habitInsights = AchievementService.generateInsights([habit], entries)
      .filter(insight => insight.habitId === habit.id);
    setInsights(habitInsights);
  }, [habit, entries]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'best_day': return 'calendar-outline';
      case 'weak_day': return 'warning-outline';
      case 'pattern': return 'analytics-outline';
      case 'streak_prediction': return 'trending-up-outline';
      case 'motivation': return 'rocket-outline';
      default: return 'bulb-outline';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'best_day': return theme.success;
      case 'weak_day': return theme.warning;
      case 'pattern': return theme.primary;
      case 'streak_prediction': return theme.secondary;
      case 'motivation': return habit.color;
      default: return theme.textSecondary;
    }
  };

  const generateAdditionalTips = (insight: HabitInsight) => {
    switch (insight.type) {
      case 'best_day':
        return [
          `Schedule more ${habit.name} sessions on ${insight.data.day}s`,
          'Use this day as your foundation for building consistency',
          'Consider what makes this day work well for you'
        ];
      case 'streak_prediction':
        return [
          'Focus on the next 3 days to build momentum',
          'Set up environment cues to support this habit',
          'Track your energy levels during habit completion'
        ];
      case 'motivation':
        return [
          'Celebrate small wins along the way',
          'Share your progress with a friend for accountability',
          'Visualize how this habit improves your life'
        ];
      default:
        return [];
    }
  };

  if (insights.length === 0) {
    return (
      <View 
        className="rounded-xl p-4"
        style={{ backgroundColor: theme.cardBackground }}
      >
        <View className="flex-row items-center mb-2">
          <Ionicons name="sparkles-outline" size={20} color={theme.primary} />
          <Text 
            className="text-lg font-semibold ml-2"
            style={{ color: theme.text }}
          >
            AI Insights
          </Text>
        </View>
        
        <Text 
          className="text-sm"
          style={{ color: theme.textSecondary }}
        >
          Complete more entries to unlock personalized insights about your habit patterns.
        </Text>
      </View>
    );
  }

  return (
    <View 
      className="rounded-xl p-4"
      style={{ backgroundColor: theme.cardBackground }}
    >
      <View className="flex-row items-center mb-4">
        <Ionicons name="sparkles" size={20} color={theme.primary} />
        <Text 
          className="text-lg font-semibold ml-2"
          style={{ color: theme.text }}
        >
          AI Insights
        </Text>
        <View 
          className="ml-2 px-2 py-1 rounded-full"
          style={{ backgroundColor: theme.primary + '20' }}
        >
          <Text 
            className="text-xs font-bold"
            style={{ color: theme.primary }}
          >
            SMART
          </Text>
        </View>
      </View>

      {insights.map((insight) => (
        <View key={insight.id} className="mb-3">
          <Pressable
            onPress={() => setExpandedInsight(
              expandedInsight === insight.id ? null : insight.id
            )}
            className="flex-row items-start p-3 rounded-xl"
            style={{ backgroundColor: theme.surface }}
          >
            <View 
              className="w-8 h-8 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: getInsightColor(insight.type) + '20' }}
            >
              <Ionicons 
                name={getInsightIcon(insight.type) as any}
                size={16} 
                color={getInsightColor(insight.type)} 
              />
            </View>
            
            <View className="flex-1">
              <Text 
                className="text-base font-medium mb-1"
                style={{ color: theme.text }}
              >
                {insight.title}
              </Text>
              <Text 
                className="text-sm"
                style={{ color: theme.textSecondary }}
              >
                {insight.description}
              </Text>
              
              {expandedInsight === insight.id && (
                <View className="mt-3">
                  <Text 
                    className="text-sm font-medium mb-2"
                    style={{ color: theme.text }}
                  >
                    💡 Action Tips:
                  </Text>
                  {generateAdditionalTips(insight).map((tip, index) => (
                    <View key={index} className="flex-row items-start mb-1">
                      <Text 
                        className="text-xs mr-2"
                        style={{ color: getInsightColor(insight.type) }}
                      >
                        •
                      </Text>
                      <Text 
                        className="text-xs flex-1"
                        style={{ color: theme.textSecondary }}
                      >
                        {tip}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            
            <Ionicons 
              name={expandedInsight === insight.id ? 'chevron-up' : 'chevron-down'}
              size={16} 
              color={theme.textTertiary} 
            />
          </Pressable>
        </View>
      ))}

      <View className="mt-2 pt-3" style={{ borderTopColor: theme.border, borderTopWidth: 1 }}>
        <Text 
          className="text-xs text-center"
          style={{ color: theme.textTertiary }}
        >
          Insights powered by AI analysis of your habit patterns
        </Text>
      </View>
    </View>
  );
};

export default HabitInsights;