import { Achievement } from '../types/game';

export const achievementsData: Achievement[] = [
  // Coding Achievements
  {
    id: 'first_code',
    title: 'Hello World!',
    description: 'Submit your first piece of code',
    icon: '🎯',
    category: 'coding',
    requirement: { type: 'challenges_completed', value: 1 },
    reward: { points: 50 },
    rarity: 'common'
  },
  {
    id: 'syntax_master',
    title: 'Syntax Master',
    description: 'Complete 10 challenges without syntax errors',
    icon: '✨',
    category: 'coding',
    requirement: { type: 'perfect_submissions', value: 10 },
    reward: { points: 200, title: 'Code Perfectionist' },
    rarity: 'rare'
  },
  {
    id: 'code_wizard',
    title: 'Code Wizard',
    description: 'Complete 50 challenges',
    icon: '🧙‍♂️',
    category: 'coding',
    requirement: { type: 'challenges_completed', value: 50 },
    reward: { points: 500, title: 'Coding Wizard' },
    rarity: 'epic'
  },

  // Rhythm Achievements
  {
    id: 'rhythm_rookie',
    title: 'Rhythm Rookie',
    description: 'Submit code in perfect sync with the beat 5 times',
    icon: '🎵',
    category: 'rhythm',
    requirement: { type: 'special', value: 5, condition: 'perfect_beat_sync' },
    reward: { points: 100 },
    rarity: 'common'
  },
  {
    id: 'beat_master',
    title: 'Beat Master',
    description: 'Maintain perfect rhythm for an entire level',
    icon: '🎼',
    category: 'rhythm',
    requirement: { type: 'special', value: 1, condition: 'perfect_level_rhythm' },
    reward: { points: 300, title: 'Rhythm Master' },
    rarity: 'epic'
  },

  // Streak Achievements
  {
    id: 'streak_starter',
    title: 'On Fire!',
    description: 'Achieve a streak of 5',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak', value: 5 },
    reward: { points: 100 },
    rarity: 'common'
  },
  {
    id: 'streak_master',
    title: 'Unstoppable!',
    description: 'Achieve a streak of 15',
    icon: '⚡',
    category: 'streak',
    requirement: { type: 'streak', value: 15 },
    reward: { points: 300, title: 'Streak Master' },
    rarity: 'rare'
  },
  {
    id: 'streak_legend',
    title: 'Legendary Streak',
    description: 'Achieve a streak of 30',
    icon: '🏆',
    category: 'streak',
    requirement: { type: 'streak', value: 30 },
    reward: { points: 1000, title: 'Coding Legend' },
    rarity: 'legendary'
  },

  // Completion Achievements
  {
    id: 'first_level',
    title: 'Level Cleared!',
    description: 'Complete your first level',
    icon: '🎖️',
    category: 'completion',
    requirement: { type: 'levels_completed', value: 1 },
    reward: { points: 200 },
    rarity: 'common'
  },
  {
    id: 'level_conqueror',
    title: 'Level Conqueror',
    description: 'Complete 5 levels',
    icon: '👑',
    category: 'completion',
    requirement: { type: 'levels_completed', value: 5 },
    reward: { points: 500, title: 'Level Master' },
    rarity: 'rare'
  },

  // Special Achievements
  {
    id: 'speed_coder',
    title: 'Speed Coder',
    description: 'Complete a challenge in under 30 seconds',
    icon: '💨',
    category: 'special',
    requirement: { type: 'special', value: 1, condition: 'fast_completion' },
    reward: { points: 150 },
    rarity: 'rare'
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Code after midnight',
    icon: '🦉',
    category: 'special',
    requirement: { type: 'special', value: 1, condition: 'midnight_coding' },
    reward: { points: 100 },
    rarity: 'common'
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete a level with 100% accuracy',
    icon: '💎',
    category: 'special',
    requirement: { type: 'special', value: 1, condition: 'perfect_level' },
    reward: { points: 400, title: 'Perfectionist' },
    rarity: 'epic'
  },
  {
    id: 'theme_explorer',
    title: 'Theme Explorer',
    description: 'Switch between light and dark themes 10 times',
    icon: '🌓',
    category: 'special',
    requirement: { type: 'special', value: 10, condition: 'theme_switches' },
    reward: { points: 75 },
    rarity: 'common'
  }
];

export const getRarityColor = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'common':
      return {
        text: 'text-gray-400',
        border: 'border-gray-500/30',
        bg: 'from-gray-500/10 to-gray-600/10',
        iconBg: 'bg-gray-500/20',
        badge: 'bg-gray-500/20'
      };
    case 'rare':
      return {
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        bg: 'from-blue-500/10 to-blue-600/10',
        iconBg: 'bg-blue-500/20',
        badge: 'bg-blue-500/20'
      };
    case 'epic':
      return {
        text: 'text-purple-400',
        border: 'border-purple-500/30',
        bg: 'from-purple-500/10 to-purple-600/10',
        iconBg: 'bg-purple-500/20',
        badge: 'bg-purple-500/20'
      };
    case 'legendary':
      return {
        text: 'text-yellow-400',
        border: 'border-yellow-500/30',
        bg: 'from-yellow-500/10 to-yellow-600/10',
        iconBg: 'bg-yellow-500/20',
        badge: 'bg-yellow-500/20'
      };
    default:
      return {
        text: 'text-gray-400',
        border: 'border-gray-500/30',
        bg: 'from-gray-500/10 to-gray-600/10',
        iconBg: 'bg-gray-500/20',
        badge: 'bg-gray-500/20'
      };
  }
};

export const getRarityColorString = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'common':
      return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    case 'rare':
      return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    case 'epic':
      return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
    case 'legendary':
      return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    default:
      return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
  }
};

export const getRarityGlow = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'common':
      return 'shadow-gray-500/20';
    case 'rare':
      return 'shadow-blue-500/30';
    case 'epic':
      return 'shadow-purple-500/40';
    case 'legendary':
      return 'shadow-yellow-500/50';
    default:
      return 'shadow-gray-500/20';
  }
};
