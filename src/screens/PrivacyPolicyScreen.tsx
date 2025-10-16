import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../state/habitStore';
import { getTheme } from '../utils/theme';

interface PrivacyPolicyScreenProps {
  navigation: any;
}

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ navigation }) => {
  const { settings } = useHabitStore();
  const theme = getTheme(settings.theme);
  
  const lastUpdated = "January 2025";
  
  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-6 py-4">
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </Pressable>
          
          <Text 
            className="text-xl font-semibold ml-4"
            style={{ color: theme.text }}
          >
            Privacy Policy
          </Text>
        </View>
        
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {/* Last Updated */}
          <View className="mb-6">
            <Text 
              className="text-sm"
              style={{ color: theme.textSecondary }}
            >
              Last updated: {lastUpdated}
            </Text>
          </View>
          
          {/* Introduction */}
          <View className="mb-6">
            <Text 
              className="text-lg font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Your Privacy Matters
            </Text>
            <Text 
              className="text-base leading-6"
              style={{ color: theme.textSecondary }}
            >
              This Privacy Policy explains how Habit Hero handles your personal information. We are committed to protecting your privacy and ensuring your data remains secure and private.
            </Text>
          </View>
          
          {/* Data Collection */}
          <View className="mb-6">
            <Text 
              className="text-lg font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Data Collection
            </Text>
            <Text 
              className="text-base leading-6 mb-3"
              style={{ color: theme.textSecondary }}
            >
              We do NOT collect any personal data from you. All information you enter into the app, including:
            </Text>
            <Text 
              className="text-base leading-6 ml-4"
              style={{ color: theme.textSecondary }}
            >
              • Habit names and descriptions{'\n'}
              • Progress tracking data{'\n'}
              • App settings and preferences{'\n'}
              • Usage statistics
            </Text>
            <Text 
              className="text-base leading-6 mt-3"
              style={{ color: theme.textSecondary }}
            >
              All of this information is stored locally on your device and never transmitted to our servers or any third parties.
            </Text>
          </View>
          
          {/* Data Storage */}
          <View className="mb-6">
            <Text 
              className="text-lg font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Data Storage
            </Text>
            <Text 
              className="text-base leading-6"
              style={{ color: theme.textSecondary }}
            >
              Your habit data is stored locally on your device using secure storage mechanisms. This data remains on your device and is never uploaded to external servers. You have complete control over your data and can export or delete it at any time through the app settings.
            </Text>
          </View>
          
          {/* Third-Party Services */}
          <View className="mb-6">
            <Text 
              className="text-lg font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Third-Party Services
            </Text>
            <Text 
              className="text-base leading-6"
              style={{ color: theme.textSecondary }}
            >
              Habit Hero does not integrate with any third-party analytics, advertising, or data collection services. We do not use cookies, tracking pixels, or any other tracking technologies.
            </Text>
          </View>
          
          {/* Data Security */}
          <View className="mb-6">
            <Text 
              className="text-lg font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Data Security
            </Text>
            <Text 
              className="text-base leading-6"
              style={{ color: theme.textSecondary }}
            >
              Since all data is stored locally on your device, your information is as secure as your device itself. We recommend using device security features like screen locks, biometric authentication, and device encryption to protect your data.
            </Text>
          </View>
          
          {/* Data Backup and Export */}
          <View className="mb-6">
            <Text 
              className="text-lg font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Data Backup and Export
            </Text>
            <Text 
              className="text-base leading-6"
              style={{ color: theme.textSecondary }}
            >
              You can export your habit data at any time through the app settings. This feature allows you to create backups of your data or transfer it to another device. The exported data is in a standard format and contains only the information you've entered into the app.
            </Text>
          </View>
          
          {/* Children's Privacy */}
          <View className="mb-6">
            <Text 
              className="text-lg font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Children's Privacy
            </Text>
            <Text 
              className="text-base leading-6"
              style={{ color: theme.textSecondary }}
            >
              Our app does not collect any personal information from anyone, including children under the age of 13. Since all data remains local to the device, there are no additional privacy concerns for younger users.
            </Text>
          </View>
          
          {/* Changes to Privacy Policy */}
          <View className="mb-6">
            <Text 
              className="text-lg font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Changes to This Privacy Policy
            </Text>
            <Text 
              className="text-base leading-6"
              style={{ color: theme.textSecondary }}
            >
              We may update this Privacy Policy from time to time. Any changes will be reflected in the app and the "Last updated" date will be revised. Since we don't collect your contact information, we recommend checking this policy periodically for updates.
            </Text>
          </View>
          
          {/* Contact Information */}
          <View className="mb-8">
            <Text 
              className="text-lg font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Questions?
            </Text>
            <Text 
              className="text-base leading-6"
              style={{ color: theme.textSecondary }}
            >
              If you have any questions about this Privacy Policy or our privacy practices, please contact us through the app store where you downloaded this application.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default PrivacyPolicyScreen;