import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, Crown, User, Star, RefreshCw, ChevronUp, ChevronDown, Target } from 'lucide-react';
import { getLeaderboardByLevel, LeaderboardEntry, isSupabaseAvailable } from '../lib/supabase';
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
      
      if (!isSupabaseAvailable) {
        setLeaderboards(prev => ({ ...prev, [levelId]: [] }));
        return;
      }
      
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
    <div className="bg-black/30 dark:bg-black/30 light:bg-white/70 backdrop-blur-sm p-4 flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-purple-400 dark:text-purple-400 light:text-indigo-600" />
          <h3 className="text-white dark:text-white light:text-slate-800 font-semibold">All Levels</h3>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={refreshAllLeaderboards}
            className="text-gray-400 dark:text-gray-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 dark:text-gray-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-800 transition-colors"
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
            className="flex-1 min-h-0"
          >
            <div className="h-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              <div className="flex space-x-4 h-full min-w-max px-2">
                {levels.map(level => {
                  const isCurrentLevel = level.id === currentLevelId;
                  const levelLeaderboard = (leaderboards[level.id] || []).slice(0, 3); // Limit to top 3
                  const isLoading = loading[level.id];

                  return (
                    <motion.div
                      key={level.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-black/20 dark:bg-black/20 light:bg-white/60 backdrop-blur-sm rounded-lg border p-4 transition-all duration-200 min-w-80 h-full flex flex-col ${
                        isCurrentLevel 
                          ? 'border-purple-500/50 bg-purple-500/10 dark:bg-purple-500/10 light:bg-indigo-200/40' 
                          : 'border-white/10 dark:border-white/10 light:border-indigo-200/30 hover:border-white/20 dark:hover:border-white/20 light:hover:border-indigo-200/50'
                      }`}
                    >
                    {/* Level Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                          isCurrentLevel 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-gray-700 dark:bg-gray-700 light:bg-slate-400 text-gray-300 dark:text-gray-300 light:text-white'
                        }`}>
                          {level.id}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        level.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                        level.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {level.difficulty}
                      </div>
                    </div>

                    {/* Level Title */}
                    <div className="text-center mb-4">
                      <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-800 leading-tight">
                        {level.title}
                      </h3>
                    </div>

                    {/* Leaderboard Entries */}
                    <div className="flex-1 space-y-2">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                        </div>
                      ) : levelLeaderboard.length === 0 ? (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-500 light:text-slate-500 text-sm">
                          No scores yet
                        </div>
                      ) : (
                        levelLeaderboard.map((entry, index) => {
                          const rank = index + 1;
                          return (
                            <div
                              key={entry.id}
                              className="flex items-center justify-between py-2 px-3 bg-black/20 dark:bg-black/20 light:bg-white/50 rounded border border-white/5 dark:border-white/5 light:border-indigo-200/30"
                            >
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-black/30 dark:bg-black/30 light:bg-indigo-100/80">
                                  {getRankIcon(rank)}
                                </div>
                                <div className="flex items-center space-x-1">
                                  <User className="w-3 h-3 text-gray-400 dark:text-gray-400 light:text-slate-600" />
                                  <span className="text-white dark:text-white light:text-slate-800 text-sm truncate max-w-24">
                                    {entry.player_name}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400" />
                                <span className="text-white dark:text-white light:text-slate-800 text-sm font-medium">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
