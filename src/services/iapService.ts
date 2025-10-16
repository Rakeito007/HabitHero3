/**
 * In-App Purchase Service for Apple StoreKit
 * 
 * IMPORTANT SETUP INSTRUCTIONS:
 * =============================
 * 
 * 1. APP STORE CONNECT SETUP:
 *    - Go to App Store Connect (https://appstoreconnect.apple.com)
 *    - Select your app
 *    - Go to "In-App Purchases" section
 *    - Create 3 subscription products with these EXACT IDs:
 *      • com.vibecode.habithero.monthly
 *      • com.vibecode.habithero.yearly  
 *      • com.vibecode.habithero.lifetime
 * 
 * 2. SUBSCRIPTION GROUP:
 *    - Create a subscription group named "Habit Hero Pro"
 *    - Add monthly and yearly subscriptions to this group
 *    - Set pricing: $1.99/month, $19.99/year
 * 
 * 3. NON-CONSUMABLE (LIFETIME):
 *    - Create lifetime as a "Non-Consumable" product
 *    - Set pricing: $25.00
 * 
 * 4. TESTING:
 *    - Create a Sandbox Tester account in App Store Connect
 *    - Use that account to test purchases before going live
 * 
 * 5. BUILD REQUIREMENTS:
 *    - Must use EAS Build (not Expo Go)
 *    - Add to app.json: 
 *      "ios": {
 *        "infoPlist": {
 *          "SKAdNetworkItems": []
 *        }
 *      }
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';
import { SubscriptionStatus } from '../types/habit';

// Product IDs - MUST match App Store Connect
export const PRODUCT_IDS = {
  MONTHLY: 'com.vibecode.habithero.monthly',
  YEARLY: 'com.vibecode.habithero.yearly',
  LIFETIME: 'com.vibecode.habithero.lifetime',
};

const PURCHASE_STORAGE_KEY = '@habit_hero_purchases';
const RECEIPT_STORAGE_KEY = '@habit_hero_receipt';

interface PurchaseData {
  productId: string;
  transactionDate: string;
  transactionId: string;
  subscriptionStatus: SubscriptionStatus;
}

/**
 * NOTE: This is a client-side implementation.
 * For production, you should:
 * 1. Verify receipts on your server
 * 2. Check subscription status with Apple's servers
 * 3. Handle subscription renewals and cancellations
 * 4. Implement proper error handling and retry logic
 */

class IAPService {

  /**
   * Initialize the IAP service
   * In a real implementation, this would connect to StoreKit
   */
  async initialize(): Promise<boolean> {
    try {
      if (Platform.OS !== 'ios') {
        console.warn('IAP only supported on iOS');
        return false;
      }

      // In real implementation:
      // await InAppPurchases.connectAsync();
      // await this.restorePurchases();
      
      return true;
    } catch (error) {
      console.error('IAP initialization failed:', error);
      return false;
    }
  }

  /**
   * Get available products from App Store
   * In real implementation, this fetches from StoreKit
   */
  async getProducts() {
    try {
      // In real implementation:
      // const { results } = await InAppPurchases.getProductsAsync(Object.values(PRODUCT_IDS));
      // return results;

      // Mock products for development
      return [
        {
          productId: PRODUCT_IDS.MONTHLY,
          price: '$1.99',
          priceAmount: 1.99,
          title: 'Monthly Subscription',
          description: 'Habit Hero Pro - Monthly',
        },
        {
          productId: PRODUCT_IDS.YEARLY,
          price: '$19.99',
          priceAmount: 19.99,
          title: 'Yearly Subscription',
          description: 'Habit Hero Pro - Yearly',
        },
        {
          productId: PRODUCT_IDS.LIFETIME,
          price: '$25.00',
          priceAmount: 25.00,
          title: 'Lifetime Access',
          description: 'Habit Hero Pro - Lifetime',
        },
      ];
    } catch (error) {
      console.error('Failed to get products:', error);
      return [];
    }
  }

  /**
   * Purchase a product
   * This will show Apple's payment sheet
   */
  async purchaseProduct(productId: string): Promise<boolean> {
    try {
      if (Platform.OS !== 'ios') {
        Alert.alert(
          'Not Available',
          'In-app purchases are only available on iOS devices.'
        );
        return false;
      }

      // In real implementation with expo-in-app-purchases:
      /*
      const { results } = await InAppPurchases.purchaseItemAsync(productId);
      
      if (results && results.length > 0) {
        const purchase = results[0];
        
        // Verify receipt with your server
        const verified = await this.verifyReceipt(purchase.transactionReceipt);
        
        if (verified) {
          await this.savePurchase(productId, purchase);
          await InAppPurchases.finishTransactionAsync(purchase, true);
          return true;
        }
      }
      */

      // For development/testing - simulate purchase
      await this.simulatePurchase(productId);
      return true;

    } catch (error: any) {
      console.error('Purchase failed:', error);
      
      if (error.code === 'USER_CANCELED') {
        // User cancelled, no alert needed
        return false;
      }
      
      Alert.alert(
        'Purchase Failed',
        'Unable to complete your purchase. Please try again.'
      );
      return false;
    }
  }

  /**
   * Restore previous purchases
   * Required by Apple App Store guidelines
   */
  async restorePurchases(): Promise<boolean> {
    try {
      if (Platform.OS !== 'ios') {
        return false;
      }

      // In real implementation:
      /*
      const { results } = await InAppPurchases.getPurchaseHistoryAsync();
      
      if (results && results.length > 0) {
        // Find the most recent active subscription or lifetime purchase
        const activePurchase = this.findActivePurchase(results);
        
        if (activePurchase) {
          await this.savePurchase(activePurchase.productId, activePurchase);
          return true;
        }
      }
      */

      // Check local storage for development
      const storedPurchase = await AsyncStorage.getItem(PURCHASE_STORAGE_KEY);
      return !!storedPurchase;

    } catch (error) {
      console.error('Restore failed:', error);
      Alert.alert(
        'Restore Failed',
        'Unable to restore purchases. Please try again.'
      );
      return false;
    }
  }

  /**
   * Get current subscription status
   */
  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const purchaseData = await AsyncStorage.getItem(PURCHASE_STORAGE_KEY);
      
      if (!purchaseData) {
        return 'free';
      }

      const purchase: PurchaseData = JSON.parse(purchaseData);
      
      // In real implementation, verify with Apple's servers
      // Check if subscription is still active
      // Handle expired subscriptions
      
      return purchase.subscriptionStatus;
    } catch (error) {
      console.error('Failed to get subscription status:', error);
      return 'free';
    }
  }

  /**
   * Save purchase data locally
   * In production, also send to your server
   */
  private async savePurchase(productId: string, transactionData?: any) {
    const subscriptionStatus = this.getSubscriptionStatusFromProductId(productId);
    
    const purchaseData: PurchaseData = {
      productId,
      transactionDate: new Date().toISOString(),
      transactionId: transactionData?.transactionId || `dev_${Date.now()}`,
      subscriptionStatus,
    };

    await AsyncStorage.setItem(PURCHASE_STORAGE_KEY, JSON.stringify(purchaseData));
    
    if (transactionData?.transactionReceipt) {
      await AsyncStorage.setItem(RECEIPT_STORAGE_KEY, transactionData.transactionReceipt);
    }
  }

  /**
   * Simulate purchase for development
   * REMOVE THIS IN PRODUCTION
   */
  private async simulatePurchase(productId: string) {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
    await this.savePurchase(productId);
  }

  /**
   * Map product ID to subscription status
   */
  private getSubscriptionStatusFromProductId(productId: string): SubscriptionStatus {
    switch (productId) {
      case PRODUCT_IDS.MONTHLY:
        return 'monthly';
      case PRODUCT_IDS.YEARLY:
        return 'yearly';
      case PRODUCT_IDS.LIFETIME:
        return 'lifetime';
      default:
        return 'free';
    }
  }

  /**
   * Verify receipt with Apple's servers
   * MUST implement this in production
   * 
   * @param _receipt - The receipt string to verify (unused in development)
   * @returns Promise<boolean> - True if valid, false if invalid
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async verifyReceipt(_receipt: string): Promise<boolean> {
    // In production, send receipt to YOUR server
    // Your server verifies with Apple's verifyReceipt API
    // Returns true if valid, false if invalid
    
    // For development
    return true;
  }
}

export const iapService = new IAPService();
