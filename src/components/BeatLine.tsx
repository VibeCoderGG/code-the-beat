import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown, User, Star, RefreshCw, Target, Clock } from 'lucide-react';
import { GameState, Level } from '../types/game';
import { getLeaderboardByLevel, LeaderboardEntry } from '../lib/supabase';

interface BeatLineProps {
  gameState: GameState;
  currentLevel: Level;
}

export const BeatLine: React.FC<BeatLineProps> = ({ gameState, currentLevel }) => {
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Calculate points that will be awarded for solving this question
  const calculatePotentialPoints = () => {
    const basePoints = 100;
    const streakBonus = gameState.streak * 10;
    const streakMultiplier = 1 + (gameState.streak / 10);
    return Math.floor((basePoints + streakBonus) * streakMultiplier);
  };

  useEffect(() => {
    if (currentLevel.challenges[gameState.currentChallenge]) {
      setCurrentPrompt(currentLevel.challenges[gameState.currentChallenge].prompt);
    }
  }, [currentLevel.challenges, gameState.currentChallenge]);

  useEffect(() => {
    fetchLevelLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel.id]);

  const fetchLevelLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await getLeaderboardByLevel(currentLevel.id, 5);
      setLeaderboardEntries(data || []);
    } catch (error) {
      console.error('Failed to fetch level leaderboard:', error);
      setLeaderboardEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case 2:
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 3:
        return <Award className="w-4 h-4 text-amber-600" />;
      default:
        return <Trophy className="w-3 h-3 text-gray-500" />;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30';
      default:
        return 'bg-gray-800/50 border-gray-700/50';
    }
  };

  return (
    <div className="bg-black/20 dark:bg-black/20 light:bg-white/60 backdrop-blur-sm border-b border-white/10 dark:border-white/10 light:border-indigo-200/50 p-6">
      <div className="flex items-start justify-between space-x-6">
        {/* Challenge Info */}
        <div className="flex-1 max-w-3xl">
          {/* Progress Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-400" />
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Challenge {gameState.currentChallenge + 1}
                </div>
              </div>
              <div className="text-gray-400 dark:text-gray-400 light:text-slate-600 text-sm">
                of {currentLevel.challenges.length}
              </div>
            </div>
            
            {/* Progress Dots */}
            <div className="flex items-center space-x-2">
              {Array.from({ length: currentLevel.challenges.length }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i < gameState.currentChallenge
                      ? 'bg-green-500 shadow-lg shadow-green-500/50'
                      : i === gameState.currentChallenge
                      ? 'bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse'
                      : 'bg-gray-600 border border-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Challenge Card */}
          <motion.div
            key={currentPrompt}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 shadow-xl"
          >
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-2 flex-shrink-0">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-blue-300 dark:text-blue-300 light:text-indigo-600 font-medium">Your Mission:</div>
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg px-3 py-1">
                    <span className="text-green-400 text-sm font-bold">
                      +{calculatePotentialPoints()} points
                    </span>
                    {gameState.streak > 0 && (
                      <span className="text-xs text-green-300 ml-2">
                        ({(1 + (gameState.streak / 10)).toFixed(1)}x multiplier)
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-white dark:text-white light:text-slate-800 text-lg font-medium leading-relaxed">
                  {currentPrompt}
                </div>
              </div>
            </div>
            
            {/* Beat Indicator */}
            {gameState.isPlaying && (
              <div className="mt-4 pt-4 border-t border-white/10 dark:border-white/10 light:border-gray-300/20">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <div className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">Beat:</div>
                  <motion.div
                    key={gameState.beatCount}
                    initial={{ scale: 1.2, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-purple-500/20 border border-purple-500/30 rounded-lg px-3 py-1"
                  >
                    <span className="text-purple-300 dark:text-purple-300 light:text-purple-600 font-mono font-bold">
                      {gameState.beatCount}
                    </span>
                  </motion.div>
                  <div className="flex-1 h-2 bg-gray-700 dark:bg-gray-700 light:bg-gray-300 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${(gameState.beatCount % 4) * 25}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};