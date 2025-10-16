import { HabitTemplate, HabitChain } from '../types/templates';

export const habitTemplates: HabitTemplate[] = [
  // Health & Fitness
  {
    id: 'drink_water',
    name: 'Drink 8 Glasses of Water',
    description: 'Stay hydrated throughout the day',
    icon: 'water-outline',
    color: '#5AC8FA',
    category: 'health_fitness',
    targetFrequency: 'daily',
    tags: ['health', 'hydration', 'wellness'],
    difficulty: 'easy',
    estimatedTime: '5 min',
    tips: [
      'Keep a water bottle visible on your desk',
      'Set hourly reminders to drink water',
      'Drink a glass when you wake up'
    ]
  },
  {
    id: 'morning_workout',
    name: 'Morning Exercise',
    description: '30 minutes of physical activity',
    icon: 'barbell-outline',
    color: '#34C759',
    category: 'health_fitness',
    targetFrequency: 'daily',
    tags: ['fitness', 'morning', 'energy'],
    difficulty: 'medium',
    estimatedTime: '30 min',
    tips: [
      'Prepare workout clothes the night before',
      'Start with 10 minutes if 30 feels overwhelming',
      'Find an activity you genuinely enjoy'
    ]
  },
  {
    id: 'walk_10k_steps',
    name: '10,000 Steps Daily',
    description: 'Walk at least 10,000 steps each day',
    icon: 'walk-outline',
    color: '#FF9500',
    category: 'health_fitness',
    targetFrequency: 'daily',
    tags: ['walking', 'cardio', 'outdoor'],
    difficulty: 'medium',
    estimatedTime: '60-90 min',
    tips: [
      'Take the stairs instead of elevators',
      'Park farther away from destinations',
      'Take walking meetings when possible'
    ]
  },
  
  // Productivity
  {
    id: 'deep_work',
    name: 'Deep Work Session',
    description: '2 hours of focused, uninterrupted work',
    icon: 'laptop-outline',
    color: '#5856D6',
    category: 'productivity',
    targetFrequency: 'daily',
    tags: ['focus', 'productivity', 'work'],
    difficulty: 'hard',
    estimatedTime: '2 hours',
    tips: [
      'Turn off all notifications',
      'Use the Pomodoro Technique',
      'Choose your most important task'
    ]
  },
  {
    id: 'inbox_zero',
    name: 'Inbox Zero',
    description: 'Clear your email inbox completely',
    icon: 'mail-outline',
    color: '#FF3B30',
    category: 'productivity',
    targetFrequency: 'daily',
    tags: ['email', 'organization', 'productivity'],
    difficulty: 'medium',
    estimatedTime: '15-30 min',
    tips: [
      'Process emails in batches',
      'Use the 2-minute rule',
      'Unsubscribe from unnecessary lists'
    ]
  },
  
  // Mindfulness
  {
    id: 'meditation',
    name: 'Daily Meditation',
    description: '10 minutes of mindfulness practice',
    icon: 'heart-outline',
    color: '#AF52DE',
    category: 'mindfulness',
    targetFrequency: 'daily',
    tags: ['meditation', 'mindfulness', 'mental health'],
    difficulty: 'easy',
    estimatedTime: '10 min',
    tips: [
      'Start with just 3 minutes',
      'Use a meditation app for guidance',
      'Find a quiet, comfortable space'
    ]
  },
  {
    id: 'gratitude_journal',
    name: 'Gratitude Journaling',
    description: "Write down 3 things you're grateful for",
    icon: 'book-outline',
    color: '#FFCC00',
    category: 'mindfulness',
    targetFrequency: 'daily',
    tags: ['gratitude', 'journaling', 'positivity'],
    difficulty: 'easy',
    estimatedTime: '5 min',
    tips: [
      "Be specific about what you're grateful for",
      "Include why you're grateful",
      'Keep a dedicated gratitude journal'
    ]
  },
  
  // Learning
  {
    id: 'read_30_min',
    name: 'Reading Time',
    description: 'Read for 30 minutes daily',
    icon: 'library-outline',
    color: '#1ABC9C',
    category: 'learning',
    targetFrequency: 'daily',
    tags: ['reading', 'learning', 'knowledge'],
    difficulty: 'easy',
    estimatedTime: '30 min',
    tips: [
      'Always have a book with you',
      'Read during your commute',
      'Join a book club for motivation'
    ]
  },
  {
    id: 'language_practice',
    name: 'Language Learning',
    description: 'Practice a new language for 20 minutes',
    icon: 'chatbubbles-outline',
    color: '#FF6482',
    category: 'learning',
    targetFrequency: 'daily',
    tags: ['language', 'learning', 'communication'],
    difficulty: 'medium',
    estimatedTime: '20 min',
    tips: [
      'Use language learning apps',
      'Practice speaking out loud',
      'Watch content in your target language'
    ]
  },
  
  // Creativity
  {
    id: 'creative_writing',
    name: 'Creative Writing',
    description: 'Write creatively for 15 minutes',
    icon: 'create-outline',
    color: '#BF5AF2',
    category: 'creativity',
    targetFrequency: 'daily',
    tags: ['writing', 'creativity', 'expression'],
    difficulty: 'medium',
    estimatedTime: '15 min',
    tips: [
      "Don't worry about perfection",
      'Use writing prompts for inspiration',
      'Set a timer and write without stopping'
    ]
  },
  
  // Finance
  {
    id: 'expense_tracking',
    name: 'Track Daily Expenses',
    description: 'Record all expenses for the day',
    icon: 'cash-outline',
    color: '#32D74B',
    category: 'finance',
    targetFrequency: 'daily',
    tags: ['finance', 'budgeting', 'money'],
    difficulty: 'easy',
    estimatedTime: '5 min',
    tips: [
      'Use a budgeting app',
      'Keep receipts throughout the day',
      'Review weekly spending patterns'
    ]
  }
];

export const habitChains: HabitChain[] = [
  {
    id: 'morning_routine',
    name: 'Perfect Morning Routine',
    description: 'Build a powerful morning routine step by step',
    habits: [
      { habitId: 'drink_water', order: 1, requiredStreak: 7, isUnlocked: true },
      { habitId: 'meditation', order: 2, requiredStreak: 14, isUnlocked: false },
      { habitId: 'morning_workout', order: 3, requiredStreak: 21, isUnlocked: false },
      { habitId: 'gratitude_journal', order: 4, requiredStreak: 30, isUnlocked: false }
    ],
    category: 'lifestyle',
    totalProgress: 0,
    isCompleted: false
  },
  {
    id: 'productivity_master',
    name: 'Productivity Master',
    description: 'Become ultra-productive with these power habits',
    habits: [
      { habitId: 'inbox_zero', order: 1, requiredStreak: 5, isUnlocked: true },
      { habitId: 'deep_work', order: 2, requiredStreak: 14, isUnlocked: false }
    ],
    category: 'productivity',
    totalProgress: 0,
    isCompleted: false
  },
  {
    id: 'wellness_warrior',
    name: 'Wellness Warrior',
    description: 'Complete physical and mental wellness journey',
    habits: [
      { habitId: 'walk_10k_steps', order: 1, requiredStreak: 10, isUnlocked: true },
      { habitId: 'drink_water', order: 2, requiredStreak: 10, isUnlocked: false },
      { habitId: 'meditation', order: 3, requiredStreak: 21, isUnlocked: false },
      { habitId: 'morning_workout', order: 4, requiredStreak: 30, isUnlocked: false }
    ],
    category: 'health_fitness',
    totalProgress: 0,
    isCompleted: false
  }
];

export const categoryInfo = {
  health_fitness: {
    name: 'Health & Fitness',
    icon: 'fitness-outline',
    color: '#34C759',
    description: 'Build physical health and fitness habits'
  },
  productivity: {
    name: 'Productivity',
    icon: 'rocket-outline',
    color: '#5856D6',
    description: 'Boost your efficiency and output'
  },
  mindfulness: {
    name: 'Mindfulness',
    icon: 'heart-outline',
    color: '#AF52DE',
    description: 'Develop mental clarity and awareness'
  },
  learning: {
    name: 'Learning',
    icon: 'school-outline',
    color: '#1ABC9C',
    description: 'Continuous learning and skill development'
  },
  social: {
    name: 'Social',
    icon: 'people-outline',
    color: '#FF6482',
    description: 'Strengthen relationships and social skills'
  },
  creativity: {
    name: 'Creativity',
    icon: 'brush-outline',
    color: '#BF5AF2',
    description: 'Express yourself and create something new'
  },
  finance: {
    name: 'Finance',
    icon: 'card-outline',
    color: '#32D74B',
    description: 'Manage money and build wealth'
  },
  lifestyle: {
    name: 'Lifestyle',
    icon: 'home-outline',
    color: '#FF9500',
    description: 'Improve your daily life and routines'
  },
  career: {
    name: 'Career',
    icon: 'briefcase-outline',
    color: '#007AFF',
    description: 'Advance your professional development'
  }
};