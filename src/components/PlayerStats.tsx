import React from 'react';
import { motion } from 'framer-motion';
import { User, Trophy, Target, Calendar, RotateCcw } from 'lucide-react';
import { PlayerData } from '../hooks/usePlayerData';

interface PlayerStatsProps {
  playerData: PlayerData;
  onReset: () => void;
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ playerData, onReset }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-4 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{playerData.name}</h3>
            <p className="text-sm text-gray-400">Player Stats</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors text-sm"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">Best Score</span>
          </div>
          <div className="text-xl font-bold text-white">
            {playerData.totalScore.toLocaleString()}
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-300">Highest Level</span>
          </div>
          <div className="text-xl font-bold text-white">
            {playerData.highestLevel}
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">Games Played</span>
          </div>
          <div className="text-xl font-bold text-white">
            {playerData.gamesPlayed}
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Trophy className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300">Challenges</span>
          </div>
          <div className="text-xl font-bold text-white">
            {playerData.totalChallenges}
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        Last played: {formatDate(playerData.lastPlayed)}
      </div>
    </motion.div>
  );
};