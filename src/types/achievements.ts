export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'consistency' | 'milestone' | 'special';
  requirement: number;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  habitId?: string; // For habit-specific achievements
}

export interface Milestone {
  id: string;
  habitId: string;
  type: 'streak' | 'total_completions' | 'consistency_month' | 'perfect_week';
  value: number;
  achievedAt: Date;
  celebration?: {
    title: string;
    message: string;
    confetti: boolean;
  };
}

export interface HabitInsight {
  id: string;
  habitId: string;
  type: 'best_day' | 'weak_day' | 'pattern' | 'streak_prediction' | 'motivation';
  title: string;
  description: string;
  data: any;
  generatedAt: Date;
  isRead: boolean;
}