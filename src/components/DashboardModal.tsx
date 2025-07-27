import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, BarChart3, Target, Star } from 'lucide-react';
import { ProgressTracker } from './ProgressTracker';
import { SkillTree } from './SkillTree';
import { AchievementsContent } from './AchievementsContent';
import { PlayerStats, PlayerProgress } from '../types/game';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerStats: PlayerStats;
  playerProgress: PlayerProgress;
  currentStreak: number;
  currentScore: number;
  onResetLevel?: () => void;
  onResetProgress?: () => void;
  currentAttempts?: number;
  unlockedLevels?: number[];
  levelCheckpoints?: { [levelId: number]: number };
}

export const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  onClose,
  playerStats,
  playerProgress,
  currentStreak,
  currentScore,
  onResetLevel,
  onResetProgress,
  currentAttempts = 0,
  unlockedLevels = [1],
  levelCheckpoints = { 1: 0 }
}) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'skills' | 'achievements'>('progress');

  const tabs = [
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'skills', label: 'Skills', icon: Target },
    { id: 'achievements', label: 'Achievements', icon: Trophy }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-gradient-to-br from-black/80 to-purple-900/20 dark:from-black/80 dark:to-purple-900/20 light:from-white/90 light:to-indigo-50/90 backdrop-blur-md border border-white/20 dark:border-white/20 light:border-indigo-200/50 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-black/20 dark:bg-black/20 light:bg-white/70 backdrop-blur-sm border-b border-white/10 dark:border-white/10 light:border-indigo-200/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl">
                  <Star className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-400 dark:to-pink-400 light:from-indigo-600 light:to-purple-600 bg-clip-text text-transparent">
                    Player Dashboard
                  </h1>
                  <p className="text-sm text-gray-400 dark:text-gray-400 light:text-slate-600">
                    Track your coding journey and achievements
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white dark:hover:text-white light:hover:text-slate-800 transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-2 mt-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'progress' | 'skills' | 'achievements')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50 text-white dark:text-white light:text-slate-800'
                        : 'bg-black/20 dark:bg-black/20 light:bg-white/50 border border-white/10 dark:border-white/10 light:border-indigo-200/30 text-gray-400 dark:text-gray-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'progress' && (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProgressTracker
                    playerStats={playerStats}
                    currentStreak={currentStreak}
                    currentScore={currentScore}
                  />
                </motion.div>
              )}

              {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <SkillTree 
                    playerStats={playerStats}
                    currentAttempts={currentAttempts}
                    totalPenalties={Math.max(0, playerStats.challenges_completed * 5 - playerStats.total_score / 100)} // Estimate penalties from stats
                    levelsUnlocked={unlockedLevels.length}
                    checkpointScore={levelCheckpoints[unlockedLevels[unlockedLevels.length - 1]] || 0}
                  />
                </motion.div>
              )}

              {activeTab === 'achievements' && (
                <motion.div
                  key="achievements"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <AchievementsContent playerProgress={playerProgress} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
