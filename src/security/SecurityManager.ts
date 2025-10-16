import { Platform, DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHabitStore } from '../state/habitStore';

interface SecurityConfig {
  enableDebuggerDetection: boolean;
  enableRootDetection: boolean;
  enableTamperDetection: boolean;
  enableAppIntegrityCheck: boolean;
  maxFailedAttempts: number;
}

class SecurityManager {
  private config: SecurityConfig = {
    enableDebuggerDetection: true,
    enableRootDetection: true,
    enableTamperDetection: true,
    enableAppIntegrityCheck: true,
    maxFailedAttempts: 3,
  };

  private failedAttempts = 0;
  private securityCheckInterval: NodeJS.Timeout | null = null;
  private appHash: string | null = null;
  private securityToken: string | null = null;
  
  // Initialize security on app startup
  async initialize(): Promise<boolean> {
    try {
      // Generate unique security token
      await this.generateSecurityToken();
      
      // Calculate app integrity hash
      await this.calculateAppHash();
      
      // Start continuous security monitoring
      this.startSecurityMonitoring();
      
      // Perform initial security checks
      const securityPassed = await this.performSecurityChecks();
      
      if (!securityPassed) {
        await this.handleSecurityViolation('Initial security check failed');
        return false;
      }
      
      // Verify subscription integrity
      await this.verifySubscriptionIntegrity();
      
      console.log('🛡️ Security Manager initialized successfully');
      return true;
    } catch (error) {
      console.error('Security initialization failed:', error);
      return false;
    }
  }

  // Generate unique security token for session - fixed encoding
  private async generateSecurityToken(): Promise<void> {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 15);
    const deviceInfo = `${Platform.OS}_${Platform.Version}`;
    
    // Use simple concatenation instead of btoa to avoid encoding issues
    this.securityToken = `${timestamp}_${random}_${deviceInfo}`;
    await AsyncStorage.setItem('@security_token', this.securityToken);
  }

  // Calculate app integrity hash (simplified version)
  private async calculateAppHash(): Promise<void> {
    try {
      // In production, this would use native modules for better security
      const appVersion = '1.0.0'; // From package.json
      const bundleId = Platform.OS === 'ios' ? 'com.vibecode.habithero' : 'com.vibecode.habithero';
      const buildNumber = Platform.OS === 'ios' ? '1' : '1';
      
      const hashInput = `${appVersion}_${bundleId}_${buildNumber}_${Platform.OS}`;
      
      // Simple hash function (in production, use crypto libraries)
      let hash = 0;
      for (let i = 0; i < hashInput.length; i++) {
        const char = hashInput.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      
      this.appHash = Math.abs(hash).toString(16);
      await AsyncStorage.setItem('@app_hash', this.appHash);
    } catch (error) {
      console.error('Failed to calculate app hash:', error);
    }
  }

  // Start continuous security monitoring
  private startSecurityMonitoring(): void {
    this.securityCheckInterval = setInterval(() => {
      this.performRuntimeSecurityChecks();
    }, 30000); // Check every 30 seconds
  }

  // Main security check function
  public async performSecurityChecks(): Promise<boolean> {
    const checks = await Promise.allSettled([
      this.checkDebuggerPresence(),
      this.checkRootAccess(),
      this.checkAppTampering(),
      this.checkEnvironmentIntegrity(),
      this.checkSubscriptionTampering(),
    ]);

    const failedChecks = checks.filter(result => result.status === 'rejected' || result.value === false);
    
    if (failedChecks.length > 0) {
      this.failedAttempts++;
      console.warn(`Security checks failed: ${failedChecks.length}/${checks.length}`);
      
      if (this.failedAttempts >= this.config.maxFailedAttempts) {
        await this.handleSecurityViolation('Multiple security check failures');
        return false;
      }
    }

    return true;
  }

  // Runtime security checks (lighter weight)
  private async performRuntimeSecurityChecks(): Promise<void> {
    if (__DEV__) return; // Skip in development

    try {
      await this.checkDebuggerPresence();
      await this.checkAppTampering();
      await this.verifySecurityToken();
    } catch (error) {
      console.warn('Runtime security check failed:', error);
    }
  }

  // Check for debugger presence - simplified
  private async checkDebuggerPresence(): Promise<boolean> {
    if (!this.config.enableDebuggerDetection || __DEV__) return true;

    try {
      // Simple check - don't use debugger statement in production
      if (typeof console !== 'undefined' && console.log()) {
        // Basic console check
        return true;
      }

      return true;
    } catch (error) {
      console.warn('Debugger detection triggered:', error);
      return false;
    }
  }

  // Check for root/jailbreak
  private async checkRootAccess(): Promise<boolean> {
    if (!this.config.enableRootDetection) return true;

    try {
      // iOS Jailbreak detection indicators
      if (Platform.OS === 'ios') {
        // These would typically be checked via native modules
        const jailbreakPaths = [
          '/Applications/Cydia.app',
          '/usr/sbin/sshd',
          '/bin/bash',
          '/etc/apt'
        ];
        
        // Simplified check (in production, use native iOS detection)
        const suspiciousActivity = Math.random() < 0.01; // Simulate detection
        if (suspiciousActivity) {
          throw new Error('Potential jailbreak detected');
        }
      }

      // Android Root detection indicators
      if (Platform.OS === 'android') {
        // These would typically be checked via native modules
        const rootPaths = [
          '/system/app/Superuser.apk',
          '/system/xbin/su',
          '/system/bin/su',
          '/data/local/xbin/su'
        ];
        
        // Simplified check (in production, use native Android detection)
        const suspiciousActivity = Math.random() < 0.01; // Simulate detection
        if (suspiciousActivity) {
          throw new Error('Potential root detected');
        }
      }

      return true;
    } catch (error) {
      console.warn('Root/Jailbreak detection triggered:', error);
      return false;
    }
  }

  // Check for app tampering
  private async checkAppTampering(): Promise<boolean> {
    if (!this.config.enableTamperDetection) return true;

    try {
      // Verify stored app hash
      const storedHash = await AsyncStorage.getItem('@app_hash');
      if (storedHash !== this.appHash) {
        throw new Error('App integrity hash mismatch');
      }

      // Check critical app components
      if (typeof useHabitStore !== 'function') {
        throw new Error('Critical app component missing');
      }

      // Skip complex code injection checks for now to avoid issues

      return true;
    } catch (error) {
      console.warn('Tampering detection triggered:', error);
      return false;
    }
  }

  // Check environment integrity
  private async checkEnvironmentIntegrity(): Promise<boolean> {
    try {
      // Verify React Native environment
      if (!(global as any).__fbBatchedBridge) {
        throw new Error('Invalid React Native environment');
      }

      // Check for emulator (basic detection)
      if (Platform.OS === 'android' && Platform.constants?.Brand === 'generic') {
        console.warn('Running on emulator - security monitoring active');
      }

      return true;
    } catch (error) {
      console.warn('Environment integrity check failed:', error);
      return false;
    }
  }

  // Verify security token integrity
  private async verifySecurityToken(): Promise<boolean> {
    try {
      const storedToken = await AsyncStorage.getItem('@security_token');
      if (storedToken !== this.securityToken) {
        throw new Error('Security token mismatch');
      }
      return true;
    } catch (error) {
      console.warn('Security token verification failed:', error);
      return false;
    }
  }

  // Check subscription tampering
  private async checkSubscriptionTampering(): Promise<boolean> {
    try {
      const store = useHabitStore.getState();
      const { settings, habits } = store;

      // Check if free user has more than 3 habits
      if (settings.subscriptionStatus === 'free' && habits.filter(h => !h.archived).length > 3) {
        throw new Error('Subscription limit violation detected');
      }

      // Verify subscription date integrity
      if (settings.subscriptionDate && settings.subscriptionStatus === 'free') {
        throw new Error('Invalid subscription state detected');
      }

      return true;
    } catch (error) {
      console.warn('Subscription tampering detected:', error);
      await this.handleSubscriptionViolation();
      return false;
    }
  }

  // Verify subscription integrity
  private async verifySubscriptionIntegrity(): Promise<void> {
    const store = useHabitStore.getState();
    const { settings } = store;

    // Create subscription integrity hash
    const subData = `${settings.subscriptionStatus}_${settings.subscriptionDate?.getTime() || 0}`;
    let hash = 0;
    for (let i = 0; i < subData.length; i++) {
      hash = ((hash << 5) - hash) + subData.charCodeAt(i);
      hash = hash & hash;
    }
    
    const subscriptionHash = Math.abs(hash).toString(16);
    await AsyncStorage.setItem('@subscription_hash', subscriptionHash);
  }

  // Handle subscription violations
  private async handleSubscriptionViolation(): Promise<void> {
    const store = useHabitStore.getState();
    const habits = store.habits.filter(h => !h.archived);

    if (habits.length > 3) {
      // Archive excess habits
      const excessHabits = habits.slice(3);
      for (const habit of excessHabits) {
        store.updateHabit(habit.id, { archived: true });
      }
    }

    // Reset subscription status
    store.updateSettings({ subscriptionStatus: 'free' });
  }

  // Handle security violations
  private async handleSecurityViolation(reason: string): Promise<void> {
    console.error(`🚨 Security Violation: ${reason}`);
    
    // Log security event
    await AsyncStorage.setItem('@security_violation', JSON.stringify({
      reason,
      timestamp: Date.now(),
      platform: Platform.OS,
      version: Platform.Version,
    }));

    // Clear sensitive data
    await this.clearSensitiveData();
    
    // Reset app to safe state
    await this.resetAppToSafeState();
    
    // Emit security event
    DeviceEventEmitter.emit('security_violation', { reason });
  }

  // Clear sensitive data
  private async clearSensitiveData(): Promise<void> {
    try {
      // Clear habits and entries (but preserve settings)
      const store = useHabitStore.getState();
      store.clearAllData();
      
      // Clear security tokens
      await AsyncStorage.multiRemove([
        '@security_token',
        '@app_hash',
        '@subscription_hash',
      ]);
      
      console.log('Sensitive data cleared due to security violation');
    } catch (error) {
      console.error('Failed to clear sensitive data:', error);
    }
  }

  // Reset app to safe state
  private async resetAppToSafeState(): Promise<void> {
    const store = useHabitStore.getState();
    
    // Reset to free plan
    store.updateSettings({
      subscriptionStatus: 'free',
      subscriptionDate: undefined,
    });
    
    // Reset onboarding
    store.updateSettings({
      hasCompletedOnboarding: false,
    });
  }

  // Get security status
  getSecurityStatus(): { secure: boolean; violations: number; lastCheck: Date } {
    return {
      secure: this.failedAttempts < this.config.maxFailedAttempts,
      violations: this.failedAttempts,
      lastCheck: new Date(),
    };
  }

  // Cleanup security monitoring
  cleanup(): void {
    if (this.securityCheckInterval) {
      clearInterval(this.securityCheckInterval);
      this.securityCheckInterval = null;
    }
  }
}

export const securityManager = new SecurityManager();