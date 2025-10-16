// Code protection and obfuscation utilities
export class CodeProtection {
  // Obfuscated function names mapping
  private static readonly obfuscatedNames = {
    // Core functions
    'addHabit': 'aH_fn_001',
    'deleteHabit': 'dH_fn_002', 
    'updateSubscription': 'uS_fn_003',
    'toggleHabitEntry': 'tHE_fn_004',
    
    // Security functions
    'checkDebugger': 'cD_sec_001',
    'checkRoot': 'cR_sec_002',
    'checkTamper': 'cT_sec_003',
  };

  // Encrypt sensitive strings - fixed base64 encoding
  static encryptString(str: string): string {
    const key = 0xABCDEF;
    let encrypted = '';
    
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      const keyByte = (key >> ((i % 3) * 8)) & 0xFF;
      const encryptedChar = charCode ^ keyByte;
      
      // Convert to hex to avoid invalid base64 characters
      encrypted += encryptedChar.toString(16).padStart(2, '0');
    }
    
    return encrypted;
  }

  // Decrypt sensitive strings - fixed base64 decoding
  static decryptString(encryptedStr: string): string {
    const key = 0xABCDEF;
    let decrypted = '';
    
    // Parse hex string back to bytes
    for (let i = 0; i < encryptedStr.length; i += 2) {
      const hexPair = encryptedStr.substr(i, 2);
      const encryptedChar = parseInt(hexPair, 16);
      const keyByte = (key >> (((i / 2) % 3) * 8)) & 0xFF;
      const originalChar = encryptedChar ^ keyByte;
      
      decrypted += String.fromCharCode(originalChar);
    }
    
    return decrypted;
  }

  // Dynamic function name resolution
  static getFunctionName(originalName: string): string {
    return (this.obfuscatedNames as any)[originalName] || originalName;
  }

  // Anti-debugging checksum
  static calculateChecksum(input: string): number {
    let checksum = 0;
    for (let i = 0; i < input.length; i++) {
      checksum = (checksum << 5) - checksum + input.charCodeAt(i);
      checksum = checksum & checksum; // Convert to 32-bit integer
    }
    return Math.abs(checksum);
  }

  // Control flow flattening simulation
  static obfuscatedExecute<T>(operations: (() => T)[]): T[] {
    const results: T[] = [];
    const indices = operations.map((_, i) => i).sort(() => Math.random() - 0.5);
    
    for (const index of indices) {
      try {
        results[index] = operations[index]();
      } catch (error) {
        console.warn('Obfuscated operation failed:', error);
      }
    }
    
    return results;
  }

  // String array rotation
  static rotateStringArray(strings: string[]): string[] {
    const rotation = Math.floor(Math.random() * strings.length);
    return [...strings.slice(rotation), ...strings.slice(0, rotation)];
  }

  // Dead code insertion
  static insertDeadCode(): void {
    // Dummy operations that don't affect functionality but confuse static analysis
    const dummy1 = Math.random() * 1000;
    const dummy2 = new Date().getTime();
    const dummy3 = dummy1 + dummy2 - dummy1 - dummy2;
    
    if (dummy3 === 0) {
      // This branch will always execute but looks conditional
      return;
    }
    
    // This code will never run but adds complexity
    console.log('This should never execute');
  }
}

// Obfuscated constants - simplified to avoid encoding issues
export const OBFUSCATED_CONSTANTS = {
  // Simple obfuscated subscription keys (not encrypted to avoid base64 issues)
  FREE_PLAN: 'free',
  MONTHLY_PLAN: 'monthly', 
  LIFETIME_PLAN: 'lifetime',
  
  // Storage keys
  HABIT_STORE_KEY: 'habit-hero-storage',
  SECURITY_TOKEN_KEY: '@security_token',
  APP_HASH_KEY: '@app_hash',
  
  // API endpoints
  API_BASE: 'https://api.example.com',
  
  // Security thresholds
  MAX_FREE_HABITS: 3,
  SECURITY_CHECK_INTERVAL: 30000,
  MAX_SECURITY_VIOLATIONS: 3,
};

// Runtime protection wrapper
export function protectedFunction<T extends any[], R>(
  fn: (...args: T) => R,
  name: string
): (...args: T) => R {
  return (...args: T): R => {
    // Insert anti-debugging checks
    const start = performance.now();
    
    try {
      // Dead code insertion
      CodeProtection.insertDeadCode();
      
      // Execute the actual function
      const result = fn(...args);
      
      // Timing check for debugging detection
      const end = performance.now();
      if (end - start > 1000) {
        console.warn('Suspicious execution time detected');
      }
      
      return result;
    } catch (error) {
      console.error(`Protected function ${name} failed:`, error);
      throw error;
    }
  };
}

// Method decorator for protection
export function Protected(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = protectedFunction(originalMethod, propertyKey);
  
  return descriptor;
}