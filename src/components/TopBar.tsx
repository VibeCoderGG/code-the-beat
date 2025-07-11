import React from 'react';
import { Code2, Sun, Moon } from 'lucide-react';
import { GameState, Level } from '../types/game';
import { useTheme } from '../contexts/ThemeContext';

interface TopBarProps {
  gameState: GameState;
  currentLevel: Level;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  onStartGame: () => void;
  onStopGame: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showCustomInput, setShowCustomInput] = React.useState(false);
  const [customLanguage, setCustomLanguage] = React.useState('');

  const predefinedLanguages = [
    { value: 'javascript', label: 'JavaScript', extension: 'js' },
    { value: 'python', label: 'Python', extension: 'py' },
    { value: 'java', label: 'Java', extension: 'java' },
    { value: 'html', label: 'HTML', extension: 'html' },
    { value: 'css', label: 'CSS', extension: 'css' },
    { value: 'typescript', label: 'TypeScript', extension: 'ts' },
    { value: 'cpp', label: 'C++', extension: 'cpp' },
    { value: 'custom', label: 'Custom...', extension: '' }
  ];

  const handleLanguageSelect = (language: string) => {
    if (language === 'custom') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      onLanguageChange(language);
    }
  };

  const handleCustomLanguageSubmit = () => {
    if (customLanguage.trim()) {
      onLanguageChange(customLanguage.trim());
      setShowCustomInput(false);
      setCustomLanguage('');
    }
  };

  return (
    <div className="flex items-center justify-between w-full">
      {/* Language Selector */}
      <div className="flex items-center space-x-2">
        <Code2 className="w-4 h-4 text-gray-400 dark:text-gray-400 light:text-slate-600" />
        <div className="relative">
          {showCustomInput ? (
            <div className="flex items-center space-x-1">
              <input
                type="text"
                value={customLanguage}
                onChange={(e) => setCustomLanguage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCustomLanguageSubmit()}
                placeholder="Enter language..."
                className="bg-black/30 dark:bg-black/30 light:bg-white/80 backdrop-blur-sm border border-white/20 dark:border-white/20 light:border-indigo-200/50 rounded-lg px-3 py-1 text-sm text-white dark:text-white light:text-slate-800 w-32 focus:outline-none focus:border-purple-500"
                autoFocus
              />
              <button
                onClick={handleCustomLanguageSubmit}
                className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 px-2 py-1 rounded-lg text-sm transition-colors"
              >
                ✓
              </button>
              <button
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomLanguage('');
                }}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 px-2 py-1 rounded-lg text-sm transition-colors"
              >
                ✕
              </button>
            </div>
          ) : (          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageSelect(e.target.value)}
            className="bg-black/30 dark:bg-black/30 light:bg-white/80 backdrop-blur-sm border border-white/20 dark:border-white/20 light:border-indigo-200/50 rounded-lg px-3 py-2 text-sm text-white dark:text-white light:text-slate-800 focus:outline-none focus:border-purple-500 min-w-[120px]"
          >
            {predefinedLanguages.map(lang => (
              <option key={lang.value} value={lang.value} className="bg-gray-800 dark:bg-gray-800 light:bg-white text-white dark:text-white light:text-slate-800">
                {lang.label}
              </option>
            ))}
          </select>
          )}
        </div>
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center w-10 h-10 bg-black/20 dark:bg-black/20 light:bg-white/80 backdrop-blur-sm border border-white/20 dark:border-white/20 light:border-indigo-200/50 rounded-lg hover:bg-black/30 dark:hover:bg-black/30 light:hover:bg-white/90 transition-all duration-200 group"
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600 group-hover:text-indigo-500 transition-colors" />
        )}
      </button>
    </div>
  );
};