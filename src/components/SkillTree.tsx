import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Zap, Target, Award, Lock, CheckCircle, Star, Undo, Shield, TrendingUp, Brain, RotateCcw, ChevronDown } from 'lucide-react';
import { PlayerStats } from '../types/game';

interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  position: { x: number; y: number };
  prerequisites: string[];
  requiredChallenges: number;
  requiredScore: number;
  unlocked: boolean;
  mastered: boolean;
  // New fields for penalty system and reset features
  penaltyRelated?: boolean;
  resetRelated?: boolean;
  progressionRelated?: boolean;
}

interface SkillTreeProps {
  playerStats: PlayerStats;
  currentAttempts?: number;
  totalPenalties?: number;
  levelsUnlocked?: number;
  checkpointScore?: number;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ 
  playerStats,
  currentAttempts = 0,
  totalPenalties = 0,
  levelsUnlocked = 1,
  checkpointScore = 0
}) => {
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  const toggleSkillDropdown = (skillId: string) => {
    setExpandedSkill(expandedSkill === skillId ? null : skillId);
  };

  // Calculate penalty resilience based on score recovery after penalties
  const penaltyResilience = totalPenalties > 0 ? Math.min(playerStats.total_score / (totalPenalties * 10), 10) : 0;
  
  // Calculate checkpoint usage effectiveness
  const checkpointEfficiency = levelsUnlocked > 1 ? playerStats.levels_completed / levelsUnlocked : 0;

  const skillNodes: SkillNode[] = [
    {
      id: 'basics',
      name: 'Coding Basics',
      description: 'Master the fundamentals of programming',
      icon: Code2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20 border-blue-500/30',
      position: { x: 2, y: 0 },
      prerequisites: [],
      requiredChallenges: 5,
      requiredScore: 500,
      unlocked: playerStats.challenges_completed >= 5,
      mastered: playerStats.challenges_completed >= 15,
      progressionRelated: true
    },
    {
      id: 'speed',
      name: 'Speed Coding',
      description: 'Code faster with rhythm and flow',
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20 border-yellow-500/30',
      position: { x: 1, y: 1 },
      prerequisites: ['basics'],
      requiredChallenges: 15,
      requiredScore: 1500,
      unlocked: playerStats.challenges_completed >= 15 && playerStats.challenges_completed >= 5,
      mastered: playerStats.max_streak >= 10
    },
    {
      id: 'accuracy',
      name: 'Perfect Accuracy',
      description: 'Write code without any syntax errors',
      icon: Target,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20 border-green-500/30',
      position: { x: 3, y: 1 },
      prerequisites: ['basics'],
      requiredChallenges: 15,
      requiredScore: 1500,
      unlocked: playerStats.challenges_completed >= 15 && playerStats.challenges_completed >= 5,
      mastered: playerStats.perfect_submissions >= 10
    },
    {
      id: 'progression_unlock',
      name: 'Level Progression',
      description: 'Unlock levels by completing previous challenges',
      icon: Lock,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/20 border-violet-500/30',
      position: { x: 2, y: 1.5 },
      prerequisites: ['basics'],
      requiredChallenges: 10,
      requiredScore: 1000,
      unlocked: levelsUnlocked >= 2,
      mastered: levelsUnlocked >= 4,
      progressionRelated: true
    },
    {
      id: 'checkpoint_master',
      name: 'Checkpoint Master',
      description: 'Efficiently use checkpoint system for strategic learning',
      icon: Undo,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20 border-orange-500/30',
      position: { x: 0.5, y: 2 },
      prerequisites: ['speed'],
      requiredChallenges: 20,
      requiredScore: 2000,
      unlocked: playerStats.challenges_completed >= 20 && levelsUnlocked >= 2,
      mastered: playerStats.levels_completed >= 3 && checkpointEfficiency >= 0.7,
      resetRelated: true,
      progressionRelated: true
    },
    {
      id: 'penalty_resilience',
      name: 'Penalty Resilience',
      description: 'Overcome progressive penalties and learn from mistakes',
      icon: Shield,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20 border-cyan-500/30',
      position: { x: 3.5, y: 2 },
      prerequisites: ['accuracy'],
      requiredChallenges: 20,
      requiredScore: 2000,
      unlocked: playerStats.challenges_completed >= 20 && totalPenalties >= 100, // Must have experienced penalties
      mastered: penaltyResilience >= 5 && playerStats.total_score >= 5000,
      penaltyRelated: true
    },
    {
      id: 'rhythm_master',
      name: 'Rhythm Master',
      description: 'Perfect synchronization with the beat',
      icon: Star,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20 border-purple-500/30',
      position: { x: 2, y: 2.5 },
      prerequisites: ['checkpoint_master', 'penalty_resilience', 'progression_unlock'],
      requiredChallenges: 25,
      requiredScore: 3000,
      unlocked: playerStats.challenges_completed >= 25 && playerStats.max_streak >= 10 && totalPenalties >= 50,
      mastered: playerStats.max_streak >= 20
    },
    {
      id: 'adaptive_learner',
      name: 'Adaptive Learner',
      description: 'Master the art of learning from mistakes and penalties',
      icon: Brain,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20 border-indigo-500/30',
      position: { x: 1, y: 3 },
      prerequisites: ['checkpoint_master'],
      requiredChallenges: 30,
      requiredScore: 4000,
      unlocked: playerStats.challenges_completed >= 30 && totalPenalties >= 200,
      mastered: playerStats.levels_completed >= 5 && penaltyResilience >= 8,
      penaltyRelated: true,
      resetRelated: true
    },
    {
      id: 'reset_strategist',
      name: 'Reset Strategist',
      description: 'Know when to reset level vs. complete progress reset',
      icon: RotateCcw,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/20 border-rose-500/30',
      position: { x: 3, y: 3 },
      prerequisites: ['penalty_resilience'],
      requiredChallenges: 30,
      requiredScore: 4000,
      unlocked: playerStats.challenges_completed >= 30 && levelsUnlocked >= 3,
      mastered: playerStats.total_score >= 8000 && checkpointEfficiency >= 0.8,
      resetRelated: true
    },
    {
      id: 'score_optimizer',
      name: 'Score Optimizer',
      description: 'Maximize points through strategic play and smart resets',
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20 border-emerald-500/30',
      position: { x: 2, y: 3.5 },
      prerequisites: ['adaptive_learner', 'reset_strategist'],
      requiredChallenges: 40,
      requiredScore: 6000,
      unlocked: playerStats.challenges_completed >= 40 && playerStats.total_score >= 6000,
      mastered: playerStats.total_score >= 12000 && penaltyResilience >= 10,
      penaltyRelated: true,
      resetRelated: true
    },
    {
      id: 'grandmaster',
      name: 'Code Grandmaster',
      description: 'The ultimate coding achievement with mastery of all systems',
      icon: Award,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20 border-amber-500/30',
      position: { x: 2, y: 4 },
      prerequisites: ['rhythm_master', 'score_optimizer'],
      requiredChallenges: 50,
      requiredScore: 10000,
      unlocked: playerStats.challenges_completed >= 50 && playerStats.total_score >= 10000,
      mastered: playerStats.levels_completed >= 10 && levelsUnlocked >= 8,
      progressionRelated: true,
      penaltyRelated: true,
      resetRelated: true
    }
  ];

  const getNodeState = (node: SkillNode) => {
    if (node.mastered) return 'mastered';
    if (node.unlocked) return 'unlocked';
    return 'locked';
  };

  const getNodeStyles = (node: SkillNode) => {
    const state = getNodeState(node);
    
    switch (state) {
      case 'mastered':
        return `${node.bgColor} ${node.color} border-2 shadow-lg scale-110`;
      case 'unlocked':
        return `${node.bgColor} ${node.color} border opacity-80 hover:opacity-100`;
      case 'locked':
        return 'bg-gray-500/10 text-gray-600 border-gray-600/30 opacity-50';
    }
  };

  return (
    <div className="bg-black/20 dark:bg-black/20 light:bg-white/70 backdrop-blur-sm border border-white/10 dark:border-white/10 light:border-indigo-200/50 rounded-xl p-6">
      <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-800 mb-6 text-center">
        <div className="flex items-center justify-center space-x-2">
          <Award className="w-5 h-5 text-purple-400" />
          <span>Skill Tree</span>
          <div className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full border border-orange-500/30">
            Checkpoint System
          </div>
        </div>
      </h2>

      {/* System Status Indicators */}
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2">
          <div className="text-blue-400 font-medium">Levels Unlocked</div>
          <div className="text-white">{levelsUnlocked}</div>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2">
          <div className="text-orange-400 font-medium">Checkpoint Score</div>
          <div className="text-white">{checkpointScore.toLocaleString()}</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2">
          <div className="text-red-400 font-medium">Current Attempts</div>
          <div className="text-white">{currentAttempts}</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-2">
          <div className="text-cyan-400 font-medium">Total Penalties</div>
          <div className="text-white">{totalPenalties}</div>
        </div>
      </div>

      <div className="relative bg-black/10 dark:bg-black/10 light:bg-white/30 rounded-xl p-4">
        {/* Unified View - Vertical List for Both Mobile and Desktop */}
        <div className="space-y-3">
          {skillNodes.map(node => {
            const Icon = node.icon;
            const state = getNodeState(node);
            const isExpanded = expandedSkill === node.id;
            
            return (
              <div key={node.id} className="bg-black/20 rounded-lg border border-white/10">
                {/* Skill Header */}
                <motion.div
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${getNodeStyles(node)}`}
                  onClick={() => toggleSkillDropdown(node.id)}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                        {state === 'mastered' && (
                          <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 text-green-400 bg-black rounded-full" />
                        )}
                        {state === 'locked' && (
                          <Lock className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 text-gray-500 bg-black rounded-full" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-base sm:text-lg">{node.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          state === 'mastered' ? 'bg-green-500/20 text-green-400' :
                          state === 'unlocked' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {state.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-6 h-6" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Skill Dropdown Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-white/10 bg-black/10">
                        <p className="text-sm sm:text-base text-gray-300 mb-4">{node.description}</p>
                        
                        {/* Enhanced descriptions for specific skills */}
                        {node.id === 'checkpoint_master' && (
                          <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                            <p className="text-xs sm:text-sm text-orange-300">
                              💡 Master the checkpoint system: Use "Reset Level" strategically to practice challenges without losing all progress. 
                              Checkpoints save your score at the start of each level!
                            </p>
                          </div>
                        )}
                        
                        {node.id === 'penalty_resilience' && (
                          <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                            <p className="text-xs sm:text-sm text-cyan-300">
                              🛡️ Learn from mistakes: Penalties increase progressively (10→15→20... max 50 points), but they help you learn. 
                              Build resilience and maintain high scores despite setbacks!
                            </p>
                          </div>
                        )}
                        
                        {node.id === 'adaptive_learner' && (
                          <div className="mb-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                            <p className="text-xs sm:text-sm text-indigo-300">
                              🧠 Smart learning: Use hints effectively, analyze your mistakes, and adapt your coding approach. 
                              The best programmers learn from every attempt!
                            </p>
                          </div>
                        )}
                        
                        {node.id === 'score_optimizer' && (
                          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                            <p className="text-xs sm:text-sm text-emerald-300">
                              📈 Strategic play: Balance speed and accuracy, maintain streaks, and know when to use checkpoint resets. 
                              Optimize your score through smart decision-making!
                            </p>
                          </div>
                        )}
                        
                        {node.id === 'progression_unlock' && (
                          <div className="mb-4 p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                            <p className="text-xs sm:text-sm text-violet-300">
                              🔒 <strong>Level Progression:</strong> Complete all challenges in a level to unlock the next. 
                              Only the first level is unlocked by default. Progress through levels sequentially!
                            </p>
                          </div>
                        )}
                        
                        {node.id === 'reset_strategist' && (
                          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                            <p className="text-xs sm:text-sm text-rose-300">
                              🔄 <strong>Reset Strategy:</strong> Know when to use "Reset Level" (checkpoint) vs "Reset All" (complete reset). 
                              Strategic resets can save time and reduce frustration!
                            </p>
                          </div>
                        )}
                        
                        {/* Reset and penalty system tips */}
                        {node.resetRelated && !node.id.includes('score_optimizer') && !node.id.includes('reset_strategist') && (
                          <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                            <p className="text-xs sm:text-sm text-orange-300">
                              ♻️ <strong>Reset System:</strong> Use "Reset Level" for minor issues, "Reset All" for major setbacks. 
                              Master the art of strategic recovery!
                            </p>
                          </div>
                        )}
                        
                        {node.penaltyRelated && !node.id.includes('penalty_resilience') && (
                          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-xs sm:text-sm text-red-300">
                              ⚠️ <strong>Penalty System:</strong> Track penalty accumulation. Progressive penalties help learning but affect scores. 
                              Build resilience and learn from mistakes!
                            </p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Challenges:</span>
                            <span className={`${playerStats.challenges_completed >= node.requiredChallenges ? 'text-green-400' : 'text-red-400'}`}>
                              {playerStats.challenges_completed}/{node.requiredChallenges}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Score:</span>
                            <span className={`${playerStats.total_score >= node.requiredScore ? 'text-green-400' : 'text-red-400'}`}>
                              {playerStats.total_score.toLocaleString()}/{node.requiredScore.toLocaleString()}
                            </span>
                          </div>
                          
                          {/* Enhanced metrics for system-related skills */}
                          {(node.resetRelated || node.penaltyRelated || node.progressionRelated) && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Levels Completed:</span>
                                <span className="text-blue-400">{playerStats.levels_completed}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Max Streak:</span>
                                <span className="text-purple-400">{playerStats.max_streak}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Perfect Submissions:</span>
                                <span className="text-green-400">{playerStats.perfect_submissions}</span>
                              </div>
                            </>
                          )}
                          
                          {node.penaltyRelated && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Total Penalties:</span>
                                <span className="text-red-400">{totalPenalties}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Penalty Resilience:</span>
                                <span className="text-cyan-400">{penaltyResilience.toFixed(1)}/10</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Current Attempts:</span>
                                <span className="text-orange-400">{currentAttempts}</span>
                              </div>
                            </>
                          )}
                          
                          {node.resetRelated && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Checkpoint Efficiency:</span>
                                <span className="text-orange-400">{(checkpointEfficiency * 100).toFixed(0)}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Current Checkpoint:</span>
                                <span className="text-blue-400">{checkpointScore.toLocaleString()}</span>
                              </div>
                            </>
                          )}
                          
                          {node.progressionRelated && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Levels Unlocked:</span>
                              <span className="text-violet-400">{levelsUnlocked}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
