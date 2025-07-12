# 🎵 Code the Beat

A revolutionary rhythm-based coding game that combines programming challenges with musical beats. Learn to code while staying in sync with the music!

## 🎯 Features

### 🎮 Core Gameplay
- **Rhythm-Based Coding**: Solve programming challenges synchronized to musical beats
- **Multi-Language Support**: JavaScript, Python, Java, HTML, CSS, TypeScript, C++, and custom languages
- **Progressive Difficulty**: From beginner to advanced levels with increasing complexity
- **Real-Time Feedback**: Instant code validation with detailed error messages and hints

### 🏆 Achievement System
- **30+ Achievements**: Unlock achievements for coding milestones, rhythm mastery, and special accomplishments
- **Smart Notifications**: Non-intrusive achievement notifications that only show once
- **Progress Tracking**: Detailed statistics for challenges completed, levels reached, and perfect submissions
- **Achievement Points**: Separate reward system for unlocking achievements

### 📊 Scoring & Progress
- **Dynamic Scoring**: Base points (100) + streak bonuses with multipliers
- **Streak Multiplier**: Earn 1 + (streak ÷ 10) multiplier for consecutive correct answers
- **Checkpoint System**: Automatic progress saving at level completion
- **Penalty System**: Progressive penalties for wrong attempts (max -50 points)
- **Score Protection**: Your score never goes below 0

### 🎯 Level System
- **20 Levels**: Carefully crafted progression from basics to advanced concepts
- **Unlock Progression**: Complete levels to unlock new challenges
- **Visual Indicators**: Clear progress tracking and difficulty indicators
- **Concept Learning**: Each level focuses on specific programming concepts

### 💡 AI-Powered Hints
- **Contextual Hints**: Smart hints based on your current challenge and attempts
- **Multiple Categories**: Concept explanations, syntax help, strategy tips, and encouragement
- **Progressive Assistance**: More hints become available as attempts increase
- **Educational Focus**: Learn programming concepts, not just syntax

### 🏅 Leaderboards
- **Global Rankings**: Compete with players worldwide
- **Level-Specific Boards**: See top performers for each level
- **Real-Time Updates**: Live leaderboard updates and rank tracking
- **Player Profiles**: Unique player names with achievement tracking

### 🎨 User Experience
- **Dark/Light Themes**: Toggle between beautiful dark and light modes
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered transitions and effects
- **Audio Integration**: Tone.js powered musical beats and sound effects

### 🔄 Reset & Recovery
- **Dual Reset System**: 
  - **Restart Level**: Reset to current level start with checkpoint score
  - **Reset All**: Complete progress reset with confirmation
- **Checkpoint Recovery**: Resume from level start instead of complete restart
- **Progress Protection**: Confirmation dialogs prevent accidental resets

### 📈 Dashboard & Analytics
- **Comprehensive Stats**: Track challenges, levels, streaks, and perfect runs
- **Skill Tree**: Visual progression system showing your coding journey
- **Achievement Gallery**: Browse all unlocked achievements and progress
- **Progress Visualization**: Beautiful charts and progress indicators

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/code-the-beat.git
   cd code-the-beat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎯 How to Play

1. **Choose Your Language**: Select from JavaScript, Python, Java, and more
2. **Listen to the Beat**: Start the rhythm and get in sync
3. **Read the Challenge**: Understand what code you need to write
4. **Code to the Beat**: Write your solution while staying in rhythm
5. **Submit & Score**: Get points based on correctness and streak multiplier
6. **Progress & Unlock**: Complete levels to unlock new challenges
7. **Track Achievements**: Unlock achievements and climb the leaderboards

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions

### Audio & Music
- **Tone.js** - Web audio framework for musical beats and sounds

### Backend & Database
- **Supabase** - Backend-as-a-Service for database and real-time features
- **PostgreSQL** - Robust relational database via Supabase

### State Management
- **React Context** - For global state management
- **localStorage** - Client-side progress persistence

### Code Quality
- **ESLint** - Code linting and quality enforcement
- **TypeScript** - Static type checking

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AchievementNotification.tsx
│   ├── AchievementsContent.tsx
│   ├── AIHints.tsx
│   ├── BeatLine.tsx
│   ├── CodeInput.tsx
│   ├── DashboardModal.tsx
│   ├── Leaderboard.tsx
│   ├── LevelSelector.tsx
│   ├── ProgressTracker.tsx
│   ├── ScoreSubmission.tsx
│   ├── SkillTree.tsx
│   └── TopBar.tsx
├── contexts/            # React Context providers
│   ├── AchievementsContext.tsx
│   └── ThemeContext.tsx
├── data/               # Game data and configurations
│   ├── achievements.ts
│   └── levels.ts
├── hooks/              # Custom React hooks
│   ├── useAchievements.ts
│   └── useGameEngine.ts
├── lib/                # External service integrations
│   └── supabase.ts
├── types/              # TypeScript type definitions
│   └── game.ts
├── utils/              # Utility functions
│   ├── player.ts
│   └── storage.ts
└── App.tsx            # Main application component
```

## 🎵 Game Mechanics

### Scoring System
- **Base Points**: 100 points per correct answer
- **Streak Bonus**: +10 points per consecutive correct answer
- **Streak Multiplier**: 1 + (current_streak ÷ 10)
- **Example**: With 3 streak → (100 + 30) × 1.3 = 169 points

### Penalty System
- **Progressive Penalties**: 
  - 1st wrong attempt: -10 points
  - 2nd wrong attempt: -15 points
  - 3rd wrong attempt: -20 points
  - Maximum penalty: -50 points
- **Attempt Tracking**: Visual counter shows current attempts
- **Score Protection**: Score never goes below 0

### Achievement Categories
- **Coding**: Programming milestones and syntax mastery
- **Rhythm**: Beat synchronization and timing achievements
- **Streak**: Consecutive success achievements
- **Completion**: Level and challenge completion milestones
- **Special**: Unique and rare accomplishments

## 🚀 Deployment

### Environment Variables (Optional)

For leaderboard functionality, you can set up Supabase:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Set up environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

**Note**: The application works perfectly without these environment variables - the leaderboard features will simply be disabled.

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Manual Deployment

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. (Optional) Add environment variables for leaderboard functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] Multiplayer mode with real-time collaboration
- [ ] Custom level editor for community-created content
- [ ] More programming languages and frameworks
- [ ] Advanced rhythm patterns and musical genres
- [ ] Mobile app development
- [ ] Social features and friend challenges
- [ ] Code review and mentoring system
- [ ] Integration with coding bootcamps and schools

## 🙏 Acknowledgments

- **Tone.js** - For the amazing web audio framework
- **Framer Motion** - For beautiful animations
- **Supabase** - For the robust backend infrastructure
- **React Team** - For the incredible framework
- **Tailwind CSS** - For the utility-first CSS approach

## 📧 Support

If you have any questions, issues, or suggestions, please:
- Open an issue on GitHub
- Join our Discord community
- Email us at support@codethebeat.com

---

**🎵 Happy Coding to the Beat! 🎵**
