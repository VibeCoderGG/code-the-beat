import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, User, Send, X } from 'lucide-react';
import { submitScore } from '../lib/supabase';

interface ScoreSubmissionProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  levelReached: number;
  challengesCompleted: number;
  onSubmitted: () => void;
}

export const ScoreSubmission: React.FC<ScoreSubmissionProps> = ({
  isOpen,
  onClose,
  score,
  levelReached,
  challengesCompleted,
  onSubmitted
}) => {
  const [playerName, setPlayerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (playerName.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    if (playerName.trim().length > 20) {
      setError('Name must be less than 20 characters');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      await submitScore({
        player_name: playerName.trim(),
        score,
        level_reached: levelReached,
        challenges_completed: challengesCompleted
      });
      
      onSubmitted();
      onClose();
      setPlayerName('');
    } catch (err) {
      setError('Failed to submit score. Please try again.');
      console.error('Score submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
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
        className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Submit Your Score</h2>
              <p className="text-gray-400 text-sm">Join the leaderboard!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {score.toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm space-y-1">
              <div>Level {levelReached} reached</div>
              <div>{challengesCompleted} challenges completed</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                maxLength={20}
                autoFocus
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm mt-2">{error}</div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !playerName.trim()}
              className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Your score will be visible to all players on the leaderboard
        </div>
      </motion.div>
    </motion.div>
  );
};