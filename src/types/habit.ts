export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  createdAt: Date;
  targetFrequency: 'daily' | 'weekly' | 'monthly';
  targetCount?: number; // for habits that can be done multiple times per day
  archived: boolean;
  order: number;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  count?: number; // for countable habits
  note?: string;
}

export interface HabitStats {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number; // percentage
  lastCompleted?: Date;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export type SubscriptionStatus = 'free' | 'monthly' | 'yearly' | 'lifetime';

export interface AppSettings {
  theme: ThemeMode;
  firstDayOfWeek: 0 | 1; // 0 = Sunday, 1 = Monday
  notifications: boolean;
  reminderTime?: string; // HH:MM format
  defaultHabitIcon: string;
  defaultHabitColor: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionDate?: Date;
  hasCompletedOnboarding: boolean;
}

export interface HabitGridData {
  date: string;
  completed: boolean;
  count?: number;
  intensity?: number; // 0-1 for color intensity
}