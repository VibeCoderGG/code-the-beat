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
    changeLevel(gameState.currentLevel);
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
      
      {/* Welcome Screen */}
      {!gameState.isPlaying && gameState.beatCount === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40"
        >
          <div className="text-center">
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"
            >
              Code the Beat
            </motion.h1>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 mb-8"
            >
              Learn programming through rhythm and music
            </motion.p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-gray-400"
            >
              Press the Play button to start your coding journey
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default App;