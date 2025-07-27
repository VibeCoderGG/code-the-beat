import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, BookOpen, Trophy, Zap, Music, Star, Award, Menu, X, Code2, Undo, Shield } from 'lucide-react';
import { useMultiLanguageGameEngine } from './hooks/useMultiLanguageGameEngine';
import { useAchievements } from './hooks/useAchievements';
import { TopBar } from './components/TopBar';
import { BeatLine } from './components/BeatLine';
import { CodeInput } from './components/CodeInput';
import { AllLevelsLeaderboard } from './components/AllLevelsLeaderboardNew';
import { LevelSelector } from './components/LevelSelector';
import { LanguageSelector } from './components/LanguageSelector';
import { Leaderboard } from './components/Leaderboard';
import { ScoreSubmission } from './components/ScoreSubmission';
import { AchievementNotification } from './components/AchievementNotification';
import { ProgressTracker } from './components/ProgressTracker';
import { DashboardModal } from './components/DashboardModal';
import { LevelProgress } from './components/LevelProgress';
import { OnboardingTour } from './components/OnboardingTour';
import { MobileWarning } from './components/MobileWarning';
import { Achievement } from './types/game';

function App() {
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showScoreSubmission, setShowScoreSubmission] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [shownAchievements, setShownAchievements] = useState<Set<string>>(new Set());
  const [showAchievementBonus, setShowAchievementBonus] = useState(false);
  const [lastSolvedChallenge, setLastSolvedChallenge] = useState<{level: number, challenge: number} | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(true);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

  // Load shown achievements from localStorage on mount
  useEffect(() => {
    const savedShownAchievements = localStorage.getItem('shownAchievements');
    if (savedShownAchievements) {
      try {
        const achievementIds = JSON.parse(savedShownAchievements);
        setShownAchievements(new Set(achievementIds));
      } catch (error) {
        console.error('Failed to load shown achievements:', error);
      }
    }

    // Check if user needs onboarding
    const hasCompletedOnboarding = localStorage.getItem('codeBeatOnboardingCompleted');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);
  
  const {
    gameState,
    currentLevel,
    submitCode,
    skipQuestion,
    changeLevel,
    updateUserCode,
    resetGame,
    resetToCheckpoint,
    levels,
    unlockedLevels,
    levelCheckpoints,
    getUnlockProgress,
    getCurrentChallenge
  } = useMultiLanguageGameEngine(selectedLanguage);

  const { 
    updatePlayerStats, 
    checkAchievements, 
    playerStats,
    unlockedAchievements,
    resetAllProgress,
    markAchievementsAsSeen,
    getUnseenAchievements,
    addAchievementPoints,
    updateGameScore
  } = useAchievements();

  // Update player stats when game state changes
  useEffect(() => {
    // Update game score in achievements context
    updateGameScore(gameState.score);
    
    updatePlayerStats({
      challenges_completed: gameState.currentChallenge + (gameState.currentLevel * 3),
      levels_completed: gameState.currentLevel,
      max_streak: gameState.streak,
      languages_used: [selectedLanguage]
    });

    // Only check achievements when there's an actual score increase or streak increase
    // This prevents achievements from triggering on skipped questions
    const shouldCheckAchievements = gameState.score > 0 && gameState.streak > 0;
    
    if (shouldCheckAchievements) {
      // Check if this is a new solved challenge (not just a skip)
      const currentPosition = { level: gameState.currentLevel, challenge: gameState.currentChallenge };
      const isNewSolve = !lastSolvedChallenge || 
        lastSolvedChallenge.level !== currentPosition.level || 
        lastSolvedChallenge.challenge !== currentPosition.challenge;
      
      if (isNewSolve && gameState.feedback.includes('Perfect!')) {
        setLastSolvedChallenge(currentPosition);
        
        const newAchievements = checkAchievements();
        if (newAchievements.length > 0) {
          const achievement = newAchievements[0];
          
          // Show achievement notification only if not shown before
          if (!shownAchievements.has(achievement.id)) {
            setNewAchievement(achievement);
            const newShownSet = new Set([...shownAchievements, achievement.id]);
            setShownAchievements(newShownSet);
            
            // Save to localStorage
            localStorage.setItem('shownAchievements', JSON.stringify([...newShownSet]));
            
            // Add achievement points
            addAchievementPoints(achievement.reward.points);
            
            // Show achievement bonus indicator
            setShowAchievementBonus(true);
            
            // Hide achievement bonus indicator after 1 second
            setTimeout(() => {
              setShowAchievementBonus(false);
            }, 1000);
          }
        }
      }
    }
  }, [gameState.score, gameState.streak, gameState.currentLevel, gameState.currentChallenge, gameState.feedback, selectedLanguage, updatePlayerStats, updateGameScore, checkAchievements, shownAchievements, addAchievementPoints, lastSolvedChallenge]);

  const handleScoreSubmitted = () => {
    setShowScoreSubmission(false);
    setShowLeaderboard(true);
  };

  const handleRestart = () => {
    // Show confirmation dialog
    const confirmReset = window.confirm(
      "Are you sure you want to restart? This will:\n\n" +
      "• Reset your score to 0\n" +
      "• Reset to Level 1, Question 1\n" +
      "• Clear all achievements\n" +
      "• Reset all statistics\n\n" +
      "This action cannot be undone!"
    );
    
    if (confirmReset) {
      // Reset game state completely
      const resetSuccess = resetGame();
      
      if (resetSuccess) {
        // Reset achievements and player stats
        resetAllProgress();
        
        // Clear shown achievements
        setShownAchievements(new Set());
        localStorage.removeItem('shownAchievements');
        
        // Show success alert
        alert("✅ Game successfully reset!\n\nAll progress, achievements, and statistics have been cleared.\nYou're back to Level 1 with a fresh start!");
        
        // Force page reload to ensure everything is reset
        window.location.reload();
      }
    }
  };

  const handleResetLevel = () => {
    resetToCheckpoint();
  };

  const handleResetProgress = () => {
    handleRestart();
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
        
      {/* Mobile Navbar */}
      <div className="block sm:hidden w-full px-4 pt-4 pb-2 bg-black/30 dark:bg-black/30 light:bg-white/80 backdrop-blur-md border-b border-white/10 dark:border-white/10 light:border-indigo-200/50">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-400 dark:to-pink-400 light:from-indigo-600 light:to-purple-600 bg-clip-text text-transparent">Code the Beat</h1>
          <button
            onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
            className="p-2 bg-black/40 dark:bg-black/40 light:bg-white/70 rounded-lg"
          >
            {showHamburgerMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <div className="flex items-center justify-center space-x-3 mb-1">
          <span className="flex items-center bg-black/40 dark:bg-black/40 light:bg-white/70 rounded-lg px-3 py-1 text-sm font-semibold">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            {playerStats.total_score.toLocaleString()} pts
          </span>
          <span className="flex items-center bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg px-3 py-1 text-xs font-medium">
            {getUnlockProgress && getUnlockProgress().nextLevelToUnlock ? (
              getUnlockProgress().questionsToNextUnlock > 0
                ? `Level ${getUnlockProgress().nextLevelToUnlock} locked`
                : `Level ${getUnlockProgress().nextLevelToUnlock} unlocked!`
            ) : 'Level 1 unlocked!'}
          </span>
        </div>
        
        {/* Hamburger Menu Dropdown */}
        <AnimatePresence>
          {showHamburgerMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 bg-black/50 dark:bg-black/50 light:bg-white/80 backdrop-blur-md rounded-xl border border-white/10 dark:border-white/10 light:border-indigo-200/50 p-3"
            >
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setShowDashboard(true);
                    markAchievementsAsSeen();
                    setShowHamburgerMenu(false);
                  }}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 text-purple-400 px-3 py-2 rounded-lg transition-all duration-200 text-sm relative"
                >
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Checkpoint System</span>
                  {getUnseenAchievements().length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {getUnseenAchievements().length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    resetToCheckpoint();
                    setShowHamburgerMenu(false);
                    alert("🔄 Level restarted!\n\nYou're back at the start of this level with your checkpoint score.");
                  }}
                  className="flex items-center justify-center space-x-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-400 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                >
                  <Undo className="w-4 h-4" />
                  <span className="font-medium">Reset Level</span>
                </button>
                
                <button
                  onClick={() => {
                    handleRestart();
                    setShowHamburgerMenu(false);
                  }}
                  className="flex items-center justify-center space-x-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="font-medium">Reset All</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowLevelSelector(true);
                    setShowHamburgerMenu(false);
                  }}
                  className="flex items-center justify-center space-x-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="font-medium">Levels</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowDashboard(true);
                    markAchievementsAsSeen();
                    setShowHamburgerMenu(false);
                  }}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 text-purple-400 px-3 py-2 rounded-lg transition-all duration-200 text-sm relative"
                >
                  <Award className="w-4 h-4" />
                  <span className="font-medium">Dashboard</span>
                  {getUnseenAchievements().length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {getUnseenAchievements().length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setShowLeaderboard(true);
                    setShowHamburgerMenu(false);
                  }}
                  className="flex items-center justify-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                >
                  <Trophy className="w-4 h-4" />
                  <span className="font-medium">Leaderboard</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowLanguageSelector(true);
                    setShowHamburgerMenu(false);
                  }}
                  className="flex items-center justify-center space-x-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-400 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                >
                  <Code2 className="w-4 h-4" />
                  <span className="font-medium">{selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}</span>
                </button>
                
                {playerStats.total_score > 0 && (
                  <button
                    onClick={() => {
                      setShowScoreSubmission(true);
                      setShowHamburgerMenu(false);
                    }}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 hover:from-green-500/30 hover:to-blue-500/30 border border-green-500/30 text-green-400 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                  >
                    <Trophy className="w-4 h-4" />
                    <span className="font-medium">Submit Score</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>        {/* Desktop Header */}
        <div className="hidden sm:block bg-black/20 dark:bg-black/20 light:bg-white/80 backdrop-blur-md border-b border-white/10 dark:border-white/10 light:border-indigo-200/50 px-6 py-4">
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
              <div className="score-display bg-black/30 dark:bg-black/30 light:bg-white/70 backdrop-blur-sm border border-white/10 dark:border-white/10 light:border-indigo-200/50 rounded-xl px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="font-bold text-lg text-white dark:text-white light:text-slate-800">{playerStats.total_score.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-400 light:text-slate-600">pts</span>
                  {playerStats.total_score > gameState.score && showAchievementBonus && (
                    <span className="text-xs text-green-400">+{(playerStats.total_score - gameState.score).toLocaleString()} from achievements</span>
                  )}
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
                getUnlockProgress={getUnlockProgress}
              />
              
              {/* Streak Display */}
              {gameState.streak > 0 && (
                <div className="streak-display bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-xl px-3 py-2">
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
                onOpenLanguageSelector={() => setShowLanguageSelector(true)}
              />
            </div>
          </div>
        </div>
        <div className="hidden sm:block bg-black/30 dark:bg-black/30 light:bg-white/80 backdrop-blur-md border-t border-white/10 dark:border-white/10 light:border-indigo-200/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Game Controls */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  resetToCheckpoint();
                  alert("🔄 Level restarted!\n\nYou're back at the start of this level with your checkpoint score.");
                }}
                className="flex items-center space-x-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-400 px-4 py-2 rounded-xl transition-all duration-200"
                title="Reset to the start of the current level with your checkpoint score"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="font-medium">Restart Level</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRestart}
                className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl transition-all duration-200"
                title="Reset all progress, achievements, and statistics - complete restart"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="font-medium">Reset All</span>
              </motion.button>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLevelSelector(true)}
                className="levels-button flex items-center space-x-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-xl transition-all duration-200"
              >
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">Levels</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowDashboard(true);
                  // Mark all achievements as seen when dashboard is opened
                  markAchievementsAsSeen();
                }}
                className="dashboard-button flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-xl transition-all duration-200 relative"
              >
                <Award className="w-4 h-4" />
                <span className="font-medium">Dashboard</span>
                {getUnseenAchievements().length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getUnseenAchievements().length}
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
              
              {playerStats.total_score > 0 && (
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

        {/* Level Info Bar */}
        <div className="bg-black/10 dark:bg-black/10 light:bg-white/60 backdrop-blur-sm border-b border-white/5 dark:border-white/5 light:border-indigo-200/30 px-6 py-3">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              {/* Level Number - Centered */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                Level {currentLevel.id}
              </div>
              
              {/* Title - Under Level */}
              <div className="text-white dark:text-white light:text-slate-800 font-semibold text-lg">
                {currentLevel.title}
              </div>
              
              {/* Description - Under Title */}
              <div className="text-gray-400 dark:text-gray-400 light:text-slate-600 text-sm max-w-xs">
                {currentLevel.description}
              </div>
              
              {/* Grid for Checkpoint and Difficulty */}
              <div className="grid grid-cols-2 gap-3 mt-3 w-full max-w-xs">
                {/* Checkpoint indicator */}
                {levelCheckpoints && levelCheckpoints[currentLevel.id] !== undefined && (
                  <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-2 rounded-lg text-xs font-medium text-center">
                    <div className="text-xs opacity-75">Checkpoint:</div>
                    <div className="font-bold">{levelCheckpoints[currentLevel.id]?.toLocaleString() || 0}</div>
                  </div>
                )}
                
                <div className={`px-3 py-2 rounded-lg text-xs font-medium text-center ${
                  currentLevel.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  currentLevel.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  <div className="text-xs opacity-75">Difficulty:</div>
                  <div className="font-bold capitalize">{currentLevel.difficulty}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Level {currentLevel.id}
              </div>
              <div className="text-white dark:text-white light:text-slate-800 font-semibold">{currentLevel.title}</div>
              <div className="text-gray-400 dark:text-gray-400 light:text-slate-600 text-sm">{currentLevel.description}</div>
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
          getCurrentChallenge={getCurrentChallenge}
        />
        
        <div className="flex flex-1 min-h-0 flex-col">
          {/* Top Row - Code Editor and Progress Tracker */}
          <div className="flex flex-1 min-h-0">
            {/* Code Editor */}
            <div className="code-editor flex-1 min-h-0">
              <CodeInput
                gameState={gameState}
                currentLevel={currentLevel}
                selectedLanguage={selectedLanguage}
                onSubmitCode={submitCode}
                onUpdateCode={updateUserCode}
                onSkipQuestion={skipQuestion}
                getCurrentChallenge={getCurrentChallenge}
              />
            </div>
            
            {/* Side Panel - Progress Tracker */}
            <div className="hidden sm:block progress-tracker w-80 bg-black/20 dark:bg-black/20 light:bg-white/70 backdrop-blur-sm border-l border-white/10 dark:border-white/10 light:border-indigo-200/50">
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
          <div className="h-[600px] sm:h-200 border-t border-white/10 dark:border-white/10 light:border-indigo-200/30 bg-black/10 dark:bg-black/10 light:bg-white/50 backdrop-blur-sm">
            <AllLevelsLeaderboard currentLevelId={currentLevel.id} />
          </div>
        </div>
        
        {/* Enhanced Bottom Action Bar */}
        
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

      {/* Language Selector Modal */}
      <AnimatePresence>
        {showLanguageSelector && (
          <LanguageSelector
            isOpen={showLanguageSelector}
            onClose={() => setShowLanguageSelector(false)}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={(language) => {
              setSelectedLanguage(language);
              setShowLanguageSelector(false);
            }}
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
            score={playerStats.total_score}
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
            onResetLevel={handleResetLevel}
            onResetProgress={handleResetProgress}
            currentAttempts={gameState.attempts}
            unlockedLevels={unlockedLevels}
            levelCheckpoints={levelCheckpoints}
          />
        )}
      </AnimatePresence>

      {/* Achievement Notification */}
      <AchievementNotification
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />

      {/* Mobile Warning - Only show if onboarding is not active */}
      {showMobileWarning && !showOnboarding && (
        <MobileWarning 
          onContinueAnyway={() => setShowMobileWarning(false)} 
        />
      )}

      {/* Onboarding Tour - Higher priority than mobile warning */}
      {showOnboarding && (
        <OnboardingTour onComplete={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}

export default App;


// as i tested teh websitee achivements points are not getting added to teh points i have chck that and also achivements are shown everytime i wisit tehe website can u fix that too and also once i go to dashboard and click the achivment i have recievd will rmove notification/unread achivents (number  apeires on dashboard button ) will disappeirs