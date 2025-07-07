import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Play, Gamepad2 } from 'lucide-react';

interface PlayerSetupProps {
  onPlayerCreated: (name: string) => void;
}

export const PlayerSetup: React.FC<PlayerSetupProps> = ({ onPlayerCreated }) => {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (playerName.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    if (playerName.trim().length > 20) {
      setError('Name must be less than 20 characters');
      return;
    }

    onPlayerCreated(playerName.trim());
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 border border-gray-700"
      >
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Code the Beat</h1>
          <p className="text-gray-400">Learn programming through rhythm and music</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              What's your name?
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  setError(null);
                }}
                placeholder="Enter your name"
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                maxLength={20}
                autoFocus
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm mt-2">{error}</div>
            )}
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!playerName.trim()}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all font-medium"
          >
            <Play className="w-5 h-5" />
            <span>Start Playing</span>
          </motion.button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Your progress and scores will be saved locally on this device
        </div>
      </motion.div>
    </div>
  );
};