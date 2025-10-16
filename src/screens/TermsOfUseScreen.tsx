import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../state/habitStore';
import { getTheme } from '../utils/theme';

interface TermsOfUseScreenProps {
  navigation: any;
}

const TermsOfUseScreen: React.FC<TermsOfUseScreenProps> = ({ navigation }) => {
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
            Terms of Use
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
              Agreement to Terms
            </Text>
            <Text 
              className="text-base leading-6"
              style={{ color: theme.textSecondary }}
            >
              By downloading, installing, or using Habit Hero, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the app.
            </Text>
          </View>
          
          {/* Description of Service */}
          <View className="mb-6">
            <Text 
              className="text-lg font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Description of Service
            </Text>
            <Text 
              className="text-base leading-6"
              style={{ color: theme.textSecondary }}
            >
              Habit Hero is a mobile application designed to help users track and build positive habits. The app allows you to create habits, monitor your progress, and visualize your consistency over time. All data is stored locally on your device.
            </Text>
          </View>
          
          {/* Acceptable Use */}
          <View className="mb-6">
            <Text 
              className="text-lg font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Acceptable Use
            </Text>
            <Text 
              className="text-base leading-6 mb-3"
              style={{ color: theme.textSecondary }}
            >
              You agree to use Habit Hero only for lawful purposes and in accordance with these Terms. You agree not to:
            </Text>
            <Text 
              className="text-base leading-6 ml-4"
              style={{ color: theme.textSecondary }}
            >
              • Use the app for any illegal or unauthorized purpose{'\n'}
              • Attempt to reverse engineer, decompile, or hack the app{'\n'}
              • Use the app in any way that could damage or impair the service{'\n'}
              • Violate any applicable laws or regulations
            </Text>
          </View>
          
          {/* Intellectual Property */}
          <View className="mb-6">
            <Text 
              className="text-lg font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Intellectual Property
            </Text>
            <Text 
              className="text-base leading-6"
              style={{ color: theme.textSecondary }}
            >
              Habit Hero and all its content, features, and functionality are owned by us and are protected by copyright, trademark, and other intellectual property laws. You are granted a limited, non-exclusive license to use the app for personal purposes.
            </Text>
          </View>
          
          {/* User Data */}
          <View className="mb-6">
            <Text 
              className="text-lg font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Your Data
            </Text>
            <Text 
              className="text-base leading-6"
              style={{ color: theme.textSecondary }}
            >
              You retain full ownership of any data you enter into the app. Since all data is stored locally on your device, you have complete control over it. You are responsible for backing up your data and keeping it secure.
            </Text>
          </View>
          
          {/* Disclaimers */}
          <View className="mb-6">
            <Text 
              className="text-lg font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Disclaimers
            </Text>
            <Text 
              className="text-base leading-6"
              style={{ color: theme.textSecondary }}
            >
              Habit Hero is provided "as is" without any warranties, express or implied. We do not guarantee that the app will be error-free, secure, or always available. The app is intended for general wellness and productivity purposes and is not a substitute for professional medical or psychological advice.
            </Text>
          </View>
          
          {/* Limitation of Liability */}
          <View className="mb-6">
            <Text 
              className="text-lg font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Limitation of Liability
            </Text>
            <Text 
              className="text-base leading-6"
              style={{ color: theme.textSecondary }}
            >
              To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the app.
            </Text>
          </View>
          
          {/* Updates and Modifications */}
          <View className="mb-6">
            <Text 
              className="text-lg font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Updates and Modifications
            </Text>
            <Text 
              className="text-base leading-6"
              style={{ color: theme.textSecondary }}
            >
              We may update or modify these Terms of Use at any time. Changes will be effective when posted in the app. Your continued use of the app after any changes indicates your acceptance of the new terms.
            </Text>
          </View>
          
          {/* Termination */}
          <View className="mb-6">
            <Text 
              className="text-lg font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Termination
            </Text>
            <Text 
              className="text-base leading-6"
              style={{ color: theme.textSecondary }}
            >
              You may stop using the app at any time by simply deleting it from your device. These Terms will remain in effect until terminated. We may terminate or suspend your access to the app immediately, without prior notice, if you violate these Terms.
            </Text>
          </View>
          
          {/* Governing Law */}
          <View className="mb-6">
            <Text 
              className="text-lg font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Governing Law
            </Text>
            <Text 
              className="text-base leading-6"
              style={{ color: theme.textSecondary }}
            >
              These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms or your use of the app will be resolved through appropriate legal channels.
            </Text>
          </View>
          
          {/* Contact Information */}
          <View className="mb-8">
            <Text 
              className="text-lg font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Contact Us
            </Text>
            <Text 
              className="text-base leading-6"
              style={{ color: theme.textSecondary }}
            >
              If you have any questions about these Terms of Use, please contact us through the app store where you downloaded this application.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default TermsOfUseScreen;