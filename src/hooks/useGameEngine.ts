import { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import { GameState, Level } from '../types/game';
import { levels } from '../data/levels';
import { saveLocalPlayer, getLocalPlayer } from "../utils/storage";
import { getOrCreatePlayerName } from "../utils/player"; // 👈 Add this


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
    showFeedback: false
  });

  const [currentLevel, setCurrentLevel] = useState<Level>(levels[0]);
  const synthRef = useRef<Tone.Synth | null>(null);
  const beatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const playerName = getOrCreatePlayerName();


  // ✅ Restore saved progress on mount
  useEffect(() => {
    const stored = getLocalPlayer();
    if (stored) {
      setGameState(prev => ({
        ...prev,
        score: stored.score,
        currentLevel: stored.level_reached,
        currentChallenge: stored.challenges_completed
      }));
      setCurrentLevel(levels[stored.level_reached]);
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
      const points = 100 + gameState.streak * 10;
      const newScore = gameState.score + points;
      const newChallengeIndex = gameState.currentChallenge + 1;

      setGameState(prev => ({
        ...prev,
        score: newScore,
        streak: prev.streak + 1,
        feedback: `Perfect! +${points} points`,
        showFeedback: true
      }));

      // ✅ Save current progress
      saveLocalPlayer(playerName, newScore, gameState.currentLevel, newChallengeIndex);

      setTimeout(() => {
        // More challenges in current level
        if (gameState.currentChallenge < currentLevel.challenges.length - 1) {
          setGameState(prev => ({
            ...prev,
            currentChallenge: newChallengeIndex,
            userCode: '',
            showFeedback: false
          }));
        } else {
          // ✅ LEVEL COMPLETE
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
              saveLocalPlayer(playerName, newScore, nextLevelIndex, 0);

              setTimeout(() => {
                setGameState(prev => ({ ...prev, showFeedback: false }));
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
        setGameState(prev => ({ ...prev, showFeedback: false }));
      }, 2000);
    }
  }, [currentLevel, gameState, stopGame, playerName]);

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
    setGameState(prev => ({ ...prev, userCode: code }));
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
