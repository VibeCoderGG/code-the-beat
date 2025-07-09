import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, Crown, User, Star, RefreshCw, ChevronUp, ChevronDown, Target } from 'lucide-react';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        return <Trophy className="w-2 h-2 text-gray-500" />;
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm border-l border-white/10 p-4 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-purple-400" />
          <h3 className="text-white font-semibold">All Levels</h3>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={refreshAllLeaderboards}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Collapsible Content */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex-1 overflow-hidden"
          >
            <div className="h-full overflow-y-auto space-y-3">
              {levels.map(level => {
                const isCurrentLevel = level.id === currentLevelId;
                const levelLeaderboard = leaderboards[level.id] || [];
                const isLoading = loading[level.id];

                return (
                  <motion.div
                    key={level.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`bg-black/20 backdrop-blur-sm rounded-lg border p-3 transition-all duration-200 ${
                      isCurrentLevel 
                        ? 'border-purple-500/50 bg-purple-500/10' 
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Level Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCurrentLevel 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-gray-700 text-gray-300'
                        }`}>
                          {level.id}
                        </div>
                        <div className="text-sm font-medium text-white">{level.title}</div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        level.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                        level.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {level.difficulty}
                      </div>
                    </div>

                    {/* Leaderboard Entries */}
                    <div className="space-y-1">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                        </div>
                      ) : levelLeaderboard.length === 0 ? (
                        <div className="text-center py-2 text-gray-500 text-xs">
                          No scores yet
                        </div>
                      ) : (
                        levelLeaderboard.map((entry, index) => {
                          const rank = index + 1;
                          return (
                            <div
                              key={entry.id}
                              className="flex items-center justify-between py-1 px-2 bg-black/20 rounded border border-white/5"
                            >
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-black/30">
                                  {getRankIcon(rank)}
                                </div>
                                <div className="flex items-center space-x-1">
                                  <User className="w-2 h-2 text-gray-400" />
                                  <span className="text-white text-xs truncate max-w-20">
                                    {entry.player_name}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="w-2 h-2 text-yellow-400" />
                                <span className="text-white text-xs font-medium">
                                  {entry.score.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
