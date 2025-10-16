# Quick Reference Card - App Store Connect

## 🎯 Your Product IDs (Copy/Paste These)

```
Monthly:  com.vibecode.habithero.monthly
Yearly:   com.vibecode.habithero.yearly
Lifetime: com.vibecode.habithero.lifetime
```

## 💰 Pricing

| Product | Type | Price | Your Cut (70%) |
|---------|------|-------|----------------|
| Monthly | Auto-renewable | $1.99/mo | $1.39/mo |
| Yearly | Auto-renewable | $19.99/yr | $13.99/yr |
| Lifetime | One-time | $25.00 | $17.50 |

## 📋 Quick Steps Checklist

### Part 1: Products (15 min)
- [ ] Create subscription group "Habit Hero Pro"
- [ ] Add Monthly subscription ($1.99)
- [ ] Add Yearly subscription ($19.99)
- [ ] Add Lifetime non-consumable ($25.00)
- [ ] Add localizations for each

### Part 2: Testing (5 min)
- [ ] Create sandbox tester account
- [ ] Save credentials: `test.habithero.___@icloud.com`

### Part 3: Banking (10 min)
- [ ] Sign Paid Apps Agreement
- [ ] Add bank account info
- [ ] Submit tax forms (W-9 or W-8BEN)

### Part 4: Review (10 min)
- [ ] Add screenshots to each product
- [ ] Add review notes
- [ ] Submit products for review

### Part 5: Testing (15 min)
- [ ] Build: `eas build --profile development --platform ios`
- [ ] Test purchase with sandbox account
- [ ] Test restore purchases
- [ ] Verify Pro features unlock

### Part 6: Launch (5 min)
- [ ] Submit app for review
- [ ] Wait 24-48 hours
- [ ] Go live! 🚀

## 🔗 Important Links

| What | URL |
|------|-----|
| App Store Connect | https://appstoreconnect.apple.com |
| Apple Developer | https://developer.apple.com |
| IAP Documentation | https://developer.apple.com/in-app-purchase/ |
| Support | https://developer.apple.com/contact/ |

## ⚡ Most Common Mistakes

1. ❌ **Product IDs don't match** → Must be EXACT
2. ❌ **Using Expo Go** → Must use EAS Build
3. ❌ **Signed into real Apple ID** → Use sandbox only
4. ❌ **Didn't sign agreements** → Won't get paid
5. ❌ **Waiting < 2 hours** → Products need time to propagate

## 💡 Pro Tips

- **Save sandbox credentials** in password manager
- **Test on physical device** (simulator has issues)
- **Wait 2-4 hours** after creating products before testing
- **Sign out of App Store** before testing (Settings → Apple ID)
- **Add promo text** about free trial in onboarding

## 📊 Revenue Expectations

### Conservative Estimates:
- 100 users → 10 conversions (10%) → $140/month
- 1,000 users → 100 conversions (10%) → $1,400/month
- 10,000 users → 1,000 conversions (10%) → $14,000/month

### Conversion Rate Tips:
- Free tier limits (3 habits) → Creates upgrade pressure ✅
- Show analytics behind paywall → Value perception ✅
- Lifetime option → Captures one-time buyers ✅
- Pro badge on dashboard → Social proof ✅

## 🎓 Next Steps After Setup

1. **Monitor Analytics** (App Store Connect)
   - Daily downloads
   - Conversion rates
   - Revenue trends

2. **A/B Test Pricing**
   - Try $2.99/month after 1 month
   - Test yearly at $24.99
   - Measure conversion changes

3. **Add Promotional Offers**
   - 3-day free trial for monthly
   - Introductory price: $0.99 first month
   - Win-back offers for churned users

4. **Marketing**
   - App Store Optimization (ASO)
   - Social media (TikTok, Instagram)
   - Product Hunt launch
   - Reddit communities (r/productivity, r/habits)

## 📞 Support

Questions? Email: onehabithero@gmail.com

**Estimated Setup Time**: 45-60 minutes
**Estimated Approval Time**: 24-48 hours
**Start Earning**: Within 72 hours! 💰

---

**Keep this document handy during setup!**
