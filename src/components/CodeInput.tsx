import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Lightbulb, Code } from 'lucide-react';
import { GameState, Level } from '../types/game';

interface CodeInputProps {
  gameState: GameState;
  currentLevel: Level;
  onSubmitCode: (code: string) => void;
  onUpdateCode: (code: string) => void;
}

export const CodeInput: React.FC<CodeInputProps> = ({
  gameState,
  currentLevel,
  onSubmitCode,
  onUpdateCode
}) => {
  const [showHint, setShowHint] = useState(false);
  const currentChallenge = currentLevel.challenges[gameState.currentChallenge];

  useEffect(() => {
    onUpdateCode('');
  }, [gameState.currentChallenge, onUpdateCode]);

  const handleSubmit = () => {
    if (gameState.userCode.trim()) {
      onSubmitCode(gameState.userCode);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="bg-gray-900 p-6 min-h-0 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Code Editor</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHint(!showHint)}
            className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-lg transition-colors text-sm"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Hint</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!gameState.userCode.trim()}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Submit</span>
          </motion.button>
        </div>
      </div>
      
      {showHint && currentChallenge && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-yellow-900 border border-yellow-600 rounded-lg p-3 mb-4"
        >
          <div className="text-yellow-200 text-sm">
            <div className="font-medium mb-1">Hint:</div>
            <ul className="list-disc list-inside space-y-1">
              {currentChallenge.hints.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
      
      <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="bg-gray-700 px-4 py-2 border-b border-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-400 ml-2">main.js</span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex text-sm text-gray-400 mb-2">
            <span className="w-8 text-right mr-4">1</span>
            <span className="text-gray-500">// Complete the challenge below</span>
          </div>
          
          <div className="flex">
            <span className="w-8 text-sm text-gray-400 text-right mr-4">2</span>
            <textarea
              value={gameState.userCode}
              onChange={(e) => onUpdateCode(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your code here..."
              className="flex-1 bg-transparent text-white font-mono text-sm resize-none outline-none placeholder-gray-500 min-h-[100px]"
              autoFocus
            />
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
        <div>
          Press <kbd className="px-2 py-1 bg-gray-700 rounded">Cmd/Ctrl + Enter</kbd> to submit
        </div>
        <div>
          {gameState.userCode.length} characters
        </div>
      </div>
    </div>
  );
};