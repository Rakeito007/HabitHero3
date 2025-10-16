import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../state/habitStore';
import { getTheme } from '../utils/theme';
import { habitTemplates, categoryInfo } from '../data/habitTemplates';
import { HabitCategory, HabitTemplate } from '../types/templates';
import { showSuccessNotification } from '../components/NotificationManager';

interface HabitTemplatesScreenProps {
  navigation: any;
}

const HabitTemplatesScreen: React.FC<HabitTemplatesScreenProps> = ({ navigation }) => {
  const { addHabit, settings } = useHabitStore();
  const theme = getTheme(settings.theme);

  const [searchQuery, setSearchQuery] = useState('');



  const filteredTemplates = habitTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleUseTemplate = (template: HabitTemplate) => {
    try {
      addHabit({
        name: template.name,
        description: template.description,
        icon: template.icon,
        color: template.color,
        targetFrequency: template.targetFrequency,
        archived: false,
      });

      showSuccessNotification(
        'Template Added!',
        `${template.name} has been added to your habits.`
      );

      navigation.goBack();
    } catch (error: any) {
      // Handle free plan limitation
      navigation.navigate('Onboarding');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return theme.success;
      case 'medium': return theme.warning;
      case 'hard': return theme.error;
      default: return theme.textSecondary;
    }
  };

  const TemplateCard = ({ template }: { template: HabitTemplate }) => (
    <Pressable
      onPress={() => handleUseTemplate(template)}
      className="rounded-xl p-3 mb-3"
      style={{ backgroundColor: theme.cardBackground }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View 
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: template.color + '20' }}
          >
            <Ionicons 
              name={template.icon as any} 
              size={20} 
              color={template.color} 
            />
          </View>
          
          <View className="flex-1">
            <Text 
              className="text-base font-semibold"
              style={{ color: theme.text }}
              numberOfLines={1}
            >
              {template.name}
            </Text>
            <Text 
              className="text-xs mt-0.5"
              style={{ color: theme.textSecondary }}
              numberOfLines={1}
            >
              {template.description}
            </Text>
            
            {/* Tags inline */}
            <View className="flex-row items-center mt-1">
              {template.tags.slice(0, 2).map((tag, index) => (
                <Text 
                  key={index}
                  className="text-xs mr-2"
                  style={{ color: theme.textTertiary }}
                >
                  #{tag}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <View className="items-end ml-2">
          <View 
            className="px-2 py-1 rounded-full mb-1"
            style={{ backgroundColor: getDifficultyColor(template.difficulty) + '20' }}
          >
            <Text 
              className="text-xs font-medium capitalize"
              style={{ color: getDifficultyColor(template.difficulty) }}
            >
              {template.difficulty}
            </Text>
          </View>
          <Text 
            className="text-xs"
            style={{ color: theme.textTertiary }}
          >
            {template.estimatedTime}
          </Text>
        </View>
      </View>
    </Pressable>
  );

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
            Habit Templates
          </Text>
        </View>

        {/* Search */}
        <View className="px-6 mb-4">
          <View 
            className="flex-row items-center px-4 py-3 rounded-xl"
            style={{ backgroundColor: theme.surface }}
          >
            <Ionicons name="search" size={20} color={theme.textTertiary} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search templates..."
              placeholderTextColor={theme.textTertiary}
              className="flex-1 ml-3 text-base"
              style={{ color: theme.text }}
            />
          </View>
        </View>



        {/* Templates List */}
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {filteredTemplates.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Ionicons name="search" size={64} color={theme.textTertiary} />
              <Text 
                className="text-lg font-medium mt-4 mb-2"
                style={{ color: theme.text }}
              >
                No templates found
              </Text>
              <Text 
                className="text-center"
                style={{ color: theme.textSecondary }}
              >
                Try adjusting your search or category filter
              </Text>
            </View>
          ) : (
            <>
              <Text 
                className="text-lg font-semibold mb-4"
                style={{ color: theme.text }}
              >
                {filteredTemplates.length} Templates
              </Text>
              
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HabitTemplatesScreen;