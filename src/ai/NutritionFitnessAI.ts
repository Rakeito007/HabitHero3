import { NutritionProfile, Recipe, MealPlan, WorkoutProfile, Exercise, WorkoutRoutine } from '../types/nutrition';

export class NutritionFitnessAI {
  private nutritionDatabase: Recipe[] = [];
  private exerciseDatabase: Exercise[] = [];
  private workoutDatabase: WorkoutRoutine[] = [];

  constructor() {
    this.initializeDatabase();
  }

  // Initialize with sample data
  private initializeDatabase() {
    this.nutritionDatabase = this.getSampleRecipes();
    this.exerciseDatabase = this.getSampleExercises();
    this.workoutDatabase = this.getSampleWorkouts();
  }

  // NUTRITION FEATURES

  // Generate personalized meal plan
  generateMealPlan(profile: NutritionProfile, days: number = 7): MealPlan {
    const meals = [];
    const usedRecipes = new Set<string>();

    for (let day = 1; day <= days; day++) {
      const dayMeals: any = { day };
      
      // Get recipes that match profile
      const compatibleRecipes = this.getCompatibleRecipes(profile);
      
      // Assign meals avoiding repetition
      dayMeals.breakfast = this.selectRecipe(compatibleRecipes, 'breakfast', usedRecipes);
      dayMeals.lunch = this.selectRecipe(compatibleRecipes, 'lunch', usedRecipes);
      dayMeals.dinner = this.selectRecipe(compatibleRecipes, 'dinner', usedRecipes);
      
      if (profile.mealsPerDay > 3) {
        dayMeals.snacks = [this.selectRecipe(compatibleRecipes, 'snack', usedRecipes)];
      }

      meals.push(dayMeals);
    }

    // Generate shopping list
    const shoppingList = this.generateShoppingList(meals);
    
    // Calculate nutrition summary
    const nutritionSummary = this.calculateNutritionSummary(meals);

    return {
      id: `meal_plan_${Date.now()}`,
      name: `${days}-Day Custom Plan`,
      duration: days as any,
      targetProfile: profile,
      meals,
      shoppingList,
      nutritionSummary,
      totalCost: this.estimateCost(shoppingList)
    };
  }

  // Get recipe suggestions based on preferences
  getRecipeSuggestions(profile: NutritionProfile, category?: string): Recipe[] {
    let compatible = this.getCompatibleRecipes(profile);
    
    if (category) {
      compatible = compatible.filter(r => r.category === category);
    }

    // Sort by relevance (calories, macros, prep time)
    return compatible
      .sort((a, b) => this.scoreRecipe(a, profile) - this.scoreRecipe(b, profile))
      .slice(0, 5);
  }

  // Quick meal suggestions
  getQuickMealIdeas(profile: NutritionProfile): string[] {
    const ideas = [
      // Breakfast
      "Greek yogurt + berries + granola (5 min)",
      "Overnight oats with protein powder (prep night before)",
      "Avocado toast with egg (8 min)",
      
      // Lunch
      "Protein wrap with veggies (5 min)",
      "Quinoa bowl with pre-cooked protein (10 min)",
      "Soup + salad combo (12 min)",
      
      // Dinner
      "Sheet pan chicken + vegetables (25 min)",
      "Stir-fry with frozen veggies (15 min)",
      "Pasta with marinara + lean protein (20 min)",
      
      // Snacks
      "Apple with almond butter",
      "Protein smoothie",
      "Veggie sticks with hummus"
    ];

    // Filter based on dietary restrictions
    return ideas.filter(idea => this.isCompatibleWithDiet(idea, profile));
  }

  // FITNESS FEATURES

  // Generate personalized workout routine
  generateWorkoutRoutine(profile: WorkoutProfile): WorkoutRoutine {
    const exercises = this.selectExercisesForProfile(profile);
    const warmup = this.getWarmupExercises();
    const cooldown = this.getCooldownExercises();

    const routine: WorkoutRoutine = {
      id: `workout_${Date.now()}`,
      name: `Custom ${profile.goals.join('/')} Workout`,
      type: this.determineWorkoutType(profile.goals),
      duration: profile.availableTime,
      difficulty: profile.fitnessLevel,
      equipment: profile.equipment,
      exercises: exercises.map(ex => ({
        exercise: ex,
        sets: this.determineSets(ex, profile),
        reps: this.determineReps(ex, profile),
        duration: ex.duration,
        restTime: this.determineRestTime(ex, profile),
      })),
      warmup,
      cooldown,
      totalCaloriesBurn: this.calculateCaloriesBurn(exercises, profile.availableTime),
      focusAreas: this.getFocusAreas(exercises)
    };

    return routine;
  }

  // Get workout suggestions
  getWorkoutSuggestions(profile: WorkoutProfile): WorkoutRoutine[] {
    return this.workoutDatabase
      .filter(workout => this.isWorkoutCompatible(workout, profile))
      .sort((a, b) => this.scoreWorkout(a, profile) - this.scoreWorkout(b, profile))
      .slice(0, 3);
  }

  // Quick exercise recommendations
  getQuickExercises(timeMinutes: number, equipment: string[] = ['bodyweight']): Exercise[] {
    return this.exerciseDatabase
      .filter(ex => equipment.some(eq => ex.equipment.includes(eq)))
      .slice(0, Math.floor(timeMinutes / 3)) // ~3 minutes per exercise
      .sort((a, b) => a.difficulty.localeCompare(b.difficulty));
  }

  // HELPER METHODS

  private getCompatibleRecipes(profile: NutritionProfile): Recipe[] {
    return this.nutritionDatabase.filter(recipe => {
      // Check dietary restrictions
      if (profile.dietaryRestrictions.length > 0) {
        const hasCompatibleDiet = profile.dietaryRestrictions.some(diet => 
          recipe.dietaryFriendly.includes(diet)
        );
        if (!hasCompatibleDiet && profile.dietaryRestrictions.length > 0) return false;
      }

      // Check prep time
      const maxPrepTime = profile.prepTime === 'quick' ? 15 : 
                         profile.prepTime === 'moderate' ? 45 : 999;
      if (recipe.prepTime + recipe.cookTime > maxPrepTime) return false;

      // Check calories (within 20% of target per meal)
      const mealCalories = profile.dailyCalories / profile.mealsPerDay;
      const calorieRange = mealCalories * 0.4; // 40% tolerance
      if (Math.abs(recipe.calories - mealCalories) > calorieRange) return false;

      return true;
    });
  }

  private selectRecipe(recipes: Recipe[], category: string, usedRecipes: Set<string>): Recipe {
    const categoryRecipes = recipes.filter(r => 
      r.category === category && !usedRecipes.has(r.id)
    );
    
    if (categoryRecipes.length === 0) {
      // Fallback to any unused recipe of the category
      const fallback = recipes.find(r => r.category === category);
      return fallback || recipes[0];
    }

    const selected = categoryRecipes[Math.floor(Math.random() * categoryRecipes.length)];
    usedRecipes.add(selected.id);
    return selected;
  }

  private scoreRecipe(recipe: Recipe, profile: NutritionProfile): number {
    let score = 0;
    
    // Prefer recipes matching dietary restrictions
    score += profile.dietaryRestrictions.filter(diet => 
      recipe.dietaryFriendly.includes(diet)
    ).length * 10;

    // Prefer appropriate prep time
    const maxTime = profile.prepTime === 'quick' ? 15 : 45;
    if (recipe.prepTime + recipe.cookTime <= maxTime) score += 5;

    // Prefer appropriate difficulty
    const skillScore = profile.cookingSkill === 'beginner' ? 
      (recipe.difficulty === 'easy' ? 5 : -5) : 0;
    score += skillScore;

    return score;
  }

  private generateShoppingList(meals: any[]): any[] {
    const ingredients = new Map();
    
    meals.forEach(dayMeal => {
      ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealType => {
        const meal = dayMeal[mealType];
        if (meal) {
          const recipes = Array.isArray(meal) ? meal : [meal];
          recipes.forEach((recipe: Recipe) => {
            recipe.ingredients.forEach(ing => {
              const key = ing.item.toLowerCase();
              if (ingredients.has(key)) {
                ingredients.set(key, ingredients.get(key) + 1);
              } else {
                ingredients.set(key, 1);
              }
            });
          });
        }
      });
    });

    return Array.from(ingredients.entries()).map(([item, quantity]) => ({
      item,
      quantity: `${quantity} units`,
      category: this.categorizeIngredient(item)
    }));
  }

  private categorizeIngredient(ingredient: string): string {
    const produce = ['apple', 'banana', 'spinach', 'tomato', 'onion', 'garlic', 'lemon'];
    const protein = ['chicken', 'beef', 'fish', 'tofu', 'eggs', 'beans'];
    const dairy = ['milk', 'cheese', 'yogurt', 'butter'];
    const grains = ['rice', 'pasta', 'bread', 'oats', 'quinoa'];

    if (produce.some(p => ingredient.includes(p))) return 'produce';
    if (protein.some(p => ingredient.includes(p))) return 'protein';
    if (dairy.some(p => ingredient.includes(p))) return 'dairy';
    if (grains.some(p => ingredient.includes(p))) return 'grains';
    
    return 'pantry';
  }

  private calculateNutritionSummary(meals: any[]) {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let days = 0;

    meals.forEach(dayMeal => {
      let dayCalories = 0;
      let dayProtein = 0;
      let dayCarbs = 0;
      let dayFats = 0;

      ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealType => {
        const meal = dayMeal[mealType];
        if (meal) {
          const recipes = Array.isArray(meal) ? meal : [meal];
          recipes.forEach((recipe: Recipe) => {
            dayCalories += recipe.calories;
            dayProtein += recipe.macros.protein;
            dayCarbs += recipe.macros.carbs;
            dayFats += recipe.macros.fats;
          });
        }
      });

      totalCalories += dayCalories;
      totalProtein += dayProtein;
      totalCarbs += dayCarbs;
      totalFats += dayFats;
      days++;
    });

    return {
      avgCalories: Math.round(totalCalories / days),
      avgMacros: {
        protein: Math.round(totalProtein / days),
        carbs: Math.round(totalCarbs / days),
        fats: Math.round(totalFats / days)
      }
    };
  }

  private estimateCost(shoppingList: any[]): number {
    // Simple cost estimation
    return shoppingList.length * 3.50; // Average $3.50 per item
  }

  private isCompatibleWithDiet(idea: string, profile: NutritionProfile): boolean {
    const lowerIdea = idea.toLowerCase();
    
    // Check restrictions
    if (profile.dietaryRestrictions.includes('vegan')) {
      if (lowerIdea.includes('chicken') || lowerIdea.includes('egg') || 
          lowerIdea.includes('yogurt') || lowerIdea.includes('cheese')) {
        return false;
      }
    }
    
    if (profile.dietaryRestrictions.includes('gluten_free')) {
      if (lowerIdea.includes('pasta') || lowerIdea.includes('bread') || 
          lowerIdea.includes('oats')) {
        return false;
      }
    }

    return true;
  }

  // Fitness helper methods
  private selectExercisesForProfile(profile: WorkoutProfile): Exercise[] {
    const availableExercises = this.exerciseDatabase.filter(ex => {
      // Check equipment compatibility
      const hasEquipment = ex.equipment.some(eq => profile.equipment.includes(eq as any));
      if (!hasEquipment) return false;

      // Check difficulty
      if (profile.fitnessLevel === 'beginner' && ex.difficulty === 'advanced') return false;

      return true;
    });

    // Select exercises based on goals
    const exerciseCount = Math.floor(profile.availableTime / 8); // ~8 min per exercise
    return availableExercises.slice(0, exerciseCount);
  }

  private determineWorkoutType(goals: string[]): WorkoutRoutine['type'] {
    if (goals.includes('strength') && goals.includes('cardio')) return 'mixed';
    if (goals.includes('strength')) return 'strength';
    if (goals.includes('cardio') || goals.includes('weight_loss')) return 'cardio';
    if (goals.includes('flexibility')) return 'flexibility';
    return 'mixed';
  }

  private determineSets(exercise: Exercise, profile: WorkoutProfile): number {
    if (exercise.category === 'cardio') return 1;
    
    switch (profile.fitnessLevel) {
      case 'beginner': return 2;
      case 'intermediate': return 3;
      case 'advanced': return 4;
      default: return 3;
    }
  }

  private determineReps(exercise: Exercise, profile: WorkoutProfile): string {
    if (exercise.category === 'cardio') return '30-60 seconds';
    
    switch (profile.fitnessLevel) {
      case 'beginner': return '8-10';
      case 'intermediate': return '10-12';
      case 'advanced': return '12-15';
      default: return '10-12';
    }
  }

  private determineRestTime(exercise: Exercise, profile: WorkoutProfile): number {
    if (exercise.category === 'strength') return profile.fitnessLevel === 'beginner' ? 60 : 45;
    return 30; // For cardio/other
  }

  private calculateCaloriesBurn(exercises: Exercise[], duration: number): number {
    const avgCaloriesPerMinute = exercises.reduce((acc, ex) => acc + ex.caloriesBurn, 0) / exercises.length;
    return Math.round(avgCaloriesPerMinute * duration);
  }

  private getFocusAreas(exercises: Exercise[]): string[] {
    const areas = new Set<string>();
    exercises.forEach(ex => ex.muscleGroups.forEach(mg => areas.add(mg)));
    return Array.from(areas);
  }

  private isWorkoutCompatible(workout: WorkoutRoutine, profile: WorkoutProfile): boolean {
    // Check equipment
    const hasEquipment = workout.equipment.every(eq => profile.equipment.includes(eq as any));
    if (!hasEquipment) return false;

    // Check duration
    if (workout.duration > profile.availableTime + 10) return false; // 10 min tolerance

    // Check difficulty
    if (profile.fitnessLevel === 'beginner' && workout.difficulty === 'advanced') return false;

    return true;
  }

  private scoreWorkout(workout: WorkoutRoutine, profile: WorkoutProfile): number {
    let score = 0;

    // Match goals
    const goalMatch = profile.goals.includes(workout.type as any) ? 10 : 0;
    score += goalMatch;

    // Prefer appropriate duration
    const durationDiff = Math.abs(workout.duration - profile.availableTime);
    score -= durationDiff / 10;

    return score;
  }

  private getWarmupExercises(): Exercise[] {
    return [
      {
        id: 'warmup_1',
        name: 'Arm Circles',
        category: 'flexibility',
        muscleGroups: ['shoulders'],
        equipment: ['bodyweight'],
        difficulty: 'beginner',
        instructions: ['Stand tall', 'Extend arms to sides', 'Make small circles'],
        tips: ['Start small, gradually increase size'],
        modifications: { easier: 'Sit in chair', harder: 'Add light weights' },
        duration: 30,
        caloriesBurn: 2
      }
    ];
  }

  private getCooldownExercises(): Exercise[] {
    return [
      {
        id: 'cooldown_1',
        name: 'Forward Fold Stretch',
        category: 'flexibility',
        muscleGroups: ['hamstrings', 'back'],
        equipment: ['bodyweight'],
        difficulty: 'beginner',
        instructions: ['Stand tall', 'Bend forward at hips', 'Let arms hang'],
        tips: ['Don\'t force the stretch'],
        modifications: { easier: 'Bend knees slightly', harder: 'Reach for toes' },
        duration: 30,
        caloriesBurn: 1
      }
    ];
  }

  // Comprehensive recipe database for all diet types
  private getSampleRecipes(): Recipe[] {
    return [
      // VEGETARIAN RECIPES
      {
        id: 'veg_breakfast_1',
        name: 'Greek Yogurt Berry Bowl',
        category: 'breakfast',
        cuisine: 'Mediterranean',
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        difficulty: 'easy',
        calories: 280,
        macros: { protein: 20, carbs: 35, fats: 8, fiber: 8 },
        ingredients: [
          { item: 'Greek yogurt', amount: '1 cup' },
          { item: 'Mixed berries', amount: '0.5 cup' },
          { item: 'Granola', amount: '2 tbsp' },
          { item: 'Honey', amount: '1 tsp' }
        ],
        instructions: [
          'Add yogurt to bowl',
          'Top with berries and granola',
          'Drizzle with honey'
        ],
        tags: ['quick', 'healthy', 'protein-rich'],
        dietaryFriendly: ['vegetarian', 'gluten_free']
      },

      // VEGAN RECIPES
      {
        id: 'vegan_breakfast_1',
        name: 'Chia Pudding Power Bowl',
        category: 'breakfast',
        cuisine: 'Modern',
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        difficulty: 'easy',
        calories: 320,
        macros: { protein: 12, carbs: 28, fats: 18, fiber: 12 },
        ingredients: [
          { item: 'Chia seeds', amount: '3 tbsp' },
          { item: 'Almond milk', amount: '1 cup' },
          { item: 'Maple syrup', amount: '1 tbsp' },
          { item: 'Banana', amount: '1 medium' },
          { item: 'Walnuts', amount: '2 tbsp' }
        ],
        instructions: [
          'Mix chia seeds with almond milk overnight',
          'Top with sliced banana and walnuts',
          'Drizzle with maple syrup'
        ],
        tags: ['overnight', 'plant-based', 'omega-3'],
        dietaryFriendly: ['vegan', 'gluten_free', 'dairy_free']
      },
      {
        id: 'vegan_lunch_1',
        name: 'Rainbow Buddha Bowl',
        category: 'lunch',
        cuisine: 'Asian-Fusion',
        prepTime: 15,
        cookTime: 20,
        servings: 1,
        difficulty: 'medium',
        calories: 450,
        macros: { protein: 22, carbs: 58, fats: 15, fiber: 14 },
        ingredients: [
          { item: 'Quinoa', amount: '0.5 cup' },
          { item: 'Chickpeas', amount: '0.5 cup' },
          { item: 'Purple cabbage', amount: '0.5 cup' },
          { item: 'Carrot', amount: '1 medium' },
          { item: 'Tahini', amount: '2 tbsp' },
          { item: 'Lemon juice', amount: '1 tbsp' }
        ],
        instructions: [
          'Cook quinoa and roast chickpeas',
          'Prepare vegetables',
          'Mix tahini dressing',
          'Assemble bowl and drizzle dressing'
        ],
        tags: ['colorful', 'complete-protein', 'antioxidants'],
        dietaryFriendly: ['vegan', 'gluten_free', 'dairy_free']
      },

      // KETO RECIPES  
      {
        id: 'keto_breakfast_1',
        name: 'Avocado Egg Boats',
        category: 'breakfast',
        cuisine: 'American',
        prepTime: 5,
        cookTime: 15,
        servings: 1,
        difficulty: 'easy',
        calories: 340,
        macros: { protein: 16, carbs: 6, fats: 28, fiber: 10 },
        ingredients: [
          { item: 'Avocado', amount: '1 large' },
          { item: 'Eggs', amount: '2 medium' },
          { item: 'Bacon bits', amount: '2 tbsp' },
          { item: 'Cheese', amount: '2 tbsp' },
          { item: 'Chives', amount: '1 tbsp' }
        ],
        instructions: [
          'Halve avocado, remove pit',
          'Crack eggs into avocado halves',
          'Bake at 400°F for 12-15 mins',
          'Top with bacon, cheese, chives'
        ],
        tags: ['high-fat', 'low-carb', 'filling'],
        dietaryFriendly: ['keto', 'low_carb', 'gluten_free']
      },
      {
        id: 'keto_dinner_1',
        name: 'Zucchini Lasagna',
        category: 'dinner',
        cuisine: 'Italian-Keto',
        prepTime: 20,
        cookTime: 45,
        servings: 4,
        difficulty: 'medium',
        calories: 420,
        macros: { protein: 32, carbs: 8, fats: 28, fiber: 4 },
        ingredients: [
          { item: 'Zucchini', amount: '3 large' },
          { item: 'Ground beef', amount: '1 lb' },
          { item: 'Ricotta cheese', amount: '1 cup' },
          { item: 'Mozzarella', amount: '1.5 cups' },
          { item: 'Marinara sauce', amount: '1 cup' }
        ],
        instructions: [
          'Slice zucchini thinly lengthwise',
          'Brown ground beef, add sauce',
          'Layer zucchini, meat, cheeses',
          'Bake covered 30 mins, uncovered 15 mins'
        ],
        tags: ['comfort-food', 'meal-prep', 'family-friendly'],
        dietaryFriendly: ['keto', 'low_carb', 'gluten_free']
      },

      // PALEO RECIPES
      {
        id: 'paleo_breakfast_1',
        name: 'Sweet Potato Hash',
        category: 'breakfast',
        cuisine: 'Paleo',
        prepTime: 10,
        cookTime: 20,
        servings: 2,
        difficulty: 'medium',
        calories: 380,
        macros: { protein: 24, carbs: 32, fats: 18, fiber: 6 },
        ingredients: [
          { item: 'Sweet potato', amount: '2 medium' },
          { item: 'Ground turkey', amount: '6 oz' },
          { item: 'Bell pepper', amount: '1 medium' },
          { item: 'Onion', amount: '0.5 medium' },
          { item: 'Coconut oil', amount: '2 tbsp' }
        ],
        instructions: [
          'Dice sweet potatoes, cook until tender',
          'Brown turkey in coconut oil',
          'Add peppers and onions',
          'Combine with sweet potatoes'
        ],
        tags: ['whole-food', 'protein-rich', 'anti-inflammatory'],
        dietaryFriendly: ['paleo', 'gluten_free', 'dairy_free']
      },

      // MEDITERRANEAN RECIPES
      {
        id: 'med_lunch_1',
        name: 'Mediterranean Quinoa Salad',
        category: 'lunch',
        cuisine: 'Mediterranean',
        prepTime: 15,
        cookTime: 15,
        servings: 2,
        difficulty: 'easy',
        calories: 390,
        macros: { protein: 14, carbs: 48, fats: 16, fiber: 8 },
        ingredients: [
          { item: 'Quinoa', amount: '1 cup' },
          { item: 'Cucumber', amount: '1 medium' },
          { item: 'Cherry tomatoes', amount: '1 cup' },
          { item: 'Kalamata olives', amount: '0.25 cup' },
          { item: 'Feta cheese', amount: '0.25 cup' },
          { item: 'Olive oil', amount: '2 tbsp' },
          { item: 'Lemon juice', amount: '2 tbsp' }
        ],
        instructions: [
          'Cook quinoa according to package',
          'Chop vegetables',
          'Mix olive oil and lemon dressing',
          'Combine all ingredients'
        ],
        tags: ['heart-healthy', 'complete-meal', 'make-ahead'],
        dietaryFriendly: ['mediterranean', 'vegetarian', 'gluten_free']
      },

      // GLUTEN-FREE RECIPES
      {
        id: 'gf_dinner_1',
        name: 'Salmon with Roasted Vegetables',
        category: 'dinner',
        cuisine: 'American',
        prepTime: 15,
        cookTime: 25,
        servings: 2,
        difficulty: 'easy',
        calories: 450,
        macros: { protein: 38, carbs: 24, fats: 22, fiber: 8 },
        ingredients: [
          { item: 'Salmon fillet', amount: '8 oz' },
          { item: 'Asparagus', amount: '1 bunch' },
          { item: 'Brussels sprouts', amount: '1 cup' },
          { item: 'Olive oil', amount: '2 tbsp' },
          { item: 'Lemon', amount: '1 medium' },
          { item: 'Herbs', amount: '2 tsp' }
        ],
        instructions: [
          'Preheat oven to 425°F',
          'Toss vegetables with oil and herbs',
          'Place salmon and vegetables on sheet pan',
          'Bake 18-22 minutes, squeeze lemon'
        ],
        tags: ['omega-3', 'one-pan', 'nutrient-dense'],
        dietaryFriendly: ['gluten_free', 'dairy_free', 'paleo']
      },

      // LOW-CARB RECIPES
      {
        id: 'lc_lunch_1',
        name: 'Chicken Caesar Lettuce Wraps',
        category: 'lunch',
        cuisine: 'American',
        prepTime: 10,
        cookTime: 0,
        servings: 1,
        difficulty: 'easy',
        calories: 320,
        macros: { protein: 28, carbs: 8, fats: 20, fiber: 4 },
        ingredients: [
          { item: 'Grilled chicken', amount: '4 oz' },
          { item: 'Romaine lettuce', amount: '6 leaves' },
          { item: 'Parmesan cheese', amount: '2 tbsp' },
          { item: 'Caesar dressing', amount: '2 tbsp' },
          { item: 'Cherry tomatoes', amount: '0.25 cup' }
        ],
        instructions: [
          'Wash and dry lettuce leaves',
          'Slice grilled chicken',
          'Fill lettuce with chicken and tomatoes',
          'Top with cheese and dressing'
        ],
        tags: ['no-cook', 'portable', 'protein-rich'],
        dietaryFriendly: ['low_carb', 'gluten_free']
      },

      // DAIRY-FREE RECIPES
      {
        id: 'df_snack_1',
        name: 'Energy Balls',
        category: 'snack',
        cuisine: 'Modern',
        prepTime: 10,
        cookTime: 0,
        servings: 8,
        difficulty: 'easy',
        calories: 120,
        macros: { protein: 4, carbs: 14, fats: 6, fiber: 3 },
        ingredients: [
          { item: 'Dates', amount: '1 cup' },
          { item: 'Almonds', amount: '0.5 cup' },
          { item: 'Coconut flakes', amount: '0.25 cup' },
          { item: 'Chia seeds', amount: '1 tbsp' },
          { item: 'Vanilla extract', amount: '1 tsp' }
        ],
        instructions: [
          'Pit dates and soak 10 minutes',
          'Blend all ingredients in food processor',
          'Roll into 8 balls',
          'Refrigerate 30 minutes to firm'
        ],
        tags: ['no-bake', 'portable', 'natural-sweetener'],
        dietaryFriendly: ['vegan', 'dairy_free', 'gluten_free', 'paleo']
      }
    ];
  }

  private getSampleExercises(): Exercise[] {
    return [
      {
        id: 'exercise_1',
        name: 'Push-ups',
        category: 'strength',
        muscleGroups: ['chest', 'shoulders', 'triceps'],
        equipment: ['bodyweight'],
        difficulty: 'intermediate',
        instructions: [
          'Start in plank position',
          'Lower body to ground',
          'Push back up to start'
        ],
        tips: ['Keep core tight', 'Full range of motion'],
        modifications: {
          easier: 'Do on knees or against wall',
          harder: 'Add feet elevation or single arm'
        },
        reps: '8-15',
        caloriesBurn: 8
      },
      {
        id: 'exercise_2',
        name: 'Bodyweight Squats',
        category: 'strength',
        muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
        equipment: ['bodyweight'],
        difficulty: 'beginner',
        instructions: [
          'Stand with feet shoulder-width apart',
          'Lower down as if sitting in chair',
          'Return to standing'
        ],
        tips: ['Keep chest up', 'Weight in heels'],
        modifications: {
          easier: 'Use chair for support',
          harder: 'Add jump or single leg'
        },
        reps: '12-20',
        caloriesBurn: 6
      },
      {
        id: 'exercise_3',
        name: 'Jumping Jacks',
        category: 'cardio',
        muscleGroups: ['full body'],
        equipment: ['bodyweight'],
        difficulty: 'beginner',
        instructions: [
          'Start with feet together',
          'Jump feet out while raising arms',
          'Return to start position'
        ],
        tips: ['Land softly', 'Keep rhythm steady'],
        modifications: {
          easier: 'Step side to side instead of jumping',
          harder: 'Add squat between jacks'
        },
        duration: 60,
        caloriesBurn: 12
      }
    ];
  }

  private getSampleWorkouts(): WorkoutRoutine[] {
    return [
      {
        id: 'workout_1',
        name: 'Quick Full Body HIIT',
        type: 'hiit',
        duration: 20,
        difficulty: 'intermediate',
        equipment: ['bodyweight'],
        exercises: [
          {
            exercise: this.exerciseDatabase[0], // Push-ups
            sets: 3,
            reps: '10-15',
            restTime: 30
          },
          {
            exercise: this.exerciseDatabase[1], // Squats
            sets: 3,
            reps: '15-20',
            restTime: 30
          }
        ],
        warmup: this.getWarmupExercises(),
        cooldown: this.getCooldownExercises(),
        totalCaloriesBurn: 180,
        focusAreas: ['full body', 'cardiovascular']
      }
    ];
  }
}

export const nutritionFitnessAI = new NutritionFitnessAI();