# 📱 App Store Submission Checklist for Habit Hero

## ✅ Completed Items

### 1. Code Cleanup
- [x] Removed unused imports from DashboardScreen.tsx
- [x] Verified OnboardingScreen.tsx imports (already clean)
- [x] TypeScript compilation passes with no errors
- [x] All screens properly typed

### 2. Privacy Disclosures (app.json)
- [x] NSCameraUsageDescription - Camera access for progress photos
- [x] NSMicrophoneUsageDescription - Audio recording for voice notes
- [x] NSPhotoLibraryUsageDescription - Photo library read access
- [x] NSPhotoLibraryAddUsageDescription - Photo library write access
- [x] NSUserTrackingUsageDescription - Ad tracking (if using ads)
- [x] NSCalendarsUsageDescription - Calendar integration
- [x] NSRemindersUsageDescription - Reminder creation
- [x] NSLocationWhenInUseUsageDescription - Location-based reminders
- [x] NSFaceIDUsageDescription - Biometric authentication
- [x] ITSAppUsesNonExemptEncryption - Set to false (no encryption)

### 3. IAP Configuration
- [x] IAP service implemented (`/src/services/iapService.ts`)
- [x] Product IDs defined in code
- [x] Purchase flow integrated in OnboardingScreen
- [x] Restore purchases button added to Settings
- [x] SKAdNetworkItems configured in app.json

---

## 🔧 To-Do Before Submission

### 1. App Store Connect - IAP Products
**Critical: Product ID Mismatch**

#### Current State:
- **Code expects**: `com.vibecode.habithero.[monthly|yearly|lifetime]`
- **Your ASC product**: `com.habithero.lifetime.pro`

#### Choose One Option:

**Option A: Update Code** (Quick - 30 seconds)
Update `/src/services/iapService.ts` line 44-48 to match your Product IDs:
```typescript
export const PRODUCT_IDS = {
  MONTHLY: 'com.habithero.monthly.pro',
  YEARLY: 'com.habithero.yearly.pro',
  LIFETIME: 'com.habithero.lifetime.pro',
};
```

**Option B: Update App Store Connect** (Recommended)
1. Go to App Store Connect → Your App → In-App Purchases
2. Delete existing draft products (if any)
3. Create 3 new products:
   - **Auto-Renewable Subscription**: `com.vibecode.habithero.monthly` ($1.99/month)
   - **Auto-Renewable Subscription**: `com.vibecode.habithero.yearly` ($19.99/year)
   - **Non-Consumable**: `com.vibecode.habithero.lifetime` ($25.00)

### 2. Fix "Missing Metadata" Error

For EACH IAP product, add:

#### Required Fields:
- **Reference Name**: E.g., "Habit Hero Pro - Monthly"
- **Product ID**: Match your chosen IDs above
- **Display Name** (Localization):
  - Language: English (U.S.)
  - Display Name: "Pro Monthly" / "Pro Yearly" / "Pro Lifetime"
- **Description** (Localization):
  - Example: "Unlock unlimited habits, advanced analytics, and premium features"
- **Review Screenshot**: 
  - Take a screenshot of the purchase screen (1242×2208px or 1170×2532px)
  - Upload in "Review Information" section

#### Subscription-Specific:
- Create **Subscription Group**: "Habit Hero Pro"
- Set **Subscription Duration**: 1 month / 1 year
- Add to Subscription Group
- Configure **Base Plan** pricing

### 3. Paid Apps Agreement
- [ ] Sign the **Paid Applications Agreement** in App Store Connect
- [ ] Complete **Tax Forms** (W-8 or W-9)
- [ ] Add **Banking Information** for payments

### 4. App Store Connect - App Information

#### Required Screenshots (iOS):
- **6.7" Display** (iPhone 14 Pro Max): At least 3 screenshots
- **6.5" Display** (iPhone 11 Pro Max): At least 3 screenshots
- **5.5" Display** (iPhone 8 Plus): At least 3 screenshots

#### App Store Listing:
- [ ] **App Name**: Habit Hero
- [ ] **Subtitle**: Build better habits, achieve your goals
- [ ] **Description**: (see below)
- [ ] **Keywords**: habit, tracker, goals, productivity, self-improvement
- [ ] **Support URL**: Your website or support email
- [ ] **Marketing URL**: (optional)
- [ ] **Privacy Policy URL**: Required for apps with IAP

#### Suggested Description:
```
Habit Hero helps you build lasting habits with a minimalist, intuitive approach.

✨ KEY FEATURES:
• Track unlimited habits (Pro)
• Beautiful progress visualizations
• Detailed analytics & insights
• Dark & light themes
• Data export & backup
• Privacy-first: all data stored locally

🎯 WHY HABIT HERO?
Simple, elegant design that helps you focus on what matters - building consistent habits that last.

💪 PRO FEATURES:
• Unlimited habit tracking (Free: 3 habits)
• Advanced analytics dashboard
• Export & import your data
• Priority support

Start your journey to better habits today!
```

### 5. Build Configuration

#### EAS Build Setup:
```bash
# Install EAS CLI (if not already)
npm install -g eas-cli

# Login to Expo account
eas login

# Configure EAS Build
eas build:configure

# Create iOS build for TestFlight
eas build --platform ios --profile production
```

#### Create `eas.json` (if not exists):
```json
{
  "build": {
    "production": {
      "ios": {
        "bundleIdentifier": "com.vibecode.habithero",
        "buildConfiguration": "Release"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-id",
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

### 6. Testing Checklist

#### Before Submission:
- [ ] Test all purchase flows (monthly, yearly, lifetime)
- [ ] Test "Restore Purchases" button
- [ ] Verify sandbox purchases work
- [ ] Test on physical iOS device (not simulator)
- [ ] Verify all privacy permissions prompt correctly
- [ ] Test theme switching
- [ ] Test habit creation, editing, deletion
- [ ] Test data export/import (Pro users)
- [ ] Verify analytics dashboard (Pro users)

#### Sandbox Testing:
1. Go to App Store Connect → Users and Access → Sandbox Testers
2. Create a sandbox Apple ID
3. Sign out of App Store on test device
4. When prompted during purchase, sign in with sandbox account
5. Test all three purchase types

### 7. App Review Information

#### Demo Account (if needed):
- **Username**: demo@habithero.com
- **Password**: demo123
- **Notes**: "All features are accessible without login. Pro features can be tested with sandbox purchases."

#### App Review Notes:
```
Thank you for reviewing Habit Hero!

IAP TESTING:
- The app includes 3 in-app purchases (monthly, yearly, lifetime subscriptions)
- Please use a sandbox account to test purchases
- "Restore Purchases" is available in Settings → Account → Restore Purchases

PERMISSIONS:
- Camera/Photos: Used for habit progress photos (feature not required)
- All permissions are optional and requested only when user accesses related features

FREE VS PRO:
- Free tier: 3 habit limit, basic features
- Pro tier: Unlimited habits, analytics, data export

Please feel free to contact me if you have any questions!
```

---

## 📋 Pre-Flight Checklist

Before hitting "Submit for Review":

- [ ] All IAP products have status "Ready to Submit"
- [ ] IAP metadata complete (name, description, screenshot)
- [ ] Paid Apps Agreement signed
- [ ] Banking & tax info completed
- [ ] App screenshots uploaded (all required sizes)
- [ ] App description, keywords, category set
- [ ] Privacy Policy URL added
- [ ] Support URL added
- [ ] App icon uploaded (1024×1024px)
- [ ] Build uploaded via EAS/Transporter
- [ ] Sandbox testing completed successfully
- [ ] App Review notes added
- [ ] Export compliance set (usesNonExemptEncryption: false)

---

## 🚀 Submit When Ready

1. **Submit IAP Products First**:
   - Go to each IAP product → Submit for Review
   - Wait for approval (usually 24-48 hours)

2. **Submit App After IAPs Approved**:
   - Go to App Store → Your App → Submit for Review
   - Choose the build from TestFlight
   - Review all info one final time
   - Click "Submit for Review"

3. **Review Timeline**:
   - Initial review: 1-3 days typically
   - May request clarifications or changes
   - Respond quickly to App Review messages

---

## 📞 Support Resources

- **App Store Connect**: https://appstoreconnect.apple.com
- **IAP Setup Guide**: See `IAP_SETUP_GUIDE.md`
- **Quick Reference**: See `QUICK_REFERENCE.md`
- **App Store Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/

---

## ✨ Current Status

**Code**: ✅ Production-ready  
**IAP Implementation**: ✅ Complete  
**Privacy Disclosures**: ✅ Complete  
**App Store Connect**: ⚠️ Needs IAP metadata + Product ID fix  
**Build**: ⏳ Pending EAS build  
**Submission**: ⏳ Pending above items

**Next Step**: Fix IAP Product IDs and complete metadata in App Store Connect!
