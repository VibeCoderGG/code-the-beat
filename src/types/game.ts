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
}

export interface BeatIndicator {
  id: string;
  x: number;
  active: boolean;
  challenge?: Challenge;
}