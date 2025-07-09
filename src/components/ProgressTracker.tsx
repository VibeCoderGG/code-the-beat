import React from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, Award, Target } from 'lucide-react';
import { PlayerStats } from '../types/game';

interface ProgressTrackerProps {
  playerStats: PlayerStats;
  currentStreak: number;
  currentScore: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  playerStats,
  currentStreak,
  currentScore
}) => {

  const progressItems = [
    {
      icon: Target,
      label: 'Challenges',
      current: playerStats.challenges_completed,
      max: 100,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400'
    },
    {
      icon: Award,
      label: 'Levels',
      current: playerStats.levels_completed,
      max: 20,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400'
    },
    {
      icon: Zap,
      label: 'Best Streak',
      current: playerStats.max_streak,
      max: 50,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/20',
      textColor: 'text-orange-400'
    },
    {
      icon: Star,
      label: 'Perfect Runs',
      current: playerStats.perfect_submissions,
      max: 25,
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-yellow-500/20',
      textColor: 'text-yellow-400'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Current Session Stats */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 dark:bg-black/20 light:bg-white/70 backdrop-blur-sm border border-white/10 dark:border-white/10 light:border-indigo-200/50 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Star className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-400 light:text-slate-600">Current Score</p>
              <p className="text-lg font-bold text-white dark:text-white light:text-slate-800">{currentScore.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/20 dark:bg-black/20 light:bg-white/70 backdrop-blur-sm border border-white/10 dark:border-white/10 light:border-indigo-200/50 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-400 light:text-slate-600">Streak</p>
              <p className="text-lg font-bold text-white dark:text-white light:text-slate-800">{currentStreak}x</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-3">
        {progressItems.map((item, index) => {
          const progress = Math.min((item.current / item.max) * 100, 100);
          const Icon = item.icon;

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/20 dark:bg-black/20 light:bg-white/70 backdrop-blur-sm border border-white/10 dark:border-white/10 light:border-indigo-200/50 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 ${item.bgColor} rounded-lg`}>
                    <Icon className={`w-4 h-4 ${item.textColor}`} />
                  </div>
                  <span className="text-sm font-medium text-white dark:text-white light:text-slate-800">{item.label}</span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-400 light:text-slate-600">
                  {item.current}/{item.max}
                </span>
              </div>
              
              <div className="relative bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-200/50 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full relative`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Languages Used */}
      {playerStats.languages_used.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black/20 dark:bg-black/20 light:bg-white/70 backdrop-blur-sm border border-white/10 dark:border-white/10 light:border-indigo-200/50 rounded-xl p-4"
        >
          <h3 className="text-sm font-medium text-white dark:text-white light:text-slate-800 mb-3 flex items-center space-x-2">
            <Award className="w-4 h-4 text-indigo-400" />
            <span>Languages Mastered</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {playerStats.languages_used.map((language, index) => (
              <motion.span
                key={language}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="px-2 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-full text-xs font-medium text-indigo-400"
              >
                {language}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
