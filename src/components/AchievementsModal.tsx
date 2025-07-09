import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Award, X, Lock, CheckCircle, Target } from 'lucide-react';
import { Achievement, PlayerProgress } from '../types/game';
import { achievementsData, getRarityColorString, getRarityGlow } from '../data/achievements';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerProgress: PlayerProgress;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  playerProgress
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All', icon: Trophy },
    { id: 'coding', label: 'Coding', icon: Award },
    { id: 'rhythm', label: 'Rhythm', icon: Star },
    { id: 'streak', label: 'Streaks', icon: CheckCircle },
    { id: 'completion', label: 'Completion', icon: Target },
    { id: 'special', label: 'Special', icon: Lock }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievementsData 
    : achievementsData.filter(achievement => achievement.category === selectedCategory);

  const unlockedAchievements = playerProgress.achievements.map(a => a.id);
  const totalUnlocked = unlockedAchievements.length;
  const totalAchievements = achievementsData.length;

  const getAchievementProgress = (achievement: Achievement): number => {
    const unlocked = unlockedAchievements.includes(achievement.id);
    if (unlocked) return 100;

    // Calculate progress based on requirement
    switch (achievement.requirement.type) {
      case 'score':
        return Math.min((playerProgress.totalScore / achievement.requirement.value) * 100, 100);
      case 'streak':
        return Math.min((playerProgress.maxStreak / achievement.requirement.value) * 100, 100);
      case 'levels_completed':
        return Math.min((playerProgress.totalLevelsCompleted / achievement.requirement.value) * 100, 100);
      case 'challenges_completed':
        return Math.min((playerProgress.totalChallengesCompleted / achievement.requirement.value) * 100, 100);
      case 'perfect_submissions':
        return Math.min((playerProgress.perfectSubmissions / achievement.requirement.value) * 100, 100);
      default:
        return 0;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[95vh] bg-black/80 dark:bg-black/80 light:bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/20 light:border-indigo-200/50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-white/10 light:border-indigo-200/30">
            <div className="flex items-center space-x-3">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <div>
                <h2 className="text-2xl font-bold text-white dark:text-white light:text-slate-800">Achievements</h2>
                <p className="text-sm text-gray-400 dark:text-gray-400 light:text-slate-600">
                  {totalUnlocked} of {totalAchievements} unlocked
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400 dark:text-gray-400 light:text-slate-600" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="p-6 border-b border-white/10 dark:border-white/10 light:border-indigo-200/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white dark:text-white light:text-slate-800">
                Overall Progress
              </span>
              <span className="text-sm text-gray-400 dark:text-gray-400 light:text-slate-600">
                {Math.round((totalUnlocked / totalAchievements) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 dark:bg-gray-700 light:bg-gray-300 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(totalUnlocked / totalAchievements) * 100}%` }}
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-1 p-6 border-b border-white/10 dark:border-white/10 light:border-indigo-200/30 overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                      : 'bg-black/20 dark:bg-black/20 light:bg-white/30 border border-white/10 dark:border-white/10 light:border-indigo-200/30 text-gray-400 dark:text-gray-400 light:text-slate-600 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>

          {/* Achievements Grid */}
          <div className="p-6 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => {
                const isUnlocked = unlockedAchievements.includes(achievement.id);
                const progress = getAchievementProgress(achievement);
                const rarityClasses = getRarityColorString(achievement.rarity);
                const rarityGlow = getRarityGlow(achievement.rarity);

                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 min-h-[180px] ${
                      isUnlocked
                        ? `${rarityClasses} ${rarityGlow} shadow-lg`
                        : 'bg-black/20 dark:bg-black/20 light:bg-white/30 border-gray-600/30 dark:border-gray-600/30 light:border-gray-300/30'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`text-3xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-2 text-lg ${
                          isUnlocked 
                            ? 'text-white dark:text-white light:text-slate-800' 
                            : 'text-gray-500 dark:text-gray-500 light:text-slate-500'
                        }`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm mb-3 leading-relaxed ${
                          isUnlocked 
                            ? 'text-gray-300 dark:text-gray-300 light:text-slate-600' 
                            : 'text-gray-600 dark:text-gray-600 light:text-slate-500'
                        }`}>
                          {achievement.description}
                        </p>
                        
                        {/* Progress Bar for Locked Achievements */}
                        {!isUnlocked && progress > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-500 dark:text-gray-500 light:text-slate-500">
                                Progress
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-500 light:text-slate-500">
                                {Math.round(progress)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 dark:bg-gray-700 light:bg-gray-300 rounded-full h-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Reward Info */}
                        <div className="flex items-center justify-between mt-4">
                          <span className={`text-sm font-medium ${
                            isUnlocked 
                              ? achievement.rarity === 'legendary' ? 'text-yellow-400' :
                                achievement.rarity === 'epic' ? 'text-purple-400' :
                                achievement.rarity === 'rare' ? 'text-blue-400' : 'text-gray-400'
                              : 'text-gray-600 dark:text-gray-600 light:text-slate-500'
                          }`}>
                            {achievement.rarity.toUpperCase()}
                          </span>
                          <span className={`text-sm font-medium ${
                            isUnlocked 
                              ? 'text-yellow-400' 
                              : 'text-gray-600 dark:text-gray-600 light:text-slate-500'
                          }`}>
                            +{achievement.reward.points} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
