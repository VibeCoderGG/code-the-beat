import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code } from 'lucide-react';
import { LanguageOption } from '../types/game';

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
}

const supportedLanguages: LanguageOption[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '⚡',
    color: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
  },
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    color: 'bg-blue-500/20 border-blue-500/30 text-blue-400'
  },
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    color: 'bg-orange-500/20 border-orange-500/30 text-orange-400'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: '🔷',
    color: 'bg-blue-600/20 border-blue-600/30 text-blue-300'
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: '⚙️',
    color: 'bg-purple-500/20 border-purple-500/30 text-purple-400'
  },
  {
    id: 'html',
    name: 'HTML',
    icon: '🌐',
    color: 'bg-red-500/20 border-red-500/30 text-red-400'
  },
  {
    id: 'css',
    name: 'CSS',
    icon: '🎨',
    color: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
  },
  {
    id: 'go',
    name: 'Go',
    icon: '🔷',
    color: 'bg-teal-500/20 border-teal-500/30 text-teal-400'
  }
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  isOpen,
  onClose,
  selectedLanguage,
  onSelectLanguage
}) => {
  if (!isOpen) return null;

  const handleLanguageSelect = (languageId: string) => {
    onSelectLanguage(languageId);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 dark:bg-gray-900 light:bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden border border-gray-700 dark:border-gray-700 light:border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700 dark:border-gray-700 light:border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white dark:text-white light:text-gray-900">
                  Select Programming Language
                </h2>
                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm">
                  Choose your preferred programming language
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 dark:hover:bg-gray-800 light:hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Languages Grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {supportedLanguages.map((language) => {
                const isSelected = selectedLanguage === language.id;
                return (
                  <motion.button
                    key={language.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLanguageSelect(language.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                      isSelected
                        ? `${language.color} ring-2 ring-offset-2 ring-offset-gray-900 dark:ring-offset-gray-900 light:ring-offset-white`
                        : 'bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-100 border-gray-700 dark:border-gray-700 light:border-gray-300 hover:border-purple-500/50 text-gray-300 dark:text-gray-300 light:text-gray-700'
                    }`}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <span className="text-white text-xs font-bold">✓</span>
                      </motion.div>
                    )}

                    {/* Language icon */}
                    <div className="text-3xl mb-2 flex justify-center">
                      {language.icon}
                    </div>

                    {/* Language name */}
                    <div className="text-sm font-semibold text-center">
                      {language.name}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Info text */}
            <div className="mt-6 p-4 bg-gray-800/30 dark:bg-gray-800/30 light:bg-gray-50 rounded-lg">
              <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm text-center">
                Each language has unique challenges and syntax. Your progress is tracked separately for each language.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
