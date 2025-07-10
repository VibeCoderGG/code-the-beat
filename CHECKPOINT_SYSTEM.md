# Checkpoint System Implementation

## Overview
A comprehensive checkpoint system has been implemented to provide fair progress recovery without completely resetting the game. The system includes visual indicators, progressive penalties, and user-friendly reset options.

## Features

### 1. Checkpoint Creation
- **When**: A checkpoint is automatically created when a player completes a level
- **What**: The player's score at the start of the next level is saved
- **Storage**: Checkpoints are stored in localStorage with the key `levelCheckpoints`
- **Visual**: Checkpoint score is displayed in the level info bar

### 2. Penalty System
- **Progressive Penalties**: 
  - 1st wrong attempt: -10 points
  - 2nd wrong attempt: -15 points
  - 3rd wrong attempt: -20 points
  - 4th wrong attempt: -25 points
  - And so on... (max penalty: -50 points)
- **Score Protection**: Score never goes below 0
- **Visual Feedback**: Shows attempt number and penalty amount in feedback
- **Attempt Counter**: Red indicator showing current attempts in the header

### 3. Reset Options
- **Reset Level**: Resets to the start of the current level with checkpoint score
- **Reset Progress**: Completely resets all progress (with confirmation dialog)
- **Visual Distinction**: Different colors (orange vs red) and icons (undo vs rotate)

## User Interface Elements

### Header Indicators
- **Score Display**: Current score with star icon
- **Attempt Counter**: Shows when attempts > 0 (red indicator)
- **Checkpoint Display**: Shows checkpoint score for current level (blue indicator)
- **Streak Display**: Shows current streak (orange indicator)

### Control Buttons
- **Reset Level**: Orange button with undo icon
  - Tooltip: "Reset to the start of the current level with your checkpoint score"
- **Reset Progress**: Red button with rotate icon
  - Tooltip: "Reset all progress, achievements, and unlock only Level 1"

## Usage

### Reset Level Button
- **Location**: Bottom action bar (orange button with undo icon)
- **Action**: Resets player to start of current level
- **Score**: Restores to checkpoint score (score when level started)
- **Challenges**: Resets to first challenge of current level
- **Streak**: Resets to 0
- **Attempts**: Resets to 0

### Example Flow
1. Player completes Level 1 with 300 points
2. Checkpoint saved: `levelCheckpoints[2] = 300` (Level 2 starts with 300 points)
3. Player progresses in Level 2, gets to 450 points
4. Player makes mistakes, gets penalties, score drops to 400 points
5. Player can see attempt counter showing failed attempts
6. Player clicks "Reset Level" (orange button)
7. Player is reset to start of Level 2 with 300 points (checkpoint score)
8. Checkpoint indicator shows "Checkpoint: 300"

## Technical Details

### Data Structure
```typescript
levelCheckpoints: {
  [levelId: number]: number  // levelId -> checkpoint score
}
```

### Key Functions
- `resetToCheckpoint()`: Resets to current level's checkpoint
- `resetGame()`: Full progress reset
- Penalty system in `submitCode()`: Progressive point deduction

### Storage
- Checkpoints are persisted in localStorage
- Backward compatibility with existing save data
- Automatic checkpoint creation on level completion

### Visual Feedback
- **Penalty Messages**: Include attempt count and penalty amount
- **Checkpoint Indicator**: Blue badge showing checkpoint score
- **Attempt Counter**: Red badge showing current attempts
- **Tooltips**: Helpful explanations for reset buttons

## Benefits
- **Fair**: Players don't lose all progress for mistakes
- **Motivating**: Encourages experimentation without fear of major loss
- **Balanced**: Still provides consequences for wrong answers
- **Educational**: Allows players to retry challenges with fresh perspective
- **Transparent**: Clear visual indicators show progress and penalties
- **User-Friendly**: Intuitive controls with helpful tooltips
