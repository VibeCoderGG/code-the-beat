import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bgmManager } from '../utils/bgmManager';

interface BGMControlsProps {
  className?: string;
}

export function BGMControls({ className = '' }: BGMControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(10);
  const [showControls, setShowControls] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  useEffect(() => {
    // Initialize BGM state
    setIsPlaying(bgmManager.isCurrentlyPlaying());
    setIsMuted(bgmManager.isMutedState());
    setVolume(Math.round(bgmManager.getVolume() * 100));
    setCurrentTrack(bgmManager.getCurrentTrack());

    // Set up a periodic check for BGM state
    const interval = setInterval(() => {
      setIsPlaying(bgmManager.isCurrentlyPlaying());
      setCurrentTrack(bgmManager.getCurrentTrack());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      bgmManager.pause();
      setIsPlaying(false);
    } else {
      try {
        await bgmManager.playTrack('coding', true);
        setIsPlaying(true);
      } catch (error) {
        console.warn('Failed to start BGM:', error);
      }
    }
  };

  const handleToggleMute = () => {
    const newMutedState = bgmManager.toggleMute();
    setIsMuted(newMutedState);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    bgmManager.setVolume(newVolume / 100);
  };

  const handleToggleControls = () => {
    setShowControls(!showControls);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showControls && !target.closest('.bgm-controls')) {
        setShowControls(false);
      }
    };

    if (showControls) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showControls]);

  return (
    <div className={`relative bgm-controls ${className}`}>
      {/* Music Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggleControls}
        className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
          isPlaying
            ? 'bg-purple-500/30 border-purple-400/50 text-purple-300'
            : 'bg-gray-700/50 border-gray-500/30 text-gray-400'
        } hover:bg-purple-500/40`}
        title="Music Controls"
        type="button"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Music className="w-5 h-5" />}
      </motion.button>

      {/* Music Controls Modal */}
      <AnimatePresence>
        {showControls && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              style={{ zIndex: 999998 }}
              onClick={() => setShowControls(false)}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-xl p-6 min-w-[280px] shadow-2xl"
              style={{ zIndex: 999999 }}
            >
            
            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-white mb-1">🎵 Music Controls</h3>
              {currentTrack && (
                <div className="text-sm text-gray-400">
                  Now Playing: {currentTrack}
                </div>
              )}
            </div>

            {/* Play/Pause Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTogglePlay}
              className="flex items-center justify-center space-x-3 w-full px-4 py-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-all duration-200 text-base font-medium mb-4"
              type="button"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause Music</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Play Music</span>
                </>
              )}
            </motion.button>

            {/* Mute Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleMute}
              className="flex items-center justify-center space-x-3 w-full px-4 py-3 rounded-lg bg-gray-700/40 hover:bg-gray-700/60 text-gray-300 transition-all duration-200 text-base font-medium mb-4"
              type="button"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-5 h-5" />
                  <span>Unmute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5" />
                  <span>Mute</span>
                </>
              )}
            </motion.button>
            
            {/* Volume Slider */}
            <div className="space-y-3 mb-4">
              <label className="block text-sm text-gray-300 font-medium">Volume: {volume}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${volume}%, #374151 ${volume}%, #374151 100%)`
                }}
              />
            </div>
            
            {/* Status and Close */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {isPlaying ? '🟢 Playing' : '⏸️ Paused'}
              </div>
              <button
                onClick={() => setShowControls(false)}
                className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded-md hover:bg-gray-700/50 transition-all duration-200"
              >
                Close
              </button>
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
