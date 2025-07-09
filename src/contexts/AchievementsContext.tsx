import React, { createContext, useState, useEffect } from 'react';
import { Achievement, PlayerStats } from '../types/game';
import { achievementsData } from '../data/achievements';

interface UnlockedAchievement extends Achievement {
  unlockedAt: Date;
  progress: number;
}

interface AchievementsContextType {
  unlockedAchievements: UnlockedAchievement[];
  playerStats: PlayerStats;
  checkAchievements: () => Achievement[];
  updatePlayerStats: (stats: Partial<PlayerStats>) => void;
  getAchievementProgress: (achievement: Achievement) => number;
  isAchievementUnlocked: (achievementId: string) => boolean;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

export { AchievementsContext };

const STORAGE_KEY = 'codeBeatAchievements';
const STATS_STORAGE_KEY = 'codeBeatPlayerStats';

export const AchievementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState<UnlockedAchievement[]>([]);
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

  // Load saved data on mount
  useEffect(() => {
    const savedAchievements = localStorage.getItem(STORAGE_KEY);
    const savedStats = localStorage.getItem(STATS_STORAGE_KEY);

    if (savedAchievements) {
      try {
        const parsed = JSON.parse(savedAchievements);
        setUnlockedAchievements(parsed.map((a: UnlockedAchievement) => ({
          ...a,
          unlockedAt: new Date(a.unlockedAt)
        })));
      } catch (error) {
        console.error('Failed to load achievements:', error);
      }
    }

    if (savedStats) {
      try {
        setPlayerStats(JSON.parse(savedStats));
      } catch (error) {
        console.error('Failed to load player stats:', error);
      }
    }
  }, []);

  // Save achievements when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  // Save stats when they change
  useEffect(() => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(playerStats));
  }, [playerStats]);

  const updatePlayerStats = (newStats: Partial<PlayerStats>) => {
    setPlayerStats((prev: PlayerStats) => {
      const updated = { ...prev, ...newStats };
      
      // Update max streak if current is higher
      if (newStats.max_streak !== undefined && newStats.max_streak > prev.max_streak) {
        updated.max_streak = newStats.max_streak;
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

  const getAchievementProgress = (achievement: Achievement): number => {
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
  };

  const isAchievementUnlocked = (achievementId: string): boolean => {
    return unlockedAchievements.some(a => a.id === achievementId);
  };

  const checkAchievements = (): Achievement[] => {
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
          progress: 100
        };

        setUnlockedAchievements(prev => [...prev, unlockedAchievement]);
        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  };

  const value: AchievementsContextType = {
    unlockedAchievements,
    playerStats,
    checkAchievements,
    updatePlayerStats,
    getAchievementProgress,
    isAchievementUnlocked
  };

  return (
    <AchievementsContext.Provider value={value}>
      {children}
    </AchievementsContext.Provider>
  );
};
