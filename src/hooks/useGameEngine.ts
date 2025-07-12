import { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import { GameState, Level } from '../types/game';
import { levels } from '../data/levels';
import { saveLocalPlayer, getLocalPlayer } from "../utils/storage";
import { getOrCreatePlayerName } from "../utils/player";

export const useGameEngine = () => {
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
    attempts: 0
  });

  const [currentLevel, setCurrentLevel] = useState<Level>(levels[0]);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]); // Track unlocked levels
  const [levelCheckpoints, setLevelCheckpoints] = useState<{[levelId: number]: number}>({ 1: 0 }); // Track score at start of each level
  const synthRef = useRef<Tone.Synth | null>(null);
  const beatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const playerName = getOrCreatePlayerName();

  // ✅ Initialize levels with unlock state and checkpoints
  useEffect(() => {
    const stored = getLocalPlayer();
    if (stored) {
      // Restore game state
      setGameState(prev => ({
        ...prev,
        score: stored.score,
        currentLevel: stored.level_reached,
        currentChallenge: stored.challenges_completed
      }));
      setCurrentLevel(levels[stored.level_reached]);
      
      // Restore unlocked levels
      const unlockedLevelIds = stored.unlockedLevels || [1];
      setUnlockedLevels(unlockedLevelIds);
      
      // Restore level checkpoints
      const checkpoints = stored.levelCheckpoints || { 1: 0 };
      setLevelCheckpoints(checkpoints);
      
      // Update levels unlock state
      levels.forEach((level) => {
        level.unlocked = unlockedLevelIds.includes(level.id);
      });
    } else {
      // First time playing - only first level unlocked
      levels.forEach((level, index) => {
        level.unlocked = index === 0;
      });
      setLevelCheckpoints({ 1: 0 });
    }
  }, []);

  // ✅ Setup Tone.js synth
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
      if (Tone.context.state !== 'running') await Tone.start();

      setGameState(prev => ({ ...prev, isPlaying: true, beatCount: 0 }));

      const beatInterval = (60 / currentLevel.tempo) * 1000;
      beatIntervalRef.current = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          beatCount: prev.beatCount + 1
        }));
        synthRef.current?.triggerAttackRelease('C4', '8n');
      }, beatInterval);
    } catch (error) {
      console.error('Failed to start Tone.js:', error);
    }
  }, [currentLevel.tempo]);

  const stopGame = useCallback(() => {
    if (beatIntervalRef.current) clearInterval(beatIntervalRef.current);
    setGameState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const submitCode = useCallback((code: string) => {
    const challenge = currentLevel.challenges[gameState.currentChallenge];
    const normalize = (str: string) => str.trim().replace(/\s+/g, ' ');
    const isCorrect = normalize(code) === normalize(challenge.expectedCode);

    if (isCorrect) {
      // Base points calculation
      const basePoints = 100;
      const streakBonus = gameState.streak * 10;
      
      // NEW: Streak multiplier - divide streak by 10 and add to base multiplier of 1
      const streakMultiplier = 1 + (gameState.streak / 10);
      const totalPoints = Math.floor((basePoints + streakBonus) * streakMultiplier);
      
      const newScore = gameState.score + totalPoints;
      const newChallengeIndex = gameState.currentChallenge + 1;

      setGameState(prev => ({
        ...prev,
        score: newScore,
        streak: prev.streak + 1,
        feedback: `Perfect! +${totalPoints} points (${streakMultiplier.toFixed(1)}x streak multiplier)`,
        showFeedback: true,
        attempts: 0  // Reset attempts on success
      }));

      // ✅ Save current progress
      saveLocalPlayer(playerName, newScore, gameState.currentLevel, newChallengeIndex, unlockedLevels, levelCheckpoints);

      setTimeout(() => {
        // More challenges in current level
        if (gameState.currentChallenge < currentLevel.challenges.length - 1) {
          setGameState(prev => ({
            ...prev,
            currentChallenge: newChallengeIndex,
            userCode: '',
            showFeedback: false,
            attempts: 0  // Reset attempts for new challenge
          }));
        } else {
          // ✅ LEVEL COMPLETE - Unlock next level and set checkpoint
          const nextLevelIndex = gameState.currentLevel + 1;
          const nextLevelId = nextLevelIndex + 1; // Level IDs are 1-indexed
          
          if (nextLevelIndex < levels.length) {
            levels[nextLevelIndex].unlocked = true;
            
            // Update unlocked levels list
            const newUnlockedLevels = [...unlockedLevels];
            if (!newUnlockedLevels.includes(nextLevelId)) {
              newUnlockedLevels.push(nextLevelId);
              setUnlockedLevels(newUnlockedLevels);
            }
            
            // Set checkpoint for next level
            const newCheckpoints = { ...levelCheckpoints, [nextLevelId]: newScore };
            setLevelCheckpoints(newCheckpoints);
            
            // Save progress with updated unlocked levels and checkpoints
            saveLocalPlayer(playerName, newScore, gameState.currentLevel, newChallengeIndex, newUnlockedLevels, newCheckpoints);
          }

          stopGame();

          setGameState(prev => ({
            ...prev,
            feedback: `Level Complete! 🎉${nextLevelIndex < levels.length ? ' Next level unlocked!' : ''} Checkpoint saved!`,
            showFeedback: true
          }));

          // Notify global listeners (e.g., leaderboard)
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('levelCompleted', {
              detail: { levelId: gameState.currentLevel + 1 }
            }));
          }, 1000);

          // Move to next level
          setTimeout(() => {
            if (nextLevelIndex < levels.length) {
              setCurrentLevel(levels[nextLevelIndex]);
              setGameState(prev => ({
                ...prev,
                currentLevel: nextLevelIndex,
                currentChallenge: 0,
                userCode: '',
                feedback: `Welcome to Level ${nextLevelIndex + 1}: ${levels[nextLevelIndex].title}!`,
                showFeedback: true,
                beatCount: 0
              }));

              // Save fresh level progress
              saveLocalPlayer(playerName, newScore, nextLevelIndex, 0, unlockedLevels, levelCheckpoints);

              setTimeout(() => {
                setGameState(prev => ({ ...prev, showFeedback: false }));
              }, 2000);
            }
          }, 3000);
        }
      }, 1500);
    } else {
      // ✅ PENALTY SYSTEM - Deduct points for wrong attempts
      const penalty = Math.min(10 + gameState.attempts * 5, 50); // Progressive penalty: 10, 15, 20, 25, 30... max 50
      const newScore = Math.max(0, gameState.score - penalty); // Don't go below 0
      
      setGameState(prev => ({
        ...prev,
        score: newScore,
        streak: 0,
        attempts: prev.attempts + 1,  // Increment attempts on failure
        feedback: `❌ Try again! -${penalty} points penalty (Attempt ${prev.attempts + 1}). Check the hint for guidance.`,
        showFeedback: true
      }));
      
      // Save the updated score with penalty
      saveLocalPlayer(playerName, newScore, gameState.currentLevel, gameState.currentChallenge, unlockedLevels, levelCheckpoints);
      
      setTimeout(() => {
        setGameState(prev => ({ ...prev, showFeedback: false }));
      }, 2000);
    }
  }, [currentLevel, gameState, stopGame, playerName, unlockedLevels, levelCheckpoints]);

  const changeLevel = useCallback((levelIndex: number) => {
    if (levelIndex >= 0 && levelIndex < levels.length && levels[levelIndex].unlocked) {
      stopGame();
      setCurrentLevel(levels[levelIndex]);
      setGameState(prev => ({
        ...prev,
        currentLevel: levelIndex,
        currentChallenge: 0,
        userCode: '',
        feedback: '',
        showFeedback: false,
        beatCount: 0,
        attempts: 0  // Reset attempts when changing levels
      }));
    }
  }, [stopGame]);

  const updateUserCode = useCallback((code: string) => {
    setGameState(prev => ({ ...prev, userCode: code }));
  }, []);

  const resetToCheckpoint = useCallback(() => {
    // Stop current game
    stopGame();
    
    // Get the checkpoint score for current level
    const currentLevelId = gameState.currentLevel + 1; // Level IDs are 1-indexed
    const checkpointScore = levelCheckpoints[currentLevelId] || 0;
    
    // Reset game state to checkpoint values
    setGameState(prev => ({
      ...prev,
      currentChallenge: 0, // Reset to start of current level
      score: checkpointScore, // Reset to checkpoint score
      streak: 0, // Reset streak
      userCode: '', // Clear code input
      feedback: `Reset to Level ${currentLevelId} checkpoint! Score: ${checkpointScore}`,
      showFeedback: true,
      beatCount: 0,
      attempts: 0,
      isPlaying: false
    }));
    
    // Save the reset state
    saveLocalPlayer(playerName, checkpointScore, gameState.currentLevel, 0, unlockedLevels, levelCheckpoints);
    
    // Hide feedback after 2 seconds
    setTimeout(() => {
      setGameState(prev => ({ ...prev, showFeedback: false }));
    }, 2000);
    
    return true; // Indicate successful reset
  }, [stopGame, gameState.currentLevel, levelCheckpoints, playerName, unlockedLevels]);

  const resetGame = useCallback(() => {
    // Stop current game
    stopGame();
    
    // Reset all levels to locked except first one
    levels.forEach((level, index) => {
      level.unlocked = index === 0;
    });
    
    // Reset game state to initial values
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
      attempts: 0
    });
    
    // Reset to first level
    setCurrentLevel(levels[0]);
    
    // Reset unlocked levels and checkpoints
    setUnlockedLevels([1]);
    setLevelCheckpoints({ 1: 0 });
    
    // Clear local storage
    localStorage.removeItem("codeBeatPlayer");
    localStorage.removeItem("playerStats");
    localStorage.removeItem("achievements");
    localStorage.removeItem("playerProgress");
    
    return true; // Indicate successful reset
  }, [stopGame]);

  return {
    gameState,
    currentLevel,
    startGame,
    stopGame,
    submitCode,
    changeLevel,
    updateUserCode,
    resetGame, // Expose resetGame function
    resetToCheckpoint, // Expose resetToCheckpoint function
    levels,
    unlockedLevels,
    levelCheckpoints
  };
};
