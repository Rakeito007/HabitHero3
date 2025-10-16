# Complete App Store Connect Setup - Step-by-Step

## Prerequisites ✅
- [ ] Apple Developer Account ($99/year)
- [ ] Logged into https://appstoreconnect.apple.com
- [ ] Bundle ID created: com.vibecode.habithero

---

## Part 1: Create Your App (5 minutes)

### Step 1: Go to App Store Connect
1. Open browser: **https://appstoreconnect.apple.com**
2. Sign in with your Apple ID
3. Click **"My Apps"**

### Step 2: Create New App (if not exists)
1. Click **"+" button** (top left)
2. Select **"New App"**
3. Fill in:
   - **Platform**: iOS
   - **Name**: Habit Hero
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: Select `com.vibecode.habithero`
   - **SKU**: habithero (or any unique identifier)
   - **User Access**: Full Access
4. Click **"Create"**

---

## Part 2: In-App Purchases Setup (15 minutes)

### Step 3: Navigate to In-App Purchases
1. In your app page, click **"In-App Purchases"** (left sidebar)
2. You'll see "No In-App Purchases" - that's normal!

---

### Step 4: Create Subscription Group

**Why?** Monthly and Yearly subscriptions must be in the same group so users can switch between them.

1. Click **"Manage"** (next to Subscription Groups)
2. Click **"+"** to create new group
3. Fill in:
   - **Subscription Group Reference Name**: Habit Hero Pro
   - **Group Name** (user-facing): Habit Hero Pro Subscription
4. Click **"Create"**

---

### Step 5: Add Monthly Subscription

1. Inside the "Habit Hero Pro" group, click **"+"**
2. Fill in **Subscription Information**:

   **Product ID**: `com.vibecode.habithero.monthly`
   ⚠️ MUST match exactly - cannot be changed later!
   
   **Reference Name**: Habit Hero Pro Monthly
   (This is just for your reference in App Store Connect)

3. Click **"Create"**

4. **Subscription Duration**:
   - Duration: **1 month**

5. **Subscription Prices**:
   - Click **"Add Pricing"**
   - Select **All Territories**
   - Price: **$1.99 USD** (Tier 2)
   - Start Date: Today
   - Click **"Next"** → **"Add Pricing"**

6. **Localizations** (Required):
   - Click **"Add Localization"**
   - Language: **English (U.S.)**
   - Fill in:
     ```
     Subscription Display Name: Pro Monthly
     
     Description: 
     Get unlimited habits, advanced analytics, data export/import, 
     and premium customization. Billed monthly.
     ```
   - Click **"Save"**

7. **Review Information**:
   - No screenshot needed yet
   - Click **"Save"** (top right)

---

### Step 6: Add Yearly Subscription

1. Back in subscription group, click **"+"** again
2. Fill in:

   **Product ID**: `com.vibecode.habithero.yearly`
   **Reference Name**: Habit Hero Pro Yearly

3. Click **"Create"**

4. **Subscription Duration**:
   - Duration: **1 year**

5. **Subscription Prices**:
   - Click **"Add Pricing"**
   - Select **All Territories**
   - Price: **$19.99 USD** (Tier 20)
   - Start Date: Today
   - Click **"Add Pricing"**

6. **Localizations**:
   - Language: **English (U.S.)**
   - Fill in:
     ```
     Subscription Display Name: Pro Yearly
     
     Description:
     Get unlimited habits, advanced analytics, data export/import, 
     and premium customization. Save 17% vs monthly. Billed annually.
     ```
   - Click **"Save"**

7. Click **"Save"** (top right)

---

### Step 7: Create Lifetime Purchase

**Why Non-Consumable?** One-time purchase that never expires.

1. Go back to main **"In-App Purchases"** page
2. Click **"+"** button
3. Select **"Non-Consumable"**
4. Fill in:

   **Product ID**: `com.vibecode.habithero.lifetime`
   **Reference Name**: Habit Hero Pro Lifetime

5. Click **"Create"**

6. **Pricing**:
   - Click **"Add Pricing"**
   - Select **All Territories**
   - Price: **$25.00 USD** (Tier 25)
   - Start Date: Today
   - Click **"Add Pricing"**

7. **Localizations**:
   - Language: **English (U.S.)**
   - Fill in:
     ```
     Display Name: Pro Lifetime
     
     Description:
     Get all Pro features forever with a one-time payment. 
     No recurring charges. Best value!
     ```
   - Click **"Save"**

8. Click **"Save"** (top right)

---

## Part 3: Sandbox Testing Setup (5 minutes)

### Step 8: Create Sandbox Test Account

**Why?** Test purchases without spending real money.

1. In App Store Connect, click **"Users and Access"** (top navigation)
2. Click **"Sandbox"** tab
3. Click **"Testers"** (left sidebar)
4. Click **"+"** button

5. Fill in:
   ```
   First Name: Test
   Last Name: Habithero
   Email: test.habithero.{YOUR_NAME}@icloud.com
   ⚠️ Must be UNIQUE email, never used before
   ⚠️ Don't use your real Apple ID
   
   Password: Create strong password (save it!)
   Confirm Password: Same password
   
   Date of Birth: Any date (over 18)
   
   App Store Territory: United States
   ```

6. Click **"Invite"**
7. **IMPORTANT**: Write down this email and password!

---

## Part 4: Agreements & Banking (Critical!)

### Step 9: Sign Paid Apps Agreement

**⚠️ Without this, you CANNOT receive money!**

1. Go to **"Agreements, Tax, and Banking"** (in main menu)
2. Find **"Paid Applications"**
3. If status shows **"Contract In Progress"**:
   - Click **"Set Up"** or **"Request"**
   - Fill in:
     - Contact Info
     - Bank Account Info (where Apple sends money)
     - Tax Forms (W-9 for US, W-8BEN for non-US)
   - Submit for review

4. Wait for Apple to approve (usually 24-48 hours)

---

## Part 5: Submit for Review (10 minutes)

### Step 10: Add Review Information

For EACH in-app purchase:

1. Go to the purchase (Monthly/Yearly/Lifetime)
2. Scroll to **"App Review Information"**
3. Add screenshot showing:
   - Where users see the subscription offer
   - What they get
   - Pricing clearly visible

**How to get screenshot**:
- Open your app in simulator
- Go to onboarding screen
- Press Cmd+S to screenshot
- Upload that screenshot

4. **Review Notes** (optional but helpful):
   ```
   Users can subscribe to unlock unlimited habits, 
   advanced analytics, and premium features. 
   Free tier limited to 3 habits.
   ```

5. Click **"Submit for Review"**

---

## Part 6: Test Before Going Live

### Step 11: Test Sandbox Purchases

**On your iPhone/iPad:**

1. **Sign out** of your real Apple ID:
   - Go to Settings → [Your Name] → Sign Out
   - Keep data on device

2. **Build and install your app**:
   ```bash
   cd /home/user/workspace
   eas build --profile development --platform ios
   ```
   - Wait for build to complete
   - Install on your device

3. **Test purchase**:
   - Open Habit Hero app
   - Go through onboarding
   - Select a Pro plan
   - Click Subscribe
   - Sign in with SANDBOX account when prompted
   - Complete "purchase"
   - Verify Pro features unlock

4. **Test restore**:
   - Delete app
   - Reinstall
   - Go to Settings → Restore Purchases
   - Sign in with same sandbox account
   - Verify subscription restored

---

## Part 7: Go Live! 🚀

### Step 12: Submit App for Review

1. In App Store Connect:
   - Go to your app
   - Click **"App Store"** tab
   - Fill in all metadata:
     - Screenshots
     - Description (mention Pro features!)
     - Keywords
     - Categories: Productivity, Health & Fitness
   
2. **Pricing**: Set to **Free** (with in-app purchases)

3. **In-App Purchases Section**:
   - Check that all 3 purchases show up
   - They should say "Ready to Submit"

4. Click **"Submit for Review"**

5. Wait 24-48 hours for Apple review

---

## ✅ Verification Checklist

Before submitting, verify:

- [ ] All 3 product IDs created (monthly, yearly, lifetime)
- [ ] All products have pricing in USD
- [ ] All products have English localization
- [ ] Sandbox tester account created
- [ ] Tested purchases with sandbox account
- [ ] Banking/tax info submitted
- [ ] Paid Apps Agreement signed
- [ ] App Store screenshots uploaded
- [ ] App metadata mentions subscriptions

---

## 🐛 Common Issues

### "Product IDs not showing in app"
- **Wait 2-4 hours** after creating them
- Product IDs propagate slowly through Apple's servers
- Try: Delete app, reinstall, try again

### "Cannot connect to iTunes Store"
- You're using Expo Go → Won't work
- Must use EAS Build
- Run: `eas build --profile development --platform ios`

### "Sandbox purchase fails"
- Sign out of ALL Apple IDs first
- Only sign in when app prompts
- Try different sandbox account
- Clear App Store cache: Settings → General → iPhone Storage → App Store → Offload

### "Payment sheet doesn't appear"
- Check Product IDs match exactly
- Check app is built with EAS (not Expo Go)
- Verify sandbox account is valid
- Check device region matches tester region

---

## 💰 When Will You Get Paid?

1. **Apple's Schedule**:
   - Payments are processed monthly
   - Reports available in App Store Connect
   - Money transferred 45 days after month ends

2. **Example Timeline**:
   - User subscribes: January 15
   - Apple processes: February 1
   - Report available: February 5
   - You get paid: March 15 (45 days after Jan 31)

3. **Your Take**:
   - First year: **70%** of subscription price
   - After 1 year: **85%** of price (if user stays subscribed)
   - Apple handles: Payment processing, refunds, currency conversion

---

## 📞 Need Help?

- **Apple Support**: https://developer.apple.com/contact/
- **Documentation**: https://developer.apple.com/in-app-purchase/
- **Your Support**: onehabithero@gmail.com

---

## 🎉 You're Ready!

Once you complete these steps, your app will be able to accept real payments from users worldwide. Apple handles all the payment processing, you just collect the revenue!

**Estimated Time to Complete**: 45-60 minutes
**Estimated Time to Approval**: 24-48 hours

Good luck with your launch! 💰🚀
