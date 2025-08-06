import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, X } from 'lucide-react';
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

  const handleCloseModal = () => {
    setShowControls(false);
  };

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

      {/* Modal Overlay */}
      <AnimatePresence>
        {showControls && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
              style={{ zIndex: 9999 }}
              onClick={handleCloseModal}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 border border-gray-600 rounded-2xl p-6 w-80 max-w-sm shadow-2xl"
              style={{ zIndex: 10000 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Music className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">Music Controls</h2>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              </div>

              {/* Current Track */}
              {currentTrack && (
                <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-300">Now Playing:</p>
                  <p className="text-white font-medium">{currentTrack}</p>
                </div>
              )}

              {/* Play/Pause Button */}
              <button
                onClick={handleTogglePlay}
                className="w-full flex items-center justify-center space-x-3 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition-colors mb-4"
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
              </button>

              {/* Mute Button */}
              <button
                onClick={handleToggleMute}
                className="w-full flex items-center justify-center space-x-3 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl transition-colors mb-4"
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
              </button>

              {/* Volume Control */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-300">Volume</label>
                  <span className="text-sm text-white font-medium">{volume}%</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="text-center">
                <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                  isPlaying 
                    ? 'bg-green-900/50 text-green-300' 
                    : 'bg-gray-700/50 text-gray-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                  <span>{isPlaying ? 'Playing' : 'Paused'}</span>
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
