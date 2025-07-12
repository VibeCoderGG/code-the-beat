import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, Crown, X, User, Star } from 'lucide-react';
import { getLeaderboard, LeaderboardEntry, isSupabaseAvailable } from '../lib/supabase';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ isOpen, onClose }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get local leaderboard data
  const getLocalLeaderboard = useCallback((): LeaderboardEntry[] => {
    try {
      const savedScores = localStorage.getItem('localLeaderboard');
      if (savedScores) {
        return JSON.parse(savedScores);
      }
      return [];
    } catch (error) {
      console.error('Failed to load local leaderboard:', error);
      return [];
    }
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!isSupabaseAvailable) {
        // Get local scores if Supabase isn't available
        const localScores = getLocalLeaderboard();
        setEntries(localScores);
        return;
      }
      
      const data = await getLeaderboard(20);
      setEntries(data || []);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error('Leaderboard error:', err);
    } finally {
      setLoading(false);
    }
  }, [getLocalLeaderboard]);

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen, fetchLeaderboard]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <Trophy className="w-5 h-5 text-gray-500" />;
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
        return 'bg-gray-800/50 border-gray-700';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
                <p className="text-gray-400 text-sm">Top coding rhythm masters</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isSupabaseAvailable && (
            <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm">
                Showing local scores only - online leaderboard unavailable
              </p>
            </div>
          )}

          <div className="overflow-y-auto max-h-[60vh]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-400">Loading leaderboard...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-400 mb-2">{error}</div>
                <button
                  onClick={fetchLeaderboard}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Try again
                </button>
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <div className="text-gray-400 mb-2">No scores yet!</div>
                <div className="text-gray-500 text-sm">Be the first to make it to the leaderboard</div>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry, index) => {
                  const rank = index + 1;
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-lg border ${getRankStyle(rank)} backdrop-blur-sm`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800">
                            {getRankIcon(rank)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="font-semibold text-white">{entry.player_name}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                              <span>Level {entry.level_reached}</span>
                              <span>•</span>
                              <span>{entry.challenges_completed} challenges</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-xl font-bold text-white">
                              {entry.score.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            #{rank}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="text-center text-sm text-gray-400">
              Complete challenges to earn points and climb the leaderboard!
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};