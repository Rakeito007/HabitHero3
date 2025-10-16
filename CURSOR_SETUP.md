# 🎯 Cursor IDE Setup Guide for Habit Hero

## ✅ What's Already Configured

Your project is **fully optimized** for Cursor IDE with:

### 1. VSCode Settings (`.vscode/settings.json`)
- ✅ Format on save enabled
- ✅ ESLint auto-fix on save
- ✅ TypeScript IntelliSense optimized
- ✅ Tailwind CSS autocomplete configured
- ✅ File exclusions for better performance
- ✅ Cursor AI-specific settings enabled

### 2. Cursor Rules (`.cursorrules`)
- ✅ Project context and tech stack documented
- ✅ Code style guidelines
- ✅ React Native best practices
- ✅ Common patterns and templates
- ✅ API usage instructions
- ✅ Performance optimization tips

### 3. Extension Recommendations (`.vscode/extensions.json`)
- ✅ Essential extensions listed
- ✅ TypeScript support
- ✅ Tailwind CSS IntelliSense
- ✅ React Native tools

### 4. TypeScript Configuration (`tsconfig.json`)
- ✅ Path aliases configured (@components, @screens, etc.)
- ✅ Strict mode enabled
- ✅ Proper includes/excludes

---

## 🚀 Getting Started with Cursor

### First-Time Setup

1. **Open Project in Cursor**
   ```bash
   cursor /path/to/habit-hero
   ```

2. **Install Recommended Extensions**
   - Cursor will prompt you to install recommended extensions
   - Click "Install All" or install individually from Extensions panel

3. **Trust Workspace**
   - When prompted, click "Trust Workspace"
   - This enables all features including ESLint, Prettier, etc.

4. **Verify TypeScript**
   - Open any `.tsx` file
   - Check bottom-right corner shows TypeScript version
   - Should see "TypeScript 5.x.x" using workspace version

---

## 🎨 Cursor AI Features

### 1. Code Completion (Copilot++)
Cursor provides intelligent code suggestions as you type:
- **Trigger**: Just start typing - suggestions appear automatically
- **Accept**: Press `Tab` to accept
- **Reject**: Press `Esc` or keep typing

### 2. Chat (Cmd/Ctrl + L)
Ask questions about your codebase:
```
Examples:
- "How does the IAP service work?"
- "Show me all habit-related screens"
- "Explain the theme system"
- "Where is the purchase flow handled?"
```

### 3. Edit Mode (Cmd/Ctrl + K)
Select code and ask Cursor to modify it:
```
Examples:
- Select a component → "Add error handling"
- Select a function → "Add TypeScript types"
- Select styles → "Convert to dark theme"
```

### 4. Composer (Cmd/Ctrl + I)
Multi-file editing and large changes:
```
Examples:
- "Add a new screen for habit statistics"
- "Refactor the theme system to support more colors"
- "Add loading states to all API calls"
```

---

## 💡 Cursor Best Practices for This Project

### 1. Context-Aware Queries
Be specific about what you're working on:
```
❌ "Add a button"
✅ "Add a button to DashboardScreen that opens the habit editor"

❌ "Fix the navigation"
✅ "Fix the navigation in AppNavigator to properly handle the theme selection screen"
```

### 2. Reference Files
Tag files in your prompts:
```
@DashboardScreen.tsx - How do I add a new button here?
@iapService.ts - Explain how restore purchases works
@theme.ts - Add a new color to the theme system
```

### 3. Use Project Knowledge
Cursor has access to `.cursorrules`, so you can ask:
```
- "What's the button pattern for this project?"
- "Show me the screen template"
- "What's the recommended way to handle modals?"
```

### 4. Codebase Search
Cursor can search your entire codebase:
```
- "Find all files that use Zustand"
- "Where is the habit creation logic?"
- "Show me all API service files"
```

---

## 🔧 Keyboard Shortcuts

### Essential Shortcuts
| Action | Mac | Windows/Linux |
|--------|-----|---------------|
| Chat | `Cmd + L` | `Ctrl + L` |
| Edit | `Cmd + K` | `Ctrl + K` |
| Composer | `Cmd + I` | `Ctrl + I` |
| Accept Suggestion | `Tab` | `Tab` |
| Command Palette | `Cmd + Shift + P` | `Ctrl + Shift + P` |
| Quick Open | `Cmd + P` | `Ctrl + P` |
| Go to Symbol | `Cmd + Shift + O` | `Ctrl + Shift + O` |

### React Native Specific
| Action | Mac | Windows/Linux |
|--------|-----|---------------|
| Reload Metro | `Cmd + R` | `Ctrl + R` |
| Format Document | `Cmd + Shift + F` | `Ctrl + Shift + F` |
| Quick Fix | `Cmd + .` | `Ctrl + .` |
| Rename Symbol | `F2` | `F2` |

---

## 🎯 Common Cursor Workflows

### 1. Adding a New Feature
```
1. Open Composer (Cmd/Ctrl + I)
2. Describe the feature:
   "Add a habit archive feature with:
   - Archive button in habit detail screen
   - Archived habits section in settings
   - Ability to unarchive habits"
3. Review changes across all files
4. Accept or modify as needed
```

### 2. Debugging an Issue
```
1. Select the problematic code
2. Open Chat (Cmd/Ctrl + L)
3. Ask: "Why isn't this working? [paste error message]"
4. Get explanation + suggested fix
5. Apply fix using Edit mode if needed
```

### 3. Understanding Existing Code
```
1. Open Chat (Cmd/Ctrl + L)
2. Ask: "@DashboardScreen.tsx Explain the analytics calculation logic"
3. Get detailed explanation with code references
4. Ask follow-up questions as needed
```

### 4. Refactoring
```
1. Select code to refactor
2. Edit mode (Cmd/Ctrl + K)
3. Request change: "Extract this into a custom hook"
4. Review suggestion
5. Accept or iterate
```

---

## 📁 Project Structure for Cursor

Cursor understands your project structure. Reference these paths:

### Screens
- `@screens/DashboardScreen.tsx` - Main habit list
- `@screens/AddHabitScreen.tsx` - Create new habit
- `@screens/HabitDetailScreen.tsx` - Habit stats & history
- `@screens/SettingsScreen.tsx` - App settings
- `@screens/OnboardingScreen.tsx` - First-time setup + IAP

### Services
- `@services/iapService.ts` - In-app purchases
- `@services/achievementService.ts` - Achievement system

### API
- `@api/chat-service.ts` - Unified AI chat interface
- `@api/openai.ts` - OpenAI client
- `@api/anthropic.ts` - Anthropic client
- `@api/image-generation.ts` - Image generation
- `@api/transcribe-audio.ts` - Audio transcription

### State
- `@state/habitStore.ts` - Main Zustand store

### Utils
- `@utils/theme.ts` - Theme system
- `@utils/proFeatures.ts` - Pro feature gating
- `@utils/cn.ts` - Tailwind class helper

---

## 🐛 Troubleshooting

### IntelliSense Not Working
1. Reload window: `Cmd/Ctrl + Shift + P` → "Reload Window"
2. Check TypeScript version (bottom-right)
3. Ensure workspace is trusted

### Tailwind Autocomplete Not Working
1. Install "Tailwind CSS IntelliSense" extension
2. Check `.vscode/settings.json` has Tailwind config
3. Reload window if needed

### ESLint/Prettier Conflicts
1. Check `.vscode/settings.json` has correct formatter
2. Verify `.prettierrc` and `.eslintrc.js` exist
3. Run: `bun run lint` to check for issues

### Cursor AI Not Responding
1. Check internet connection
2. Verify Cursor subscription is active
3. Try reloading window
4. Check Cursor status page

---

## 💰 Cursor Pricing & Features

### Free Tier
- ✅ Basic code completion
- ✅ Limited AI requests (50/month)
- ✅ Chat with codebase
- ⚠️ May be slow during peak times

### Pro ($20/month)
- ✅ Unlimited AI requests
- ✅ Priority access (faster responses)
- ✅ Advanced models (GPT-4, Claude 3.5)
- ✅ Composer for multi-file edits
- ✅ Early access to new features

**Recommendation**: Pro is worth it for active development!

---

## 🎓 Learning Resources

### Cursor Documentation
- [Cursor Docs](https://docs.cursor.sh/)
- [Cursor Shortcuts](https://docs.cursor.sh/shortcuts)
- [Cursor Rules Guide](https://docs.cursor.sh/context/rules)

### Project Documentation
- `APP_STORE_SUBMISSION_CHECKLIST.md` - Submission guide
- `IAP_SETUP_GUIDE.md` - IAP setup details
- `QUICK_REFERENCE.md` - Quick IAP reference
- `CLEANUP_COMPLETE.md` - Recent changes

### React Native + Cursor
- Ask Cursor: "What's the React Native best practice for [topic]?"
- Reference `.cursorrules` for project-specific patterns
- Use Composer for large structural changes

---

## 🚀 Advanced Tips

### 1. Custom Cursor Rules
The `.cursorrules` file teaches Cursor about your project:
- Tech stack (React Native + Expo)
- Code style (double quotes, Pressable over TouchableOpacity)
- File organization
- Common patterns

### 2. Multi-File Context
When asking questions, provide context:
```
"Looking at @DashboardScreen.tsx and @habitStore.ts, 
how can I add a filter for archived habits?"
```

### 3. Iterative Development
Use Chat for planning, Edit for implementation:
```
Chat: "How should I structure a new achievements system?"
↓ (Get plan)
Composer: "Implement the achievements system as discussed"
↓ (Get code)
Edit: "Add error handling to the achievement unlock logic"
```

### 4. Code Review
Ask Cursor to review your changes:
```
"Review this component for:
- Performance issues
- Accessibility concerns
- TypeScript type safety
- React Native best practices"
```

---

## ✅ Quick Verification Checklist

After opening in Cursor, verify:
- [ ] Extensions installed (ESLint, Prettier, Tailwind)
- [ ] TypeScript IntelliSense working (shows types on hover)
- [ ] Tailwind autocomplete working (className suggestions)
- [ ] Format on save working (try adding spaces and saving)
- [ ] ESLint working (see yellow/red squiggles for issues)
- [ ] Cursor AI responding (try Cmd/Ctrl + L chat)
- [ ] No TypeScript errors (run `npx tsc --noEmit`)

---

## 🎉 You're Ready!

Your Habit Hero project is **fully optimized** for Cursor IDE. 

### Next Steps:
1. Open project in Cursor
2. Install recommended extensions
3. Try Chat (Cmd/Ctrl + L) → "Give me an overview of this project"
4. Start building! 🚀

### Pro Tips:
- Use Chat for questions and exploration
- Use Edit for small, focused changes
- Use Composer for multi-file features
- Reference `.cursorrules` for project conventions

Happy coding! 💻✨
