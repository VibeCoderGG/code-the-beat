import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown, User, Star, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';
import { getLeaderboardByLevel, LeaderboardEntry } from '../lib/supabase';
import { levels } from '../data/levels';

interface AllLevelsLeaderboardProps {
  currentLevelId: number;
}

export const AllLevelsLeaderboard: React.FC<AllLevelsLeaderboardProps> = ({ currentLevelId }) => {
  const [leaderboards, setLeaderboards] = useState<{ [key: number]: LeaderboardEntry[] }>({});
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Load leaderboards for all levels
    levels.forEach(level => {
      fetchLevelLeaderboard(level.id);
    });
  }, []);

  const fetchLevelLeaderboard = async (levelId: number) => {
    try {
      setLoading(prev => ({ ...prev, [levelId]: true }));
      const data = await getLeaderboardByLevel(levelId, 3);
      setLeaderboards(prev => ({ ...prev, [levelId]: data || [] }));
    } catch (error) {
      console.error(`Failed to fetch leaderboard for level ${levelId}:`, error);
      setLeaderboards(prev => ({ ...prev, [levelId]: [] }));
    } finally {
      setLoading(prev => ({ ...prev, [levelId]: false }));
    }
  };

  const refreshAllLeaderboards = () => {
    levels.forEach(level => {
      fetchLevelLeaderboard(level.id);
    });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-3 h-3 text-yellow-400" />;
      case 2:
        return <Medal className="w-3 h-3 text-gray-400" />;
      case 3:
        return <Award className="w-3 h-3 text-amber-600" />;
      default:
        return <Trophy className="w-2.5 h-2.5 text-gray-500" />;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border-yellow-500/20';
      case 2:
        return 'bg-gradient-to-r from-gray-400/10 to-gray-500/10 border-gray-400/20';
      case 3:
        return 'bg-gradient-to-r from-amber-600/10 to-amber-700/10 border-amber-600/20';
      default:
        return 'bg-gray-800/30 border-gray-700/30';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-600';
      case 'intermediate': return 'bg-yellow-600';
      case 'advanced': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  if (collapsed) {
    return (
      <div className="bg-gray-900 border-t border-gray-700 p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-white">All Levels Leaderboard</span>
          </div>
          <button
            onClick={() => setCollapsed(false)}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border-t border-gray-700 p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="text-lg font-bold text-white">All Levels Leaderboard</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshAllLeaderboards}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCollapsed(true)}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-64 overflow-y-auto">
        {levels.map(level => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: level.id * 0.1 }}
            className={`bg-gray-800 border rounded-lg p-3 ${
              level.id === currentLevelId ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700'
            }`}
          >
            {/* Level Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-white">Level {level.id}</span>
                <span className={`px-1.5 py-0.5 rounded text-xs font-medium text-white ${getDifficultyColor(level.difficulty)}`}>
                  {level.difficulty}
                </span>
              </div>
              {level.id === currentLevelId && (
                <div className="bg-blue-500 text-white px-1.5 py-0.5 rounded-full text-xs font-medium">
                  Current
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-400 mb-2 truncate">{level.title}</div>
            
            {/* Leaderboard Entries */}
            <div className="space-y-1">
              {loading[level.id] ? (
                <div className="flex items-center justify-center py-3">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-xs text-gray-400">Loading...</span>
                </div>
              ) : leaderboards[level.id]?.length === 0 ? (
                <div className="text-center py-3">
                  <div className="text-xs text-gray-500 mb-1">No scores yet!</div>
                  <div className="text-xs text-gray-600">Be the first!</div>
                </div>
              ) : (
                leaderboards[level.id]?.map((entry, index) => {
                  const rank = index + 1;
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`p-1.5 rounded border ${getRankStyle(rank)} backdrop-blur-sm`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 min-w-0 flex-1">
                          <div className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-800 flex-shrink-0">
                            {getRankIcon(rank)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-1">
                              <User className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
                              <span className="text-xs font-medium text-white truncate">
                                {entry.player_name}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center space-x-0.5">
                            <Star className="w-2.5 h-2.5 text-yellow-400" />
                            <span className="text-xs font-bold text-white">
                              {entry.score > 999 ? `${(entry.score / 1000).toFixed(1)}k` : entry.score}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            #{rank}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
            
            {leaderboards[level.id]?.length > 0 && (
              <div className="mt-2 pt-1.5 border-t border-gray-700">
                <div className="text-xs text-gray-500 text-center">
                  Top {leaderboards[level.id].length} player{leaderboards[level.id].length !== 1 ? 's' : ''}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-700">
        <div className="text-center text-xs text-gray-400">
          Complete levels to see your name on the leaderboard! 🏆
        </div>
      </div>
    </div>
  );
};