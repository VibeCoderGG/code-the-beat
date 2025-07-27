export interface Level {
  id: number;
  title: string;
  concept: string;
  description: string;
  tempo: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  challenges: Challenge[];
  unlocked: boolean;
}

export interface Challenge {
  id: number;
  prompt: string;
  expectedCode: string;
  hints: string[];
  beatPosition: number;
  timeSignature: number;
  language: string; // Programming language for this challenge
}

export interface LanguageOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface GameState {
  currentLevel: number;
  currentChallenge: number;
  score: number;
  streak: number;
  isPlaying: boolean;
  beatCount: number;
  userCode: string;
  feedback: string;
  showFeedback: boolean;
  attempts: number;
  solvedQuestions: number; // Track total solved questions across all levels
}

export interface BeatIndicator {
  id: string;
  x: number;
  active: boolean;
  challenge?: Challenge;
}

// New Achievement System Types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'coding' | 'rhythm' | 'streak' | 'completion' | 'special';
  requirement: {
    type: 'score' | 'streak' | 'levels_completed' | 'challenges_completed' | 'perfect_submissions' | 'total_playtime' | 'total_score' | 'max_streak' | 'languages_used' | 'special';
    value: number;
    condition?: string;
  };
  reward: {
    points: number;
    title?: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: number;
}

export interface PlayerProgress {
  totalScore: number;
  totalChallengesCompleted: number;
  totalLevelsCompleted: number;
  maxStreak: number;
  perfectSubmissions: number;
  timePlayedMinutes: number;
  achievements: Achievement[];
  skillTree: SkillProgress;
  dailyStreak: number;
  lastPlayDate?: Date;
}

export interface SkillProgress {
  concepts: {
    [concept: string]: {
      level: number;
      experience: number;
      maxExperience: number;
    };
  };
  totalLevel: number;
  totalExperience: number;
}

export interface PlayerStats {
  challenges_completed: number;
  levels_completed: number;
  total_score: number;
  max_streak: number;
  perfect_submissions: number;
  total_playtime: number; // in minutes
  languages_used: string[];
  special_counters: Record<string, number>;
}