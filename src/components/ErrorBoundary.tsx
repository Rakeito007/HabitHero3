import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useHabitStore } from "../state/habitStore";
import { getTheme } from "../utils/theme";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // No console output reliance; UI will show the message
  }

  private handleReset = () => {
    try {
      const store = useHabitStore.getState();
      store.clearAllData();
    } catch (_) {}
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (!this.state.hasError) return this.props.children as any;

    const settings = useHabitStore.getState().settings;
    const theme = getTheme(settings.theme);

    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
        <View className="flex-1 px-6 py-6">
          <View className="items-center mb-6">
            <View className="w-16 h-16 rounded-2xl items-center justify-center" style={{ backgroundColor: theme.error }}>
              <Ionicons name="warning" size={32} color="white" />
            </View>
            <Text className="text-2xl font-bold mt-4" style={{ color: theme.text }}>
              Something went wrong
            </Text>
            <Text className="text-sm mt-2 text-center" style={{ color: theme.textSecondary }}>
              The app hit an unexpected error. You can reset and try again.
            </Text>
          </View>

          <View className="flex-1 rounded-xl p-4" style={{ backgroundColor: theme.surface }}>
            <Text className="text-base font-semibold mb-2" style={{ color: theme.text }}>
              Error details
            </Text>
            <ScrollView className="max-h-60">
              <Text className="text-xs" style={{ color: theme.textSecondary }}>
                {this.state.error?.message || "Unknown error"}
              </Text>
            </ScrollView>
          </View>

          <View className="mt-6 flex-row">
            <Pressable
              onPress={this.handleReset}
              className="flex-1 py-3 rounded-full items-center justify-center"
              style={{ backgroundColor: theme.primary }}
            >
              <Text className="text-white font-semibold">Reset App</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
