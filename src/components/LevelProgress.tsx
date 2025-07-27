import React from 'react';
import { motion } from 'framer-motion';
import { Star, Target, Unlock } from 'lucide-react';
import { GameState, Level } from '../types/game';

interface LevelProgressProps {
  gameState: GameState;
  currentLevel: Level;
  levels: Level[];
  getUnlockProgress?: () => {
    questionsToNextUnlock: number;
    nextLevelToUnlock: number | null;
    totalQuestionsAnswered: number;
    progressPercentage: number;
  };
}

export const LevelProgress: React.FC<LevelProgressProps> = ({
  gameState,
  currentLevel,
  levels,
  getUnlockProgress
}) => {
  const challengeProgress = ((gameState.currentChallenge + 1) / currentLevel.challenges.length) * 100;
  const overallProgress = ((gameState.currentLevel + (gameState.currentChallenge + 1) / currentLevel.challenges.length) / levels.length) * 100;
  
  // Get unlock progress if function is provided
  const unlockProgress = getUnlockProgress ? getUnlockProgress() : null;

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

      {/* Level Unlock Progress */}
      {unlockProgress && unlockProgress.nextLevelToUnlock && (
        <div className="flex items-center space-x-2">
          <Unlock className="w-4 h-4 text-green-400" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 dark:text-gray-400 light:text-slate-600">
              {unlockProgress.questionsToNextUnlock > 0 
                ? `${unlockProgress.questionsToNextUnlock} questions to unlock Level ${unlockProgress.nextLevelToUnlock}`
                : `Level ${unlockProgress.nextLevelToUnlock} unlocked!`
              }
            </span>
            <div className="w-28 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-200/50 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${unlockProgress.progressPercentage}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
              />
            </div>
          </div>
        </div>
      )}

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
