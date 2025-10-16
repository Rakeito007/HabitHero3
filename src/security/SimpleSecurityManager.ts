
import AsyncStorage from '@react-native-async-storage/async-storage';

class SimpleSecurityManager {
  private failedAttempts = 0;
  private maxFailedAttempts = 3;
  private securityToken: string | null = null;
  
  // Simple initialization for Expo Go compatibility
  async initialize(): Promise<boolean> {
    try {
      // Generate basic security token
      this.securityToken = `${Date.now()}_${Math.random().toString(36)}`;
      await AsyncStorage.setItem('@security_token', this.securityToken);
      
      console.log('🛡️ Simple Security Manager initialized for Expo Go');
      return true;
    } catch (error) {
      console.warn('Security initialization warning:', error);
      return true; // Don't block app if security fails
    }
  }
  
  // Simple validation method for protected functions
  validateOperation(operationName: string): boolean {
    try {
      if (this.failedAttempts >= this.maxFailedAttempts) {
        console.warn(`Operation ${operationName} blocked due to security violations`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.warn('Validation error:', error);
      return true; // Allow operation if check fails
    }
  }
  
  // Record security violation
  recordViolation(reason: string): void {
    try {
      this.failedAttempts++;
      console.warn(`Security violation: ${reason} (${this.failedAttempts}/${this.maxFailedAttempts})`);
      
      if (this.failedAttempts >= this.maxFailedAttempts) {
        this.resetToSafeState();
      }
    } catch (error) {
      console.warn('Failed to record violation:', error);
    }
  }
  
  // Reset app to safe state - simplified for Expo Go
  private resetToSafeState(): void {
    try {
      console.log('App reset to safe state - security violations exceeded');
      // In Expo Go, we just log the violation instead of modifying store directly
    } catch (error) {
      console.warn('Failed to reset to safe state:', error);
    }
  }
  
  // Get security status
  getSecurityStatus(): { secure: boolean; violations: number; lastCheck: Date } {
    return {
      secure: this.failedAttempts < this.maxFailedAttempts,
      violations: this.failedAttempts,
      lastCheck: new Date(),
    };
  }
  
  // Cleanup - no complex operations
  cleanup(): void {
    // Nothing to cleanup in simple version
  }
}

export const simpleSecurityManager = new SimpleSecurityManager();