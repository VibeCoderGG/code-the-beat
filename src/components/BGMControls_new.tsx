import React from 'react';

interface BGMControlsProps {
  className?: string;
}

const BGMControls: React.FC<BGMControlsProps> = ({ className = '' }) => {
  return (
    <div className={className}>
      <p>BGM Controls - Test</p>
    </div>
  );
};

export default BGMControls;
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