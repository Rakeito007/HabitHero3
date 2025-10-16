import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useHabitStore } from '../state/habitStore';
import { getTheme } from '../utils/theme';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import AddHabitScreen from '../screens/AddHabitScreen';
import EditHabitScreen from '../screens/EditHabitScreen';
import HabitDetailScreen from '../screens/HabitDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfUseScreen from '../screens/TermsOfUseScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import HabitTemplatesScreen from '../screens/HabitTemplatesScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import ThemeSelectionScreen from '../screens/ThemeSelectionScreen';

import NutritionFitnessScreen from '../screens/NutritionFitnessScreen';

export type RootStackParamList = {
  Dashboard: undefined;
  AddHabit: undefined;
  EditHabit: { habitId: string };
  HabitDetail: { habitId: string };
  Settings: { showSubscriptionPlans?: boolean };
  PrivacyPolicy: undefined;
  TermsOfUse: undefined;
  Onboarding: undefined;
  HabitTemplates: undefined;
  Achievements: undefined;
  ThemeSelection: undefined;

  NutritionFitness: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { settings } = useHabitStore();
  const theme = getTheme(settings.theme);
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
      />
      
      <Stack.Screen 
        name="AddHabit" 
        component={AddHabitScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      
      <Stack.Screen 
        name="EditHabit" 
        component={EditHabitScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      
      <Stack.Screen 
        name="HabitDetail" 
        component={HabitDetailScreen}
      />
      
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
      />
      
      <Stack.Screen 
        name="PrivacyPolicy" 
        component={PrivacyPolicyScreen}
      />
      
      <Stack.Screen 
        name="TermsOfUse" 
        component={TermsOfUseScreen}
      />
      
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen}
      />
      
      <Stack.Screen 
        name="HabitTemplates" 
        component={HabitTemplatesScreen}
      />
      
      <Stack.Screen 
        name="Achievements" 
        component={AchievementsScreen}
      />
      
      <Stack.Screen 
        name="ThemeSelection" 
        component={ThemeSelectionScreen}
      />

      
      <Stack.Screen 
        name="NutritionFitness" 
        component={NutritionFitnessScreen}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;