import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Star } from 'lucide-react';
import { Level } from '../types/game';

interface LevelSelectorProps {
  levels: Level[];
  currentLevelIndex: number;
  onSelectLevel: (index: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  levels,
  currentLevelIndex,
  onSelectLevel,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-600';
      case 'intermediate': return 'bg-yellow-600';
      case 'advanced': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Select Level</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {levels.map((level, index) => (
            <motion.div
              key={level.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => level.unlocked ? onSelectLevel(index) : null}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                level.unlocked
                  ? index === currentLevelIndex
                    ? 'bg-blue-600 border-blue-500'
                    : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                  : 'bg-gray-800 border-gray-700 cursor-not-allowed opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-300">
                    Level {level.id}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getDifficultyColor(level.difficulty)}`}>
                    {level.difficulty}
                  </span>
                </div>
                
                {level.unlocked ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-500" />
                )}
              </div>
              
              <h3 className="font-semibold text-white mb-1">{level.title}</h3>
              <p className="text-sm text-gray-400 mb-2">{level.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">
                  {level.challenges.length} challenges
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300">{level.tempo} BPM</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};