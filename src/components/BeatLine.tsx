import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState, Level, BeatIndicator } from '../types/game';

interface BeatLineProps {
  gameState: GameState;
  currentLevel: Level;
}

export const BeatLine: React.FC<BeatLineProps> = ({ gameState, currentLevel }) => {
  const [beatIndicators, setBeatIndicators] = useState<BeatIndicator[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');

  useEffect(() => {
    const indicators: BeatIndicator[] = [];
    for (let i = 0; i < 16; i++) {
      indicators.push({
        id: `beat-${i}`,
        x: (i / 16) * 100,
        active: i === (gameState.beatCount % 16),
        challenge: i === 0 ? currentLevel.challenges[gameState.currentChallenge] : undefined
      });
    }
    setBeatIndicators(indicators);
  }, [gameState.beatCount, currentLevel.challenges, gameState.currentChallenge]);

  useEffect(() => {
    if (currentLevel.challenges[gameState.currentChallenge]) {
      setCurrentPrompt(currentLevel.challenges[gameState.currentChallenge].prompt);
    }
  }, [currentLevel.challenges, gameState.currentChallenge]);

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white mb-2">
          Challenge {gameState.currentChallenge + 1} of {currentLevel.challenges.length}
        </h2>
        <motion.div
          key={currentPrompt}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg text-gray-300"
        >
          {currentPrompt}
        </motion.div>
      </div>
      
      <div className="relative h-20 bg-gray-900 rounded-lg overflow-hidden">
        {/* Beat Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-600 transform -translate-y-1/2" />
        
        {/* Beat Indicators */}
        {beatIndicators.map((indicator) => (
          <motion.div
            key={indicator.id}
            className={`absolute top-1/2 w-4 h-4 rounded-full transform -translate-y-1/2 -translate-x-1/2 ${
              indicator.active ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-gray-600'
            }`}
            style={{ left: `${indicator.x}%` }}
            animate={{
              scale: indicator.active ? 1.5 : 1,
              opacity: indicator.active ? 1 : 0.6
            }}
            transition={{ duration: 0.1 }}
          />
        ))}
        
        {/* Current Beat Line */}
        <motion.div
          className="absolute top-0 bottom-0 w-1 bg-green-500 shadow-lg shadow-green-500/50"
          style={{ left: `${((gameState.beatCount % 16) / 16) * 100}%` }}
          animate={{ opacity: gameState.isPlaying ? 1 : 0 }}
        />
        
        {/* Challenge Prompt Indicators */}
        {currentLevel.challenges.map((challenge, index) => {
          const isActive = index === gameState.currentChallenge;
          return (
            <motion.div
              key={challenge.id}
              className={`absolute top-2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium ${
                isActive ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'
              }`}
              style={{ left: `${((challenge.beatPosition % 16) / 16) * 100}%` }}
              animate={{
                scale: isActive ? 1.1 : 1,
                y: isActive ? -5 : 0
              }}
            >
              {index + 1}
            </motion.div>
          );
        })}
        
        {/* Beat Counter */}
        <div className="absolute top-2 right-2 text-sm font-mono text-gray-400">
          Beat: {gameState.beatCount}
        </div>
      </div>
      
      {/* Feedback */}
      <AnimatePresence>
        {gameState.showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mt-4 p-3 rounded-lg text-center font-medium ${
              gameState.feedback.includes('Perfect') || gameState.feedback.includes('Complete')
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {gameState.feedback}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};