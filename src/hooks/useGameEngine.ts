import { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import { GameState, Level } from '../types/game';
import { levels } from '../data/levels';
import { dynamicLevelGenerator } from '../data/dynamicLevels';
import { aiService } from '../services/aiService';
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
  const [dynamicLevels, setDynamicLevels] = useState<Level[]>(levels); // Store AI-generated levels
  const [selectedLanguage, setSelectedLanguage] = useState<string>('javascript');
  const [isGeneratingLevel, setIsGeneratingLevel] = useState<boolean>(false);
  const synthRef = useRef<Tone.Synth | null>(null);
  const beatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const playerName = getOrCreatePlayerName();

  // ✅ Initialize levels with unlock state and checkpoints + Dynamic Level Generation
  useEffect(() => {
    const initializeLevels = async () => {
      const stored = getLocalPlayer();
      if (stored) {
        // Restore game state
        setGameState(prev => ({
          ...prev,
          score: stored.score,
          currentLevel: stored.level_reached,
          currentChallenge: stored.challenges_completed
        }));
        
        // Restore unlocked levels
        const unlockedLevelIds = stored.unlockedLevels || [1];
        setUnlockedLevels(unlockedLevelIds);
        
        // Restore level checkpoints
        const checkpoints = stored.levelCheckpoints || { 1: 0 };
        setLevelCheckpoints(checkpoints);
        
        // Generate dynamic levels for the current language
        try {
          setIsGeneratingLevel(true);
          const generatedLevels = await dynamicLevelGenerator.generateMultipleLevels(1, 5, selectedLanguage);
          
          // Update unlock state
          generatedLevels.forEach((level: Level) => {
            level.unlocked = unlockedLevelIds.includes(level.id);
          });
          
          setDynamicLevels(generatedLevels);
          setCurrentLevel(generatedLevels[stored.level_reached] || generatedLevels[0]);
        } catch (error) {
          console.error('Failed to generate dynamic levels, using static levels:', error);
          // Fallback to static levels
          levels.forEach((level) => {
            level.unlocked = unlockedLevelIds.includes(level.id);
          });
          setCurrentLevel(levels[stored.level_reached] || levels[0]);
        } finally {
          setIsGeneratingLevel(false);
        }
      } else {
        // First time playing - generate levels for first level
        try {
          setIsGeneratingLevel(true);
          const firstLevel = await dynamicLevelGenerator.generateLevel(1, selectedLanguage);
          firstLevel.unlocked = true;
          
          const generatedLevels = [firstLevel, ...levels.slice(1)];
          generatedLevels.forEach((level, index) => {
            level.unlocked = index === 0;
          });
          
          setDynamicLevels(generatedLevels);
          setCurrentLevel(firstLevel);
        } catch (error) {
          console.error('Failed to generate first level, using static level:', error);
          // Fallback to static levels
          levels.forEach((level, index) => {
            level.unlocked = index === 0;
          });
          setCurrentLevel(levels[0]);
        } finally {
          setIsGeneratingLevel(false);
        }
        
        setLevelCheckpoints({ 1: 0 });
      }
    };

    initializeLevels();
  }, [selectedLanguage]); // Re-generate when language changes

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
          // ✅ LEVEL COMPLETE - Unlock next level and set checkpoint + Generate next level
          const nextLevelIndex = gameState.currentLevel + 1;
          const nextLevelId = nextLevelIndex + 1; // Level IDs are 1-indexed
          
          // Always generate next level for infinite gameplay
          const generateNextLevel = async () => {
            try {
              const nextLevel = await dynamicLevelGenerator.generateLevel(nextLevelId, selectedLanguage);
              nextLevel.unlocked = true;
              
              // Update dynamic levels array (extend if needed)
              const updatedLevels = [...dynamicLevels];
              while (updatedLevels.length <= nextLevelIndex) {
                updatedLevels.push(levels[0]); // Placeholder
              }
              updatedLevels[nextLevelIndex] = nextLevel;
              setDynamicLevels(updatedLevels);
              
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
            } catch (error) {
              console.error('Failed to generate next level:', error);
              // Fallback: create a simple level
              const fallbackLevel: Level = {
                id: nextLevelId,
                title: `Level ${nextLevelId}`,
                concept: 'variables',
                description: 'Continue your coding journey',
                tempo: 80 + Math.floor(nextLevelId / 5) * 10,
                difficulty: nextLevelId <= 10 ? 'beginner' : nextLevelId <= 25 ? 'intermediate' : 'advanced',
                unlocked: true,
                challenges: [{
                  id: 1,
                  prompt: `Create a variable in ${selectedLanguage}`,
                  expectedCode: selectedLanguage === 'python' ? 'value = 1' : 'let value = 1;',
                  hints: ['Use variable syntax', 'Choose a good name'],
                  beatPosition: 0,
                  timeSignature: 4
                }],
                isDynamic: false
              };
              
              const updatedLevels = [...dynamicLevels];
              while (updatedLevels.length <= nextLevelIndex) {
                updatedLevels.push(levels[0]); // Placeholder
              }
              updatedLevels[nextLevelIndex] = fallbackLevel;
              setDynamicLevels(updatedLevels);
              
              const newUnlockedLevels = [...unlockedLevels];
              if (!newUnlockedLevels.includes(nextLevelId)) {
                newUnlockedLevels.push(nextLevelId);
                setUnlockedLevels(newUnlockedLevels);
              }
              const newCheckpoints = { ...levelCheckpoints, [nextLevelId]: newScore };
              setLevelCheckpoints(newCheckpoints);
              saveLocalPlayer(playerName, newScore, gameState.currentLevel, newChallengeIndex, newUnlockedLevels, newCheckpoints);
            }
          };
          
          generateNextLevel();

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
      // ✅ PENALTY SYSTEM + AI FEEDBACK - Deduct points and get AI-powered feedback
      const penalty = Math.min(10 + gameState.attempts * 5, 50); // Progressive penalty: 10, 15, 20, 25, 30... max 50
      const newScore = Math.max(0, gameState.score - penalty); // Don't go below 0
      const newAttempts = gameState.attempts + 1;
      
      // Get AI-powered feedback
      const getAIFeedback = async () => {
        try {
          const aiFeedback = await aiService.generateFeedback(
            challenge.prompt,
            code,
            challenge.expectedCode,
            newAttempts
          );
          
          setGameState(prev => ({
            ...prev,
            score: newScore,
            streak: 0,
            attempts: newAttempts,
            feedback: `${aiFeedback.message} -${penalty} points penalty. ${aiFeedback.encouragement}`,
            showFeedback: true
          }));
        } catch (error) {
          console.error('Failed to get AI feedback:', error);
          // Fallback to static feedback
          setGameState(prev => ({
            ...prev,
            score: newScore,
            streak: 0,
            attempts: newAttempts,
            feedback: `❌ Try again! -${penalty} points penalty (Attempt ${newAttempts}). Check the hint for guidance.`,
            showFeedback: true
          }));
        }
      };
      
      getAIFeedback();
      
      // Save the updated score with penalty
      saveLocalPlayer(playerName, newScore, gameState.currentLevel, gameState.currentChallenge, unlockedLevels, levelCheckpoints);
      
      setTimeout(() => {
        setGameState(prev => ({ ...prev, showFeedback: false }));
      }, 3000); // Show feedback longer for AI messages
    }
  }, [currentLevel, gameState, stopGame, playerName, unlockedLevels, setUnlockedLevels, levelCheckpoints, setLevelCheckpoints, dynamicLevels, selectedLanguage]);

  const changeLevel = useCallback((levelIndex: number) => {
    if (levelIndex >= 0 && levelIndex < dynamicLevels.length && dynamicLevels[levelIndex].unlocked) {
      stopGame();
      setCurrentLevel(dynamicLevels[levelIndex]);
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
  }, [stopGame, dynamicLevels]);

  const changeLanguage = useCallback(async (language: string) => {
    if (language === selectedLanguage) return;
    
    setSelectedLanguage(language);
    
    // Clear dynamic levels to trigger regeneration
    dynamicLevelGenerator.clearGeneratedLevels();
    
    // The useEffect will handle regeneration when selectedLanguage changes
  }, [selectedLanguage]);

  const regenerateCurrentLevel = useCallback(async () => {
    try {
      setIsGeneratingLevel(true);
      const regeneratedLevel = await dynamicLevelGenerator.regenerateLevel(
        currentLevel.id,
        selectedLanguage
      );
      
      regeneratedLevel.unlocked = currentLevel.unlocked;
      
      // Update the current level
      setCurrentLevel(regeneratedLevel);
      
      // Update in the dynamic levels array
      const updatedLevels = [...dynamicLevels];
      updatedLevels[gameState.currentLevel] = regeneratedLevel;
      setDynamicLevels(updatedLevels);
      
      // Reset current challenge
      setGameState(prev => ({
        ...prev,
        currentChallenge: 0,
        userCode: '',
        feedback: 'Level regenerated with new AI challenges! 🎲',
        showFeedback: true,
        attempts: 0
      }));
      
      setTimeout(() => {
        setGameState(prev => ({ ...prev, showFeedback: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to regenerate level:', error);
      setGameState(prev => ({
        ...prev,
        feedback: 'Failed to regenerate level. Please try again.',
        showFeedback: true
      }));
      setTimeout(() => {
        setGameState(prev => ({ ...prev, showFeedback: false }));
      }, 2000);
    } finally {
      setIsGeneratingLevel(false);
    }
  }, [currentLevel, selectedLanguage, dynamicLevels, gameState.currentLevel]);

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
    const resetLevels = [...dynamicLevels];
    resetLevels.forEach((level, index) => {
      level.unlocked = index === 0;
    });
    setDynamicLevels(resetLevels);
    
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
    setCurrentLevel(resetLevels[0]);
    
    // Reset unlocked levels and checkpoints
    setUnlockedLevels([1]);
    setLevelCheckpoints({ 1: 0 });
    
    // Clear local storage
    localStorage.removeItem("codeBeatPlayer");
    localStorage.removeItem("playerStats");
    localStorage.removeItem("achievements");
    localStorage.removeItem("playerProgress");
    
    // Clear dynamic level cache
    dynamicLevelGenerator.clearGeneratedLevels();
    
    return true; // Indicate successful reset
  }, [stopGame, dynamicLevels, setUnlockedLevels, setLevelCheckpoints]);

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
    changeLanguage, // Change programming language
    regenerateCurrentLevel, // Regenerate current level with new AI challenges
    levels: dynamicLevels, // Return dynamic levels instead of static
    unlockedLevels,
    levelCheckpoints,
    selectedLanguage,
    isGeneratingLevel
  };
};
