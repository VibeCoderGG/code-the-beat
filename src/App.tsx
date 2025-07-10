import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, BookOpen, Trophy, Zap, Music, Star, Award, Undo, RefreshCw, Sparkles } from 'lucide-react';
import { useGameEngine } from './hooks/useGameEngine';
import { useAchievements } from './hooks/useAchievements';
import { TopBar } from './components/TopBar';
import { BeatLine } from './components/BeatLine';
import { CodeInput } from './components/CodeInput';
import { AllLevelsLeaderboard } from './components/AllLevelsLeaderboardNew';
import { LevelSelector } from './components/LevelSelector';
import { Leaderboard } from './components/Leaderboard';
import { ScoreSubmission } from './components/ScoreSubmission';
import { AchievementNotification } from './components/AchievementNotification';
import { ProgressTracker } from './components/ProgressTracker';
import { DashboardModal } from './components/DashboardModal';
import { LevelProgress } from './components/LevelProgress';
import { Achievement } from './types/game';

function App() {
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showScoreSubmission, setShowScoreSubmission] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  
  const {
    gameState,
    currentLevel,
    startGame,
    stopGame,
    submitCode,
    changeLevel,
    updateUserCode,
    resetGame,
    resetToCheckpoint,
    changeLanguage,
    regenerateCurrentLevel,
    levels,
    levelCheckpoints,
    selectedLanguage,
    isGeneratingLevel
  } = useGameEngine();

  const { 
    updatePlayerStats, 
    checkAchievements, 
    playerStats,
    unlockedAchievements 
  } = useAchievements();

  // Update player stats when game state changes
  useEffect(() => {
    updatePlayerStats({
      challenges_completed: gameState.currentChallenge + (gameState.currentLevel * 3),
      levels_completed: gameState.currentLevel,
      total_score: gameState.score,
      max_streak: gameState.streak,
      languages_used: [selectedLanguage]
    });

    // Check for new achievements
    const newAchievements = checkAchievements();
    if (newAchievements.length > 0) {
      setNewAchievement(newAchievements[0]); // Show first new achievement
    }
  }, [gameState.score, gameState.streak, gameState.currentLevel, gameState.currentChallenge, selectedLanguage, updatePlayerStats, checkAchievements]);

  const handleScoreSubmitted = () => {
    setShowScoreSubmission(false);
    setShowLeaderboard(true);
  };

  const handleRestart = () => {
    // Show confirmation dialog before resetting
    const confirmReset = window.confirm(
      "Are you sure you want to reset all progress? This will:\n\n" +
      "• Reset your score to 0\n" +
      "• Lock all levels except Level 1\n" +
      "• Clear all achievements\n" +
      "• Reset all statistics\n\n" +
      "This action cannot be undone!"
    );
    
    if (confirmReset) {
      const resetSuccess = resetGame();
      if (resetSuccess) {
        // Force a page reload to ensure all components are reset
        window.location.reload();
      }
    }
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

              {/* Attempt Counter */}
              {gameState.attempts > 0 && (
                <div className="bg-red-500/20 text-red-400 border border-red-500/30 backdrop-blur-sm rounded-xl px-3 py-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-medium">Attempts: {gameState.attempts}</span>
                  </div>
                </div>
              )}

              {/* Level Progress */}
              <LevelProgress
                gameState={gameState}
                currentLevel={currentLevel}
                levels={levels}
              />
              
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
                onLanguageChange={changeLanguage}
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
              <div className="text-gray-400 dark:text-gray-400 light:text-slate-600 text-sm">
                {currentLevel.description} • {currentLevel.challenges.length} challenges
              </div>
              
              {/* Dynamic Level Indicator */}
              {currentLevel.isDynamic && (
                <div className="flex items-center space-x-1 bg-purple-500/20 text-purple-400 px-2 py-1 rounded-lg text-xs">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Generated</span>
                </div>
              )}
              
              {/* Generation Loading Indicator */}
              {isGeneratingLevel && (
                <div className="flex items-center space-x-1 bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-lg text-xs">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Generating...</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Checkpoint indicator */}
              {levelCheckpoints && levelCheckpoints[currentLevel.id] !== undefined && (
                <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded-lg text-xs font-medium">
                  Checkpoint: {levelCheckpoints[currentLevel.id]?.toLocaleString() || 0}
                </div>
              )}
              
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
        
        <div className="flex flex-1 min-h-0 flex-col">
          {/* Top Row - Code Editor and Progress Tracker */}
          <div className="flex flex-1 min-h-0">
            {/* Code Editor */}
            <div className="flex-1 min-h-0">
              <CodeInput
                gameState={gameState}
                currentLevel={currentLevel}
                selectedLanguage={selectedLanguage}
                onSubmitCode={submitCode}
                onUpdateCode={updateUserCode}
              />
            </div>
            
            {/* Side Panel - Progress Tracker */}
            <div className="w-80 bg-black/20 dark:bg-black/20 light:bg-white/70 backdrop-blur-sm border-l border-white/10 dark:border-white/10 light:border-indigo-200/50">
              <div className="p-4 h-full">
                <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-800 mb-4 flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>Your Progress</span>
                </h2>
                <ProgressTracker
                  playerStats={playerStats}
                  currentStreak={gameState.streak}
                  currentScore={gameState.score}
                />
              </div>
            </div>
          </div>
          
          {/* Bottom Row - All Levels Leaderboard (Full Width) */}
          <div className="h-80 border-t border-white/10 dark:border-white/10 light:border-indigo-200/30 bg-black/10 dark:bg-black/10 light:bg-white/50 backdrop-blur-sm">
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
                onClick={regenerateCurrentLevel}
                disabled={isGeneratingLevel}
                className="flex items-center space-x-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-xl transition-all duration-200 disabled:opacity-50"
                title="Generate new AI challenges for this level"
              >
                {isGeneratingLevel ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span className="font-medium">New Challenges</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetToCheckpoint}
                className="flex items-center space-x-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-400 px-4 py-2 rounded-xl transition-all duration-200"
                title="Reset to the start of the current level with your checkpoint score"
              >
                <Undo className="w-4 h-4" />
                <span className="font-medium">Reset Level</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRestart}
                className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl transition-all duration-200"
                title="Reset all progress, achievements, and unlock only Level 1"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="font-medium">Reset Progress</span>
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
                onClick={() => setShowDashboard(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-xl transition-all duration-200 relative"
              >
                <Award className="w-4 h-4" />
                <span className="font-medium">Dashboard</span>
                {unlockedAchievements.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unlockedAchievements.length}
                  </span>
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLeaderboard(true)}
                className="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl transition-all duration-200"
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

      {/* Dashboard Modal */}
      <AnimatePresence>
        {showDashboard && (
          <DashboardModal
            isOpen={showDashboard}
            onClose={() => setShowDashboard(false)}
            playerStats={playerStats}
            playerProgress={{
              totalScore: playerStats.total_score,
              totalChallengesCompleted: playerStats.challenges_completed,
              totalLevelsCompleted: playerStats.levels_completed,
              maxStreak: playerStats.max_streak,
              perfectSubmissions: playerStats.perfect_submissions,
              timePlayedMinutes: playerStats.total_playtime,
              achievements: unlockedAchievements,
              skillTree: { concepts: {}, totalLevel: 0, totalExperience: 0 },
              dailyStreak: 0
            }}
            currentStreak={gameState.streak}
            currentScore={gameState.score}
          />
        )}
      </AnimatePresence>

      {/* Achievement Notification */}
      <AchievementNotification
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />
    </div>
  );
}

export default App;