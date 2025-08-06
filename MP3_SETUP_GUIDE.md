# 🎵 MP3 Setup Guide for Code the Beat

## 🚀 Quick Setup (3 Easy Steps)

### **Step 1: Copy Your MP3 File**
1. Copy your MP3 file to: `public/bgm/` folder
2. You can name it anything you want (e.g., `my-music.mp3`, `background.mp3`, etc.)

### **Step 2: Configure the BGM System**
Add this code to your `App.tsx` file (preferably in a useEffect):

```typescript
// Import the bgmManager
import { bgmManager } from './utils/bgmManager';

// In your App component, add this useEffect:
useEffect(() => {
  // Replace 'your-file.mp3' with your actual MP3 filename
  bgmManager.setSingleTrackForAll('your-file.mp3');
  bgmManager.enableRealMusic();
}, []);
```

### **Step 3: That's It!**
Your MP3 will now play as background music throughout the website!

---

## 🎛️ Advanced Configuration

### **Option 1: Single File for Everything**
```typescript
// Use one MP3 for all game states
bgmManager.setSingleTrackForAll('my-background-music.mp3');
```

### **Option 2: Different Files for Different States**
```typescript
// Set different music for different game states
bgmManager.setTrack('coding', 'coding-music.mp3');        // Regular gameplay
bgmManager.setTrack('achievement', 'victory-sound.mp3');  // Achievement unlocks
bgmManager.setTrack('menu', 'menu-music.mp3');          // Dashboard/menus
bgmManager.setTrack('intense', 'focus-music.mp3');       // High streaks
```

### **Option 3: Manual File Placement**
If you want to use the default filenames, rename your files to:
- `coding-flow.mp3` - Main background music
- `victory-fanfare.mp3` - Achievement sounds (optional)
- `ambient-tech.mp3` - Menu music (optional)  
- `focus-beats.mp3` - Intense focus music (optional)

---

## 🎵 What Happens Next

1. **Music Auto-Starts**: When users click "Start Music", your MP3 will play
2. **Volume Control**: Users can adjust volume with the slider
3. **Looping**: Music will loop continuously
4. **Responsive**: Works on both desktop and mobile
5. **Persistent**: Volume and play state remembered across sessions

---

## 🔧 Troubleshooting

### **MP3 Not Playing?**
1. Check file path: Make sure MP3 is in `public/bgm/` folder
2. Check filename: Ensure the filename in code matches your actual file
3. Check browser console for error messages
4. Try a different MP3 file (some files may have encoding issues)

### **Browser Support**
- ✅ Chrome, Firefox, Safari, Edge (all modern browsers)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ⚠️ Some browsers may require user interaction before playing audio

---

## 📁 File Structure Example
```
public/
├── bgm/
│   └── your-music.mp3     ← Your MP3 file goes here
├── vite.svg
└── ...
```

---

## 🎮 Ready to Rock!

Once you've completed the setup, your coding game will have real background music that enhances the experience. Users will love coding to the beat! 🎵🚀
