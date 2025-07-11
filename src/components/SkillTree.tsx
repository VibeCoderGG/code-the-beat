import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Zap, Target, Award, Lock, CheckCircle, Star, Undo, Shield, TrendingUp, Brain, RotateCcw } from 'lucide-react';
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
  // Optional props for reset functionality
  onResetLevel?: () => void;
  onResetProgress?: () => void;
  currentAttempts?: number;
  totalPenalties?: number;
  levelsUnlocked?: number;
  checkpointScore?: number;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ 
  playerStats,
  onResetLevel,
  onResetProgress,
  currentAttempts = 0,
  totalPenalties = 0,
  levelsUnlocked = 1,
  checkpointScore = 0
}) => {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

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
      position: { x: 1, y: 0 },
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
      position: { x: 0, y: 1 },
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
      position: { x: 2, y: 1 },
      prerequisites: ['basics'],
      requiredChallenges: 15,
      requiredScore: 1500,
      unlocked: playerStats.challenges_completed >= 15 && playerStats.challenges_completed >= 5,
      mastered: playerStats.perfect_submissions >= 10
    },
    {
      id: 'checkpoint_master',
      name: 'Checkpoint Master',
      description: 'Efficiently use checkpoint system for strategic learning',
      icon: Undo,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20 border-orange-500/30',
      position: { x: 0, y: 2 },
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
      position: { x: 2, y: 2 },
      prerequisites: ['accuracy'],
      requiredChallenges: 20,
      requiredScore: 2000,
      unlocked: playerStats.challenges_completed >= 20 && totalPenalties >= 100, // Must have experienced penalties
      mastered: penaltyResilience >= 5 && playerStats.total_score >= 5000,
      penaltyRelated: true
    },
    {
      id: 'progression_unlock',
      name: 'Level Progression',
      description: 'Unlock levels by completing previous challenges',
      icon: Lock,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/20 border-violet-500/30',
      position: { x: 1, y: 1.5 },
      prerequisites: ['basics'],
      requiredChallenges: 10,
      requiredScore: 1000,
      unlocked: levelsUnlocked >= 2,
      mastered: levelsUnlocked >= 4,
      progressionRelated: true
    },
    {
      id: 'rhythm_master',
      name: 'Rhythm Master',
      description: 'Perfect synchronization with the beat',
      icon: Star,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20 border-purple-500/30',
      position: { x: 1, y: 2 },
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
      position: { x: 0, y: 3 },
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
      position: { x: 2, y: 3 },
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
      position: { x: 1, y: 3.5 },
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
      position: { x: 1, y: 4 },
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

  const renderConnection = (from: SkillNode, to: SkillNode) => {
    // Calculate positions based on a centered grid
    const containerWidth = 500; // Fixed container width
    const containerHeight = 500; // Fixed container height
    
    // Create a centered grid where (1,2) is the center
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const gridSpacing = 100;
    
    const fromX = centerX + (from.position.x - 1) * gridSpacing;
    const fromY = centerY + (from.position.y - 2) * gridSpacing; // Offset to center vertically
    const toX = centerX + (to.position.x - 1) * gridSpacing;
    const toY = centerY + (to.position.y - 2) * gridSpacing;

    const isUnlocked = to.unlocked;
    
    return (
      <svg
        key={`${from.id}-${to.id}`}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <line
          x1={fromX}
          y1={fromY}
          x2={toX}
          y2={toY}
          stroke={isUnlocked ? '#6366f1' : '#374151'}
          strokeWidth="2"
          strokeDasharray={isUnlocked ? '0' : '5,5'}
          className="transition-all duration-300"
        />
      </svg>
    );
  };

  return (
    <div className="bg-black/20 dark:bg-black/20 light:bg-white/70 backdrop-blur-sm border border-white/10 dark:border-white/10 light:border-indigo-200/50 rounded-xl p-6">
      <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-800 mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-purple-400" />
          <span>Skill Tree</span>
          <div className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full border border-orange-500/30">
            Checkpoint System
          </div>
        </div>
        
        {/* Reset Control Panel */}
        <div className="flex items-center space-x-2">
          {onResetLevel && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onResetLevel}
              className="flex items-center space-x-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-400 px-3 py-1 rounded-lg text-xs transition-all duration-200"
              title="Reset to current level checkpoint"
            >
              <Undo className="w-3 h-3" />
              <span>Reset Level</span>
            </motion.button>
          )}
          {onResetProgress && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const confirmReset = window.confirm(
                  "Reset all progress? This will:\n• Reset score to 0\n• Lock all levels except Level 1\n• Clear achievements\n• Reset statistics"
                );
                if (confirmReset && onResetProgress) {
                  onResetProgress();
                }
              }}
              className="flex items-center space-x-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 px-3 py-1 rounded-lg text-xs transition-all duration-200"
              title="Complete progress reset"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </motion.button>
          )}
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

      <div className="relative bg-black/10 dark:bg-black/10 light:bg-white/30 rounded-xl p-4 h-[550px] flex items-center justify-center overflow-hidden">
        {/* Skill Tree Container */}
        <div className="relative w-[500px] h-[500px]">

        {/* Connections */}
        <div className="absolute inset-0">
          {skillNodes.map(node => 
            node.prerequisites.map(prereqId => {
              const prereqNode = skillNodes.find(n => n.id === prereqId);
              return prereqNode ? renderConnection(prereqNode, node) : null;
            })
          )}
        </div>

        {/* Skill Nodes */}
        <div className="absolute inset-0">
          {skillNodes.map(node => {
            const Icon = node.icon;
            const state = getNodeState(node);
            const nodeSize = 80;
            
            // Calculate position using the same centered grid system
            const containerWidth = 500;
            const containerHeight = 500;
            const centerX = containerWidth / 2;
            const centerY = containerHeight / 2;
            const gridSpacing = 100;
            
            const nodeX = centerX + (node.position.x - 1) * gridSpacing - (nodeSize / 2);
            const nodeY = centerY + (node.position.y - 2) * gridSpacing - (nodeSize / 2);

            return (
              <motion.div
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * node.position.y }}
                className={`absolute rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${getNodeStyles(node)}`}
                style={{
                  width: `${nodeSize}px`,
                  height: `${nodeSize}px`,
                  left: `${nodeX}px`,
                  top: `${nodeY}px`
                }}
                onClick={() => setSelectedNode(node)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center justify-center w-full h-full">
                  <Icon className="w-8 h-8" />
                </div>
                {state === 'mastered' && (
                  <CheckCircle className="absolute -top-2 -right-2 w-6 h-6 text-green-400 bg-black rounded-full" />
                )}
                {state === 'locked' && (
                  <Lock className="absolute -top-2 -right-2 w-6 h-6 text-gray-500 bg-black rounded-full" />
                )}
              </motion.div>
            );
          })}
        </div>
        </div>
      </div>

      {/* Node Details */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-black/30 dark:bg-black/30 light:bg-white/50 backdrop-blur-sm border border-white/10 dark:border-white/10 light:border-indigo-200/50 rounded-xl p-4"
        >
          <h3 className="font-bold text-white dark:text-white light:text-slate-800 mb-2">{selectedNode.name}</h3>
          <p className="text-sm text-gray-300 dark:text-gray-300 light:text-slate-600 mb-3">{selectedNode.description}</p>
          
          {/* Enhanced descriptions for checkpoint-related skills */}
          {selectedNode.id === 'checkpoint_master' && (
            <div className="mb-3 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <p className="text-xs text-orange-300">
                💡 Master the checkpoint system: Use "Reset Level" strategically to practice challenges without losing all progress. 
                Checkpoints save your score at the start of each level!
              </p>
            </div>
          )}
          
          {selectedNode.id === 'penalty_resilience' && (
            <div className="mb-3 p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
              <p className="text-xs text-cyan-300">
                🛡️ Learn from mistakes: Penalties increase progressively (10→15→20... max 50 points), but they help you learn. 
                Build resilience and maintain high scores despite setbacks!
              </p>
            </div>
          )}
          
          {selectedNode.id === 'adaptive_learner' && (
            <div className="mb-3 p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
              <p className="text-xs text-indigo-300">
                🧠 Smart learning: Use hints effectively, analyze your mistakes, and adapt your coding approach. 
                The best programmers learn from every attempt!
              </p>
            </div>
          )}
          
          {selectedNode.id === 'score_optimizer' && (
            <div className="mb-3 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <p className="text-xs text-emerald-300">
                📈 Strategic play: Balance speed and accuracy, maintain streaks, and know when to use checkpoint resets. 
                Optimize your score through smart decision-making!
              </p>
            </div>
          )}
          
          {selectedNode.id === 'progression_unlock' && (
            <div className="mb-3 p-2 bg-violet-500/10 border border-violet-500/20 rounded-lg">
              <p className="text-xs text-violet-300">
                🔒 <strong>Level Progression:</strong> Complete all challenges in a level to unlock the next. 
                Only the first level is unlocked by default. Progress through levels sequentially!
              </p>
            </div>
          )}
          
          {selectedNode.id === 'reset_strategist' && (
            <div className="mb-3 p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
              <p className="text-xs text-rose-300">
                🔄 <strong>Reset Strategy:</strong> Know when to use "Reset Level" (checkpoint) vs "Reset All" (complete reset). 
                Strategic resets can save time and reduce frustration!
              </p>
            </div>
          )}
          
          {/* Reset and penalty system tips */}
          {selectedNode.resetRelated && !selectedNode.id.includes('score_optimizer') && !selectedNode.id.includes('reset_strategist') && (
            <div className="mb-3 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <p className="text-xs text-orange-300">
                ♻️ <strong>Reset System:</strong> Use "Reset Level" for minor issues, "Reset All" for major setbacks. 
                Master the art of strategic recovery!
              </p>
            </div>
          )}
          
          {selectedNode.penaltyRelated && !selectedNode.id.includes('penalty_resilience') && (
            <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-xs text-red-300">
                ⚠️ <strong>Penalty System:</strong> Track penalty accumulation. Progressive penalties help learning but affect scores. 
                Build resilience and learn from mistakes!
              </p>
            </div>
          )}
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400 dark:text-gray-400 light:text-slate-600">Challenges:</span>
              <span className={`${playerStats.challenges_completed >= selectedNode.requiredChallenges ? 'text-green-400' : 'text-red-400'}`}>
                {playerStats.challenges_completed}/{selectedNode.requiredChallenges}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 dark:text-gray-400 light:text-slate-600">Score:</span>
              <span className={`${playerStats.total_score >= selectedNode.requiredScore ? 'text-green-400' : 'text-red-400'}`}>
                {playerStats.total_score.toLocaleString()}/{selectedNode.requiredScore.toLocaleString()}
              </span>
            </div>
            
            {/* Enhanced metrics for system-related skills */}
            {(selectedNode.resetRelated || selectedNode.penaltyRelated || selectedNode.progressionRelated) && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400 dark:text-gray-400 light:text-slate-600">Levels Completed:</span>
                  <span className="text-blue-400">{playerStats.levels_completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 dark:text-gray-400 light:text-slate-600">Max Streak:</span>
                  <span className="text-purple-400">{playerStats.max_streak}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 dark:text-gray-400 light:text-slate-600">Perfect Submissions:</span>
                  <span className="text-green-400">{playerStats.perfect_submissions}</span>
                </div>
              </>
            )}
            
            {selectedNode.penaltyRelated && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400 dark:text-gray-400 light:text-slate-600">Total Penalties:</span>
                  <span className="text-red-400">{totalPenalties}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 dark:text-gray-400 light:text-slate-600">Penalty Resilience:</span>
                  <span className="text-cyan-400">{penaltyResilience.toFixed(1)}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 dark:text-gray-400 light:text-slate-600">Current Attempts:</span>
                  <span className="text-orange-400">{currentAttempts}</span>
                </div>
              </>
            )}
            
            {selectedNode.resetRelated && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400 dark:text-gray-400 light:text-slate-600">Checkpoint Efficiency:</span>
                  <span className="text-orange-400">{(checkpointEfficiency * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 dark:text-gray-400 light:text-slate-600">Current Checkpoint:</span>
                  <span className="text-blue-400">{checkpointScore.toLocaleString()}</span>
                </div>
              </>
            )}
            
            {selectedNode.progressionRelated && (
              <div className="flex justify-between">
                <span className="text-gray-400 dark:text-gray-400 light:text-slate-600">Levels Unlocked:</span>
                <span className="text-violet-400">{levelsUnlocked}</span>
              </div>
            )}
            
            <div className="text-center mt-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${ 
                getNodeState(selectedNode) === 'mastered' ? 'bg-green-500/20 text-green-400' :
                getNodeState(selectedNode) === 'unlocked' ? 'bg-blue-500/20 text-blue-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {getNodeState(selectedNode).toUpperCase()}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
