export const saveLocalPlayer = (player_name: string, score: number, level_reached: number, challenges_completed: number, unlockedLevels: number[] = [], levelCheckpoints: {[levelId: number]: number} = {}) => {
  localStorage.setItem("codeBeatPlayer", JSON.stringify({ 
    player_name, 
    score, 
    level_reached, 
    challenges_completed, 
    unlockedLevels,
    levelCheckpoints
  }));
};

export const getLocalPlayer = (): {
  player_name: string;
  score: number;
  level_reached: number;
  challenges_completed: number;
  unlockedLevels: number[];
  levelCheckpoints: {[levelId: number]: number};
} | null => {
  const raw = localStorage.getItem("codeBeatPlayer");
  if (!raw) return null;
  
  const parsed = JSON.parse(raw);
  // Ensure unlockedLevels exists for backward compatibility
  if (!parsed.unlockedLevels) {
    parsed.unlockedLevels = [1]; // Default to having first level unlocked
  }
  // Ensure levelCheckpoints exists for backward compatibility
  if (!parsed.levelCheckpoints) {
    parsed.levelCheckpoints = { 1: 0 }; // Default checkpoint for level 1
  }
  return parsed;
};

export const resetPlayerProgress = () => {
  localStorage.removeItem("codeBeatPlayer");
  // Also clear any other game-related localStorage items
  localStorage.removeItem("playerStats");
  localStorage.removeItem("achievements");
  localStorage.removeItem("playerProgress");
};
