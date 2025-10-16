import { useHabitStore } from '../state/habitStore';


export const useProFeatures = () => {
  const { settings } = useHabitStore();
  
  // Ensure subscription defaults to 'free' if not set
  const subscriptionStatus = settings.subscriptionStatus || 'free';
  const isProUser = subscriptionStatus === 'monthly' || subscriptionStatus === 'lifetime';
  
  // Debug logging removed for production
  
  return {
    isProUser,
    subscriptionType: subscriptionStatus,
    canAccessAnalytics: isProUser,
    canExportData: isProUser,
    canAddUnlimitedHabits: isProUser,
    maxHabitsForFree: 5
  };
};

export const getProFeatureList = () => [
  'Unlimited habits (vs 5 free)',
  'Detailed analytics & insights', 
  'Data export & backup',
  'Priority support',
  'Future premium features'
];

export const showUpgradePrompt = (featureName: string) => {
  return {
    title: `${featureName} - PRO Feature`,
    message: `Unlock ${featureName.toLowerCase()} and all premium features with Habit Hero PRO.`,
    features: getProFeatureList()
  };
};