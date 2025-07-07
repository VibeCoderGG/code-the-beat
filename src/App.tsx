import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, BookOpen, Trophy } from 'lucide-react';
import { useGameEngine } from './hooks/useGameEngine';
import { TopBar } from './components/TopBar';
import { BeatLine } from './components/BeatLine';
import { CodeInput } from './components/CodeInput';
import { LevelSelector } from './components/LevelSelector';
import { Leaderboard } from './components/Leaderboard';
import { ScoreSubmission } from './components/ScoreSubmission';

function App() {
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showScoreSubmission, setShowScoreSubmission] = useState(false);
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

  const handleScoreSubmitted = () => {
    setShowScoreSubmission(false);
    setShowLeaderboard(true);
  };

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
                onClick={() => setShowLeaderboard(true)}
                className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Trophy className="w-4 h-4" />
                <span>Leaderboard</span>
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
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                {currentLevel.description}
              </div>
              
              {gameState.score > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowScoreSubmission(true)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors text-sm"
                >
                  <Trophy className="w-3 h-3" />
                  <span>Submit Score</span>
                </motion.button>
              )}
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
      
      {/* Leaderboard Modal */}
      <AnimatePresence>
        {showLeaderboard && (
          <Leaderboard
            isOpen={showLeaderboard}
            onClose={() => setShowLeaderboard(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Score Submission Modal */}
      <AnimatePresence>
        {showScoreSubmission && (
          <ScoreSubmission
            isOpen={showScoreSubmission}
            onClose={() => setShowScoreSubmission(false)}
            score={gameState.score}
            levelReached={gameState.currentLevel + 1}
            challengesCompleted={gameState.currentChallenge + (gameState.currentLevel * 3)}
            onSubmitted={handleScoreSubmitted}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;