import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Sparkles, RefreshCw, MessageCircle } from 'lucide-react';
import { GameState, Level } from '../types/game';
import { aiService } from '../services/aiService';

interface AIHintsProps {
  gameState: GameState;
  currentLevel: Level;
  selectedLanguage: string;
  onClose?: () => void;
}

export const AIHints: React.FC<AIHintsProps> = ({ 
  gameState, 
  currentLevel, 
  selectedLanguage,
  onClose 
}) => {
  const [hint, setHint] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintType, setHintType] = useState<'general' | 'specific' | 'ai'>('general');

  const currentChallenge = currentLevel.challenges[gameState.currentChallenge];

  const getAIHint = async () => {
    if (!currentChallenge) return;
    
    setIsLoading(true);
    setHintType('ai');
    
    try {
      const aiHint = await aiService.generateHint(
        currentChallenge.prompt,
        selectedLanguage,
        currentLevel.difficulty,
        gameState.attempts + 1
      );
      
      setHint(aiHint);
      setShowHint(true);
    } catch (error) {
      console.error('Failed to get AI hint:', error);
      // Fallback to static hint
      const fallbackHint = currentChallenge.hints[Math.min(gameState.attempts, currentChallenge.hints.length - 1)];
      setHint(fallbackHint);
      setHintType('general');
      setShowHint(true);
    } finally {
      setIsLoading(false);
    }
  };

  const showStaticHint = () => {
    if (!currentChallenge) return;
    
    const staticHint = currentChallenge.hints[Math.min(gameState.attempts, currentChallenge.hints.length - 1)];
    setHint(staticHint);
    setHintType('general');
    setShowHint(true);
  };

  const showExplanation = () => {
    if (!currentChallenge) return;
    
    const explanation = currentChallenge.explanation || 
      `This challenge is about ${currentLevel.concept}. ${currentChallenge.prompt}`;
    setHint(explanation);
    setHintType('specific');
    setShowHint(true);
  };

  const closeHint = () => {
    setShowHint(false);
    if (onClose) onClose();
  };

  useEffect(() => {
    // Auto-hide hint after 10 seconds
    if (showHint) {
      const timer = setTimeout(() => {
        setShowHint(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showHint]);

  if (!currentChallenge) return null;

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          <span>Need Help?</span>
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">
            Attempt {gameState.attempts + 1}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={showStaticHint}
          className="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
        >
          <Lightbulb className="w-4 h-4" />
          <span>Quick Hint</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={getAIHint}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400 px-3 py-2 rounded-lg transition-all duration-200 text-sm disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>AI Hint</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={showExplanation}
          className="flex items-center space-x-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Explain</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-lg border ${
              hintType === 'ai' 
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-100' 
                : hintType === 'specific'
                ? 'bg-green-500/10 border-green-500/30 text-green-100'
                : 'bg-blue-500/10 border-blue-500/30 text-blue-100'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {hintType === 'ai' && <Sparkles className="w-4 h-4 text-purple-400" />}
                  {hintType === 'specific' && <MessageCircle className="w-4 h-4 text-green-400" />}
                  {hintType === 'general' && <Lightbulb className="w-4 h-4 text-blue-400" />}
                  <span className="text-xs font-medium opacity-75">
                    {hintType === 'ai' ? 'AI Suggestion' : 
                     hintType === 'specific' ? 'Explanation' : 'Hint'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{hint}</p>
              </div>
              <button
                onClick={closeHint}
                className="ml-2 text-gray-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      <div className="mt-3 flex items-center space-x-2">
        <div className="flex-1 bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.min(((gameState.attempts + 1) / 4) * 100, 100)}%` 
            }}
          />
        </div>
        <span className="text-xs text-gray-400">
          {gameState.attempts + 1}/4 attempts
        </span>
      </div>
    </div>
  );
};
