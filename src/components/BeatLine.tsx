import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, Crown, User, Star, RefreshCw } from 'lucide-react';
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

  useEffect(() => {
    if (currentLevel.challenges[gameState.currentChallenge]) {
      setCurrentPrompt(currentLevel.challenges[gameState.currentChallenge].prompt);
    }
  }, [currentLevel.challenges, gameState.currentChallenge]);

  useEffect(() => {
    fetchLevelLeaderboard();
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
    <div className="bg-gray-800 border-b border-gray-700 p-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Challenge Info */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                Challenge {gameState.currentChallenge + 1}
              </div>
              <div className="text-gray-400 text-xs">
                of {currentLevel.challenges.length}
              </div>
            </div>
            <div className="flex space-x-1">
              {Array.from({ length: currentLevel.challenges.length }, (_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i < gameState.currentChallenge
                      ? 'bg-green-500'
                      : i === gameState.currentChallenge
                      ? 'bg-blue-500'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
          <motion.div
            key={currentPrompt}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900 border border-gray-600 rounded-lg p-3"
          >
            <div className="text-xs text-gray-400 mb-1">Your Task:</div>
            <div className="text-sm text-white font-medium">{currentPrompt}</div>
          </motion.div>
        </div>

        {/* Level Leaderboard */}
        <div className="bg-gray-900 border border-gray-600 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-white">Level {currentLevel.id} Leaders</span>
            </div>
            <button
              onClick={fetchLevelLeaderboard}
              className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
          
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-xs text-gray-400">Loading...</span>
              </div>
            ) : leaderboardEntries.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-xs text-gray-500 mb-1">No scores yet!</div>
                <div className="text-xs text-gray-600">Be the first to complete this level</div>
              </div>
            ) : (
              leaderboardEntries.map((entry, index) => {
                const rank = index + 1;
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-2 rounded border ${getRankStyle(rank)} backdrop-blur-sm`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-800">
                          {getRankIcon(rank)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <span className="text-xs font-medium text-white truncate">
                              {entry.player_name}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {entry.challenges_completed} challenges
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs font-bold text-white">
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
              })
            )}
          </div>
          
          {leaderboardEntries.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-700">
              <div className="text-xs text-gray-500 text-center">
                Complete this level to join the leaderboard!
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Feedback */}
      <AnimatePresence>
        {gameState.showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mt-4 p-3 rounded-lg text-center font-medium ${
              gameState.feedback.includes('Perfect') || gameState.feedback.includes('Complete')
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {gameState.feedback}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};