import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../state/habitStore';
import { getTheme } from '../utils/theme';
import { SubscriptionStatus } from '../types/habit';
import { initializeSampleData } from '../utils/sampleData';
import { iapService, PRODUCT_IDS } from '../services/iapService';

interface OnboardingScreenProps {
  navigation: any;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const { settings, updateSubscription, completeOnboarding } = useHabitStore();
  const theme = getTheme(settings.theme);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionStatus>('free');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Initialize IAP service
    iapService.initialize();
  }, []);

  const subscriptionPlans = [
    {
      id: 'free' as SubscriptionStatus,
      title: 'Free',
      price: '$0',
      period: '',
      features: [
        'Track up to 3 habits',
        'Basic progress charts',
        'Local data storage',
        'Light & dark themes'
      ],
      popular: false,
      color: theme.textSecondary,
    },
    {
      id: 'monthly' as SubscriptionStatus,
      title: 'Pro Monthly',
      price: '$1.99',
      period: '/month',
      features: [
        'Unlimited habits',
        'Advanced analytics',
        'Data export & import',
        'Premium customization',
        'Priority support'
      ],
      popular: false,
      color: theme.primary,
    },
    {
      id: 'yearly' as SubscriptionStatus,
      title: 'Pro Yearly',
      price: '$19.99',
      period: '/year',
      features: [
        'All Pro Monthly features',
        'Save 17% vs monthly',
        'Best value subscription',
        'Priority support',
        'Cancel anytime'
      ],
      popular: false,
      color: theme.secondary,
    },
    {
      id: 'lifetime' as SubscriptionStatus,
      title: 'Pro Lifetime',
      price: '$25.00',
      period: 'one-time',
      features: [
        'All Pro features forever',
        'No recurring payments',
        'Future updates included',
        'Premium support',
        'Best value!'
      ],
      popular: true,
      color: theme.success,
    },
  ];

  const handleSubscribe = async (planId: SubscriptionStatus) => {
    if (planId === 'free') {
      completeOnboarding();
      
      // Add sample data for free users
      setTimeout(() => {
        initializeSampleData();
      }, 100);
      
      navigation.replace('Main');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Get the product ID for the selected plan
      const productId = planId === 'monthly' ? PRODUCT_IDS.MONTHLY : 
                       planId === 'yearly' ? PRODUCT_IDS.YEARLY :
                       PRODUCT_IDS.LIFETIME;
      
      // Attempt real purchase through Apple
      const success = await iapService.purchaseProduct(productId);
      
      if (success) {
        // Update subscription status
        updateSubscription(planId);
        completeOnboarding();
        
        // Add sample data after subscription
        setTimeout(() => {
          initializeSampleData();
        }, 100);
        
        Alert.alert(
          'Purchase Successful!',
          `Welcome to Habit Hero Pro! Your ${planId === 'monthly' ? 'monthly' : planId === 'yearly' ? 'yearly' : 'lifetime'} subscription is now active.`,
          [
            {
              text: 'Get Started',
              onPress: () => navigation.replace('Main'),
            },
          ]
        );
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert(
        'Purchase Failed',
        'Unable to complete your purchase. Please try again.',
        [{ text: 'OK' }]
      );
      setIsProcessing(false);
    }
  };

  const PlanCard = ({ plan, isSelected, onSelect }: any) => (
    <Pressable
      onPress={() => {
        setSelectedPlan(plan.id);
        onSelect(plan.id);
      }}
      className={`rounded-2xl p-6 mb-4 border-2 ${plan.popular ? 'relative' : ''}`}
      style={{
        backgroundColor: isSelected ? plan.color + '10' : theme.cardBackground,
        borderColor: isSelected ? plan.color : theme.border,
      }}
    >
      {plan.popular && (
        <View 
          className="absolute -top-3 left-4 px-3 py-1 rounded-full"
          style={{ backgroundColor: plan.color }}
        >
          <Text className="text-white text-xs font-bold">MOST POPULAR</Text>
        </View>
      )}
      
      <View className="items-center mb-4">
        <Text 
          className="text-xl font-bold mb-1"
          style={{ color: theme.text }}
        >
          {plan.title}
        </Text>
        <View className="flex-row items-baseline">
          <Text 
            className="text-3xl font-bold"
            style={{ color: plan.color }}
          >
            {plan.price}
          </Text>
          {plan.period && (
            <Text 
              className="text-base ml-1"
              style={{ color: theme.textSecondary }}
            >
              {plan.period}
            </Text>
          )}
        </View>
      </View>
      
      <View className="space-y-3">
        {plan.features.map((feature: string, index: number) => (
          <View key={index} className="flex-row items-center">
            <Ionicons 
              name="checkmark-circle" 
              size={20} 
              color={plan.color} 
              style={{ marginRight: 12 }}
            />
            <Text 
              className="text-base flex-1"
              style={{ color: theme.text }}
            >
              {feature}
            </Text>
          </View>
        ))}
      </View>
      
      {isSelected && (
        <View className="mt-4 pt-4" style={{ borderTopColor: theme.border, borderTopWidth: 1 }}>
          <View className="flex-row items-center justify-center">
            <Ionicons name="checkmark-circle" size={20} color={plan.color} />
            <Text 
              className="text-base font-medium ml-2"
              style={{ color: plan.color }}
            >
              Selected
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-6 py-4">
          <View className="items-center mb-2">
            <View 
              className="w-16 h-16 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: theme.primary + '20' }}
            >
              <Ionicons name="trophy" size={32} color={theme.primary} />
            </View>
            <Text 
              className="text-3xl font-bold text-center"
              style={{ color: theme.text }}
            >
              Welcome to Habit Hero!
            </Text>
            <Text 
              className="text-lg text-center mt-2"
              style={{ color: theme.textSecondary }}
            >
              Choose your plan to start building better habits
            </Text>
          </View>
        </View>
        
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {subscriptionPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
              onSelect={setSelectedPlan}
            />
          ))}
          
          {/* Continue Button */}
          <Pressable
            onPress={() => handleSubscribe(selectedPlan)}
            disabled={isProcessing}
            className="mt-4 mb-6 py-4 px-6 rounded-2xl items-center"
            style={{ 
              backgroundColor: isProcessing ? theme.textTertiary : theme.primary,
              opacity: isProcessing ? 0.6 : 1
            }}
          >
            {isProcessing ? (
              <Text className="text-white font-bold text-lg">Processing...</Text>
            ) : (
              <Text className="text-white font-bold text-lg">
                {selectedPlan === 'free' ? 'Continue with Free' : `Subscribe ${selectedPlan === 'monthly' ? 'Monthly' : 'Lifetime'}`}
              </Text>
            )}
          </Pressable>
          
          {/* Terms */}
          <View className="items-center mb-8">
            <Text 
              className="text-xs text-center leading-4"
              style={{ color: theme.textTertiary }}
            >
              By continuing, you agree to our Terms of Use and Privacy Policy.{'\n'}
              Subscriptions auto-renew unless cancelled 24 hours before renewal.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default OnboardingScreen;