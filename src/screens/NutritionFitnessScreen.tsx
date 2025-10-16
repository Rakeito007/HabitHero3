import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../state/habitStore';
import { getTheme } from '../utils/theme';


interface NutritionFitnessScreenProps {
  navigation: any;
}

const NutritionFitnessScreen: React.FC<NutritionFitnessScreenProps> = ({ navigation }) => {
  const { settings } = useHabitStore();
  const theme = getTheme(settings.theme);
  const [activeTab, setActiveTab] = useState<'nutrition' | 'fitness'>('nutrition');
  const [mealIdeas, setMealIdeas] = useState<string[]>([]);
  const [workoutSuggestions, setWorkoutSuggestions] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const ideas = [
      'Greek yogurt with berries and granola',
      'Quinoa bowl with roasted vegetables',
      'Grilled chicken with sweet potato',
      'Overnight oats with banana and nuts'
    ];
    const exercises = [
      { name: 'Push-ups', reps: '10-15', difficulty: 'beginner', muscleGroups: ['chest', 'arms'], caloriesBurn: 5 },
      { name: 'Squats', reps: '15-20', difficulty: 'beginner', muscleGroups: ['legs', 'glutes'], caloriesBurn: 6 },
      { name: 'Plank', duration: 30, difficulty: 'intermediate', muscleGroups: ['core'], caloriesBurn: 4 }
    ];
    
    setMealIdeas(ideas);
    setWorkoutSuggestions(exercises);
  };

  const generateMealPlan = () => {
    // Meal plan generation would be implemented here
    console.log('Meal plan feature coming soon');
  };

  const generateWorkout = () => {
    // Workout generation would be implemented here
    console.log('Workout generator coming soon');
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <View className="flex-row items-center justify-between p-6">
        <View>
          <Text className="text-2xl font-bold" style={{ color: theme.text }}>
            Nutrition & Fitness
          </Text>
          <Text className="text-sm mt-1" style={{ color: theme.textSecondary }}>
            Health & Wellness Hub
          </Text>
        </View>
        
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: theme.surface }}
        >
          <Ionicons name="close" size={20} color={theme.text} />
        </Pressable>
      </View>

      {/* Tab Selector */}
      <View className="flex-row mx-6 mb-6 p-1 rounded-xl" style={{ backgroundColor: theme.surface }}>
        <Pressable
          onPress={() => setActiveTab('nutrition')}
          className="flex-1 py-3 rounded-lg items-center"
          style={{ 
            backgroundColor: activeTab === 'nutrition' ? theme.primary : 'transparent' 
          }}
        >
          <Text 
            className="font-medium"
            style={{ 
              color: activeTab === 'nutrition' ? 'white' : theme.text 
            }}
          >
            🥗 Nutrition
          </Text>
        </Pressable>
        
        <Pressable
          onPress={() => setActiveTab('fitness')}
          className="flex-1 py-3 rounded-lg items-center"
          style={{ 
            backgroundColor: activeTab === 'fitness' ? theme.primary : 'transparent' 
          }}
        >
          <Text 
            className="font-medium"
            style={{ 
              color: activeTab === 'fitness' ? 'white' : theme.text 
            }}
          >
            💪 Fitness
          </Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {activeTab === 'nutrition' ? (
          <View className="px-6">
            {/* Quick Actions */}
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                Quick Actions
              </Text>
              
              <View className="flex-row space-x-3">
                <Pressable
                  onPress={generateMealPlan}
                  className="flex-1 p-4 rounded-xl"
                  style={{ backgroundColor: theme.success + '20' }}
                >
                  <Ionicons name="calendar" size={24} color={theme.success} />
                  <Text 
                    className="text-base font-medium mt-2"
                    style={{ color: theme.text }}
                  >
                    7-Day Meal Plan
                  </Text>
                  <Text 
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Custom recipes
                  </Text>
                </Pressable>
                
                <Pressable
                  onPress={() => {/* Show recipes */}}
                  className="flex-1 p-4 rounded-xl"
                  style={{ backgroundColor: theme.warning + '20' }}
                >
                  <Ionicons name="restaurant" size={24} color={theme.warning} />
                  <Text 
                    className="text-base font-medium mt-2"
                    style={{ color: theme.text }}
                  >
                    Quick Recipes
                  </Text>
                  <Text 
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Under 15 min
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Meal Ideas */}
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                Quick Meal Ideas
              </Text>
              
              {mealIdeas.map((idea, index) => (
                <View 
                  key={index}
                  className="p-4 rounded-xl mb-3 flex-row items-center"
                  style={{ backgroundColor: theme.surface }}
                >
                  <View 
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: theme.primary + '20' }}
                  >
                    <Ionicons name="nutrition" size={20} color={theme.primary} />
                  </View>
                  
                  <View className="flex-1">
                    <Text 
                      className="text-base font-medium"
                      style={{ color: theme.text }}
                    >
                      {idea}
                    </Text>
                  </View>
                  
                  <Ionicons name="chevron-forward" size={16} color={theme.textTertiary} />
                </View>
              ))}
            </View>

            {/* Nutrition Tips */}
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                Nutrition Tips
              </Text>
              
              <View 
                className="p-4 rounded-xl"
                style={{ backgroundColor: theme.primary + '10' }}
              >
                <Text 
                  className="text-base leading-6"
                  style={{ color: theme.text }}
                >
                  🥗 Start with simple swaps: replace one snack with fruit daily
                  {'\n\n'}💧 Track water intake - aim for 8 glasses
                  {'\n\n'}🍳 Prep ingredients the night before for quick mornings
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="px-6">
            {/* Quick Actions */}
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                Quick Actions
              </Text>
              
              <View className="flex-row space-x-3">
                <Pressable
                  onPress={generateWorkout}
                  className="flex-1 p-4 rounded-xl"
                  style={{ backgroundColor: theme.error + '20' }}
                >
                  <Ionicons name="fitness" size={24} color={theme.error} />
                  <Text 
                    className="text-base font-medium mt-2"
                    style={{ color: theme.text }}
                  >
                    Custom Workout
                  </Text>
                  <Text 
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Your level & time
                  </Text>
                </Pressable>
                
                <Pressable
                  onPress={() => {/* Show quick exercises */}}
                  className="flex-1 p-4 rounded-xl"
                  style={{ backgroundColor: theme.secondary + '20' }}
                >
                  <Ionicons name="timer" size={24} color={theme.secondary} />
                  <Text 
                    className="text-base font-medium mt-2"
                    style={{ color: theme.text }}
                  >
                    5-Min Energy
                  </Text>
                  <Text 
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Quick boost
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Exercise Suggestions */}
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                Recommended Exercises
              </Text>
              
              {workoutSuggestions.map((exercise, index) => (
                <View 
                  key={index}
                  className="p-4 rounded-xl mb-3"
                  style={{ backgroundColor: theme.surface }}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <Text 
                      className="text-base font-medium"
                      style={{ color: theme.text }}
                    >
                      {exercise.name}
                    </Text>
                    <View 
                      className="px-2 py-1 rounded"
                      style={{ 
                        backgroundColor: exercise.difficulty === 'beginner' ? theme.success + '20' :
                                       exercise.difficulty === 'intermediate' ? theme.warning + '20' :
                                       theme.error + '20'
                      }}
                    >
                      <Text 
                        className="text-xs font-medium"
                        style={{ 
                          color: exercise.difficulty === 'beginner' ? theme.success :
                                 exercise.difficulty === 'intermediate' ? theme.warning :
                                 theme.error
                        }}
                      >
                        {exercise.difficulty}
                      </Text>
                    </View>
                  </View>
                  
                  <Text 
                    className="text-sm mb-2"
                    style={{ color: theme.textSecondary }}
                  >
                    {exercise.reps || `${exercise.duration}s`} • {exercise.muscleGroups.join(', ')}
                  </Text>
                  
                  <Text 
                    className="text-sm"
                    style={{ color: theme.textTertiary }}
                  >
                    🔥 ~{exercise.caloriesBurn} cal/min
                  </Text>
                </View>
              ))}
            </View>

            {/* Fitness Tips */}
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                Fitness Tips
              </Text>
              
              <View 
                className="p-4 rounded-xl"
                style={{ backgroundColor: theme.primary + '10' }}
              >
                <Text 
                  className="text-base leading-6"
                  style={{ color: theme.text }}
                >
                  💪 Start with bodyweight - no equipment needed
                  {'\n\n'}⏰ Even 5 minutes counts toward your goals
                  {'\n\n'}🎯 Focus on form over speed for better results
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NutritionFitnessScreen;