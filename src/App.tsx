import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, BookOpen } from 'lucide-react';
import { useGameEngine } from './hooks/useGameEngine';
import { TopBar } from './components/TopBar';
import { BeatLine } from './components/BeatLine';
import { CodeInput } from './components/CodeInput';
import { LevelSelector } from './components/LevelSelector';

function App() {
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const {
    gameState,
    currentLevel,
    startGame,
    stopGame,
    submitCode,
    changeLevel,
    updateUserCode,
    levels
  } = useGameEngine();

  const handleRestart = () => {
    stopGame();
    setTimeout(() => {
      changeLevel(gameState.currentLevel);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Main Game Interface */}
      <div className="h-screen flex flex-col">
        <TopBar
          gameState={gameState}
          currentLevel={currentLevel}
          onStartGame={startGame}
          onStopGame={stopGame}
          onRestart={handleRestart}
        />
        
        <BeatLine
          gameState={gameState}
          currentLevel={currentLevel}
        />
        
        <div className="flex-1 flex flex-col">
          <CodeInput
            gameState={gameState}
            currentLevel={currentLevel}
            onSubmitCode={submitCode}
            onUpdateCode={updateUserCode}
          />
        </div>
        
        {/* Bottom Action Bar */}
        <div className="bg-gray-800 border-t border-gray-700 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLevelSelector(true)}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Levels</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </motion.button>
            </div>
            
            <div className="text-sm text-gray-400">
              {currentLevel.description}
            </div>
          </div>
        </div>
      </div>
      
      {/* Level Selector Modal */}
      <AnimatePresence>
        {showLevelSelector && (
          <LevelSelector
            levels={levels}
            currentLevelIndex={gameState.currentLevel}
            onSelectLevel={(index) => {
              changeLevel(index);
              setShowLevelSelector(false);
            }}
            isOpen={showLevelSelector}
            onClose={() => setShowLevelSelector(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;