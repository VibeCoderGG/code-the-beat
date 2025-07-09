import React from 'react';
import { motion } from 'framer-motion';
import { Star, Target } from 'lucide-react';
import { GameState, Level } from '../types/game';

interface LevelProgressProps {
  gameState: GameState;
  currentLevel: Level;
  levels: Level[];
}

export const LevelProgress: React.FC<LevelProgressProps> = ({
  gameState,
  currentLevel,
  levels
}) => {
  const challengeProgress = ((gameState.currentChallenge + 1) / currentLevel.challenges.length) * 100;
  const overallProgress = ((gameState.currentLevel + (gameState.currentChallenge + 1) / currentLevel.challenges.length) / levels.length) * 100;

  return (
    <div className="flex items-center space-x-4">
      {/* Current Level Progress */}
      <div className="flex items-center space-x-2">
        <Target className="w-4 h-4 text-blue-400" />
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 dark:text-gray-400 light:text-slate-600">
            Challenge {gameState.currentChallenge + 1}/{currentLevel.challenges.length}
          </span>
          <div className="w-20 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-200/50 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${challengeProgress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="flex items-center space-x-2">
        <Star className="w-4 h-4 text-purple-400" />
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 dark:text-gray-400 light:text-slate-600">
            Overall Progress
          </span>
          <div className="w-24 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-200/50 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-500 light:text-slate-500">
            {overallProgress.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
};
