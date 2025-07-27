import { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import { GameState, Level, Challenge } from '../types/game';
import { enhancedMultiLanguageLevels, getChallengesForLanguageWithAST } from '../data/enhancedMultiLanguageLevels';
import { PatternValidator } from '../utils/patternValidation';
import { saveLocalPlayer, getLocalPlayer } from "../utils/storage";
import { getOrCreatePlayerName } from "../utils/player";

export const useMultiLanguageGameEngine = (selectedLanguage: string) => {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 0,
    currentChallenge: 0,
    score: 0,
    streak: 0,
    isPlaying: false,
    beatCount: 0,
    userCode: '',
    feedback: '',
    showFeedback: false,
    attempts: 0,
    solvedQuestions: 0
  });

  const [currentLevel, setCurrentLevel] = useState<Level>(enhancedMultiLanguageLevels[0]);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]);
  const [levelCheckpoints, setLevelCheckpoints] = useState<{[levelId: number]: number}>({ 1: 0 });
  const [randomizedChallengeOrders, setRandomizedChallengeOrders] = useState<{[key: string]: number[]}>({});
  const synthRef = useRef<Tone.Synth | null>(null);
  const beatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const playerName = getOrCreatePlayerName();

  // Get filtered challenges for current language
  const getFilteredChallenges = useCallback((level: Level): Challenge[] => {
    return getChallengesForLanguageWithAST(level, selectedLanguage);
  }, [selectedLanguage]);

  // Create language-aware levels
  const languageAwareLevels = useCallback((): Level[] => {
    return enhancedMultiLanguageLevels.map((level: Level) => ({
      ...level,
      challenges: getFilteredChallenges(level)
    }));
  }, [getFilteredChallenges]);

  // Utility function to shuffle an array using Fisher-Yates algorithm
  const shuffleArray = useCallback((array: number[]): number[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Function to get or create randomized challenge order for a level
  const getRandomizedChallengeOrder = useCallback((levelIndex: number): number[] => {
    const levelId = levelIndex + 1;
    const languageKey = `${levelId}_${selectedLanguage}`;
    
    if (randomizedChallengeOrders[languageKey]) {
      return randomizedChallengeOrders[languageKey];
    }
    
    const currentLangLevel = languageAwareLevels()[levelIndex];
    const challengeIndices = Array.from({ length: currentLangLevel.challenges.length }, (_, i) => i);
    const shuffled = shuffleArray(challengeIndices);
    
    setRandomizedChallengeOrders(prev => ({
      ...prev,
      [languageKey]: shuffled
    }));
    
    return shuffled;
  }, [randomizedChallengeOrders, shuffleArray, selectedLanguage, languageAwareLevels]);

  // Function to get the current challenge based on randomized order
  const getCurrentChallenge = useCallback(() => {
    const randomOrder = getRandomizedChallengeOrder(gameState.currentLevel);
    const actualChallengeIndex = randomOrder[gameState.currentChallenge];
    const currentLangLevel = languageAwareLevels()[gameState.currentLevel];
    return currentLangLevel.challenges[actualChallengeIndex];
  }, [gameState.currentLevel, gameState.currentChallenge, getRandomizedChallengeOrder, languageAwareLevels]);

  // Update current level when language changes
  useEffect(() => {
    const langAwareLevels = languageAwareLevels();
    setCurrentLevel(langAwareLevels[gameState.currentLevel]);
  }, [selectedLanguage, gameState.currentLevel, languageAwareLevels]);

  // Initialize levels with unlock state and checkpoints
  useEffect(() => {
    const stored = getLocalPlayer();
    if (stored) {
      const langAwareLevels = languageAwareLevels();
      
      setGameState(prev => ({
        ...prev,
        score: stored.score,
        currentLevel: stored.level_reached,
        currentChallenge: stored.challenges_completed,
        solvedQuestions: stored.solvedQuestions || 0
      }));
      setCurrentLevel(langAwareLevels[stored.level_reached]);
      
      const unlockedLevelIds = stored.unlockedLevels || [1];
      setUnlockedLevels(unlockedLevelIds);
      
      const checkpoints = stored.levelCheckpoints || { 1: 0 };
      setLevelCheckpoints(checkpoints);
      
      const randomizedOrders = stored.randomizedOrders || {};
      setRandomizedChallengeOrders(randomizedOrders);
      
      langAwareLevels.forEach((level) => {
        level.unlocked = unlockedLevelIds.includes(level.id);
      });
    } else {
      const langAwareLevels = languageAwareLevels();
      langAwareLevels.forEach((level, index) => {
        level.unlocked = index === 0;
      });
      setLevelCheckpoints({ 1: 0 });
      setRandomizedChallengeOrders({});
    }
  }, [selectedLanguage, languageAwareLevels]);

  // Setup Tone.js synth
  useEffect(() => {
    const synthInstance = new Tone.Synth().toDestination();
    synthRef.current = synthInstance;

    return () => {
      synthRef.current?.dispose();
      if (beatIntervalRef.current) clearInterval(beatIntervalRef.current);
    };
  }, []);

  const startGame = useCallback(async () => {
    try {
      if (Tone.context.state !== 'running') {
        try {
          await Tone.start();
        } catch (error) {
          console.warn('AudioContext not allowed yet, will start without audio:', error);
        }
      }

      setGameState(prev => ({ ...prev, isPlaying: true, beatCount: 0 }));

      const beatInterval = (60 / currentLevel.tempo) * 1000;
      beatIntervalRef.current = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          beatCount: prev.beatCount + 1
        }));
        if (Tone.context.state === 'running') {
          synthRef.current?.triggerAttackRelease('C4', '8n');
        }
      }, beatInterval);
    } catch (error) {
      console.error('Failed to start game:', error);
      setGameState(prev => ({ ...prev, isPlaying: true, beatCount: 0 }));
    }
  }, [currentLevel.tempo]);

  const stopGame = useCallback(() => {
    if (beatIntervalRef.current) clearInterval(beatIntervalRef.current);
    setGameState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const submitCode = useCallback((code: string) => {
    const challenge = getCurrentChallenge();
    
    // Use pattern validation for all languages
    let validationResult;
    
    // Check if challenge has expected keywords for validation
    if (challenge.expectedCode) {
      // Extract potential keywords from the expected code
      const expectedKeywords = challenge.expectedCode.match(/\b(function|const|let|var|if|for|while|class|def|import|export)\b/g) || [];
      
      if (expectedKeywords.length > 0) {
        validationResult = PatternValidator.validateChallenge(code, selectedLanguage, { 
          expectedKeywords: expectedKeywords 
        });
      } else {
        // Fallback to basic pattern validation
        validationResult = PatternValidator.validateCode(code, selectedLanguage);
      }
    } else {
      // Use basic pattern validation
      validationResult = PatternValidator.validateCode(code, selectedLanguage);
    }
    
    if (validationResult.isValid) {
      const basePoints = validationResult.score;
      const streakBonus = gameState.streak * 10;
      const streakMultiplier = 1 + (gameState.streak / 10);
      const totalPoints = Math.floor((basePoints + streakBonus) * streakMultiplier);
      
      const newScore = gameState.score + totalPoints;
      const newChallengeIndex = gameState.currentChallenge + 1;

      setGameState(prev => ({
        ...prev,
        score: newScore,
        streak: prev.streak + 1,
        solvedQuestions: prev.solvedQuestions + 1,
        feedback: `${validationResult.feedback} +${totalPoints} points (${streakMultiplier.toFixed(1)}x streak multiplier)`,
        showFeedback: true,
        attempts: 0
      }));

      saveLocalPlayer(playerName, newScore, gameState.currentLevel, newChallengeIndex, unlockedLevels, levelCheckpoints, randomizedChallengeOrders, gameState.solvedQuestions + 1);

      // Level unlocking logic (every 20 questions)
      const totalQuestionsAnswered = gameState.solvedQuestions + 1;
      const questionsNeededPerLevel = 20;
      const maxUnlockableLevel = Math.min(Math.floor(totalQuestionsAnswered / questionsNeededPerLevel) + 1, enhancedMultiLanguageLevels.length);
      
      const newUnlockedLevels = [...unlockedLevels];
      let levelsUnlocked = false;
      
      for (let levelId = 1; levelId <= maxUnlockableLevel; levelId++) {
        if (!newUnlockedLevels.includes(levelId) && levelId <= enhancedMultiLanguageLevels.length) {
          newUnlockedLevels.push(levelId);
          const langAwareLevels = languageAwareLevels();
          langAwareLevels[levelId - 1].unlocked = true;
          levelsUnlocked = true;
        }
      }
      
      if (levelsUnlocked) {
        setUnlockedLevels(newUnlockedLevels);
      }

      setTimeout(() => {
        if (gameState.currentChallenge < currentLevel.challenges.length - 1) {
          setGameState(prev => ({
            ...prev,
            currentChallenge: newChallengeIndex,
            userCode: '',
            showFeedback: false,
            attempts: 0,
            feedback: levelsUnlocked ? `Correct! +${totalPoints} points 🎉 New level(s) unlocked!` : prev.feedback
          }));
        } else {
          // Level complete
          const nextLevelIndex = gameState.currentLevel + 1;
          const nextLevelId = nextLevelIndex + 1;
          
          if (nextLevelIndex < enhancedMultiLanguageLevels.length) {
            const newCheckpoints = { ...levelCheckpoints, [nextLevelId]: newScore };
            setLevelCheckpoints(newCheckpoints);
            saveLocalPlayer(playerName, newScore, gameState.currentLevel, newChallengeIndex, newUnlockedLevels, newCheckpoints, randomizedChallengeOrders, gameState.solvedQuestions + 1);
          }

          stopGame();

          setGameState(prev => ({
            ...prev,
            feedback: `Level Complete! 🎉${levelsUnlocked ? ' New level(s) unlocked!' : ''} Checkpoint saved!`,
            showFeedback: true
          }));

          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('levelCompleted', {
              detail: { levelId: gameState.currentLevel + 1 }
            }));
          }, 1000);

          setTimeout(() => {
            if (nextLevelIndex < enhancedMultiLanguageLevels.length) {
              const langAwareLevels = languageAwareLevels();
              setCurrentLevel(langAwareLevels[nextLevelIndex]);
              setGameState(prev => ({
                ...prev,
                currentLevel: nextLevelIndex,
                currentChallenge: 0,
                userCode: '',
                feedback: `Welcome to Level ${nextLevelIndex + 1}: ${langAwareLevels[nextLevelIndex].title}!`,
                showFeedback: true,
                beatCount: 0
              }));

              saveLocalPlayer(playerName, newScore, nextLevelIndex, 0, newUnlockedLevels, levelCheckpoints, randomizedChallengeOrders, gameState.solvedQuestions + 1);

              setTimeout(() => {
                setGameState(prev => ({ ...prev, showFeedback: false }));
              }, 2000);
            }
          }, 3000);
        }
      }, 1500);
    } else {
      // Wrong answer - penalty system
      const penalty = Math.min(10 + gameState.attempts * 5, 50);
      const newScore = Math.max(0, gameState.score - penalty);
      
      setGameState(prev => ({
        ...prev,
        score: newScore,
        streak: 0,
        attempts: prev.attempts + 1,
        feedback: `${validationResult.feedback} -${penalty} points penalty (Attempt ${prev.attempts + 1}). Score: ${validationResult.score}%`,
        showFeedback: true
      }));
      
      saveLocalPlayer(playerName, newScore, gameState.currentLevel, gameState.currentChallenge, unlockedLevels, levelCheckpoints, randomizedChallengeOrders, gameState.solvedQuestions);
      
      setTimeout(() => {
        setGameState(prev => ({ ...prev, showFeedback: false }));
      }, 2000);
    }
  }, [currentLevel, gameState, stopGame, playerName, unlockedLevels, levelCheckpoints, randomizedChallengeOrders, getCurrentChallenge, languageAwareLevels, selectedLanguage]);

  const skipQuestion = useCallback(() => {
    const newChallengeIndex = gameState.currentChallenge + 1;

    setGameState(prev => ({
      ...prev,
      streak: 0,
      feedback: 'Question skipped! No points awarded.',
      showFeedback: true,
      attempts: 0
    }));

    saveLocalPlayer(playerName, gameState.score, gameState.currentLevel, newChallengeIndex, unlockedLevels, levelCheckpoints, randomizedChallengeOrders, gameState.solvedQuestions);

    setTimeout(() => {
      if (gameState.currentChallenge < currentLevel.challenges.length - 1) {
        setGameState(prev => ({
          ...prev,
          currentChallenge: newChallengeIndex,
          userCode: '',
          showFeedback: false,
          attempts: 0,
          feedback: ''
        }));
      } else {
        stopGame();
        setGameState(prev => ({
          ...prev,
          feedback: `Level challenges completed! Solve questions to unlock new levels.`,
          showFeedback: true
        }));
        
        setTimeout(() => {
          setGameState(prev => ({ ...prev, showFeedback: false }));
        }, 3000);
      }
    }, 1500);
  }, [currentLevel, gameState, stopGame, playerName, unlockedLevels, levelCheckpoints, randomizedChallengeOrders]);

  const changeLevel = useCallback((levelIndex: number) => {
    const langAwareLevels = languageAwareLevels();
    if (levelIndex >= 0 && levelIndex < langAwareLevels.length && langAwareLevels[levelIndex].unlocked) {
      stopGame();
      setCurrentLevel(langAwareLevels[levelIndex]);
      setGameState(prev => ({
        ...prev,
        currentLevel: levelIndex,
        currentChallenge: 0,
        userCode: '',
        feedback: '',
        showFeedback: false,
        beatCount: 0,
        attempts: 0
      }));
    }
  }, [stopGame, languageAwareLevels]);

  const updateUserCode = useCallback((code: string) => {
    setGameState(prev => ({ ...prev, userCode: code }));
  }, []);

  const getUnlockProgress = useCallback(() => {
    const totalQuestionsAnswered = gameState.solvedQuestions;
    const questionsNeededPerLevel = 20;
    const questionsToNextUnlock = questionsNeededPerLevel - (totalQuestionsAnswered % questionsNeededPerLevel);
    const nextLevelToUnlock = Math.floor(totalQuestionsAnswered / questionsNeededPerLevel) + 2;
    
    return {
      questionsToNextUnlock: questionsToNextUnlock === questionsNeededPerLevel ? 0 : questionsToNextUnlock,
      nextLevelToUnlock: nextLevelToUnlock <= enhancedMultiLanguageLevels.length ? nextLevelToUnlock : null,
      totalQuestionsAnswered: totalQuestionsAnswered,
      progressPercentage: ((totalQuestionsAnswered % questionsNeededPerLevel) / questionsNeededPerLevel) * 100
    };
  }, [gameState.solvedQuestions]);

  const resetToCheckpoint = useCallback(() => {
    stopGame();
    
    const currentLevelId = gameState.currentLevel + 1;
    const checkpointScore = levelCheckpoints[currentLevelId] || 0;
    
    setGameState(prev => ({
      ...prev,
      currentChallenge: 0,
      score: checkpointScore,
      streak: 0,
      userCode: '',
      feedback: `Reset to Level ${currentLevelId} checkpoint! Score: ${checkpointScore}`,
      showFeedback: true,
      beatCount: 0,
      attempts: 0,
      isPlaying: false
    }));
    
    saveLocalPlayer(playerName, checkpointScore, gameState.currentLevel, 0, unlockedLevels, levelCheckpoints, randomizedChallengeOrders, gameState.solvedQuestions);
    
    setTimeout(() => {
      setGameState(prev => ({ ...prev, showFeedback: false }));
    }, 2000);
    
    return true;
  }, [stopGame, gameState.currentLevel, gameState.solvedQuestions, levelCheckpoints, playerName, unlockedLevels, randomizedChallengeOrders]);

  const resetGame = useCallback(() => {
    stopGame();
    
    const langAwareLevels = languageAwareLevels();
    langAwareLevels.forEach((level, index) => {
      level.unlocked = index === 0;
    });
    
    setGameState({
      currentLevel: 0,
      currentChallenge: 0,
      score: 0,
      streak: 0,
      isPlaying: false,
      beatCount: 0,
      userCode: '',
      feedback: '',
      showFeedback: false,
      attempts: 0,
      solvedQuestions: 0
    });
    
    setCurrentLevel(langAwareLevels[0]);
    setUnlockedLevels([1]);
    setLevelCheckpoints({ 1: 0 });
    setRandomizedChallengeOrders({});
    
    localStorage.removeItem("codeBeatPlayer");
    localStorage.removeItem("playerStats");
    localStorage.removeItem("achievements");
    localStorage.removeItem("playerProgress");
    
    return true;
  }, [stopGame, languageAwareLevels]);

  return {
    gameState,
    currentLevel,
    startGame,
    stopGame,
    submitCode,
    skipQuestion,
    changeLevel,
    updateUserCode,
    resetGame,
    resetToCheckpoint,
    levels: languageAwareLevels(),
    unlockedLevels,
    levelCheckpoints,
    getUnlockProgress,
    getCurrentChallenge
  };
};
