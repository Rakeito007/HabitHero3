// Security module exports
import { securityManager } from './SecurityManager';
export { securityManager } from './SecurityManager';
export { CodeProtection, protectedFunction, OBFUSCATED_CONSTANTS } from './CodeProtection';
export { SecureStorage } from './SecureStorage';

// Quick setup function for easy integration
export const initializeSecurity = async () => {
  try {
    const result = await securityManager.initialize();
    if (!result) {
      console.warn('🛡️ Security checks failed - app running in safe mode');
    }
    return result;
  } catch (error) {
    console.error('🚨 Security initialization error:', error);
    return false;
  }
};

// Security status check
export const getSecurityStatus = () => securityManager.getSecurityStatus();

// Manual security check trigger
export const runSecurityCheck = () => securityManager.performSecurityChecks();