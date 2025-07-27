import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Lightbulb, Code, Terminal, CheckCircle, XCircle, SkipForward } from 'lucide-react';
import { GameState, Level, Challenge } from '../types/game';
import { AIHints } from './AIHints';

interface CodeInputProps {
  gameState: GameState;
  currentLevel: Level;
  selectedLanguage: string;
  onSubmitCode: (code: string) => void;
  onUpdateCode: (code: string) => void;
  onSkipQuestion?: () => void;
  getCurrentChallenge?: () => Challenge | null;
}

export const CodeInput: React.FC<CodeInputProps> = ({
  gameState,
  currentLevel,
  selectedLanguage,
  onSubmitCode,
  onUpdateCode,
  onSkipQuestion,
  getCurrentChallenge
}) => {
  const [showHint, setShowHint] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(1);
  
  // Get current challenge using randomized order if available
  const currentChallenge = getCurrentChallenge 
    ? getCurrentChallenge() 
    : currentLevel.challenges[gameState.currentChallenge];

  useEffect(() => {
    onUpdateCode('');
  }, [gameState.currentChallenge, onUpdateCode]);

  useEffect(() => {
    const lines = gameState.userCode.split('\n').length;
    setLineNumbers(lines);
  }, [gameState.userCode]);

  // Add safety check for challenge after hooks
  if (!currentChallenge) {
    return (
      <div className="flex-1 bg-black/20 dark:bg-black/20 light:bg-white/60 backdrop-blur-sm p-6 min-h-0 flex flex-col">
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white dark:text-white light:text-slate-800">
            <p className="text-lg font-semibold mb-2">Loading challenge...</p>
            <p className="text-sm text-gray-400">Please wait while we load the next challenge.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (gameState.userCode.trim()) {
      onSubmitCode(gameState.userCode);
    }
  };

  const getFileExtension = () => {
    const extensions: { [key: string]: string } = {
      javascript: 'js', python: 'py', java: 'java', html: 'html', 
      css: 'css', typescript: 'ts', cpp: 'cpp'
    };
    return extensions[selectedLanguage] || selectedLanguage;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 bg-black/20 dark:bg-black/20 light:bg-white/60 backdrop-blur-sm p-6 min-h-0 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-purple-400 dark:text-purple-400 light:text-indigo-600" />
            <h3 className="text-lg font-semibold text-white dark:text-white light:text-slate-800">Code Editor</h3>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400 dark:text-gray-400 light:text-slate-600">
            <Code className="w-4 h-4" />
            <span>main.{getFileExtension()}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHint(!showHint)}
            className={`hint-button flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
              showHint 
                ? 'bg-yellow-500/30 border border-yellow-500/50 text-yellow-300' 
                : 'bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span className="font-medium">Hint</span>
          </motion.button>
          
          {onSkipQuestion && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSkipQuestion}
              className="skip-button flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-400"
            >
              <SkipForward className="w-4 h-4" />
              <span>Skip</span>
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!gameState.userCode.trim()}
            className={`flex items-center space-x-2 px-6 py-2 rounded-xl transition-all duration-200 font-medium ${
              gameState.userCode.trim()
                ? 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400'
                : 'bg-gray-500/20 border border-gray-500/30 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Submit Code</span>
          </motion.button>
        </div>
      </div>
      
      {/* Hint Panel */}
      <AnimatePresence>
        {showHint && currentChallenge && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-4"
          >
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-yellow-300 mb-2">💡 Helpful Hints:</div>
                <ul className="space-y-1">
                  {currentChallenge.hints.map((hint, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-2 text-yellow-200"
                    >
                      <span className="text-yellow-400 mt-1">•</span>
                      <span className="text-sm">{hint}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback - Moved here between buttons and code editor */}
      <AnimatePresence>
        {gameState.showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-4 p-4 rounded-xl border backdrop-blur-sm ${
              gameState.feedback.includes('Perfect') || gameState.feedback.includes('Correct')
                ? 'bg-green-500/10 border-green-500/30 text-green-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              {gameState.feedback.includes('Perfect') || gameState.feedback.includes('Correct') ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              <span className="font-medium">{gameState.feedback}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Code Editor */}
      <div className="flex-1 bg-black/40 dark:bg-black/40 light:bg-white/80 backdrop-blur-sm rounded-xl border border-white/10 dark:border-white/10 light:border-indigo-200/50 overflow-hidden shadow-2xl flex flex-col min-h-0">
        {/* Editor Header */}
        <div className="bg-black/30 dark:bg-black/30 light:bg-indigo-50/80 backdrop-blur-sm px-4 py-3 border-b border-white/10 dark:border-white/10 light:border-indigo-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-400 dark:text-gray-400 light:text-slate-600 text-sm font-mono">main.{getFileExtension()}</span>
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-400 light:text-slate-600">
              {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}
            </div>
          </div>
        </div>
        
        {/* Editor Content */}
        <div className="flex flex-1 min-h-0 overflow-auto">
          {/* Line Numbers */}
          <div className="bg-black/20 dark:bg-black/20 light:bg-indigo-50/60 border-r border-white/5 dark:border-white/5 light:border-indigo-200/30 px-3 py-4 min-w-[3rem]">
            <div className="font-mono text-xs text-gray-500 dark:text-gray-500 light:text-slate-500 space-y-[1.25rem]">
              <div>1</div>
              {Array.from({ length: Math.max(1, lineNumbers - 1) }, (_, i) => (
                <div key={i + 2}>{i + 2}</div>
              ))}
            </div>
          </div>
          
          {/* Code Area */}
          <div className="flex-1 p-4">
            <div className="font-mono text-sm space-y-[1.25rem]">
              <div className="text-gray-500 dark:text-gray-500 light:text-slate-500">// Complete the challenge below</div>
              <textarea
                value={gameState.userCode}
                onChange={(e) => onUpdateCode(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your code here..."
                className="w-full bg-transparent text-white dark:text-white light:text-slate-800 font-mono text-sm resize-none outline-none placeholder-gray-500 dark:placeholder-gray-500 light:placeholder-slate-500 min-h-[200px]"
                style={{ lineHeight: '1.25rem' }}
                autoFocus
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Hints */}
      <div className="mt-4">
        <AIHints
          currentLevel={currentLevel}
          currentChallenge={currentChallenge}
          userCode={gameState.userCode}
          attempts={gameState.attempts}
        />
      </div>
      
      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-400 dark:text-gray-400 light:text-slate-600">
        <div className="flex items-center space-x-4">
          <kbd className="px-2 py-1 bg-black/30 dark:bg-black/30 light:bg-indigo-100/80 border border-white/20 dark:border-white/20 light:border-indigo-200/50 rounded text-xs">
            Cmd/Ctrl + Enter
          </kbd>
          <span>to submit</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>{gameState.userCode.length} characters</span>
          <span>•</span>
          <span>{lineNumbers} lines</span>
        </div>
      </div>
    </div>
  );
};