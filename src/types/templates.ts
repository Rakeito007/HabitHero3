export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: HabitCategory;
  targetFrequency: 'daily' | 'weekly' | 'monthly';
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string; // e.g., "5 min", "30 min", "1 hour"
  tips: string[];
}

export type HabitCategory = 
  | 'health_fitness'
  | 'productivity'
  | 'mindfulness'
  | 'learning'
  | 'social'
  | 'creativity'
  | 'finance'
  | 'lifestyle'
  | 'career';

export interface HabitChain {
  id: string;
  name: string;
  description: string;
  habits: {
    habitId: string;
    order: number;
    requiredStreak?: number; // Days needed before next habit unlocks
    isUnlocked: boolean;
  }[];
  category: HabitCategory;
  totalProgress: number; // 0-100%
  isCompleted: boolean;
  startedAt?: Date;
  completedAt?: Date;
}

export interface SmartReminder {
  id: string;
  habitId: string;
  type: 'time_based' | 'location_based' | 'weather_based' | 'mood_based';
  conditions: {
    time?: string; // HH:MM
    timeRange?: { start: string; end: string };
    weather?: 'sunny' | 'rainy' | 'cloudy';
    mood?: 'motivated' | 'low_energy' | 'stressed';
    location?: string;
  };
  message: string;
  isActive: boolean;
  adaptiveScheduling: boolean; // AI learns best times
}