import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, X } from 'lucide-react';

interface MobileWarningProps {
  onContinueAnyway: () => void;
}

export const MobileWarning: React.FC<MobileWarningProps> = ({ onContinueAnyway }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent;
      const mobileKeywords = [
        'Android', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone',
        'Opera Mini', 'IEMobile', 'Mobile Safari'
      ];
      
      const isMobileUserAgent = mobileKeywords.some(keyword => 
        userAgent.includes(keyword)
      );
      
      const isSmallScreen = window.innerWidth <= 768 || window.innerHeight <= 600;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      const mobile = isMobileUserAgent || (isSmallScreen && isTouchDevice);
      setIsMobile(mobile);
      
      // Check if user has already dismissed the warning
      const hasAcknowledged = localStorage.getItem('codeBeatMobileWarningDismissed');
      if (mobile && !hasAcknowledged) {
        setShowWarning(true);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleContinueAnyway = () => {
    localStorage.setItem('codeBeatMobileWarningDismissed', 'true');
    setShowWarning(false);
    onContinueAnyway();
  };

  const handleDismiss = () => {
    localStorage.setItem('codeBeatMobileWarningDismissed', 'true');
    setShowWarning(false);
    onContinueAnyway();
  };

  if (!isMobile || !showWarning) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-md w-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border border-purple-500/30 rounded-2xl p-6 text-center shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Monitor className="w-16 h-16 text-blue-400" />
            <div className="absolute -bottom-2 -right-2 bg-orange-500 rounded-full p-1">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-4">
          Better Experience on Desktop
        </h2>

        {/* Description */}
        <div className="text-gray-300 mb-6 space-y-3">
          <p>
            <strong className="text-purple-400">Code the Beat</strong> is optimized for desktop computers with:
          </p>
          <ul className="text-left text-sm space-y-2">
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Full-size code editor with syntax highlighting</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Comfortable keyboard for typing code</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Multiple panels for progress tracking</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Better performance and responsiveness</span>
            </li>
          </ul>
        </div>

        {/* Recommendation */}
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
          <p className="text-blue-300 text-sm">
            <strong>Recommendation:</strong> Switch to a desktop or laptop computer for the best coding experience.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleContinueAnyway}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            Continue on Mobile Anyway
          </button>
          
          <p className="text-xs text-gray-400">
            You can dismiss this message, but the experience may be limited on mobile devices.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            This message won't show again after dismissing.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
