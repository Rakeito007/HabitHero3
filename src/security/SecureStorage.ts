import AsyncStorage from '@react-native-async-storage/async-storage';
import { CodeProtection } from './CodeProtection';

interface EncryptedData {
  data: string;
  checksum: string;
  timestamp: number;
  version: string;
}

export class SecureStorage {
  private static readonly ENCRYPTION_KEY = 0x48656C6C6F; // "Hello" in hex
  private static readonly APP_VERSION = '1.0.0';
  
  // Encrypt data before storage - fixed encoding
  private static encrypt(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      const timestamp = Date.now();
      
      // Convert to hex to avoid base64 issues
      let encrypted = '';
      for (let i = 0; i < jsonString.length; i++) {
        const keyChar = (this.ENCRYPTION_KEY >> ((i % 4) * 8)) & 0xFF;
        const encryptedChar = jsonString.charCodeAt(i) ^ keyChar;
        encrypted += encryptedChar.toString(16).padStart(2, '0');
      }
      
      // Create integrity checksum
      const checksum = CodeProtection.calculateChecksum(jsonString + timestamp);
      
      const encryptedData: EncryptedData = {
        data: encrypted,
        checksum: checksum.toString(),
        timestamp,
        version: this.APP_VERSION,
      };
      
      return JSON.stringify(encryptedData);
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Data encryption failed');
    }
  }
  
  // Decrypt data after retrieval - fixed decoding
  private static decrypt(encryptedString: string): any {
    try {
      const encryptedData: EncryptedData = JSON.parse(encryptedString);
      
      // Version check
      if (encryptedData.version !== this.APP_VERSION) {
        console.warn('Data version mismatch, may need migration');
      }
      
      // Decrypt the hex data
      const encrypted = encryptedData.data;
      let decrypted = '';
      
      for (let i = 0; i < encrypted.length; i += 2) {
        const hexPair = encrypted.substr(i, 2);
        const encryptedChar = parseInt(hexPair, 16);
        const keyChar = (this.ENCRYPTION_KEY >> (((i / 2) % 4) * 8)) & 0xFF;
        const decryptedChar = encryptedChar ^ keyChar;
        decrypted += String.fromCharCode(decryptedChar);
      }
      
      // Verify integrity
      const expectedChecksum = CodeProtection.calculateChecksum(decrypted + encryptedData.timestamp);
      if (expectedChecksum.toString() !== encryptedData.checksum) {
        throw new Error('Data integrity check failed - possible tampering detected');
      }
      
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Data decryption failed');
    }
  }
  
  // Secure setItem
  static async setItem(key: string, value: any): Promise<void> {
    try {
      const encryptedKey = CodeProtection.encryptString(key);
      const encryptedValue = this.encrypt(value);
      
      await AsyncStorage.setItem(encryptedKey, encryptedValue);
      
      // Store access log for monitoring
      const accessLog = {
        key,
        action: 'write',
        timestamp: Date.now(),
      };
      
      await AsyncStorage.setItem(
        `${encryptedKey}_log`,
        JSON.stringify(accessLog)
      );
    } catch (error) {
      console.error('Secure storage write failed:', error);
      throw error;
    }
  }
  
  // Secure getItem
  static async getItem(key: string): Promise<any> {
    try {
      const encryptedKey = CodeProtection.encryptString(key);
      const encryptedValue = await AsyncStorage.getItem(encryptedKey);
      
      if (!encryptedValue) {
        return null;
      }
      
      const decryptedValue = this.decrypt(encryptedValue);
      
      // Update access log
      const accessLog = {
        key,
        action: 'read',
        timestamp: Date.now(),
      };
      
      await AsyncStorage.setItem(
        `${encryptedKey}_log`,
        JSON.stringify(accessLog)
      );
      
      return decryptedValue;
    } catch (error) {
      console.error('Secure storage read failed:', error);
      // Return null instead of throwing to prevent app crashes
      return null;
    }
  }
  
  // Secure removeItem
  static async removeItem(key: string): Promise<void> {
    try {
      const encryptedKey = CodeProtection.encryptString(key);
      
      await AsyncStorage.multiRemove([
        encryptedKey,
        `${encryptedKey}_log`
      ]);
    } catch (error) {
      console.error('Secure storage removal failed:', error);
      throw error;
    }
  }
  
  // Get all access logs for security auditing
  static async getAccessLogs(): Promise<any[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const logKeys = allKeys.filter(key => key.endsWith('_log'));
      
      const logs = [];
      for (const logKey of logKeys) {
        const logData = await AsyncStorage.getItem(logKey);
        if (logData) {
          logs.push(JSON.parse(logData));
        }
      }
      
      return logs.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Failed to retrieve access logs:', error);
      return [];
    }
  }
  
  // Clear all secure data
  static async clearAll(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(allKeys);
      console.log('All secure data cleared');
    } catch (error) {
      console.error('Failed to clear secure data:', error);
      throw error;
    }
  }
  
  // Data integrity check for all stored data
  static async verifyIntegrity(): Promise<{ valid: number; invalid: number; errors: string[] }> {
    const result = { valid: 0, invalid: 0, errors: [] as string[] };
    
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const dataKeys = allKeys.filter(key => !key.endsWith('_log'));
      
      for (const key of dataKeys) {
        try {
          const value = await AsyncStorage.getItem(key);
          if (value) {
            // Try to decrypt - will throw if integrity check fails
            this.decrypt(value);
            result.valid++;
          }
        } catch (error) {
          result.invalid++;
          result.errors.push(`Key ${key}: ${(error as Error).message}`);
        }
      }
    } catch (error) {
      result.errors.push(`Integrity check failed: ${(error as Error).message}`);
    }
    
    return result;
  }
}