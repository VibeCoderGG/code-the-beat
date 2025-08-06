# Achievement System Debug Guide

## 🔍 How to Test Achievement Issues

### Testing Achievement Points
1. **Reset everything**: Use "Reset All" button to start fresh
2. **Complete a few challenges**: Answer questions correctly to earn points
3. **Check total score**: Should be `gameScore + achievementPoints`
4. **Watch console**: No errors should appear about achievement points

### Testing Achievement Notifications
1. **Open browser dev tools** (F12)
2. **Watch localStorage**: Check `codeBeatAchievements` and `shownAchievements` keys
3. **Complete challenges**: Watch for achievement unlocks
4. **Reload page**: Achievements should NOT show again
5. **Check storage**: `shownAchievements` should contain achievement IDs

### Testing Dashboard Notifications
1. **Unlock achievements** without opening dashboard
2. **Check badge count**: Should show number on Dashboard button
3. **Open dashboard**: Badge should disappear
4. **Reload page**: Badge should stay hidden until new achievements

## 🐛 Current Debugging Steps

### For Points Not Adding:
```javascript
// In browser console, check these:
localStorage.getItem('codeBeatBaseGameScore');
localStorage.getItem('codeBeatAchievementPoints');
localStorage.getItem('codeBeatPlayerStats');
```

### For Repeated Notifications:
```javascript
// Check what's stored:
localStorage.getItem('shownAchievements');
localStorage.getItem('codeBeatAchievements');
```

### For Dashboard Badge:
- The badge is controlled by `getUnseenAchievements().length > 0`
- Opening dashboard calls `markAchievementsAsSeen()`
- This sets `seen: true` on all achievements

## 💡 Solution Summary

The system works like this:
1. **Achievement Points**: `total_score = baseGameScore + achievementPoints`
2. **Notification Tracking**: Uses localStorage `shownAchievements` array
3. **Dashboard Badge**: Shows count of achievements with `seen: false`

## 🚨 If Still Not Working

Check browser console for any errors and verify localStorage contains the right data structure.
