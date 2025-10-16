export interface NutritionProfile {
  goals: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'performance';
  dietaryRestrictions: Array<'vegetarian' | 'vegan' | 'gluten_free' | 'dairy_free' | 'keto' | 'paleo' | 'low_carb' | 'mediterranean'>;
  allergies: string[];
  dailyCalories: number;
  macroTargets: {
    protein: number; // percentage
    carbs: number;   // percentage  
    fats: number;    // percentage
  };
  mealsPerDay: 3 | 4 | 5 | 6;
  cookingSkill: 'beginner' | 'intermediate' | 'advanced';
  prepTime: 'quick' | 'moderate' | 'unlimited'; // <15min, 15-45min, 45min+
}

export interface Recipe {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
  cuisine: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  calories: number;
  macros: {
    protein: number; // grams
    carbs: number;   // grams
    fats: number;    // grams
    fiber: number;   // grams
  };
  ingredients: Array<{
    item: string;
    amount: string;
    substitute?: string;
  }>;
  instructions: string[];
  tags: string[];
  dietaryFriendly: Array<'vegetarian' | 'vegan' | 'gluten_free' | 'dairy_free' | 'keto' | 'paleo' | 'low_carb' | 'mediterranean'>;
}

export interface MealPlan {
  id: string;
  name: string;
  duration: 1 | 7 | 14 | 30; // days
  targetProfile: NutritionProfile;
  meals: Array<{
    day: number;
    breakfast?: Recipe;
    lunch?: Recipe;
    dinner?: Recipe;
    snacks?: Recipe[];
  }>;
  shoppingList: Array<{
    item: string;
    quantity: string;
    category: 'produce' | 'protein' | 'dairy' | 'grains' | 'pantry' | 'frozen' | 'other';
  }>;
  totalCost?: number;
  nutritionSummary: {
    avgCalories: number;
    avgMacros: { protein: number; carbs: number; fats: number; };
  };
}

export interface WorkoutProfile {
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: Array<'strength' | 'cardio' | 'flexibility' | 'weight_loss' | 'muscle_gain' | 'endurance'>;
  availableTime: number; // minutes per session
  frequency: number; // workouts per week
  equipment: Array<'bodyweight' | 'dumbbells' | 'resistance_bands' | 'gym_access' | 'cardio_equipment'>;
  limitations: string[]; // injuries, restrictions
  preferredStyle: Array<'hiit' | 'strength_training' | 'yoga' | 'pilates' | 'running' | 'cycling' | 'swimming'>;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'balance' | 'plyometric';
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  tips: string[];
  modifications: {
    easier: string;
    harder: string;
  };
  duration?: number; // seconds for timed exercises
  reps?: string; // e.g., "8-12", "3 sets"
  caloriesBurn: number; // per minute
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'mixed' | 'hiit';
  duration: number; // total minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  exercises: Array<{
    exercise: Exercise;
    sets?: number;
    reps?: string;
    duration?: number; // seconds
    restTime?: number; // seconds
    notes?: string;
  }>;
  warmup: Exercise[];
  cooldown: Exercise[];
  totalCaloriesBurn: number;
  focusAreas: string[];
}