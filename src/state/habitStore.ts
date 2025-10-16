import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitEntry, HabitStats, AppSettings, SubscriptionStatus } from '../types/habit';
import { simpleProtectedFunction, SIMPLE_CONSTANTS } from '../security/SimpleProtection';
import { widgetService } from '../services/widgetService';

interface HabitStore {
  habits: Habit[];
  entries: HabitEntry[];
  settings: AppSettings;
  
  // Security tracking
  lastSecurityCheck: Date | null;
  securityViolations: number;
  
  // Subscription management  
  updateSubscription: (status: SubscriptionStatus) => void;
  completeOnboarding: () => void;
  
  // Habit management (protected)
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'order'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  reorderHabits: (fromIndex: number, toIndex: number) => void;
  
  // Entry management
  toggleHabitEntry: (habitId: string, date: string) => void;
  updateHabitEntry: (habitId: string, date: string, updates: Partial<HabitEntry>) => void;
  getHabitEntry: (habitId: string, date: string) => HabitEntry | undefined;
  
  // Statistics
  getHabitStats: (habitId: string) => HabitStats;
  getHabitEntriesForPeriod: (habitId: string, startDate: string, endDate: string) => HabitEntry[];
  
  // Settings
  updateSettings: (updates: Partial<AppSettings>) => void;
  
  
  // Security methods
  updateSecurityStatus: (violations: number) => void;
  
  // Data management
  exportData: () => string;
  importData: (data: string) => void;
  clearAllData: () => void;
}

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const calculateStreak = (entries: HabitEntry[], endDate: Date = new Date()): { current: number; longest: number } => {
  if (entries.length === 0) return { current: 0, longest: 0 };
  
  const sortedEntries = entries
    .filter(entry => entry.completed)
    .sort((a, b) => b.date.localeCompare(a.date));
  
  if (sortedEntries.length === 0) return { current: 0, longest: 0 };
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const today = formatDate(endDate);
  const yesterday = formatDate(new Date(endDate.getTime() - 86400000));
  
  // Calculate current streak
  if (sortedEntries[0].date === today || sortedEntries[0].date === yesterday) {
    const currentDate = new Date(endDate);
    for (const entry of sortedEntries) {
      const entryDate = formatDate(currentDate);
      if (entry.date === entryDate) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
  }
  
  // Calculate longest streak
  const allDates = sortedEntries.map(entry => entry.date).sort();
  for (let i = 0; i < allDates.length; i++) {
    const currentDate = new Date(allDates[i]);
    const nextDate = i < allDates.length - 1 ? new Date(allDates[i + 1]) : null;
    
    tempStreak = 1;
    
    if (nextDate) {
      const dayDiff = (nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
      if (dayDiff === 1) {
        tempStreak++;
        i++;
        while (i < allDates.length - 1) {
          const current = new Date(allDates[i]);
          const next = new Date(allDates[i + 1]);
          const diff = (next.getTime() - current.getTime()) / (1000 * 60 * 60 * 24);
          if (diff === 1) {
            tempStreak++;
            i++;
          } else {
            break;
          }
        }
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
  }
  
  return { current: currentStreak, longest: longestStreak };
};

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      entries: [],
      lastSecurityCheck: null,
      securityViolations: 0,
      settings: {
        theme: 'dark',
        firstDayOfWeek: 1,
        notifications: false,
        defaultHabitIcon: 'star-outline',
        defaultHabitColor: '#007AFF',
        subscriptionStatus: 'free',
        hasCompletedOnboarding: false,
      },
      
      addHabit: simpleProtectedFunction((habitData) => {
        const state = get();
        
        // Check subscription limits
        const activeHabits = state.habits.filter(h => !h.archived);
        
        if (state.settings.subscriptionStatus === SIMPLE_CONSTANTS.FREE_PLAN && activeHabits.length >= SIMPLE_CONSTANTS.MAX_FREE_HABITS) {
          throw new Error('Free plan limited to 3 habits. Upgrade to Pro for unlimited habits.');
        }
        
        const habit: Habit = {
          ...habitData,
          id: generateId(),
          createdAt: new Date(),
          order: state.habits.length,
        };
        
        set((state) => ({
          habits: [...state.habits, habit],
        }));
      }, 'addHabit'),
      
      updateHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id ? { ...habit, ...updates } : habit
          ),
        }));
      },
      
      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
          entries: state.entries.filter((entry) => entry.habitId !== id),
        }));
      },
      
      reorderHabits: (fromIndex, toIndex) => {
        set((state) => {
          const newHabits = [...state.habits];
          const [moved] = newHabits.splice(fromIndex, 1);
          newHabits.splice(toIndex, 0, moved);
          return {
            habits: newHabits.map((habit, index) => ({ ...habit, order: index })),
          };
        });
      },
      
      toggleHabitEntry: (habitId, date) => {
        const existing = get().getHabitEntry(habitId, date);
        if (existing) {
          set((state) => ({
            entries: state.entries.map((entry) =>
              entry.id === existing.id
                ? { ...entry, completed: !entry.completed }
                : entry
            ),
          }));
        } else {
          const entry: HabitEntry = {
            id: generateId(),
            habitId,
            date,
            completed: true,
            count: 1,
          };
          set((state) => ({
            entries: [...state.entries, entry],
          }));
        }
        
        // Widget data update removed for testing
      },
      
      updateHabitEntry: (habitId, date, updates) => {
        const existing = get().getHabitEntry(habitId, date);
        if (existing) {
          set((state) => ({
            entries: state.entries.map((entry) =>
              entry.id === existing.id ? { ...entry, ...updates } : entry
            ),
          }));
        }
      },
      
      getHabitEntry: (habitId, date) => {
        return get().entries.find((entry) => entry.habitId === habitId && entry.date === date);
      },
      
      getHabitStats: (habitId) => {
        const entries = get().entries.filter((entry) => entry.habitId === habitId);
        const completedEntries = entries.filter((entry) => entry.completed);
        const streaks = calculateStreak(completedEntries);
        
        const totalDays = entries.length || 1;
        const completionRate = (completedEntries.length / totalDays) * 100;
        
        const lastCompleted = completedEntries
          .sort((a, b) => b.date.localeCompare(a.date))[0]?.date;
        
        return {
          habitId,
          currentStreak: streaks.current,
          longestStreak: streaks.longest,
          totalCompletions: completedEntries.length,
          completionRate: Math.round(completionRate),
          lastCompleted: lastCompleted ? new Date(lastCompleted) : undefined,
        };
      },
      
      getHabitEntriesForPeriod: (habitId: string, startDate: string, endDate: string) => {
        return get().entries.filter((entry) => 
          entry.habitId === habitId &&
          entry.date >= startDate &&
          entry.date <= endDate
        );
      },
      
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },
      
      updateSubscription: simpleProtectedFunction((status) => {
        // Validate subscription status
        const validStatuses = [
          SIMPLE_CONSTANTS.FREE_PLAN,
          SIMPLE_CONSTANTS.MONTHLY_PLAN,
          SIMPLE_CONSTANTS.LIFETIME_PLAN,
        ];
        
        if (!validStatuses.includes(status)) {
          console.warn('Invalid subscription status attempted');
          return;
        }
        
        set((state) => ({
          settings: { 
            ...state.settings, 
            subscriptionStatus: status,
            subscriptionDate: new Date(),
          },
        }));
      }, 'updateSubscription'),
      
      updateSecurityStatus: (violations) => {
        set((state) => ({
          securityViolations: violations,
          lastSecurityCheck: new Date(),
        }));
      },
      
      completeOnboarding: () => {
        set((state) => ({
          settings: { ...state.settings, hasCompletedOnboarding: true },
        }));
      },
      
      exportData: () => {
        const { habits, entries, settings } = get();
        return JSON.stringify({ habits, entries, settings }, null, 2);
      },
      
      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.habits && parsed.entries && parsed.settings) {
            set({
              habits: parsed.habits,
              entries: parsed.entries,
              settings: parsed.settings,
            });
          }
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      },
      
      clearAllData: () => {
        set({
          habits: [],
          entries: [],
          settings: {
            theme: 'dark',
            firstDayOfWeek: 1,
            notifications: false,
            defaultHabitIcon: 'star-outline',
            defaultHabitColor: '#007AFF',
            subscriptionStatus: 'free',
            hasCompletedOnboarding: false,
          },
        });
      },
    }),
    {
      name: 'habit-hero-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        habits: state.habits,
        entries: state.entries,
        settings: state.settings,
        securityViolations: state.securityViolations,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Optimize date conversion - only convert if needed
          if (state.habits?.length > 0) {
            state.habits = state.habits.map(habit => ({
              ...habit,
              createdAt: typeof habit.createdAt === 'string' ? new Date(habit.createdAt) : habit.createdAt
            }));
          }
        }
      },
      
      
      // Add faster hydration options
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // Handle migrations if needed in future
        return persistedState;
      },
    }
  )
);