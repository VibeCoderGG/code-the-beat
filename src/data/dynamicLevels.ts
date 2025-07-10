import { Level, Challenge } from '../types/game';
import { aiService, AIChallenge } from '../services/aiService';

// Programming concepts for infinite level generation
const programmingConcepts = [
  'variables', 'loops', 'conditionals', 'functions', 'arrays', 'objects',
  'string manipulation', 'mathematical operations', 'boolean logic', 'type conversion',
  'error handling', 'async programming', 'recursion', 'data structures', 'algorithms',
  'classes', 'inheritance', 'polymorphism', 'encapsulation', 'abstraction',
  'event handling', 'promises', 'callbacks', 'modules', 'namespaces'
];

export class DynamicLevelGenerator {
  private static instance: DynamicLevelGenerator;
  private generatedLevels: Map<string, Level> = new Map();
  private generationCache: Map<string, Promise<Level>> = new Map();

  static getInstance(): DynamicLevelGenerator {
    if (!DynamicLevelGenerator.instance) {
      DynamicLevelGenerator.instance = new DynamicLevelGenerator();
    }
    return DynamicLevelGenerator.instance;
  }

  async generateLevel(
    levelId: number, 
    language: string = 'javascript',
    playerSkillLevel?: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<Level> {
    const cacheKey = `${levelId}-${language}-${playerSkillLevel || 'auto'}`;
    
    // Check if level is already being generated
    if (this.generationCache.has(cacheKey)) {
      return this.generationCache.get(cacheKey)!;
    }

    // Check if level is already generated
    if (this.generatedLevels.has(cacheKey)) {
      return this.generatedLevels.get(cacheKey)!;
    }

    // Generate the level
    const generationPromise = this.generateLevelInternal(levelId, language, playerSkillLevel);
    this.generationCache.set(cacheKey, generationPromise);

    try {
      const level = await generationPromise;
      this.generatedLevels.set(cacheKey, level);
      return level;
    } finally {
      this.generationCache.delete(cacheKey);
    }
  }

  private async generateLevelInternal(
    levelId: number, 
    language: string,
    playerSkillLevel?: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<Level> {
    // Generate infinite level template
    const template = this.generateLevelTemplate(levelId);
    
    // Determine skill level based on player progress or template
    const skillLevel = playerSkillLevel || template.difficulty;

    try {
      // Use AI to generate level metadata
      const levelData = await aiService.generateDynamicLevel(levelId, language);
      
      // Generate challenges using AI
      const challenges: Challenge[] = [];
      for (let i = 0; i < template.challengeCount; i++) {
        try {
          const aiChallenge = await aiService.generateChallenge(
            levelData.concept,
            skillLevel,
            language,
            i + 1 // Pass challenge number for variety
          );

          challenges.push({
            id: i + 1,
            prompt: aiChallenge.prompt,
            expectedCode: aiChallenge.expectedCode,
            hints: aiChallenge.hints,
            beatPosition: i * 4, // Spread challenges across beats
            timeSignature: 4,
            explanation: aiChallenge.explanation
          });
        } catch (error) {
          console.error(`Failed to generate challenge ${i + 1} for level ${levelId}:`, error);
          // Fallback to a default challenge
          challenges.push(this.getDefaultChallenge(levelData.concept, i + 1, language));
        }
      }

      return {
        id: levelId,
        title: levelData.title,
        concept: levelData.concept,
        description: levelData.description,
        tempo: template.tempo,
        difficulty: levelData.difficulty,
        unlocked: levelId === 1, // Only first level is unlocked by default
        challenges,
        isDynamic: true,
        language,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Failed to generate level ${levelId} with AI:`, error);
      return this.createFallbackLevel(levelId, template, language);
    }
  }

  private generateLevelTemplate(levelId: number) {
    // Select concept based on level (cycle through concepts)
    const concept = programmingConcepts[levelId % programmingConcepts.length];
    
    // Calculate difficulty based on level number
    let difficulty: 'beginner' | 'intermediate' | 'advanced';
    if (levelId <= 10) {
      difficulty = 'beginner';
    } else if (levelId <= 25) {
      difficulty = 'intermediate';
    } else {
      difficulty = 'advanced';
    }

    // Calculate tempo based on level (gradually increase)
    const baseTempo = 80;
    const tempoIncrement = Math.floor(levelId / 5) * 10; // Increase by 10 every 5 levels
    const tempo = Math.min(baseTempo + tempoIncrement, 200); // Cap at 200 BPM

    // More challenges in higher levels - minimum 10 questions per level
    const challengeCount = Math.max(10, Math.min(10 + Math.floor(levelId / 10), 15)); // Start with 10, max 15

    return {
      id: levelId,
      title: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} ${concept.charAt(0).toUpperCase() + concept.slice(1)}`,
      concept,
      description: `Master ${concept} with ${difficulty} level challenges (${challengeCount} questions)`,
      tempo,
      difficulty,
      unlocked: levelId === 1,
      challengeCount
    };
  }

  private getDefaultChallenge(concept: string, challengeId: number, language: string): Challenge {
    const defaultChallenges: { [key: string]: Challenge } = {
      variables: {
        id: challengeId,
        prompt: `Create a variable named 'value${challengeId}' with a number`,
        expectedCode: language === 'python' ? `value${challengeId} = ${challengeId * 10}` : `let value${challengeId} = ${challengeId * 10};`,
        hints: ["Use appropriate variable declaration", "Numbers don't need quotes"],
        beatPosition: (challengeId - 1) * 4,
        timeSignature: 4
      },
      loops: {
        id: challengeId,
        prompt: `Create a for loop that runs ${challengeId + 2} times`,
        expectedCode: language === 'python' ? `for i in range(${challengeId + 2}):\n    print(i)` : `for (let i = 0; i < ${challengeId + 2}; i++) {\n    console.log(i);\n}`,
        hints: ["Use for loop syntax", "Initialize, condition, increment"],
        beatPosition: (challengeId - 1) * 4,
        timeSignature: 4
      },
      conditionals: {
        id: challengeId,
        prompt: `Check if x is greater than ${challengeId * 5}`,
        expectedCode: language === 'python' ? `if x > ${challengeId * 5}:\n    print("Greater")` : `if (x > ${challengeId * 5}) {\n    console.log("Greater");\n}`,
        hints: ["Use if statement", "Greater than: >"],
        beatPosition: (challengeId - 1) * 4,
        timeSignature: 4
      },
      functions: {
        id: challengeId,
        prompt: `Create a function named 'func${challengeId}'`,
        expectedCode: language === 'python' ? `def func${challengeId}():\n    pass` : `function func${challengeId}() {}`,
        hints: ["Use function keyword", "Function name and parentheses"],
        beatPosition: (challengeId - 1) * 4,
        timeSignature: 4
      }
    };

    return defaultChallenges[concept] || defaultChallenges.variables;
  }

  private createFallbackLevel(levelId: number, template: { title: string; concept: string; description: string; tempo: number; difficulty: 'beginner' | 'intermediate' | 'advanced' }, language: string): Level {
    return {
      id: levelId,
      title: template.title,
      concept: template.concept,
      description: template.description,
      tempo: template.tempo,
      difficulty: template.difficulty,
      unlocked: levelId === 1,
      challenges: [
        {
          id: 1,
          prompt: `Create a basic ${template.concept} example in ${language}`,
          expectedCode: language === 'python' ? '# Complete this challenge' : '// Complete this challenge',
          hints: ["Think about the basic syntax"],
          beatPosition: 0,
          timeSignature: 4
        }
      ],
      isDynamic: false,
      language
    };
  }

  async regenerateLevel(levelId: number, language: string = 'javascript'): Promise<Level> {
    const cacheKey = `${levelId}-${language}`;
    
    // Clear existing cache
    this.generatedLevels.delete(cacheKey);
    this.generationCache.delete(cacheKey);
    
    // Generate new level
    return this.generateLevel(levelId, language);
  }

  // Generate multiple levels at once (for preloading)
  async generateMultipleLevels(startLevel: number, count: number, language: string = 'javascript'): Promise<Level[]> {
    const levels: Level[] = [];
    
    for (let i = 0; i < count; i++) {
      const levelId = startLevel + i;
      try {
        const level = await this.generateLevel(levelId, language);
        levels.push(level);
      } catch (error) {
        console.error(`Failed to generate level ${levelId}:`, error);
        // Add a fallback static level
        const template = this.generateLevelTemplate(levelId);
        levels.push(this.createFallbackLevel(levelId, template, language));
      }
    }
    
    return levels;
  }

  // Get level generation status
  isLevelGenerating(levelId: number, language: string = 'javascript'): boolean {
    const cacheKey = `${levelId}-${language}`;
    return this.generationCache.has(cacheKey);
  }

  // Clear all generated levels (useful for language changes)
  clearGeneratedLevels(): void {
    this.generatedLevels.clear();
    this.generationCache.clear();
  }

  // Get all generated levels
  getGeneratedLevels(): Level[] {
    return Array.from(this.generatedLevels.values());
  }
}

// Export singleton instance
export const dynamicLevelGenerator = DynamicLevelGenerator.getInstance();

// Export initial levels for immediate use (will be replaced by dynamic ones)
export const levels: Level[] = [
  {
    id: 1,
    title: "Variables & Values",
    concept: "variables",
    description: "Learn to store and use data in variables",
    tempo: 80,
    difficulty: 'beginner',
    unlocked: true,
    challenges: [
      {
        id: 1,
        prompt: "Loading AI-generated challenge...",
        expectedCode: "// Generated by AI",
        hints: ["AI is generating this challenge"],
        beatPosition: 0,
        timeSignature: 4
      }
    ],
    isDynamic: false
  }
];

// Export helper functions
export async function generateInfiniteLevel(levelId: number, language: string = 'javascript'): Promise<Level> {
  return dynamicLevelGenerator.generateLevel(levelId, language);
}

export async function regenerateLevel(levelId: number, language: string = 'javascript'): Promise<Level> {
  return dynamicLevelGenerator.regenerateLevel(levelId, language);
}
