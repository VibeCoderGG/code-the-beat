import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import { Achievement } from '../types/game';
import { getRarityColor } from '../data/achievements';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({ 
  achievement, 
  onClose 
}) => {
  // Auto-close after 1 second
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(() => {
        onClose();
      }, 1000); // 1 second

      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const rarityColor = getRarityColor(achievement.rarity);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -100, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -100, scale: 0.8 }}
        className="fixed top-20 left-4 z-50 max-w-sm"
      >
        <div className={`bg-gradient-to-r ${rarityColor.bg} backdrop-blur-md border ${rarityColor.border} rounded-xl p-4 shadow-2xl`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${rarityColor.iconBg}`}>
                <Trophy className={`w-6 h-6 ${rarityColor.text}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-white">Achievement Unlocked!</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${rarityColor.badge} ${rarityColor.text} font-medium`}>
                    {achievement.rarity}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <p className="font-semibold text-white">{achievement.title}</p>
                    <p className="text-sm text-gray-200">{achievement.description}</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-300">
                  +{Math.floor(achievement.reward.points / 2)} points
                  {achievement.reward.title && (
                    <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                      {achievement.reward.title}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
