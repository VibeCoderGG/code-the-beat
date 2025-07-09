import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Zap, Target, Award, Lock, CheckCircle, Star } from 'lucide-react';
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
}

interface SkillTreeProps {
  playerStats: PlayerStats;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ playerStats }) => {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  const skillNodes: SkillNode[] = [
    {
      id: 'basics',
      name: 'Coding Basics',
      description: 'Master the fundamentals of programming',
      icon: Code2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20 border-blue-500/30',
      position: { x: 1, y: 0 }, // Center top
      prerequisites: [],
      requiredChallenges: 5,
      requiredScore: 500,
      unlocked: playerStats.challenges_completed >= 5,
      mastered: playerStats.challenges_completed >= 15
    },
    {
      id: 'speed',
      name: 'Speed Coding',
      description: 'Code faster with rhythm and flow',
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20 border-yellow-500/30',
      position: { x: 0, y: 1 }, // Left middle
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
      position: { x: 2, y: 1 }, // Right middle
      prerequisites: ['basics'],
      requiredChallenges: 15,
      requiredScore: 1500,
      unlocked: playerStats.challenges_completed >= 15 && playerStats.challenges_completed >= 5,
      mastered: playerStats.perfect_submissions >= 10
    },
    {
      id: 'rhythm_master',
      name: 'Rhythm Master',
      description: 'Perfect synchronization with the beat',
      icon: Star,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20 border-purple-500/30',
      position: { x: 1, y: 2 }, // Center bottom middle
      prerequisites: ['speed', 'accuracy'],
      requiredChallenges: 25,
      requiredScore: 3000,
      unlocked: playerStats.challenges_completed >= 25 && playerStats.max_streak >= 10 && playerStats.perfect_submissions >= 10,
      mastered: playerStats.max_streak >= 20
    },
    {
      id: 'grandmaster',
      name: 'Code Grandmaster',
      description: 'The ultimate coding achievement',
      icon: Award,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20 border-amber-500/30',
      position: { x: 1, y: 3 }, // Center bottom
      prerequisites: ['rhythm_master'],
      requiredChallenges: 50,
      requiredScore: 10000,
      unlocked: playerStats.challenges_completed >= 50 && playerStats.total_score >= 10000,
      mastered: playerStats.levels_completed >= 10
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
    const containerHeight = 400; // Fixed container height
    
    // Create a centered grid where (1,1) is the center
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const gridSpacing = 120;
    
    const fromX = centerX + (from.position.x - 1) * gridSpacing;
    const fromY = centerY + (from.position.y - 1.5) * gridSpacing; // Offset to center vertically
    const toX = centerX + (to.position.x - 1) * gridSpacing;
    const toY = centerY + (to.position.y - 1.5) * gridSpacing;

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
      <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-800 mb-6 flex items-center space-x-2">
        <Award className="w-5 h-5 text-purple-400" />
        <span>Skill Tree</span>
      </h2>

      <div className="relative bg-black/10 dark:bg-black/10 light:bg-white/30 rounded-xl p-4 h-[450px] flex items-center justify-center overflow-hidden">
        {/* Skill Tree Container */}
        <div className="relative w-[500px] h-[400px]">

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
            const containerHeight = 400;
            const centerX = containerWidth / 2;
            const centerY = containerHeight / 2;
            const gridSpacing = 120;
            
            const nodeX = centerX + (node.position.x - 1) * gridSpacing - (nodeSize / 2);
            const nodeY = centerY + (node.position.y - 1.5) * gridSpacing - (nodeSize / 2);

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
