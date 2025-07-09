import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, BookOpen, Trophy, Zap, Music, Star } from 'lucide-react';
import { useGameEngine } from './hooks/useGameEngine';
import { TopBar } from './components/TopBar';
import { BeatLine } from './components/BeatLine';
import { CodeInput } from './components/CodeInput';
import { AllLevelsLeaderboard } from './components/AllLevelsLeaderboardNew';
import { LevelSelector } from './components/LevelSelector';
import { Leaderboard } from './components/Leaderboard';
import { ScoreSubmission } from './components/ScoreSubmission';

function App() {
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showScoreSubmission, setShowScoreSubmission] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 light:from-blue-50 light:via-indigo-50 light:to-purple-50 text-white dark:text-white light:text-slate-800">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30 dark:opacity-30 light:opacity-15 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/10 dark:to-purple-500/10 light:from-indigo-300/20 light:to-purple-300/20 animate-pulse"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/20 dark:bg-purple-500/20 light:bg-indigo-400/25 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-yellow-500/20 dark:bg-yellow-500/20 light:bg-amber-400/25 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/20 dark:bg-pink-500/20 light:bg-rose-400/25 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Game Interface */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Enhanced Header */}
        <div className="bg-black/20 dark:bg-black/20 light:bg-white/80 backdrop-blur-md border-b border-white/10 dark:border-white/10 light:border-indigo-200/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Music className="w-8 h-8 text-purple-400 dark:text-purple-400 light:text-indigo-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-400 dark:to-pink-400 light:from-indigo-600 light:to-purple-600 bg-clip-text text-transparent">
                    Code the Beat
                  </h1>
                  <p className="text-xs text-gray-400 dark:text-gray-400 light:text-slate-600">Rhythm meets Programming</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Score Display */}
              <div className="bg-black/30 dark:bg-black/30 light:bg-white/70 backdrop-blur-sm border border-white/10 dark:border-white/10 light:border-indigo-200/50 rounded-xl px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="font-bold text-lg text-white dark:text-white light:text-slate-800">{gameState.score.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-400 light:text-slate-600">pts</span>
                </div>
              </div>
              
              {/* Streak Display */}
              {gameState.streak > 0 && (
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-xl px-3 py-2">
                  <div className="flex items-center space-x-1">
                    <Zap className="w-4 h-4 text-orange-400" />
                    <span className="font-bold text-orange-400">{gameState.streak}x</span>
                  </div>
                </div>
              )}
              
              {/* Language Selector */}
              <TopBar
                gameState={gameState}
                currentLevel={currentLevel}
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                onStartGame={startGame}
                onStopGame={stopGame}
                onRestart={handleRestart}
              />
            </div>
          </div>
        </div>

        {/* Level Info Bar */}
        <div className="bg-black/10 dark:bg-black/10 light:bg-white/60 backdrop-blur-sm border-b border-white/5 dark:border-white/5 light:border-indigo-200/30 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Level {currentLevel.id}
              </div>
              <div className="text-white dark:text-white light:text-slate-800 font-semibold">{currentLevel.title}</div>
              <div className="text-gray-400 dark:text-gray-400 light:text-slate-600 text-sm">{currentLevel.description}</div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                currentLevel.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                currentLevel.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {currentLevel.difficulty}
              </div>
            </div>
          </div>
        </div>
        
        <BeatLine
          gameState={gameState}
          currentLevel={currentLevel}
        />
        
        <div className="flex flex-1 min-h-0">
          {/* Main Content Area */}
          <div className="flex-1 min-h-0">
            <CodeInput
              gameState={gameState}
              currentLevel={currentLevel}
              selectedLanguage={selectedLanguage}
              onSubmitCode={submitCode}
              onUpdateCode={updateUserCode}
            />
          </div>
          
          {/* Side Panel */}
          <div className="w-80 bg-black/20 dark:bg-black/20 light:bg-white/70 backdrop-blur-sm border-l border-white/10 dark:border-white/10 light:border-indigo-200/50">
            <AllLevelsLeaderboard currentLevelId={currentLevel.id} />
          </div>
        </div>
        
        {/* Enhanced Bottom Action Bar */}
        <div className="bg-black/30 dark:bg-black/30 light:bg-white/80 backdrop-blur-md border-t border-white/10 dark:border-white/10 light:border-indigo-200/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Game Controls */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={gameState.isPlaying ? stopGame : startGame}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  gameState.isPlaying 
                    ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400' 
                    : 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400'
                }`}
              >
                {gameState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span className="font-medium">{gameState.isPlaying ? 'Stop' : 'Start'}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRestart}
                className="flex items-center space-x-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 text-gray-400 px-4 py-2 rounded-xl transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="font-medium">Restart</span>
              </motion.button>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLevelSelector(true)}
                className="flex items-center space-x-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-xl transition-all duration-200"
              >
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">Levels</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLeaderboard(true)}
                className="flex items-center space-x-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400 px-4 py-2 rounded-xl transition-all duration-200"
              >
                <Trophy className="w-4 h-4" />
                <span className="font-medium">Leaderboard</span>
              </motion.button>
              
              {gameState.score > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowScoreSubmission(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 hover:from-green-500/30 hover:to-blue-500/30 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl transition-all duration-200"
                >
                  <Trophy className="w-4 h-4" />
                  <span className="font-medium">Submit Score</span>
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