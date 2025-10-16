import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHabitStore } from '../state/habitStore';
import { getTheme } from '../utils/theme';

interface NotificationBannerProps {
  visible: boolean;
  onHide: () => void;
  title: string;
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info' | 'habit';
  action?: {
    label: string;
    onPress: () => void;
  };
  habitColor?: string;
  duration?: number;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  visible,
  onHide,
  title,
  message,
  type = 'info',
  action,
  habitColor,
  duration = 4000,
}) => {
  const { settings } = useHabitStore();
  const theme = getTheme(settings.theme);
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-200)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(opacity, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();

      // Auto hide
      if (duration > 0) {
        const timer = setTimeout(() => {
          hideNotification();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      hideNotification();
    }
  }, [visible]);

  const hideNotification = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: -200,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(opacity, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(scale, {
        toValue: 0.9,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start(() => {
      // Defer the onHide callback to avoid scheduling updates during useInsertionEffect
      setTimeout(() => {
        onHide();
      }, 0);
    });
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: theme.success,
          icon: 'checkmark-circle' as const,
          textColor: 'white',
        };
      case 'warning':
        return {
          backgroundColor: theme.warning,
          icon: 'warning' as const,
          textColor: 'white',
        };
      case 'error':
        return {
          backgroundColor: theme.error,
          icon: 'close-circle' as const,
          textColor: 'white',
        };
      case 'habit':
        return {
          backgroundColor: habitColor || theme.primary,
          icon: 'trophy' as const,
          textColor: 'white',
        };
      default:
        return {
          backgroundColor: theme.primary,
          icon: 'information-circle' as const,
          textColor: 'white',
        };
    }
  };

  const typeConfig = getTypeConfig();

  // Generate grid pattern background
  const renderGridPattern = () => {
    const tileSize = 8;
    const gap = 1;
    const tilesPerRow = Math.floor((screenWidth - 60) / (tileSize + gap));
    const rows = 3;
    const tiles = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < tilesPerRow; col++) {
        const opacity = Math.random() > 0.7 ? 0.3 : 0.1;
        tiles.push(
          <View
            key={`${row}-${col}`}
            style={{
              width: tileSize,
              height: tileSize,
              backgroundColor: 'rgba(255, 255, 255, ' + opacity + ')',
              borderRadius: 1,
              position: 'absolute',
              left: col * (tileSize + gap),
              top: row * (tileSize + gap),
            }}
          />
        );
      }
    }

    return (
      <View
        className="absolute inset-0 overflow-hidden"
        style={{ opacity: 0.6 }}
      >
        {tiles}
      </View>
    );
  };

  if (!visible) return null;

  return (
    <View
      className="absolute left-0 right-0 z-50"
      style={{
        top: insets.top + 10,
        paddingHorizontal: 16,
      }}
    >
      <Animated.View
        style={{
          transform: [{ translateY }, { scale }],
          opacity,
        }}
      >
        <Pressable
          onPress={hideNotification}
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: typeConfig.backgroundColor,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 12,
          }}
        >
          {/* Grid Pattern Background */}
          {renderGridPattern()}

          {/* Content */}
          <View className="flex-row items-center p-4 relative z-10">
            {/* Icon */}
            <View 
              className="w-12 h-12 rounded-xl items-center justify-center mr-3"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Ionicons
                name={typeConfig.icon}
                size={24}
                color={typeConfig.textColor}
              />
            </View>

            {/* Text Content */}
            <View className="flex-1">
              <Text
                className="text-base font-bold mb-1"
                style={{ color: typeConfig.textColor }}
                numberOfLines={1}
              >
                {title}
              </Text>
              <Text
                className="text-sm"
                style={{ color: typeConfig.textColor, opacity: 0.9 }}
                numberOfLines={2}
              >
                {message}
              </Text>
            </View>

            {/* Action Button */}
            {action && (
              <Pressable
                onPress={() => {
                  action.onPress();
                  hideNotification();
                }}
                className="ml-3 px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <Text
                  className="text-sm font-medium"
                  style={{ color: typeConfig.textColor }}
                >
                  {action.label}
                </Text>
              </Pressable>
            )}

            {/* Close Button */}
            <Pressable
              onPress={hideNotification}
              className="ml-2 w-8 h-8 rounded-full items-center justify-center"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }}
            >
              <Ionicons
                name="close"
                size={16}
                color={typeConfig.textColor}
              />
            </Pressable>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default NotificationBanner;