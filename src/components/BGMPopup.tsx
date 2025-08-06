import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bgmManager } from '../utils/bgmManager';

interface BGMPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BGMPopup({ isOpen, onClose }: BGMPopupProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(10);
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

  // Close popup when clicking outside or auto-close after delay
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.bgm-popup-content')) {
        onClose();
      }
    };

    // Auto-close after 8 seconds
    let autoCloseTimer: NodeJS.Timeout;
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      autoCloseTimer = setTimeout(() => {
        onClose();
      }, 8000);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
      }
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay Alert */}
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] bg-gray-900/95 backdrop-blur-md border border-purple-400/30 rounded-xl p-5 min-w-[320px] max-w-[400px] shadow-2xl bgm-popup-content"
            style={{
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.3), 0 10px 40px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-semibold text-white">Music Controls</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                type="button"
              >
                ✕
              </button>
            </div>

            {/* Current Track Alert */}
            {currentTrack && (
              <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-purple-300">🎵</span>
                  <div>
                    <div className="text-xs text-purple-200/80 font-medium">Now Playing</div>
                    <div className="text-sm text-purple-100 font-semibold">{currentTrack}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Control Buttons - Compact Row */}
            <div className="flex gap-2 mb-4">
              {/* Play/Pause Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTogglePlay}
                className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  isPlaying
                    ? 'bg-purple-500/30 hover:bg-purple-500/40 text-purple-300 border border-purple-400/50'
                    : 'bg-green-500/30 hover:bg-green-500/40 text-green-300 border border-green-400/50'
                }`}
                type="button"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span className="text-sm">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span className="text-sm">Play</span>
                  </>
                )}
              </motion.button>

              {/* Mute Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleToggleMute}
                className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  isMuted
                    ? 'bg-red-500/30 hover:bg-red-500/40 text-red-300 border border-red-400/50'
                    : 'bg-blue-500/30 hover:bg-blue-500/40 text-blue-300 border border-blue-400/50'
                }`}
                type="button"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span className="text-sm">Unmute</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm">Mute</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Volume Slider - Compact */}
            <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-gray-300 font-medium">Volume</label>
                <span className="text-xs text-purple-300 font-bold bg-purple-500/20 px-2 py-1 rounded">{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${volume}%, #374151 ${volume}%, #374151 100%)`
                }}
              />
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-center space-x-2 text-xs bg-gray-800/30 rounded-lg p-2">
              <div className={`flex items-center space-x-1 ${isPlaying ? 'text-green-400' : 'text-yellow-400'}`}>
                <span>{isPlaying ? '🟢' : '⏸️'}</span>
                <span className="font-medium">{isPlaying ? 'Playing' : 'Paused'}</span>
              </div>
              {isMuted && (
                <div className="flex items-center space-x-1 text-red-400">
                  <span>•</span>
                  <span>🔇 Muted</span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
