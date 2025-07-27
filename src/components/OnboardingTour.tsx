import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, X, Play, Code, Trophy, Target, Music } from 'lucide-react';

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
    description: 'A rhythm-based coding game where you solve programming challenges while staying in sync with the beat!',
    icon: <Music className="w-6 h-6" />,
    position: 'center'
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
    id: 'play-button',
    title: 'Start the Beat 🎮',
    description: 'Click this button to start the rhythm! The beat will help you stay focused while coding.',
    target: '.play-button',
    icon: <Play className="w-6 h-6" />,
    position: 'bottom-right'
  },
  {
    id: 'code-editor',
    title: 'Code Editor 💻',
    description: 'Write your JavaScript code here to solve the challenges. The prompt will tell you what to create!',
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
    // If we have a highlighted element, position relative to it
    if (spotlightRect && step.target) {
      const modalWidth = 350; // Reduced modal width
      const modalHeight = 250; // Reduced modal height
      const spacing = 30; // Increased space between element and modal
      
      const elementCenterX = spotlightRect.left + spotlightRect.width / 2;
      const elementCenterY = spotlightRect.top + spotlightRect.height / 2;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let left = elementCenterX;
      let top = elementCenterY;
      const transform = '';
      
      // Try to position to the right of the element first
      if (spotlightRect.right + spacing + modalWidth < viewportWidth) {
        left = spotlightRect.right + spacing;
        top = Math.max(spacing, Math.min(spotlightRect.top - 50, viewportHeight - modalHeight - spacing));
      }
      // If not enough space on right, try left
      else if (spotlightRect.left - spacing - modalWidth > 0) {
        left = spotlightRect.left - spacing - modalWidth;
        top = Math.max(spacing, Math.min(spotlightRect.top - 50, viewportHeight - modalHeight - spacing));
      }
      // If not enough space left/right, try below
      else if (spotlightRect.bottom + spacing + modalHeight < viewportHeight) {
        left = Math.max(spacing, Math.min(elementCenterX - modalWidth / 2, viewportWidth - modalWidth - spacing));
        top = spotlightRect.bottom + spacing;
      }
      // If not enough space below, try above
      else if (spotlightRect.top - spacing - modalHeight > 0) {
        left = Math.max(spacing, Math.min(elementCenterX - modalWidth / 2, viewportWidth - modalWidth - spacing));
        top = spotlightRect.top - spacing - modalHeight;
      }
      // Fallback: position to the side with more space, even if it overlaps viewport
      else {
        const rightSpace = viewportWidth - spotlightRect.right;
        const leftSpace = spotlightRect.left;
        
        if (rightSpace > leftSpace) {
          // Position to the right, even if it goes off screen
          left = Math.min(spotlightRect.right + spacing, viewportWidth - modalWidth);
          top = Math.max(spacing, Math.min(spotlightRect.top - 50, viewportHeight - modalHeight - spacing));
        } else {
          // Position to the left
          left = Math.max(0, spotlightRect.left - spacing - modalWidth);
          top = Math.max(spacing, Math.min(spotlightRect.top - 50, viewportHeight - modalHeight - spacing));
        }
      }
      
      return {
        position: 'fixed' as const,
        left: `${left}px`,
        top: `${top}px`,
        transform,
        zIndex: 51
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
    
    // Fallback to center for non-targeted steps
    return {
      position: 'fixed' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 51,
      maxWidth: '90vw' // Ensure it doesn't go off screen on small devices
    };
  };

  // Add spotlight effect for targeted elements
  useEffect(() => {
    if (step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        element.classList.add('onboarding-highlight');
        
        // Get element position for spotlight
        const rect = element.getBoundingClientRect();
        setSpotlightRect(rect);
        
        // Scroll element into view
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center', 
          inline: 'center' 
        });
        
        return () => {
          element.classList.remove('onboarding-highlight');
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
          {/* Main Overlay with Spotlight Cutout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{
              background: spotlightRect
                ? `radial-gradient(circle at ${spotlightRect.left + spotlightRect.width / 2}px ${spotlightRect.top + spotlightRect.height / 2}px, transparent ${Math.max(spotlightRect.width, spotlightRect.height) / 2 + 20}px, rgba(0, 0, 0, 0.8) ${Math.max(spotlightRect.width, spotlightRect.height) / 2 + 60}px)`
                : 'rgba(0, 0, 0, 0.7)'
            }}
          />
          
          {/* Additional Dark Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-49"
          />
          
          {/* Tour Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={getModalPosition()}
            className="max-w-sm"
          >
            <div className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 shadow-2xl">
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
