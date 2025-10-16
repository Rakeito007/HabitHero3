import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../state/habitStore';
import { getTheme } from '../utils/theme';
import { Achievement } from '../types/achievements';
import { AchievementService } from '../services/achievementService';

interface AchievementsScreenProps {
  navigation: any;
}

const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ navigation }) => {
  const { habits, entries, settings } = useHabitStore();
  const theme = getTheme(settings.theme);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    // Generate achievements based on current progress
    const allAchievements: Achievement[] = [];
    
    // Initialize all possible achievements
    habits.forEach(habit => {
      AchievementService.defaultAchievements.forEach(template => {
        const achievementId = `${template.title.toLowerCase().replace(/\s+/g, '-')}-${habit.id}`;
        const habitEntries = entries.filter(e => e.habitId === habit.id && e.completed);
        const stats = calculateHabitStats(habitEntries);
        const progress = calculateProgress(template, stats, habit);

        allAchievements.push({
          ...template,
          id: achievementId,
          habitId: habit.id,
          progress: Math.min(progress, template.maxProgress),
          unlockedAt: progress >= template.maxProgress ? new Date() : undefined,
        });
      });
    });

    setAchievements(allAchievements);
  }, [habits, entries]);

  const calculateHabitStats = (habitEntries: any[]) => {
    const completed = habitEntries.filter(e => e.completed);
    let currentStreak = 0;
    
    // Calculate current streak (simplified)
    const today = new Date().toISOString().split('T')[0];
    const sortedEntries = habitEntries.sort((a, b) => b.date.localeCompare(a.date));
    
    for (const entry of sortedEntries) {
      if (entry.completed) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      currentStreak,
      totalCompletions: completed.length,
      completionRate: habitEntries.length > 0 ? Math.round((completed.length / habitEntries.length) * 100) : 0,
    };
  };

  const calculateProgress = (template: any, stats: any, habit: any): number => {
    switch (template.category) {
      case 'streak':
        return Math.min(stats.currentStreak, template.requirement);
      case 'consistency':
        return Math.min(stats.completionRate, template.requirement);
      case 'milestone':
        if (template.title === 'Habit Collector') {
          return Math.min(habits.length, template.requirement);
        }
        return Math.min(stats.totalCompletions, template.requirement);
      default:
        return 0;
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked') return achievement.unlockedAt;
    if (filter === 'locked') return !achievement.unlockedAt;
    return true;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return theme.textSecondary;
      case 'rare': return theme.primary;
      case 'epic': return theme.warning;
      case 'legendary': return theme.error;
      default: return theme.textSecondary;
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'medal-outline';
      case 'rare': return 'trophy-outline';
      case 'epic': return 'diamond-outline';
      case 'legendary': return 'star-outline';
      default: return 'medal-outline';
    }
  };

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const habit = habits.find(h => h.id === achievement.habitId);
    const isUnlocked = !!achievement.unlockedAt;
    const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

    return (
      <View 
        className={`rounded-xl p-4 mb-4 ${isUnlocked ? '' : 'opacity-60'}`}
        style={{ 
          backgroundColor: theme.cardBackground,
          borderColor: isUnlocked ? getRarityColor(achievement.rarity) : theme.border,
          borderWidth: isUnlocked ? 2 : 1,
        }}
      >
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <View 
              className="w-14 h-14 rounded-full items-center justify-center mr-3"
              style={{ 
                backgroundColor: isUnlocked 
                  ? getRarityColor(achievement.rarity) + '20' 
                  : theme.surface 
              }}
            >
              <Ionicons 
                name={isUnlocked ? getRarityIcon(achievement.rarity) as any : achievement.icon as any}
                size={28} 
                color={isUnlocked ? getRarityColor(achievement.rarity) : theme.textTertiary} 
              />
            </View>
            
            <View className="flex-1">
              <Text 
                className="text-lg font-semibold"
                style={{ color: theme.text }}
              >
                {achievement.title}
              </Text>
              <Text 
                className="text-sm mt-1"
                style={{ color: theme.textSecondary }}
                numberOfLines={2}
              >
                {achievement.description}
              </Text>
              {habit && (
                <Text 
                  className="text-xs mt-1"
                  style={{ color: habit.color }}
                >
                  {habit.name}
                </Text>
              )}
            </View>
          </View>

          <View className="items-end">
            <View 
              className="px-3 py-1 rounded-full mb-2"
              style={{ backgroundColor: getRarityColor(achievement.rarity) + '20' }}
            >
              <Text 
                className="text-xs font-bold uppercase"
                style={{ color: getRarityColor(achievement.rarity) }}
              >
                {achievement.rarity}
              </Text>
            </View>
            
            {isUnlocked && (
              <Text 
                className="text-xs"
                style={{ color: theme.success }}
              >
                ✓ Unlocked
              </Text>
            )}
          </View>
        </View>

        {/* Progress Bar */}
        {!isUnlocked && (
          <View>
            <View className="flex-row justify-between items-center mb-2">
              <Text 
                className="text-sm font-medium"
                style={{ color: theme.textSecondary }}
              >
                Progress
              </Text>
              <Text 
                className="text-sm"
                style={{ color: theme.text }}
              >
                {achievement.progress}/{achievement.maxProgress}
              </Text>
            </View>
            
            <View 
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: theme.surface }}
            >
              <View 
                className="h-full rounded-full"
                style={{ 
                  width: `${progressPercentage}%`,
                  backgroundColor: getRarityColor(achievement.rarity)
                }}
              />
            </View>
          </View>
        )}

        {/* Unlock Date */}
        {isUnlocked && achievement.unlockedAt && (
          <View className="mt-2 pt-2" style={{ borderTopColor: theme.border, borderTopWidth: 1 }}>
            <Text 
              className="text-xs"
              style={{ color: theme.textTertiary }}
            >
              Unlocked {achievement.unlockedAt.toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const totalCount = achievements.length;

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <View className="flex-row items-center">
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color={theme.text} />
            </Pressable>
            
            <Text 
              className="text-xl font-semibold ml-4"
              style={{ color: theme.text }}
            >
              Achievements
            </Text>
          </View>

          <View className="items-end">
            <Text 
              className="text-lg font-bold"
              style={{ color: theme.primary }}
            >
              {unlockedCount}/{totalCount}
            </Text>
            <Text 
              className="text-xs"
              style={{ color: theme.textSecondary }}
            >
              Unlocked
            </Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View className="flex-row px-6 mb-4">
          {[
            { key: 'all', label: 'All' },
            { key: 'unlocked', label: 'Unlocked' },
            { key: 'locked', label: 'In Progress' },
          ].map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setFilter(tab.key as any)}
              className="flex-1 py-3 mx-1 rounded-xl items-center"
              style={{
                backgroundColor: filter === tab.key ? theme.primary : theme.surface,
              }}
            >
              <Text 
                className="text-sm font-medium"
                style={{
                  color: filter === tab.key ? 'white' : theme.text
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Achievements List */}
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {filteredAchievements.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Ionicons name="trophy-outline" size={64} color={theme.textTertiary} />
              <Text 
                className="text-lg font-medium mt-4 mb-2"
                style={{ color: theme.text }}
              >
                No achievements yet
              </Text>
              <Text 
                className="text-center"
                style={{ color: theme.textSecondary }}
              >
                Start completing habits to unlock achievements!
              </Text>
            </View>
          ) : (
            filteredAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default AchievementsScreen;