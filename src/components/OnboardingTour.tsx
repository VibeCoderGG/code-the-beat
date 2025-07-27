import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, X, Code, Trophy, Target, Music } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  icon: React.ReactNode;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

interface OnboardingTourProps {
  onComplete: () => void;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Code the Beat! 🎵',
    description: 'A coding game where you solve programming challenges in multiple languages!',
    icon: <Music className="w-6 h-6" />,
    position: 'center'
  },
  {
    id: 'language-selector',
    title: 'Choose Your Language 🔧',
    description: 'Start by selecting your preferred programming language from the dropdown. You can switch languages anytime!',
    target: '.language-selector',
    icon: <Code className="w-6 h-6" />,
    position: 'bottom-left'
  },
  {
    id: 'score-display',
    title: 'Your Score �',
    description: 'This shows your current points. Solve challenges correctly to earn more points and build streaks!',
    target: '.score-display',
    icon: <Target className="w-6 h-6" />,
    position: 'bottom-left'
  },
  {
    id: 'code-editor',
    title: 'Code Editor 💻',
    description: 'Write your code here to solve the challenges. The prompt will tell you what to create!',
    target: '.code-editor',
    icon: <Code className="w-6 h-6" />,
    position: 'top-right'
  },
  {
    id: 'hint-button',
    title: 'Need Help? 💡',
    description: 'Stuck on a challenge? Click the Hint button to get helpful tips and guidance!',
    target: '.hint-button',
    icon: <Target className="w-6 h-6" />,
    position: 'bottom-left'
  },
  {
    id: 'skip-button',
    title: 'Skip if Needed ⏭️',
    description: 'If a challenge is too difficult, you can skip it. But remember: skipped questions don\'t count toward unlocking new levels!',
    target: '.skip-button',
    icon: <Target className="w-6 h-6" />,
    position: 'bottom-left'
  },
  {
    id: 'progress-tracker',
    title: 'Track Your Progress 📊',
    description: 'Monitor your achievements, streak, and see how many questions you need to unlock the next level!',
    target: '.progress-tracker',
    icon: <Trophy className="w-6 h-6" />,
    position: 'top-left'
  },
  {
    id: 'levels-button',
    title: 'Explore Levels 📚',
    description: 'Access different coding levels and challenges. Unlock new levels by solving 20 questions!',
    target: '.levels-button',
    icon: <Target className="w-6 h-6" />,
    position: 'bottom-right'
  },
  {
    id: 'dashboard-button',
    title: 'Your Dashboard 🏆',
    description: 'View your achievements, statistics, and overall progress in the game!',
    target: '.dashboard-button',
    icon: <Trophy className="w-6 h-6" />,
    position: 'bottom-right'
  }
];

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('codeBeatOnboardingCompleted', 'true');
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const step = onboardingSteps[currentStep];

  const getModalPosition = () => {
    // Force center position for steps that specify center position
    if (step.position === 'center') {
      return {
        position: 'fixed' as const,
        top: '30%',
        left: '38%',
        transform: 'translate(-50%, -50%)',
        zIndex: 52,
        maxWidth: '90vw',
        width: '400px' // Fixed width for center modals
      };
    }
    
    // If we have a highlighted element, position relative to it
    if (spotlightRect && step.target) {
      const modalWidth = 400; // Increased modal width
      const modalHeight = 280; // Increased modal height  
      const spacing = 20; // Space between element and modal
      
      const elementCenterX = spotlightRect.left + spotlightRect.width / 2;
      const elementCenterY = spotlightRect.top + spotlightRect.height / 2;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let left = elementCenterX;
      let top = elementCenterY;
      
      // For code editor, position to the right center
      if (step.target === '.code-editor') {
        left = Math.min(spotlightRect.right + spacing, viewportWidth - modalWidth - 20);
        top = Math.max(20, Math.min(elementCenterY - modalHeight / 2, viewportHeight - modalHeight - 20));
      }
      // Try to position to the right of the element first for other elements
      else if (spotlightRect.right + spacing + modalWidth < viewportWidth) {
        left = spotlightRect.right + spacing;
        top = Math.max(20, Math.min(spotlightRect.top - 50, viewportHeight - modalHeight - 20));
      }
      // If not enough space on right, try left
      else if (spotlightRect.left - spacing - modalWidth > 0) {
        left = spotlightRect.left - spacing - modalWidth;
        top = Math.max(20, Math.min(spotlightRect.top - 50, viewportHeight - modalHeight - 20));
      }
      // If not enough space left/right, try below
      else if (spotlightRect.bottom + spacing + modalHeight < viewportHeight) {
        left = Math.max(20, Math.min(elementCenterX - modalWidth / 2, viewportWidth - modalWidth - 20));
        top = spotlightRect.bottom + spacing;
      }
      // If not enough space below, try above
      else if (spotlightRect.top - spacing - modalHeight > 0) {
        left = Math.max(20, Math.min(elementCenterX - modalWidth / 2, viewportWidth - modalWidth - 20));
        top = spotlightRect.top - spacing - modalHeight;
      }
      // Fallback: center the modal
      else {
        left = (viewportWidth - modalWidth) / 2;
        top = (viewportHeight - modalHeight) / 2;
      }
      
      return {
        position: 'fixed' as const,
        left: `${left}px`,
        top: `${top}px`,
        transform: '',
        zIndex: 52,
        width: `${modalWidth}px`
      };
    }
    
    // If we have a target but no spotlight, try to find the element and position relative to it
    if (step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        const modalWidth = 350;
        const modalHeight = 250;
        const spacing = 30;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Position below the element by default for header elements
        const left = Math.max(spacing, Math.min(rect.left - 50, viewportWidth - modalWidth - spacing));
        let top = rect.bottom + spacing;
        
        // If not enough space below, position above
        if (top + modalHeight > viewportHeight - spacing) {
          top = Math.max(spacing, rect.top - modalHeight - spacing);
        }
        
        return {
          position: 'fixed' as const,
          left: `${left}px`,
          top: `${top}px`,
          transform: '',
          zIndex: 51
        };
      }
    }
    
    // Fallback to center for non-targeted steps or center position steps
    return {
      position: 'fixed' as const,
      top: '25%',
      left: '25%',
      transform: 'translate(-50%, -50%)',
      zIndex: 51,
      maxWidth: '90vw', // Ensure it doesn't go off screen on small devices
      width: '400px' // Fixed width for center modals
    };
  };

  // Add glow effect for targeted elements
  useEffect(() => {
    if (step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        // Add glow effect
        element.classList.add('onboarding-glow');
        
        // Get element position for modal positioning
        const rect = element.getBoundingClientRect();
        setSpotlightRect(rect);
        
        // Scroll element into view
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center', 
          inline: 'center' 
        });
        
        return () => {
          element.classList.remove('onboarding-glow');
          setSpotlightRect(null);
        };
      }
    } else {
      setSpotlightRect(null);
    }
  }, [step.target]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Tour Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={getModalPosition()}
            className="max-w-md"
          >
            <div className="bg-gradient-to-br from-indigo-900/98 to-purple-900/98 backdrop-blur-md border border-indigo-500/40 rounded-2xl p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-500/20 p-2 rounded-lg">
                    {step.icon}
                  </div>
                  <h2 className="text-xl font-bold text-white">{step.title}</h2>
                </div>
                <button
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <p className="text-gray-200 mb-6 leading-relaxed">
                {step.description}
              </p>

              {/* Progress Indicator */}
              <div className="flex items-center space-x-2 mb-6">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? 'bg-indigo-400 w-6'
                        : index < currentStep
                        ? 'bg-green-400'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentStep === 0
                      ? 'text-gray-500 cursor-not-allowed'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="text-sm text-gray-400">
                  {currentStep + 1} of {onboardingSteps.length}
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all duration-200 font-medium"
                >
                  <span>{currentStep === onboardingSteps.length - 1 ? 'Get Started!' : 'Next'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
