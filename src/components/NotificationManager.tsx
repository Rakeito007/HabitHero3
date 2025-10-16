import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import NotificationBanner from './NotificationBanner';

interface NotificationData {
  id: string;
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

interface NotificationManagerProps {
  children: React.ReactNode;
}

// Global notification context
let globalShowNotification: ((notification: Omit<NotificationData, 'id'>) => void) | null = null;

export const showNotification = (notification: Omit<NotificationData, 'id'>) => {
  if (globalShowNotification) {
    globalShowNotification(notification);
  }
};

// Predefined notification helpers
export const showSuccessNotification = (title: string, message: string, action?: NotificationData['action']) => {
  showNotification({ title, message, type: 'success', action });
};

export const showErrorNotification = (title: string, message: string, action?: NotificationData['action']) => {
  showNotification({ title, message, type: 'error', action });
};

export const showHabitNotification = (title: string, message: string, habitColor?: string, action?: NotificationData['action']) => {
  showNotification({ title, message, type: 'habit', habitColor, action });
};

export const showWarningNotification = (title: string, message: string, action?: NotificationData['action']) => {
  showNotification({ title, message, type: 'warning', action });
};

const NotificationManager: React.FC<NotificationManagerProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = useCallback((notification: Omit<NotificationData, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 11);
    const newNotification: NotificationData = { ...notification, id };
    
    setNotifications(prev => {
      // Limit to 3 notifications at once
      const updated = [newNotification, ...prev.slice(0, 2)];
      return updated;
    });
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Set global function
  React.useEffect(() => {
    globalShowNotification = addNotification;
    return () => {
      globalShowNotification = null;
    };
  }, [addNotification]);

  return (
    <View className="flex-1">
      {children}
      
      {/* Render notifications */}
      {notifications.map((notification, index) => (
        <View
          key={notification.id}
          style={{
            position: 'absolute',
            top: index * 90, // Stack notifications
            left: 0,
            right: 0,
            zIndex: 1000 - index,
          }}
        >
          <NotificationBanner
            visible={true}
            onHide={() => removeNotification(notification.id)}
            title={notification.title}
            message={notification.message}
            type={notification.type}
            action={notification.action}
            habitColor={notification.habitColor}
            duration={notification.duration}
          />
        </View>
      ))}
    </View>
  );
};

export default NotificationManager;