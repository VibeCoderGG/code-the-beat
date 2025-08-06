import { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bgmManager } from '../utils/bgmManager';

interface BGMControlsProps {
  className?: string;
}

export function BGMControls({ className = '' }: BGMControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    // Set volume to 10% as requested
    bgmManager.setVolume(0.1);
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      bgmManager.pause();
      setIsPlaying(false);
    } else {
      bgmManager.playTrack('coding', true);
      setIsPlaying(true);
    }
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
      {/* Speaker Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleTogglePlay}
        onContextMenu={(e) => {
          e.preventDefault();
          handleToggleControls();
        }}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400 transition-all duration-200"
        title={isPlaying ? "Pause Music (Right-click for volume)" : "Play Music (Right-click for volume)"}
        type="button"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </motion.button>

      {/* Volume Controls Popup */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 right-full mr-2 z-50 bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-lg p-3 min-w-[120px] shadow-xl"
          >
            {/* Music Status */}
            <div className="text-center text-sm text-purple-400 font-medium mb-2">
              {isPlaying ? "🎵 Playing" : "⏸️ Paused"}
            </div>
            
            {/* Volume Display */}
            <div className="text-center text-xs text-gray-400">
              Volume: 10%
            </div>
            
            {/* Arrow Pointer */}
            <div className="absolute top-1/2 left-full -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-white/20"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
