import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Trophy, Zap, Code2 } from 'lucide-react';
import { GameState, Level } from '../types/game';

interface TopBarProps {
  gameState: GameState;
  currentLevel: Level;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  onStartGame: () => void;
  onStopGame: () => void;
  onRestart: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  gameState,
  currentLevel,
  selectedLanguage,
  onLanguageChange,
  onStartGame,
  onStopGame,
  onRestart
}) => {
  const [showCustomInput, setShowCustomInput] = React.useState(false);
  const [customLanguage, setCustomLanguage] = React.useState('');

  const predefinedLanguages = [
    { value: 'javascript', label: 'JavaScript', extension: 'js' },
    { value: 'python', label: 'Python', extension: 'py' },
    { value: 'java', label: 'Java', extension: 'java' },
    { value: 'html', label: 'HTML', extension: 'html' },
    { value: 'css', label: 'CSS', extension: 'css' },
    { value: 'typescript', label: 'TypeScript', extension: 'ts' },
    { value: 'cpp', label: 'C++', extension: 'cpp' },
    { value: 'custom', label: 'Custom...', extension: '' }
  ];

  const handlePlayClick = async () => {
    if (gameState.isPlaying) {
      onStopGame();
    } else {
      await onStartGame();
    }
  };

  const handleLanguageSelect = (language: string) => {
    if (language === 'custom') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      onLanguageChange(language);
    }
  };

  const handleCustomLanguageSubmit = () => {
    if (customLanguage.trim()) {
      onLanguageChange(customLanguage.trim());
      setShowCustomInput(false);
      setCustomLanguage('');
    }
  };

  const getCurrentLanguage = () => predefinedLanguages.find(lang => lang.value === selectedLanguage) || { label: selectedLanguage, extension: selectedLanguage };

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
          {/* Language Selector */}
          <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-gray-400" />
            <div className="relative">
              {showCustomInput ? (
                <div className="flex items-center space-x-1">
                  <input
                    type="text"
                    value={customLanguage}
                    onChange={(e) => setCustomLanguage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCustomLanguageSubmit()}
                    placeholder="Enter language..."
                    className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white w-24 focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={handleCustomLanguageSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomLanguage('');
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageSelect(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {predefinedLanguages.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
          
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
    </div>
  );
};