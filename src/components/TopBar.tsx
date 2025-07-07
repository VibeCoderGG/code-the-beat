import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Trophy, Zap } from 'lucide-react';
import { GameState, Level } from '../types/game';

interface TopBarProps {
  gameState: GameState;
  currentLevel: Level;
  onStartGame: () => void;
  onStopGame: () => void;
  onRestart: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  gameState,
  currentLevel,
  onStartGame,
  onStopGame,
  onRestart
}) => {
  const handlePlayClick = async () => {
    if (gameState.isPlaying) {
      onStopGame();
    } else {
      await onStartGame();
    }
  };

  return (
    <div className="bg-gray-900 border-b border-gray-700 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-xl font-bold text-white">
            Code the Beat
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayClick}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors text-sm"
            >
              {gameState.isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Play</span>
                </>
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart</span>
            </motion.button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-xs text-gray-400">Level {currentLevel.id}</div>
            <div className="text-sm font-semibold text-white">{currentLevel.title}</div>
            <div className="text-xs text-gray-400">{currentLevel.concept}</div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-yellow-600 px-2 py-1 rounded-full">
              <Trophy className="w-4 h-4 text-white" />
              <span className="text-white font-medium text-sm">{gameState.score}</span>
            </div>
            
            <div className="flex items-center space-x-1 bg-blue-600 px-2 py-1 rounded-full">
              <Zap className="w-4 h-4 text-white" />
              <span className="text-white font-medium text-sm">{gameState.streak}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-2">
        <div className="text-xs text-gray-400 mb-1">Progress</div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: `${((gameState.currentChallenge + 1) / currentLevel.challenges.length) * 100}%` 
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};