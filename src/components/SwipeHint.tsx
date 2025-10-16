import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SwipeHintProps {
  theme: any;
  visible: boolean;
}

const SwipeHint: React.FC<SwipeHintProps> = ({ theme, visible }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show hint with animation
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(slideAnim, {
              toValue: -20,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 3 }
        ),
      ]).start(() => {
        // Auto hide after animation
        setTimeout(() => {
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }, 1000);
      });
    }
  }, [visible]);

  return (
    <Animated.View
      className="absolute top-4 right-4 flex-row items-center px-3 py-2 rounded-full"
      style={{
        backgroundColor: theme.primary + 'DD',
        opacity: opacityAnim,
        transform: [{ translateX: slideAnim }],
      }}
    >
      <Ionicons name="chevron-back" size={16} color="white" />
      <Text className="text-white text-xs font-medium ml-1">
        Swipe to delete
      </Text>
    </Animated.View>
  );
};

export default SwipeHint;