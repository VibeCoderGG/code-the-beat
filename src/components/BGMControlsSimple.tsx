import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';
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

  if (!showControls) {
    return (
      <div className={className}>
        {/* Music Button */}
        <button
          onClick={() => setShowControls(true)}
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-purple-600 border-purple-400 text-white'
              : 'bg-gray-700 border-gray-500 text-gray-300'
          } hover:scale-110`}
          title="Music Controls"
        >
          {isMuted ? <VolumeX size={20} /> : <Music size={20} />}
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Music Button */}
      <div className={className}>
        <button
          onClick={() => setShowControls(true)}
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-purple-600 border-purple-400 text-white'
              : 'bg-gray-700 border-gray-500 text-gray-300'
          } hover:scale-110`}
          title="Music Controls"
        >
          {isMuted ? <VolumeX size={20} /> : <Music size={20} />}
        </button>
      </div>

      {/* Modal - Exactly like LevelSelector */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
            onClick={() => setShowControls(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 z-[10000]"
              onClick={(e) => e.stopPropagation()}
            >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">🎵 Music Controls</h2>
            <button
              onClick={() => setShowControls(false)}
              className="text-gray-400 hover:text-white text-xl"
            >
              ×
            </button>
          </div>

          {/* Current Track Display */}
          {currentTrack && (
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-300 mb-1">Now Playing:</p>
              <p className="text-white font-semibold">{currentTrack}</p>
            </div>
          )}

          {/* Control Buttons Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Play/Pause Button */}
            <button
              onClick={handleTogglePlay}
              className={`p-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-all ${
                isPlaying
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              <span className="text-sm font-medium">
                {isPlaying ? 'Pause' : 'Play'}
              </span>
            </button>

            {/* Mute Button */}
            <button
              onClick={handleToggleMute}
              className={`p-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-all ${
                isMuted
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              <span className="text-sm font-medium">
                {isMuted ? 'Unmute' : 'Mute'}
              </span>
            </button>
          </div>

          {/* Volume Control */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-white font-medium">Volume</label>
              <span className="text-gray-300">{volume}%</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #9333ea 0%, #9333ea ${volume}%, #4b5563 ${volume}%, #4b5563 100%)`
                }}
              />
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
              isPlaying 
                ? 'bg-green-900 text-green-300' 
                : 'bg-gray-700 text-gray-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400' : 'bg-gray-500'}`}></div>
              <span className="font-medium">{isPlaying ? 'Playing' : 'Paused'}</span>
            </div>
          </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
