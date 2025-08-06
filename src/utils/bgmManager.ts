// Background Music Manager
export class BGMManager {
  private audio: HTMLAudioElement | null = null;
  private currentTrack: string | null = null;
  private volume: number = 0.1; // Default to 10%
  private isPlaying: boolean = false;
  private isMuted: boolean = false;

  // Available BGM tracks mapped to your actual audio files
  private tracks = {
    coding: '/bgm/Ambient Background - loop A.wav',      // Ambient coding music
    achievement: '/bgm/Inspirational Motivational (Short).wav', // Achievement unlock sound
    menu: '/bgm/Calm Relax.wav',       // Menu/dashboard music
    intense: '/bgm/ES_Freak Out (Instrumental Version) - OTE.wav'      // High-energy focus music
  };

  // Playlist support for multiple tracks
  private playlists: Record<string, string[]> = {
    coding: [
      '/bgm/Ambient Background - loop A.wav',
      '/bgm/Calm Relax.wav',
      '/bgm/ES_Easy Walker - Brendon Moeller.wav'
    ],
    chill: [
      '/bgm/Calm Relax.wav',
      '/bgm/This Ambience.wav',
      '/bgm/Summer Upbeat Uplifting Party Dance Pop.wav'
    ],
    focus: [
      '/bgm/ES_Freak Out (Instrumental Version) - OTE.wav',
      '/bgm/Inspirational Motivational (Short).wav',
      '/bgm/MAIN_TRACK.wav'
    ]
  };

  private currentPlaylist: string[] = [];
  private currentTrackIndex: number = 0;
  private isPlaylistMode: boolean = false;

  // Fallback silent track for demo mode
  private silentMode = false; // Set to true if you want silent mode, false to use actual music files

  constructor() {
    // Load volume preference from localStorage, default to 10%
    const savedVolume = localStorage.getItem('codeBeatBGMVolume');
    const savedMuted = localStorage.getItem('codeBeatBGMMuted');
    
    if (savedVolume) {
      this.volume = parseFloat(savedVolume);
    } else {
      this.volume = 0.1; // Default to 10% volume
    }
    
    if (savedMuted) {
      this.isMuted = savedMuted === 'true';
    }
  }

  async playTrack(trackName: keyof typeof this.tracks, loop: boolean = true): Promise<void> {
    try {
      // If same track is already playing, don't restart
      if (this.currentTrack === trackName && this.isPlaying && this.audio) {
        return;
      }

      // Stop current track
      this.stop();

      // Create new audio element
      this.audio = new Audio();
      
      if (this.silentMode) {
        // Silent mode for testing without audio files
        console.log(`🎵 Silent mode: Would play BGM track "${trackName}"`);
        this.currentTrack = trackName;
        this.isPlaying = true;
        return;
      }

      // Set up the audio element
      this.audio.src = this.tracks[trackName];
      this.audio.loop = loop;
      this.audio.volume = this.isMuted ? 0 : this.volume;
      this.audio.preload = 'auto';
      
      console.log(`🎵 Loading BGM: ${this.tracks[trackName]}`);
      
      // Add error handler for missing files
      this.audio.addEventListener('error', () => {
        console.warn(`🎵 Could not load music file: ${this.tracks[trackName]}`);
        console.log(`💡 Make sure the file exists in /public/bgm/`);
        console.log(`📁 Available files: Check your /public/bgm/ directory`);
        // Don't set silent mode, just fail gracefully for this track
      });

      // Add loaded event handler
      this.audio.addEventListener('loadeddata', () => {
        console.log(`✅ BGM file loaded successfully: ${trackName}`);
      });

      // Add ended event handler for non-looping tracks
      this.audio.addEventListener('ended', () => {
        if (!loop) {
          this.isPlaying = false;
          this.currentTrack = null;
        }
      });
      
      this.currentTrack = trackName;
      
      // Try to play the audio
      await this.audio.play();
      this.isPlaying = true;
      
      console.log(`🎵 Now playing: ${trackName} (${loop ? 'looping' : 'once'})`);
      
    } catch (error) {
      console.warn('BGM playback failed:', error);
      
      // Specific error handling
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          console.log(`💡 User interaction required to start audio. Click anywhere to enable music.`);
        } else if (error.name === 'NotSupportedError') {
          console.log(`💡 Audio format not supported. Try converting to MP3 or WAV.`);
        } else {
          console.log(`💡 Audio error: ${error.message}`);
        }
      }
      
      // Continue without music instead of setting silent mode
      this.isPlaying = false;
      this.currentTrack = null;
    }
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    this.isPlaying = false;
    this.currentTrack = null;
  }

  pause(): void {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  resume(): void {
    if (this.audio && !this.isPlaying) {
      this.audio.play().then(() => {
        this.isPlaying = true;
      }).catch(console.warn);
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }
    localStorage.setItem('codeBeatBGMVolume', this.volume.toString());
  }

  getVolume(): number {
    return this.volume;
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }
    localStorage.setItem('codeBeatBGMMuted', this.isMuted.toString());
    return this.isMuted;
  }

  isMutedState(): boolean {
    return this.isMuted;
  }

  getCurrentTrack(): string | null {
    return this.currentTrack;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  // Enable real music mode (call this when you have actual music files)
  enableRealMusic(): void {
    this.silentMode = false;
    console.log('🎵 Real music mode enabled');
  }

  // Check if in silent demo mode
  isInSilentMode(): boolean {
    return this.silentMode;
  }

  // Smooth transition between tracks
  async fadeToTrack(trackName: keyof typeof this.tracks, duration: number = 1000): Promise<void> {
    if (this.audio && this.isPlaying) {
      // Fade out current track
      const originalVolume = this.audio.volume;
      const fadeOutSteps = 20;
      const fadeOutInterval = duration / fadeOutSteps;
      
      for (let i = fadeOutSteps; i >= 0; i--) {
        if (this.audio) {
          this.audio.volume = (originalVolume * i) / fadeOutSteps;
        }
        await new Promise(resolve => setTimeout(resolve, fadeOutInterval));
      }
    }
    
    // Play new track
    await this.playTrack(trackName);
    
    // Fade in new track
    if (this.audio) {
      this.audio.volume = 0;
      const targetVolume = this.isMuted ? 0 : this.volume;
      const fadeInSteps = 20;
      const fadeInInterval = duration / fadeInSteps;
      
      for (let i = 0; i <= fadeInSteps; i++) {
        if (this.audio) {
          this.audio.volume = (targetVolume * i) / fadeInSteps;
        }
        await new Promise(resolve => setTimeout(resolve, fadeInInterval));
      }
    }
  }

  // Helper method to use a single MP3 file for all tracks
  setSingleTrackForAll(filename: string): void {
    const fullPath = `/bgm/${filename}`;
    this.tracks = {
      coding: fullPath,
      achievement: fullPath,
      menu: fullPath,
      intense: fullPath
    };
    console.log(`🎵 BGM configured to use: ${filename}`);
  }

  // Helper method to set a specific track
  setTrack(trackName: keyof typeof this.tracks, filename: string): void {
    this.tracks[trackName] = `/bgm/${filename}`;
    console.log(`🎵 ${trackName} track set to: ${filename}`);
  }

  // 🎵 PLAYLIST METHODS - Random Music Rotation
  
  // Set up a playlist for random music rotation
  setPlaylist(playlistName: string, filenames: string[]): void {
    this.playlists[playlistName] = filenames.map(filename => `/bgm/${filename}`);
    console.log(`🎵 Playlist "${playlistName}" set with ${filenames.length} tracks`);
  }

  // Start playlist mode with random track selection
  async startPlaylist(playlistName: string): Promise<void> {
    if (!this.playlists[playlistName] || this.playlists[playlistName].length === 0) {
      console.warn(`Playlist "${playlistName}" is empty or doesn't exist`);
      return;
    }

    this.isPlaylistMode = true;
    this.currentPlaylist = [...this.playlists[playlistName]];
    
    // Shuffle the playlist for random order
    this.shufflePlaylist();
    
    // Start with first track
    this.currentTrackIndex = 0;
    await this.playPlaylistTrack();
  }

  // Shuffle playlist for random order
  private shufflePlaylist(): void {
    for (let i = this.currentPlaylist.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.currentPlaylist[i], this.currentPlaylist[j]] = [this.currentPlaylist[j], this.currentPlaylist[i]];
    }
  }

  // Play current track in playlist
  private async playPlaylistTrack(): Promise<void> {
    if (this.currentPlaylist.length === 0) return;

    try {
      this.stop();
      
      this.audio = new Audio();
      this.audio.src = this.currentPlaylist[this.currentTrackIndex];
      this.audio.volume = this.isMuted ? 0 : this.volume;
      this.audio.loop = false; // Don't loop individual tracks in playlist
      
      // Set up event listener for when track ends
      this.audio.addEventListener('ended', () => {
        this.playNextInPlaylist();
      });
      
      await this.audio.play();
      this.isPlaying = true;
      this.currentTrack = 'playlist';
      
      console.log(`🎵 Playing track ${this.currentTrackIndex + 1}/${this.currentPlaylist.length} from playlist`);
      
    } catch (error) {
      console.warn('Playlist track playback failed:', error);
      // Try next track
      this.playNextInPlaylist();
    }
  }

  // Move to next track in playlist
  private playNextInPlaylist(): void {
    if (!this.isPlaylistMode || this.currentPlaylist.length === 0) return;
    
    this.currentTrackIndex++;
    
    // If we've played all tracks, reshuffle and start over
    if (this.currentTrackIndex >= this.currentPlaylist.length) {
      this.shufflePlaylist();
      this.currentTrackIndex = 0;
      console.log('🎵 Playlist completed, reshuffling for continuous play');
    }
    
    // Play next track
    this.playPlaylistTrack();
  }

  // Stop playlist mode and return to single track mode
  stopPlaylist(): void {
    this.isPlaylistMode = false;
    this.currentPlaylist = [];
    this.currentTrackIndex = 0;
    this.stop();
    console.log('🎵 Playlist mode stopped');
  }

  // Check if currently in playlist mode
  isInPlaylistMode(): boolean {
    return this.isPlaylistMode;
  }
}

// Global BGM instance
export const bgmManager = new BGMManager();
