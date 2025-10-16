// Simple protected function wrapper - simplified for Expo Go
export function simpleProtectedFunction<T extends any[], R>(
  fn: (...args: T) => R,
  name: string
): (...args: T) => R {
  return (...args: T): R => {
    try {
      // Execute the function directly - no complex security checks in Expo Go
      const result = fn(...args);
      return result;
    } catch (error) {
      console.warn(`Protected function ${name} failed:`, error);
      throw error;
    }
  };
}

// Constants without encryption
export const SIMPLE_CONSTANTS = {
  FREE_PLAN: 'free',
  MONTHLY_PLAN: 'monthly', 
  LIFETIME_PLAN: 'lifetime',
  MAX_FREE_HABITS: 3,
};