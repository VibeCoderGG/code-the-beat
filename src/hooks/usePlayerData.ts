import { useState, useEffect } from 'react';

export interface PlayerData {
  name: string;
  totalScore: number;
  highestLevel: number;
  totalChallenges: number;
  gamesPlayed: number;
  lastPlayed: string;
}

const STORAGE_KEY = 'codeTheBeat_playerData';

export const usePlayerData = () => {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [isNewPlayer, setIsNewPlayer] = useState(false);

  useEffect(() => {
    loadPlayerData();
  }, []);

  const loadPlayerData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setPlayerData(data);
        setIsNewPlayer(false);
      } else {
        setIsNewPlayer(true);
      }
    } catch (error) {
      console.error('Failed to load player data:', error);
      setIsNewPlayer(true);
    }
  };

  const savePlayerData = (data: PlayerData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setPlayerData(data);
      setIsNewPlayer(false);
    } catch (error) {
      console.error('Failed to save player data:', error);
    }
  };

  const createPlayer = (name: string) => {
    const newPlayer: PlayerData = {
      name: name.trim(),
      totalScore: 0,
      highestLevel: 1,
      totalChallenges: 0,
      gamesPlayed: 0,
      lastPlayed: new Date().toISOString()
    };
    savePlayerData(newPlayer);
    return newPlayer;
  };

  const updatePlayerStats = (score: number, level: number, challenges: number) => {
    if (!playerData) return;

    const updatedData: PlayerData = {
      ...playerData,
      totalScore: Math.max(playerData.totalScore, score),
      highestLevel: Math.max(playerData.highestLevel, level),
      totalChallenges: Math.max(playerData.totalChallenges, challenges),
      gamesPlayed: playerData.gamesPlayed + 1,
      lastPlayed: new Date().toISOString()
    };

    savePlayerData(updatedData);
    return updatedData;
  };

  const resetPlayerData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPlayerData(null);
    setIsNewPlayer(true);
  };

  return {
    playerData,
    isNewPlayer,
    createPlayer,
    updatePlayerStats,
    resetPlayerData,
    savePlayerData
  };
};