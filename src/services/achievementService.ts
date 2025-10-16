import { Achievement, Milestone, HabitInsight } from '../types/achievements';
import { Habit, HabitEntry } from '../types/habit';

export class AchievementService {
  static defaultAchievements: Omit<Achievement, 'id' | 'progress' | 'unlockedAt'>[] = [
    // Streak Achievements
    {
      title: 'Getting Started',
      description: 'Complete a habit for 3 days in a row',
      icon: 'flame-outline',
      category: 'streak',
      requirement: 3,
      maxProgress: 3,
      rarity: 'common',
    },
    {
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: 'shield-outline',
      category: 'streak',
      requirement: 7,
      maxProgress: 7,
      rarity: 'common',
    },
    {
      title: 'Monthly Master',
      description: 'Keep going for 30 days straight',
      icon: 'trophy-outline',
      category: 'streak',
      requirement: 30,
      maxProgress: 30,
      rarity: 'rare',
    },
    {
      title: 'Unstoppable',
      description: 'Achieve a 100-day streak',
      icon: 'rocket-outline',
      category: 'streak',
      requirement: 100,
      maxProgress: 100,
      rarity: 'epic',
    },
    {
      title: 'Legend',
      description: 'Reach the legendary 365-day streak',
      icon: 'star-outline',
      category: 'streak',
      requirement: 365,
      maxProgress: 365,
      rarity: 'legendary',
    },
    // Consistency Achievements
    {
      title: 'Consistent Performer',
      description: 'Achieve 80% completion rate over 30 days',
      icon: 'checkmark-circle-outline',
      category: 'consistency',
      requirement: 80,
      maxProgress: 100,
      rarity: 'rare',
    },
    {
      title: 'Perfectionist',
      description: 'Complete a habit every day for a month',
      icon: 'diamond-outline',
      category: 'consistency',
      requirement: 100,
      maxProgress: 100,
      rarity: 'epic',
    },
    // Milestone Achievements
    {
      title: 'Century Club',
      description: 'Complete a habit 100 times',
      icon: 'medal-outline',
      category: 'milestone',
      requirement: 100,
      maxProgress: 100,
      rarity: 'rare',
    },
    {
      title: 'Habit Collector',
      description: 'Create 10 different habits',
      icon: 'list-outline',
      category: 'milestone',
      requirement: 10,
      maxProgress: 10,
      rarity: 'common',
    },
    // Special Achievements
    {
      title: 'Early Bird',
      description: 'Complete habits before 8 AM for 7 days',
      icon: 'sunny-outline',
      category: 'special',
      requirement: 7,
      maxProgress: 7,
      rarity: 'rare',
    },
    {
      title: 'Night Owl',
      description: 'Complete habits after 10 PM for 7 days',
      icon: 'moon-outline',
      category: 'special',
      requirement: 7,
      maxProgress: 7,
      rarity: 'rare',
    },
  ];

  static generateInsights(habits: Habit[], entries: HabitEntry[]): HabitInsight[] {
    const insights: HabitInsight[] = [];
    const today = new Date();

    habits.forEach(habit => {
      const habitEntries = entries.filter(e => e.habitId === habit.id && e.completed);
      
      if (habitEntries.length < 7) return; // Need at least a week of data

      // Best day analysis
      const dayStats = this.analyzeBestDay(habitEntries);
      if (dayStats) {
        insights.push({
          id: `best-day-${habit.id}`,
          habitId: habit.id,
          type: 'best_day',
          title: `${habit.name} Peak Day`,
          description: `You're most consistent with ${habit.name} on ${dayStats.day}s (${dayStats.rate}% completion rate)`,
          data: dayStats,
          generatedAt: today,
          isRead: false,
        });
      }

      // Streak prediction
      const prediction = this.predictStreakContinuation(habitEntries);
      if (prediction) {
        insights.push({
          id: `prediction-${habit.id}`,
          habitId: habit.id,
          type: 'streak_prediction',
          title: 'Streak Forecast',
          description: `Based on your pattern, you have a ${prediction.probability}% chance of reaching a ${prediction.targetDays}-day streak`,
          data: prediction,
          generatedAt: today,
          isRead: false,
        });
      }

      // Motivation based on recent performance
      const motivation = this.generateMotivation(habit, habitEntries);
      if (motivation) {
        insights.push({
          id: `motivation-${habit.id}`,
          habitId: habit.id,
          type: 'motivation',
          title: motivation.title,
          description: motivation.message,
          data: {},
          generatedAt: today,
          isRead: false,
        });
      }
    });

    return insights;
  }

  private static analyzeBestDay(entries: HabitEntry[]) {
    const dayMap = new Map<string, { completed: number; total: number }>();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    entries.forEach(entry => {
      const date = new Date(entry.date);
      const dayName = dayNames[date.getDay()];
      
      const stats = dayMap.get(dayName) || { completed: 0, total: 0 };
      stats.total++;
      if (entry.completed) stats.completed++;
      dayMap.set(dayName, stats);
    });

    let bestDay = '';
    let bestRate = 0;

    dayMap.forEach((stats, day) => {
      const rate = (stats.completed / stats.total) * 100;
      if (rate > bestRate && stats.total >= 3) { // At least 3 data points
        bestRate = rate;
        bestDay = day;
      }
    });

    return bestDay ? { day: bestDay, rate: Math.round(bestRate) } : null;
  }

  private static predictStreakContinuation(entries: HabitEntry[]) {
    // Simple prediction based on recent consistency
    const recentEntries = entries.slice(-14); // Last 2 weeks
    const completionRate = recentEntries.filter(e => e.completed).length / recentEntries.length;
    
    let targetDays = 30;
    let probability = Math.round(completionRate * 100);

    if (completionRate > 0.8) targetDays = 60;
    if (completionRate > 0.9) targetDays = 100;

    return probability > 50 ? { targetDays, probability } : null;
  }

  private static generateMotivation(habit: Habit, entries: HabitEntry[]) {
    const recentEntries = entries.slice(-7);
    const completedRecent = recentEntries.filter(e => e.completed).length;
    const totalEntries = entries.filter(e => e.completed).length;

    if (completedRecent === 7) {
      return {
        title: 'Perfect Week! 🔥',
        message: `You've completed ${habit.name} every day this week. You're on fire!`,
      };
    }

    if (completedRecent >= 5) {
      return {
        title: 'Strong Momentum 💪',
        message: `${completedRecent}/7 days this week. You're building something great!`,
      };
    }

    if (totalEntries >= 50 && completedRecent < 3) {
      return {
        title: 'Back on Track 🎯',
        message: `You've done ${habit.name} ${totalEntries} times before. You've got this!`,
      };
    }

    return null;
  }

  static checkAchievements(habits: Habit[], entries: HabitEntry[], currentAchievements: Achievement[]): Achievement[] {
    const newAchievements: Achievement[] = [];

    habits.forEach(habit => {
      const habitEntries = entries.filter(e => e.habitId === habit.id && e.completed);
      const stats = this.calculateHabitStats(habitEntries);

      this.defaultAchievements.forEach(template => {
        const achievementId = `${template.title.toLowerCase().replace(/\s+/g, '-')}-${habit.id}`;
        const existing = currentAchievements.find(a => a.id === achievementId);

        if (!existing || !existing.unlockedAt) {
          const progress = this.calculateProgress(template, stats, habit, habits);
          
          if (progress >= template.maxProgress && !existing?.unlockedAt) {
            newAchievements.push({
              ...template,
              id: achievementId,
              habitId: habit.id,
              progress: template.maxProgress,
              unlockedAt: new Date(),
            });
          }
        }
      });
    });

    return newAchievements;
  }

  private static calculateProgress(template: any, stats: any, habit: Habit, allHabits: Habit[]): number {
    switch (template.category) {
      case 'streak':
        return Math.min(stats.currentStreak, template.requirement);
      case 'consistency':
        return Math.min(stats.completionRate, template.requirement);
      case 'milestone':
        if (template.title === 'Habit Collector') {
          return Math.min(allHabits.length, template.requirement);
        }
        return Math.min(stats.totalCompletions, template.requirement);
      case 'special':
        // Simplified for demo - would need time-based analysis
        return stats.currentStreak >= template.requirement ? template.requirement : 0;
      default:
        return 0;
    }
  }

  private static calculateHabitStats(entries: HabitEntry[]) {
    const completed = entries.filter(e => e.completed);
    const total = entries.length || 1;
    
    // Calculate current streak
    let currentStreak = 0;
    const sortedEntries = entries.sort((a, b) => b.date.localeCompare(a.date));
    
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
      completionRate: Math.round((completed.length / total) * 100),
    };
  }
}