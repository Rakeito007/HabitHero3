import { useHabitStore } from '../state/habitStore';
import { habitColors } from './theme';

export const initializeSampleData = () => {
  const { addHabit, toggleHabitEntry, habits, settings } = useHabitStore.getState();
  
  // Only add sample data if no habits exist and user has completed onboarding
  if (habits.length > 0 || !settings.hasCompletedOnboarding) return;
  
  // Optimize: Pre-define sample habits as constants to avoid recreation
  const baseSampleHabits = [
    {
      name: 'Drink Water',
      description: 'Stay hydrated throughout the day',
      icon: 'water-outline',
      color: habitColors[1],
      targetFrequency: 'daily' as const,
      archived: false,
    },
    {
      name: 'Exercise',
      description: 'Get at least 30 minutes of physical activity',
      icon: 'fitness-outline',
      color: habitColors[2],
      targetFrequency: 'daily' as const,
      archived: false,
    },
    {
      name: 'Read Books',
      description: 'Read for at least 20 minutes',
      icon: 'book-outline',
      color: habitColors[4],
      targetFrequency: 'daily' as const,
      archived: false,
    },
  ];
  
  // Optimize: Calculate habits to add based on subscription
  const habitsToAdd = settings.subscriptionStatus === 'free' 
    ? baseSampleHabits 
    : [...baseSampleHabits, {
        name: 'Meditation',
        description: 'Practice mindfulness and meditation',
        icon: 'heart-outline',
        color: habitColors[5],
        targetFrequency: 'daily' as const,
        archived: false,
      }];
    
  habitsToAdd.forEach(habit => {
    try {
      addHabit(habit);
    } catch (error) {
      // Silently fail if limits are exceeded
      console.warn('Could not add sample habit:', habit.name, (error as Error).message);
    }
  });
  
  // Get the newly added habits
  const newHabits = useHabitStore.getState().habits;
  
  // Optimize: Defer heavy sample data generation to not block startup
  setTimeout(() => {
    const today = new Date();
    const completionRates = [0.85, 0.70, 0.75, 0.50]; // Water, Exercise, Reading, Meditation
    
    // Batch process entries to avoid blocking UI
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      newHabits.forEach((habit, habitIndex) => {
        const baseRate = completionRates[habitIndex] || 0.5;
        const adjustedRate = habitIndex === 3 ? baseRate + (i * 0.01) : baseRate;
        
        if (Math.random() < adjustedRate) {
          toggleHabitEntry(habit.id, dateString);
        }
      });
    }
  }, 100); // Small delay to not block initial render
};