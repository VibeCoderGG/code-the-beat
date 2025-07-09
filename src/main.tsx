import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import { AchievementsProvider } from './contexts/AchievementsContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AchievementsProvider>
        <App />
      </AchievementsProvider>
    </ThemeProvider>
  </StrictMode>
);
