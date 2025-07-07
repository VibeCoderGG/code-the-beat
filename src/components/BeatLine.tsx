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
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Challenge {gameState.currentChallenge + 1}
            </div>
            <div className="text-gray-400 text-sm">
              of {currentLevel.challenges.length}
            </div>
          </div>
          <div className="flex space-x-1">
            {Array.from({ length: currentLevel.challenges.length }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < gameState.currentChallenge
                    ? 'bg-green-500'
                    : i === gameState.currentChallenge
                    ? 'bg-blue-500'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        <motion.div
          key={currentPrompt}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 border border-gray-600 rounded-lg p-4"
        >
          <div className="text-sm text-gray-400 mb-1">Your Task:</div>
          <div className="text-lg text-white font-medium">{currentPrompt}</div>
        </motion.div>
      </div>
      
      <div className="relative h-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700">
        {/* Beat Track */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 transform -translate-y-1/2" />
        
        {/* Beat Indicators */}
        {beatIndicators.map((indicator) => (
          <motion.div
            key={indicator.id}
            className={`absolute top-1/2 w-3 h-3 rounded-full transform -translate-y-1/2 -translate-x-1/2 border-2 ${
              indicator.active 
                ? 'bg-green-400 border-green-300 shadow-lg shadow-green-400/60' 
                : 'bg-gray-700 border-gray-600'
            }`}
            style={{ left: `${4 + (indicator.x * 0.92)}%` }}
            animate={{
              scale: indicator.active ? 1.4 : 1,
              opacity: indicator.active ? 1 : 0.7
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          />
        ))}
        
        {/* Progress Line */}
        <motion.div
          className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 to-green-500 shadow-lg shadow-green-400/50"
          style={{ left: `${4 + (((gameState.beatCount % 16) / 16) * 92)}%` }}
          animate={{ 
            opacity: gameState.isPlaying ? 1 : 0,
            boxShadow: gameState.isPlaying ? '0 0 20px rgba(74, 222, 128, 0.6)' : '0 0 0px rgba(74, 222, 128, 0)'
          }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Challenge Markers */}
        {currentLevel.challenges.map((challenge, index) => {
          const isActive = index === gameState.currentChallenge;
          const isCompleted = index < gameState.currentChallenge;
          return (
            <motion.div
              key={challenge.id}
              className={`absolute top-1 transform -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-bold ${
                isCompleted 
                  ? 'bg-green-500 text-white' 
                  : isActive 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40' 
                  : 'bg-gray-600 text-gray-300'
              }`}
              style={{ left: `${4 + (((challenge.beatPosition % 16) / 16) * 92)}%` }}
              animate={{
                scale: isActive ? 1.1 : 1
              }}
              transition={{ duration: 0.2 }}
            >
              {isCompleted ? '✓' : index + 1}
            </motion.div>
          );
        })}
        
        {/* Beat Counter */}
        <div className="absolute top-1 right-3 text-xs font-mono text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
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