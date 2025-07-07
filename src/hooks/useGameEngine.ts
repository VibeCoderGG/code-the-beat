import { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import { GameState, Level, Challenge } from '../types/game';
import { levels } from '../data/levels';
import { submitScore } from '../lib/supabase';

export const useGameEngine = (onScoreUpdate?: (score: number, level: number, challenges: number) => void) => {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 0,
    currentChallenge: 0,
    score: 0,
    streak: 0,
    isPlaying: false,
    beatCount: 0,
    userCode: '',
    feedback: '',
    showFeedback: false
  });

  const [currentLevel, setCurrentLevel] = useState<Level>(levels[0]);
  const synthRef = useRef<Tone.Synth | null>(null);
  const beatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSubmittedScore = useRef<number>(0);

  useEffect(() => {
    // Initialize synth
    const synthInstance = new Tone.Synth().toDestination();
    synthRef.current = synthInstance;

    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
      }
      if (beatIntervalRef.current) {
        clearInterval(beatIntervalRef.current);
      }
    };
  }, []);

  const autoSubmitScore = useCallback(async (playerName: string, score: number, level: number, challenges: number) => {
    // Only submit if score improved significantly (by at least 100 points)
    if (score > lastSubmittedScore.current + 100) {
      try {
        await submitScore({
          player_name: playerName,
          score,
          level_reached: level,
          challenges_completed: challenges
        });
        lastSubmittedScore.current = score;
      } catch (error) {
        console.error('Auto score submission failed:', error);
      }
    }
  }, []);

  const startGame = useCallback(async () => {
    try {
      // Start Tone.js audio context
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }

      setGameState(prev => ({
        ...prev,
        isPlaying: true,
        beatCount: 0
      }));

      // Calculate beat interval based on tempo
      const beatInterval = (60 / currentLevel.tempo) * 1000; // Convert BPM to milliseconds

      // Start beat counter
      beatIntervalRef.current = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          beatCount: prev.beatCount + 1
        }));

        // Play beat sound
        if (synthRef.current) {
          synthRef.current.triggerAttackRelease('C4', '8n');
        }
      }, beatInterval);

    } catch (error) {
      console.error('Failed to start audio:', error);
      // Fallback: start without audio
      setGameState(prev => ({
        ...prev,
        isPlaying: true,
        beatCount: 0
      }));

      const beatInterval = (60 / currentLevel.tempo) * 1000;
      beatIntervalRef.current = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          beatCount: prev.beatCount + 1
        }));
      }, beatInterval);
    }
  }, [currentLevel.tempo]);

  const stopGame = useCallback(() => {
    if (beatIntervalRef.current) {
      clearInterval(beatIntervalRef.current);
      beatIntervalRef.current = null;
    }

    setGameState(prev => ({
      ...prev,
      isPlaying: false
    }));
  }, []);

  const submitCode = useCallback((code: string) => {
    const submitCode = useCallback((code: string, playerName?: string) => {
    const currentChallenge = currentLevel.challenges[gameState.currentChallenge];
    const normalizeCode = (str: string) => str.trim().replace(/\s+/g, ' ');
    const isCorrect = normalizeCode(code) === normalizeCode(currentChallenge.expectedCode);
    
    if (isCorrect) {
      const points = 100 + (gameState.streak * 10);
      const newScore = gameState.score + points;
      const newStreak = gameState.streak + 1;
      
      setGameState(prev => ({
        ...prev,
        score: newScore,
        streak: newStreak,
        feedback: `Perfect! +${points} points`,
        showFeedback: true
      }));

      // Update player stats and auto-submit score
      const challengesCompleted = gameState.currentChallenge + 1 + (gameState.currentLevel * 3);
      if (onScoreUpdate) {
        onScoreUpdate(newScore, gameState.currentLevel + 1, challengesCompleted);
      }
      
      // Auto-submit score to leaderboard if player name is available
      if (playerName) {
        autoSubmitScore(playerName, newScore, gameState.currentLevel + 1, challengesCompleted);
      }
      
      // Move to next challenge
      setTimeout(() => {
        if (gameState.currentChallenge < currentLevel.challenges.length - 1) {
          setGameState(prev => ({
            ...prev,
            currentChallenge: prev.currentChallenge + 1,
            userCode: '',
            showFeedback: false
          }));
        } else {
          // Level complete - unlock next level
          const nextLevelIndex = gameState.currentLevel + 1;
          if (nextLevelIndex < levels.length) {
            levels[nextLevelIndex].unlocked = true;
          }
          
          stopGame();
          setGameState(prev => ({
            ...prev,
            feedback: 'Level Complete! 🎉',
            showFeedback: true
          }));
          
          // Auto-advance to next level after a delay
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
              
              // Clear the welcome message after showing it
              setTimeout(() => {
                setGameState(prev => ({
                  ...prev,
                  showFeedback: false
                }));
              }, 2000);
            }
          }, 3000);
        }
      }, 1500);
    } else {
      setGameState(prev => ({
        ...prev,
        streak: 0,
        feedback: 'Try again! Check the hint for guidance.',
        showFeedback: true
      }));
      
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          showFeedback: false
        }));
      }, 2000);
    }
  }, [currentLevel, gameState.currentChallenge, gameState.streak, gameState.currentLevel, gameState.score, stopGame, onScoreUpdate, autoSubmitScore]);

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
        beatCount: 0
      }));
    }
  }, [stopGame]);

  const updateUserCode = useCallback((code: string) => {
    setGameState(prev => ({
      ...prev,
      userCode: code
    }));
  }, []);

  return {
    gameState,
    currentLevel,
    startGame,
    stopGame,
    submitCode,
    changeLevel,
    updateUserCode,
    levels
  };
};