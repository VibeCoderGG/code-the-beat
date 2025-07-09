import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Brain, Code, Zap, X, Sparkles } from 'lucide-react';
import { Challenge, Level } from '../types/game';

interface AIHintsProps {
  currentLevel: Level;
  currentChallenge: Challenge;
  userCode: string;
  attempts: number;
}

interface Hint {
  type: 'concept' | 'syntax' | 'strategy' | 'encouragement';
  title: string;
  content: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const AIHints: React.FC<AIHintsProps> = ({
  currentLevel,
  currentChallenge,
  userCode,
  attempts
}) => {
  const [currentHint, setCurrentHint] = useState<Hint | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [availableHints, setAvailableHints] = useState<Hint[]>([]);

  // Generate contextual hints based on the challenge and user progress
  const generateHints = (): Hint[] => {
    const hints: Hint[] = [];

    // Basic concept hints
    if (currentLevel.concept.includes('variables')) {
      hints.push({
        type: 'concept',
        title: 'Variables Concept',
        content: 'Variables are containers that store data values. Think of them as labeled boxes where you can put information.',
        icon: Brain,
        color: 'text-blue-400'
      });
    }

    if (currentLevel.concept.includes('functions')) {
      hints.push({
        type: 'concept',
        title: 'Functions Explained',
        content: 'Functions are reusable blocks of code that perform specific tasks. They help organize your code and avoid repetition.',
        icon: Code,
        color: 'text-purple-400'
      });
    }

    if (currentLevel.concept.includes('loops')) {
      hints.push({
        type: 'concept',
        title: 'Loops Pattern',
        content: 'Loops allow you to repeat code multiple times. Perfect for when you need to do the same thing over and over.',
        icon: Zap,
        color: 'text-orange-400'
      });
    }

    // Syntax hints based on common patterns
    if (currentChallenge.expectedCode.includes('let ') || currentChallenge.expectedCode.includes('const ')) {
      hints.push({
        type: 'syntax',
        title: 'Variable Declaration',
        content: 'Use "let" for variables that change, "const" for constants. Remember the syntax: let variableName = value;',
        icon: Code,
        color: 'text-green-400'
      });
    }

    if (currentChallenge.expectedCode.includes('function')) {
      hints.push({
        type: 'syntax',
        title: 'Function Syntax',
        content: 'Function syntax: function functionName() { // your code here }. Don\'t forget the curly braces!',
        icon: Code,
        color: 'text-yellow-400'
      });
    }

    // Strategy hints based on attempts
    if (attempts > 2) {
      hints.push({
        type: 'strategy',
        title: 'Step by Step',
        content: 'Break down the problem: 1) Understand what you need to create, 2) Think about the syntax, 3) Write it step by step.',
        icon: Lightbulb,
        color: 'text-cyan-400'
      });
    }

    if (attempts > 4) {
      hints.push({
        type: 'strategy',
        title: 'Look at the Pattern',
        content: 'Compare your code with the expected output. Look for missing semicolons, brackets, or spelling differences.',
        icon: Brain,
        color: 'text-pink-400'
      });
    }

    // Encouragement
    if (attempts > 3) {
      hints.push({
        type: 'encouragement',
        title: 'Keep Going!',
        content: 'Every expert was once a beginner. Each attempt is teaching you something new. You\'re doing great!',
        icon: Sparkles,
        color: 'text-amber-400'
      });
    }

    return hints;
  };

  useEffect(() => {
    const hints = generateHints();
    setAvailableHints(hints);
    
    if (hints.length > 0 && attempts > 1) {
      const hintToShow = hints[hintIndex % hints.length];
      setCurrentHint(hintToShow);
      setShowHint(true);
    }
  }, [attempts, hintIndex, currentLevel.concept, currentChallenge.expectedCode]);

  const nextHint = () => {
    if (availableHints.length > 1) {
      const newIndex = (hintIndex + 1) % availableHints.length;
      setHintIndex(newIndex);
      setCurrentHint(availableHints[newIndex]);
    }
  };

  const closeHint = () => {
    setShowHint(false);
    setCurrentHint(null);
  };

  if (!currentHint || !showHint) return null;

  const Icon = currentHint.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="bg-gradient-to-r from-black/80 to-purple-900/30 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg`}>
              <Icon className={`w-5 h-5 ${currentHint.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-white">{currentHint.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 ${currentHint.color} font-medium`}>
                AI Hint
              </span>
            </div>
          </div>
          <button
            onClick={closeHint}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          {currentHint.content}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              Hint {(hintIndex % availableHints.length) + 1} of {availableHints.length}
            </span>
          </div>
          {availableHints.length > 1 && (
            <button
              onClick={nextHint}
              className="text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 text-purple-400 px-3 py-1 rounded-lg transition-all duration-200"
            >
              Next Hint
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
