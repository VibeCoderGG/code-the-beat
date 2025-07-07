import { useState, useEffect, useCallback } from 'react';
import * as Tone from 'tone';
import { GameState, Level, Challenge } from '../types/game';
import { levels } from '../data/levels';

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
  const [synth, setSynth] = useState<Tone.Synth | null>(null);
  const [transport, setTransport] = useState<typeof Tone.Transport | null>(null);

  useEffect(() => {
    const synthInstance = new Tone.Synth().toDestination();
    setSynth(synthInstance);
    setTransport(Tone.Transport);

    return () => {
      synthInstance.dispose();
    };
  }, []);

  const startGame = useCallback(async () => {
    if (transport && synth) {
      await Tone.start();
      transport.bpm.value = currentLevel.tempo;
      transport.start();
      
      setGameState(prev => ({
        ...prev,
        isPlaying: true,
        beatCount: 0
      }));

      // Schedule beat events
      transport.scheduleRepeat((time) => {
        synth.triggerAttackRelease('C4', '8n', time);
        setGameState(prev => ({
          ...prev,
          beatCount: prev.beatCount + 1
        }));
      }, '4n');
    }
  }, [transport, synth, currentLevel.tempo]);

  const stopGame = useCallback(() => {
    if (transport) {
      transport.stop();
      transport.cancel();
      setGameState(prev => ({
        ...prev,
        isPlaying: false,
        beatCount: 0
      }));
    }
  }, [transport]);

  const submitCode = useCallback((code: string) => {
    const currentChallenge = currentLevel.challenges[gameState.currentChallenge];
    const isCorrect = code.trim() === currentChallenge.expectedCode.trim();
    
    if (isCorrect) {
      const points = 100 + (gameState.streak * 10);
      setGameState(prev => ({
        ...prev,
        score: prev.score + points,
        streak: prev.streak + 1,
        feedback: `Perfect! +${points} points`,
        showFeedback: true
      }));
      
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
          // Level complete
          stopGame();
          setGameState(prev => ({
            ...prev,
            feedback: 'Level Complete!',
            showFeedback: true
          }));
        }
      }, 1500);
    } else {
      setGameState(prev => ({
        ...prev,
        streak: 0,
        feedback: 'Try again! Check the hint.',
        showFeedback: true
      }));
      
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          showFeedback: false
        }));
      }, 2000);
    }
  }, [currentLevel, gameState.currentChallenge, gameState.streak, stopGame]);

  const changeLevel = useCallback((levelIndex: number) => {
    if (levelIndex >= 0 && levelIndex < levels.length) {
      setCurrentLevel(levels[levelIndex]);
      setGameState(prev => ({
        ...prev,
        currentLevel: levelIndex,
        currentChallenge: 0,
        userCode: '',
        feedback: '',
        showFeedback: false
      }));
      stopGame();
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