# Background Music Setup

## Simple Music Player

Code the Beat now includes a simple, non-intrusive music player with:
- **Play/Pause button** - Click to start/stop background music
- **Volume at 10%** - Default low volume that won't interfere with coding
- **Popup controls** - Click the speaker icon for volume control and track switching

## Adding Music Files

To enable background music, add your MP3 files to this directory (`public/bgm/`).

### Quick Setup (Single File):

1. Add your music file to this folder (e.g., `background-music.mp3`)
2. Update `App.tsx` line 60 to use your filename:
   ```typescript
   bgmManager.setSingleTrackForAll('background-music.mp3');
   ```
3. Reload the app - music will auto-start at 10% volume

### Advanced Setup (Multiple Tracks):

Add these specific files for different scenarios:
- **coding-flow.mp3** - Main background music for coding challenges
- **victory-fanfare.mp3** - Achievement unlock sound (3-5 seconds)
- **ambient-tech.mp3** - Menu/dashboard background music
- **focus-beats.mp3** - Intense focus music for higher levels

## Music Controls

### Simple Interface:
- **Play/Pause**: Purple button in top-right corner
- **Speaker Icon**: Click to open volume controls popup
- **Popup Controls**: Volume slider, mute toggle, track switching

### Default Settings:
- **Volume**: 10% (quiet background music)
- **Auto-start**: Music begins when app loads
- **Non-intrusive**: Low volume, easy to control

## File Requirements:

- **Format**: MP3 (best browser compatibility)
- **Size**: Keep under 10MB for faster loading
- **Length**: 2-5 minutes (will loop automatically)
- **Volume**: Pre-normalize to avoid volume jumps (player defaults to 10% anyway)

## Demo Mode:

Until you add real MP3 files, the app runs in "demo mode":
- All music controls work normally
- No actual audio plays
- Console shows helpful messages
- Yellow notice appears in controls popup

## How It Works:

1. **Minimal Interface**: Just play/pause + speaker button in top-right
2. **Popup Controls**: Click speaker for volume, mute, track switching
3. **Smart Volume**: Starts at 10% so it's not distracting
4. **Auto-start**: Music begins automatically (after user interaction)
5. **Achievement Effects**: Special sounds play when achievements unlock

## Legal Note:

Ensure you have the rights to use any music files you add. Consider:
- Royalty-free music from YouTube Audio Library, Freesound
- Creative Commons licensed tracks
- Original compositions

## Testing:

1. Add your MP3 file(s) to this directory
2. Update filename in `App.tsx` if using single track mode
3. Reload the app
4. Click play button to start music at 10% volume
5. Click speaker icon to access volume controls
