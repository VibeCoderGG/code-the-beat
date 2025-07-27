import React from 'react';
import { Code2 } from 'lucide-react';
import { GameState, Level } from '../types/game';

interface TopBarProps {
  gameState: GameState;
  currentLevel: Level;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  onOpenLanguageSelector: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  selectedLanguage,
  onOpenLanguageSelector,
}) => {

  return (
    <div className="flex items-center justify-between w-full">
      {/* Empty left side for balance */}
      <div></div>

      {/* Language Button */}
      <button
        onClick={onOpenLanguageSelector}
        className="language-selector flex items-center justify-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl transition-all duration-200"
        title="Select programming language"
      >
        <Code2 className="w-4 h-4" />
        <span className="font-medium">{selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}</span>
      </button>
    </div>
  );
};