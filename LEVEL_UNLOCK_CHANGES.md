# Level Unlock System Changes

## Summary
Changed the level unlocking mechanism from **"complete entire level"** to **"every 20 questions answered"** regardless of which level the player is on.

## Changes Made

### 1. Modified `useGameEngine.ts`
- **Updated `submitCode` function**: Now calculates total questions answered across all levels and unlocks new levels every 20 questions
- **Added `getUnlockProgress` function**: Provides progress tracking for next level unlock
- **Improved calculation logic**: Properly counts challenges from completed levels plus current progress

### 2. Enhanced `LevelProgress.tsx` Component
- **Added unlock progress display**: Shows progress toward next level unlock
- **New visual indicator**: Green progress bar showing questions remaining until next unlock
- **Dynamic text**: Shows "X questions to unlock Level Y" or "Level Y unlocked!"

### 3. Updated `App.tsx`
- **Passed `getUnlockProgress` function**: Connected the unlock progress calculation to the UI component

## How It Works

### Old System
- Player had to complete ALL challenges in a level (50 for Level 1, 49 for Level 2, etc.)
- Only one level unlocked at a time
- Could take a very long time to unlock new content

### New System
- **Every 20 correct answers unlocks a new level**
- Player can answer 20 questions from Level 1, then gets Level 2 unlocked
- Can continue with more questions from Level 1 or switch to Level 2
- After 40 total questions, Level 3 unlocks, and so on

### Example Progression
- Questions 1-20: Level 2 unlocks
- Questions 21-40: Level 3 unlocks  
- Questions 41-60: Level 4 unlocks
- And so on...

## Technical Details

### Calculation Logic
```typescript
// Calculate total questions answered
let totalQuestionsAnswered = 0;

// Add challenges from all completed levels
for (let i = 0; i < gameState.currentLevel; i++) {
  totalQuestionsAnswered += levels[i].challenges.length;
}

// Add current progress in current level
totalQuestionsAnswered += gameState.currentChallenge + 1;

// Determine max unlockable level
const questionsNeededPerLevel = 20;
const maxUnlockableLevel = Math.min(
  Math.floor(totalQuestionsAnswered / questionsNeededPerLevel) + 1, 
  levels.length
);
```

### UI Updates
- **Level Progress Component**: Now shows both current challenge progress and unlock progress
- **Visual Feedback**: Green progress bar and text indicating progress toward next unlock
- **Real-time Updates**: Progress updates immediately when questions are answered correctly

## Benefits

1. **Faster Content Unlocking**: Players can access new levels much sooner
2. **Better Player Retention**: Regular rewards (new levels) keep players engaged
3. **Flexible Learning**: Players can explore different topics without being stuck on one level
4. **Clear Progress Indication**: Players always know how close they are to unlocking the next level

## Testing

The development server can be started with:
```bash
npm run dev
```

The game will now unlock levels every 20 questions instead of requiring full level completion.
