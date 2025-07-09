import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, Lock, CheckCircle, Target } from 'lucide-react';
import { Achievement, PlayerProgress } from '../types/game';
import { achievementsData, getRarityColorString, getRarityGlow } from '../data/achievements';

interface AchievementsContentProps {
  playerProgress: PlayerProgress;
}

export const AchievementsContent: React.FC<AchievementsContentProps> = ({
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

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-black/20 dark:bg-black/20 light:bg-white/60 backdrop-blur-sm rounded-xl border border-white/10 dark:border-white/10 light:border-indigo-200/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <div>
              <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-800">Achievements</h3>
              <p className="text-sm text-gray-400 dark:text-gray-400 light:text-slate-600">
                {totalUnlocked} of {totalAchievements} unlocked
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white dark:text-white light:text-slate-800">
            Overall Progress
          </span>
          <span className="text-sm text-gray-400 dark:text-gray-400 light:text-slate-600">
            {Math.round((totalUnlocked / totalAchievements) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 dark:bg-gray-700 light:bg-gray-300 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(totalUnlocked / totalAchievements) * 100}%` }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
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
  );
};
