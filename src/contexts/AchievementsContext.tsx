import React, { createContext, useState, useEffect, useCallback } from 'react';
import { Achievement, PlayerStats } from '../types/game';
import { achievementsData } from '../data/achievements';

interface UnlockedAchievement extends Achievement {
  unlockedAt: Date;
  progress: number;
  seen: boolean; // Track if achievement notification has been seen
}

interface AchievementsContextType {
  unlockedAchievements: UnlockedAchievement[];
  playerStats: PlayerStats;
  checkAchievements: () => Achievement[];
  updatePlayerStats: (stats: Partial<PlayerStats>) => void;
  updateGameScore: (gameScore: number) => void; // New function for game score
  getAchievementProgress: (achievement: Achievement) => number;
  isAchievementUnlocked: (achievementId: string) => boolean;
  resetAllProgress: () => void;
  markAchievementsAsSeen: () => void;
  getUnseenAchievements: () => UnlockedAchievement[];
  addAchievementPoints: (points: number) => void;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

export { AchievementsContext };

const STORAGE_KEY = 'codeBeatAchievements';
const STATS_STORAGE_KEY = 'codeBeatPlayerStats';

export const AchievementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState<UnlockedAchievement[]>([]);
  const [achievementPoints, setAchievementPoints] = useState<number>(0); // Track achievement points separately
  const [baseGameScore, setBaseGameScore] = useState<number>(0); // Track base game score separately
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    challenges_completed: 0,
    levels_completed: 0,
    total_score: 0,
    max_streak: 0,
    perfect_submissions: 0,
    total_playtime: 0,
    languages_used: [],
    special_counters: {}
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    const savedAchievements = localStorage.getItem(STORAGE_KEY);
    const savedStats = localStorage.getItem(STATS_STORAGE_KEY);
    const savedAchievementPoints = localStorage.getItem('codeBeatAchievementPoints');
    const savedBaseGameScore = localStorage.getItem('codeBeatBaseGameScore');

    if (savedAchievements) {
      try {
        const parsed = JSON.parse(savedAchievements);
        setUnlockedAchievements(parsed.map((a: UnlockedAchievement) => ({
          ...a,
          unlockedAt: new Date(a.unlockedAt),
          seen: a.seen || false // Default to false if not present
        })));
      } catch (error) {
        console.error('Failed to load achievements:', error);
      }
    }

    if (savedStats) {
      try {
        const loadedStats = JSON.parse(savedStats);
        setPlayerStats(loadedStats);
      } catch (error) {
        console.error('Failed to load player stats:', error);
      }
    }

    if (savedAchievementPoints) {
      try {
        const points = JSON.parse(savedAchievementPoints);
        setAchievementPoints(points);
      } catch (error) {
        console.error('Failed to load achievement points:', error);
      }
    }

    if (savedBaseGameScore) {
      try {
        const score = JSON.parse(savedBaseGameScore);
        setBaseGameScore(score);
      } catch (error) {
        console.error('Failed to load base game score:', error);
      }
    }
    
    // Mark as initialized to prevent achievement checks on initial load
    setIsInitialized(true);
  }, []);

  // Save achievements when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  // Save stats when they change
  useEffect(() => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(playerStats));
  }, [playerStats]);

  // Save achievement points when they change
  useEffect(() => {
    localStorage.setItem('codeBeatAchievementPoints', JSON.stringify(achievementPoints));
  }, [achievementPoints]);

  // Save base game score when it changes
  useEffect(() => {
    localStorage.setItem('codeBeatBaseGameScore', JSON.stringify(baseGameScore));
  }, [baseGameScore]);

  // Update total score when achievement points change
  useEffect(() => {
    if (isInitialized) {
      setPlayerStats(prev => ({
        ...prev,
        total_score: baseGameScore + achievementPoints
      }));
    }
  }, [achievementPoints, baseGameScore, isInitialized]);

  const updatePlayerStats = (newStats: Partial<PlayerStats>) => {
    setPlayerStats((prev: PlayerStats) => {
      const updated = { ...prev, ...newStats };
      
      // Update max streak if current is higher or if explicitly set
      if (newStats.max_streak !== undefined) {
        updated.max_streak = Math.max(prev.max_streak, newStats.max_streak);
      }
      
      // Merge special counters
      if (newStats.special_counters) {
        updated.special_counters = { ...prev.special_counters, ...newStats.special_counters };
      }
      
      // Merge languages used
      if (newStats.languages_used) {
        const uniqueLanguages = new Set([...prev.languages_used, ...newStats.languages_used]);
        updated.languages_used = Array.from(uniqueLanguages);
      }
      
      return updated;
    });
  };

  const getAchievementProgress = useCallback((achievement: Achievement): number => {
    const req = achievement.requirement;
    
    switch (req.type) {
      case 'challenges_completed':
        return Math.min(100, (playerStats.challenges_completed / req.value) * 100);
      case 'levels_completed':
        return Math.min(100, (playerStats.levels_completed / req.value) * 100);
      case 'total_score':
        return Math.min(100, (playerStats.total_score / req.value) * 100);
      case 'max_streak':
        return Math.min(100, (playerStats.max_streak / req.value) * 100);
      case 'streak': // Handle both 'streak' and 'max_streak' for backwards compatibility
        return Math.min(100, (playerStats.max_streak / req.value) * 100);
      case 'perfect_submissions':
        return Math.min(100, (playerStats.perfect_submissions / req.value) * 100);
      case 'total_playtime':
        return Math.min(100, (playerStats.total_playtime / req.value) * 100);
      case 'languages_used':
        return Math.min(100, (playerStats.languages_used.length / req.value) * 100);
      case 'special': {
        const specialValue = playerStats.special_counters[req.condition || ''] || 0;
        return Math.min(100, (specialValue / req.value) * 100);
      }
      default:
        return 0;
    }
  }, [playerStats]);

  const isAchievementUnlocked = useCallback((achievementId: string): boolean => {
    return unlockedAchievements.some(a => a.id === achievementId);
  }, [unlockedAchievements]);

  const checkAchievements = useCallback((): Achievement[] => {
    // Don't check achievements if not initialized yet (on first load)
    if (!isInitialized) {
      return [];
    }

    const newlyUnlocked: Achievement[] = [];

    for (const achievement of achievementsData) {
      // Skip if already unlocked
      if (isAchievementUnlocked(achievement.id)) continue;

      // Check if requirements are met
      const progress = getAchievementProgress(achievement);
      if (progress >= 100) {
        // Unlock achievement
        const unlockedAchievement: UnlockedAchievement = {
          ...achievement,
          unlockedAt: new Date(),
          progress: 100,
          seen: false
        };

        setUnlockedAchievements(prev => [...prev, unlockedAchievement]);
        newlyUnlocked.push(achievement);
        
        // Add achievement points to stats (but not to game score)
        if (achievement.reward.points) {
          addAchievementPoints(achievement.reward.points);
        }
      }
    }

    return newlyUnlocked;
  }, [isInitialized, isAchievementUnlocked, getAchievementProgress]);

  const markAchievementsAsSeen = () => {
    setUnlockedAchievements(prev => 
      prev.map(achievement => ({ ...achievement, seen: true }))
    );
  };

  const getUnseenAchievements = (): UnlockedAchievement[] => {
    return unlockedAchievements.filter(achievement => !achievement.seen);
  };

  const addAchievementPoints = (points: number) => {
    // Only add to achievement points tracker, don't modify total_score directly
    setAchievementPoints(prev => prev + points);
  };

  const updateGameScore = (gameScore: number) => {
    // Update the base game score
    setBaseGameScore(gameScore);
    
    // Update the total score to be base game score plus achievement points
    setPlayerStats(prev => ({
      ...prev,
      total_score: gameScore + achievementPoints
    }));
  };

  const resetAllProgress = () => {
    // Reset all state to initial values
    setUnlockedAchievements([]);
    setAchievementPoints(0);
    setBaseGameScore(0);
    setPlayerStats({
      challenges_completed: 0,
      levels_completed: 0,
      total_score: 0,
      max_streak: 0,
      perfect_submissions: 0,
      total_playtime: 0,
      languages_used: [],
      special_counters: {}
    });
    
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STATS_STORAGE_KEY);
    localStorage.removeItem('codeBeatAchievementPoints');
    localStorage.removeItem('codeBeatBaseGameScore');
  };

  const value: AchievementsContextType = {
    unlockedAchievements,
    playerStats,
    checkAchievements,
    updatePlayerStats,
    updateGameScore,
    getAchievementProgress,
    isAchievementUnlocked,
    resetAllProgress,
    markAchievementsAsSeen,
    getUnseenAchievements,
    addAchievementPoints
  };

  return (
    <AchievementsContext.Provider value={value}>
      {children}
    </AchievementsContext.Provider>
  );
};
