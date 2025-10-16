import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useHabitStore } from '../state/habitStore';
import { getTheme } from '../utils/theme';
import AppNavigator from './AppNavigator';
import OnboardingScreen from '../screens/OnboardingScreen';

type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { settings } = useHabitStore();
  const theme = getTheme(settings.theme);
  
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: theme.background }
      }}
      initialRouteName={settings.hasCompletedOnboarding ? 'Main' : 'Onboarding'}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={AppNavigator} />
    </Stack.Navigator>
  );
};

export default RootNavigator;