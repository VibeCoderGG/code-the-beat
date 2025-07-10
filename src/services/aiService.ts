// AI Service for dynamic challenge generation and feedback using Google Gemini API
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

export interface AIChallenge {
  prompt: string;
  expectedCode: string;
  explanation: string;
  hints: string[];
}

export interface AIFeedback {
  message: string;
  encouragement: string;
  hint?: string;
}

interface CachedChallenge extends AIChallenge {
  timestamp: number;
}

interface CachedHint {
  hint: string;
  timestamp: number;
}

interface CachedLevel {
  title: string;
  description: string;
  concept: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timestamp: number;
}

export class AIService {
  private static instance: AIService;
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private isApiAvailable: boolean = false;
  private lastRequestTime: number = 0;
  private REQUEST_INTERVAL = 2000; // 2 seconds between requests (mutable for dynamic adjustment)
  private requestQueue: Array<() => Promise<unknown>> = [];
  private isProcessingQueue: boolean = false;
  private challengeCache: Map<string, CachedChallenge> = new Map();
  private hintCache: Map<string, CachedHint> = new Map();
  private levelCache: Map<string, CachedLevel> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  constructor() {
    this.initializeAPI();
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private async throttledRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          // Handle specific API errors
          if (error instanceof Error) {
            if (error.message.includes('429') || error.message.includes('quota')) {
              console.warn('API quota exceeded, throttling more aggressively');
              // Increase throttle interval for this session
              this.REQUEST_INTERVAL = Math.min(this.REQUEST_INTERVAL * 2, 30000); // Max 30 seconds
            } else if (error.message.includes('503') || error.message.includes('502')) {
              console.warn('API service unavailable, retrying...');
              // Retry after a delay
              setTimeout(() => {
                this.requestQueue.unshift(async () => {
                  try {
                    const result = await requestFn();
                    resolve(result);
                  } catch (retryError) {
                    reject(retryError);
                  }
                });
              }, 5000);
              return;
            }
          }
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;

      if (timeSinceLastRequest < this.REQUEST_INTERVAL) {
        // Wait for the remaining time
        const waitTime = this.REQUEST_INTERVAL - timeSinceLastRequest;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }

      const request = this.requestQueue.shift();
      if (request) {
        this.lastRequestTime = Date.now();
        try {
          await request();
        } catch (error) {
          console.error('Request failed:', error);
        }
      }
    }

    this.isProcessingQueue = false;
  }

  private initializeAPI(): void {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.warn('Gemini API key not found. Using fallback mock data.');
      this.isApiAvailable = false;
    } else {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        this.isApiAvailable = true;
        console.log('Gemini API initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Gemini API:', error);
        this.isApiAvailable = false;
      }
    }
  }

  async generateChallenge(
    concept: string, 
    difficulty: 'beginner' | 'intermediate' | 'advanced', 
    language: string = 'javascript',
    challengeNumber: number = 1
  ): Promise<AIChallenge> {
    // Check cache first
    const cacheKey = `${concept}-${difficulty}-${language}-${challengeNumber}`;
    const cached = this.challengeCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('Using cached challenge for:', cacheKey);
      return {
        prompt: cached.prompt,
        expectedCode: cached.expectedCode,
        explanation: cached.explanation,
        hints: cached.hints
      };
    }

    if (this.isApiAvailable && this.model) {
      try {
        const challenge = await this.throttledRequest(() => 
          this.generateChallengeWithAPI(concept, difficulty, language, challengeNumber)
        );
        
        // Cache the result
        this.challengeCache.set(cacheKey, {
          ...challenge,
          timestamp: Date.now()
        });
        
        // Clean up old cache entries
        this.cleanupCache();
        
        return challenge;
      } catch (error) {
        console.error('API call failed, falling back to mock data:', error);
        return this.generateMockChallenge(concept, difficulty, language, challengeNumber);
      }
    } else {
      return this.generateMockChallenge(concept, difficulty, language, challengeNumber);
    }
  }

  private cleanupCache(): void {
    const now = Date.now();
    
    // Clean up challenge cache
    for (const [key, challenge] of this.challengeCache.entries()) {
      if (now - challenge.timestamp > this.CACHE_DURATION) {
        this.challengeCache.delete(key);
      }
    }
    
    // Clean up hint cache
    for (const [key, hint] of this.hintCache.entries()) {
      if (now - hint.timestamp > this.CACHE_DURATION) {
        this.hintCache.delete(key);
      }
    }
    
    // Clean up level cache
    for (const [key, level] of this.levelCache.entries()) {
      if (now - level.timestamp > this.CACHE_DURATION) {
        this.levelCache.delete(key);
      }
    }
  }

  private async generateChallengeWithAPI(
    concept: string, 
    difficulty: 'beginner' | 'intermediate' | 'advanced', 
    language: string,
    challengeNumber: number = 1
  ): Promise<AIChallenge> {
    const prompt = `Generate a ${difficulty} level coding challenge #${challengeNumber} for the concept "${concept}" in ${language}.
    
    The challenge should be:
    - Appropriate for ${difficulty} level programmers
    - Focused on ${concept}
    - Written in ${language}
    - Single line or simple multi-line code
    - Practical and educational
    - Progressive difficulty (challenge ${challengeNumber} of 10-15 in this level)
    - Unique and different from basic examples
    
    Please respond with a JSON object containing:
    {
      "prompt": "Clear, concise challenge description that varies from basic examples",
      "expectedCode": "The exact code solution",
      "explanation": "Why this code works and what it demonstrates",
      "hints": ["helpful hint 1", "helpful hint 2", "helpful hint 3"]
    }
    
    Make sure the JSON is valid and properly formatted.`;

    const result = await this.model!.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Extract JSON from response (remove any markdown formatting)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const challengeData = JSON.parse(jsonMatch[0]);
        return {
          prompt: challengeData.prompt,
          expectedCode: challengeData.expectedCode,
          explanation: challengeData.explanation,
          hints: challengeData.hints || []
        };
      }
    } catch (parseError) {
      console.error('Failed to parse API response:', parseError);
    }
    
    // Fallback if parsing fails
    return this.generateMockChallenge(concept, difficulty, language, challengeNumber);
  }

  private generateMockChallenge(
    concept: string, 
    difficulty: 'beginner' | 'intermediate' | 'advanced', 
    language: string,
    challengeNumber: number = 1
  ): Promise<AIChallenge> {
    const mockChallenges = this.getMockChallenges(concept, difficulty, language, challengeNumber);
    const randomChallenge = mockChallenges[Math.floor(Math.random() * mockChallenges.length)];
    
    // Simulate async behavior
    return new Promise(resolve => {
      setTimeout(() => resolve(randomChallenge), 500);
    });
  }

  private getMockChallenges(concept: string, difficulty: string, language: string, challengeNumber: number): AIChallenge[] {
    const baseVariants = this.generateConceptVariants(concept, difficulty, language);
    const challengeVariants = this.generateChallengeVariants(baseVariants, challengeNumber);
    
    return challengeVariants;
  }

  private generateConceptVariants(concept: string, _difficulty: string, language: string): AIChallenge[] {
    const challengePool: { [key: string]: AIChallenge[] } = {
      variables: [
        {
          prompt: `Create a ${language} variable to store your age`,
          expectedCode: language === 'python' ? 'age = 25' : 'let age = 25;',
          explanation: `Variables store data that can be referenced and used later in your program.`,
          hints: ['Think about variable declaration syntax', 'Choose a meaningful name', 'Initialize with a number']
        },
        {
          prompt: `Create a ${language} variable to store your favorite color`,
          expectedCode: language === 'python' ? 'color = "blue"' : 'let color = "blue";',
          explanation: `String variables store text data enclosed in quotes.`,
          hints: ['Use quotes for text values', 'Choose a descriptive name', 'Remember the syntax']
        },
        {
          prompt: `Create a ${language} variable to track if a user is logged in`,
          expectedCode: language === 'python' ? 'is_logged_in = True' : 'let isLoggedIn = true;',
          explanation: `Boolean variables store true/false values for logical operations.`,
          hints: ['Boolean values: true or false', 'Use camelCase for JavaScript', 'No quotes around booleans']
        },
        {
          prompt: `Create a ${language} variable to store the current temperature`,
          expectedCode: language === 'python' ? 'temperature = 72.5' : 'let temperature = 72.5;',
          explanation: `Variables can store decimal numbers (floating point values).`,
          hints: ['Decimal numbers are allowed', 'Use a descriptive name', 'No quotes for numbers']
        },
        {
          prompt: `Create a ${language} variable to store a product price`,
          expectedCode: language === 'python' ? 'price = 19.99' : 'let price = 19.99;',
          explanation: `Variables are commonly used to store financial values.`,
          hints: ['Use decimal notation', 'Choose a meaningful name', 'Consider the data type']
        }
      ],
      loops: [
        {
          prompt: `Write a ${language} loop that prints numbers 1 to 3`,
          expectedCode: language === 'python' ? 'for i in range(1, 4):\n    print(i)' : 'for (let i = 1; i <= 3; i++) {\n    console.log(i);\n}',
          explanation: `This loop iterates through numbers 1 to 3, demonstrating basic loop structure.`,
          hints: ['Use a for loop', 'Start at 1', 'End at 3 (inclusive)']
        },
        {
          prompt: `Create a ${language} loop that counts down from 5 to 1`,
          expectedCode: language === 'python' ? 'for i in range(5, 0, -1):\n    print(i)' : 'for (let i = 5; i >= 1; i--) {\n    console.log(i);\n}',
          explanation: `This loop counts backwards, showing how to decrement in loops.`,
          hints: ['Start at 5', 'Use decrement operator', 'End at 1']
        },
        {
          prompt: `Write a ${language} loop that prints even numbers from 2 to 8`,
          expectedCode: language === 'python' ? 'for i in range(2, 9, 2):\n    print(i)' : 'for (let i = 2; i <= 8; i += 2) {\n    console.log(i);\n}',
          explanation: `This loop demonstrates incrementing by 2 to get even numbers.`,
          hints: ['Start at 2', 'Increment by 2', 'Think about even numbers']
        },
        {
          prompt: `Create a ${language} loop that runs exactly 4 times`,
          expectedCode: language === 'python' ? 'for i in range(4):\n    print(f"Iteration {i}")' : 'for (let i = 0; i < 4; i++) {\n    console.log(`Iteration ${i}`);\n}',
          explanation: `This loop demonstrates running a specific number of iterations.`,
          hints: ['Start at 0', 'Run 4 times', 'Use template literals for output']
        },
        {
          prompt: `Write a ${language} while loop that counts from 1 to 3`,
          expectedCode: language === 'python' ? 'i = 1\nwhile i <= 3:\n    print(i)\n    i += 1' : 'let i = 1;\nwhile (i <= 3) {\n    console.log(i);\n    i++;\n}',
          explanation: `While loops continue until a condition becomes false.`,
          hints: ['Initialize counter', 'Check condition', 'Update counter inside loop']
        }
      ],
      conditionals: [
        {
          prompt: `Write a ${language} conditional to check if a number is greater than 10`,
          expectedCode: language === 'python' ? 'if number > 10:\n    print("Greater than 10")' : 'if (number > 10) {\n    console.log("Greater than 10");\n}',
          explanation: `Conditional statements execute different code based on whether a condition is true or false.`,
          hints: ['Use if statement', 'Check if greater than 10', 'Add appropriate output']
        },
        {
          prompt: `Create a ${language} if-else to check if a number is even or odd`,
          expectedCode: language === 'python' ? 'if number % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")' : 'if (number % 2 === 0) {\n    console.log("Even");\n} else {\n    console.log("Odd");\n}',
          explanation: `The modulo operator (%) helps determine if a number is even or odd.`,
          hints: ['Use modulo operator %', 'Check if remainder is 0', 'Add else clause']
        },
        {
          prompt: `Write a ${language} conditional to check if someone can vote (age >= 18)`,
          expectedCode: language === 'python' ? 'if age >= 18:\n    print("Can vote")' : 'if (age >= 18) {\n    console.log("Can vote");\n}',
          explanation: `Conditional statements are commonly used for eligibility checks.`,
          hints: ['Use greater than or equal to', 'Check age 18', 'Consider voting eligibility']
        },
        {
          prompt: `Create a ${language} conditional to check if a password is strong (length > 8)`,
          expectedCode: language === 'python' ? 'if len(password) > 8:\n    print("Strong password")' : 'if (password.length > 8) {\n    console.log("Strong password");\n}',
          explanation: `String length is commonly checked in validation logic.`,
          hints: ['Check string length', 'Use length property/function', 'Compare with 8']
        },
        {
          prompt: `Write a ${language} conditional to check if a score is passing (>= 60)`,
          expectedCode: language === 'python' ? 'if score >= 60:\n    print("Passing grade")' : 'if (score >= 60) {\n    console.log("Passing grade");\n}',
          explanation: `Conditional statements are useful for grading and scoring systems.`,
          hints: ['Use greater than or equal to', 'Check score 60', 'Think about passing grades']
        }
      ],
      functions: [
        {
          prompt: `Create a ${language} function that greets a person by name`,
          expectedCode: language === 'python' ? 'def greet(name):\n    return f"Hello, {name}!"' : 'function greet(name) {\n    return `Hello, ${name}!`;\n}',
          explanation: `Functions allow you to encapsulate reusable code with parameters and return values.`,
          hints: ['Use function syntax', 'Take name parameter', 'Return greeting string']
        },
        {
          prompt: `Write a ${language} function that calculates the area of a rectangle`,
          expectedCode: language === 'python' ? 'def calculate_area(width, height):\n    return width * height' : 'function calculateArea(width, height) {\n    return width * height;\n}',
          explanation: `Functions can perform calculations and return results.`,
          hints: ['Take two parameters', 'Multiply width and height', 'Return the result']
        },
        {
          prompt: `Create a ${language} function that checks if a number is positive`,
          expectedCode: language === 'python' ? 'def is_positive(number):\n    return number > 0' : 'function isPositive(number) {\n    return number > 0;\n}',
          explanation: `Functions can return boolean values based on conditions.`,
          hints: ['Take number parameter', 'Check if greater than 0', 'Return boolean']
        },
        {
          prompt: `Write a ${language} function that converts Celsius to Fahrenheit`,
          expectedCode: language === 'python' ? 'def celsius_to_fahrenheit(celsius):\n    return (celsius * 9/5) + 32' : 'function celsiusToFahrenheit(celsius) {\n    return (celsius * 9/5) + 32;\n}',
          explanation: `Functions can implement mathematical formulas.`,
          hints: ['Use conversion formula', 'Multiply by 9/5', 'Add 32']
        },
        {
          prompt: `Create a ${language} function that finds the maximum of two numbers`,
          expectedCode: language === 'python' ? 'def find_max(a, b):\n    return max(a, b)' : 'function findMax(a, b) {\n    return Math.max(a, b);\n}',
          explanation: `Functions can use built-in utilities to solve problems.`,
          hints: ['Take two parameters', 'Use max function', 'Return the larger number']
        }
      ],
      arrays: [
        {
          prompt: `Create a ${language} array of your favorite colors`,
          expectedCode: language === 'python' ? 'colors = ["red", "blue", "green"]' : 'let colors = ["red", "blue", "green"];',
          explanation: `Arrays store multiple values in a single variable, indexed by position.`,
          hints: ['Use array syntax', 'Add string elements', 'Use square brackets']
        },
        {
          prompt: `Write a ${language} array of numbers from 1 to 5`,
          expectedCode: language === 'python' ? 'numbers = [1, 2, 3, 4, 5]' : 'let numbers = [1, 2, 3, 4, 5];',
          explanation: `Arrays can store sequences of numbers.`,
          hints: ['Use square brackets', 'Add numbers sequentially', 'Separate with commas']
        },
        {
          prompt: `Create a ${language} array of shopping items`,
          expectedCode: language === 'python' ? 'shopping_list = ["milk", "bread", "eggs"]' : 'let shoppingList = ["milk", "bread", "eggs"];',
          explanation: `Arrays are commonly used for lists and collections.`,
          hints: ['Think about shopping items', 'Use strings', 'Create a practical list']
        },
        {
          prompt: `Write a ${language} array of days of the week`,
          expectedCode: language === 'python' ? 'days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]' : 'let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];',
          explanation: `Arrays can store fixed sets of related data.`,
          hints: ['List all 7 days', 'Use string values', 'Start with Monday']
        },
        {
          prompt: `Create an empty ${language} array for storing user data`,
          expectedCode: language === 'python' ? 'user_data = []' : 'let userData = [];',
          explanation: `Empty arrays can be initialized and filled later.`,
          hints: ['Use empty brackets', 'Choose descriptive name', 'Initialize empty']
        }
      ]
    };

    const conceptChallenges = challengePool[concept] || challengePool.variables;
    
    // Return all challenges for the concept to provide variety
    return conceptChallenges;
  }

  private generateChallengeVariants(baseChallenges: AIChallenge[], challengeNumber: number): AIChallenge[] {
    // For challenges beyond the base set, create variations
    if (challengeNumber > baseChallenges.length) {
      const baseChallenge = baseChallenges[challengeNumber % baseChallenges.length];
      const variations = this.createChallengeVariations(baseChallenge, challengeNumber);
      return [...baseChallenges, ...variations];
    }
    
    return baseChallenges;
  }

  private createChallengeVariations(baseChallenge: AIChallenge, challengeNumber: number): AIChallenge[] {
    const variations: AIChallenge[] = [];
    
    // Create variations based on the base challenge
    if (baseChallenge.prompt.includes('variable')) {
      variations.push({
        prompt: `Create a variable to store item ${challengeNumber}`,
        expectedCode: baseChallenge.expectedCode.replace(/\w+(?=\s*=)/, `item${challengeNumber}`),
        explanation: `Variables can store different types of data with descriptive names.`,
        hints: ['Use meaningful variable names', 'Consider the data type', 'Follow naming conventions']
      });
    }
    
    if (baseChallenge.prompt.includes('loop')) {
      variations.push({
        prompt: `Create a loop that runs ${challengeNumber} times`,
        expectedCode: baseChallenge.expectedCode.replace(/\d+/, challengeNumber.toString()),
        explanation: `Loops can be configured to run any number of iterations.`,
        hints: ['Set the correct loop count', 'Use proper loop syntax', 'Consider the iteration logic']
      });
    }
    
    if (baseChallenge.prompt.includes('function')) {
      variations.push({
        prompt: `Create a function called func${challengeNumber}`,
        expectedCode: baseChallenge.expectedCode.replace(/\w+(?=\()/, `func${challengeNumber}`),
        explanation: `Functions can have different names while maintaining similar structure.`,
        hints: ['Use descriptive function names', 'Follow naming conventions', 'Consider the function purpose']
      });
    }
    
    return variations;
  }

  async generateFeedback(
    challenge: string,
    userCode: string,
    expectedCode: string,
    attemptNumber: number
  ): Promise<AIFeedback> {
    if (this.isApiAvailable && this.model) {
      try {
        return await this.generateFeedbackWithAPI(challenge, userCode, expectedCode, attemptNumber);
      } catch (error) {
        console.error('API call failed, falling back to mock feedback:', error);
        return this.generateMockFeedback(userCode, expectedCode, attemptNumber);
      }
    } else {
      return this.generateMockFeedback(userCode, expectedCode, attemptNumber);
    }
  }

  private async generateFeedbackWithAPI(
    challenge: string,
    userCode: string,
    expectedCode: string,
    attemptNumber: number
  ): Promise<AIFeedback> {
    const prompt = `Analyze this coding attempt and provide helpful feedback:

    Challenge: ${challenge}
    Expected Code: ${expectedCode}
    User's Code: ${userCode}
    Attempt Number: ${attemptNumber}

    Please provide feedback as a JSON object:
    {
      "message": "Specific, constructive feedback about the code",
      "encouragement": "Positive, motivating message",
      "hint": "Helpful hint for improvement (optional)"
    }

    Make the feedback:
    - Constructive and educational
    - Appropriate for attempt number ${attemptNumber}
    - Encouraging but specific
    - Include a hint if the user seems stuck`;

    const result = await this.model!.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const feedbackData = JSON.parse(jsonMatch[0]);
        return {
          message: feedbackData.message,
          encouragement: feedbackData.encouragement,
          hint: feedbackData.hint
        };
      }
    } catch (parseError) {
      console.error('Failed to parse feedback response:', parseError);
    }
    
    return this.generateMockFeedback(userCode, expectedCode, attemptNumber);
  }

  private generateMockFeedback(userCode: string, expectedCode: string, attemptNumber: number): AIFeedback {
    const encouragements = [
      "Great effort! Keep going! 🌟",
      "You're learning well! 💪",
      "Almost there! 🎯",
      "Every expert was once a beginner! 🚀"
    ];

    const baseEncouragement = encouragements[Math.min(attemptNumber - 1, encouragements.length - 1)];

    if (attemptNumber === 1) {
      return {
        message: "🤔 Take a moment to think about the structure needed...",
        encouragement: baseEncouragement,
        hint: "Review the syntax requirements carefully."
      };
    } else if (attemptNumber === 2) {
      return {
        message: "💡 Check your syntax - something might be missing.",
        encouragement: baseEncouragement,
        hint: this.generateSpecificHint(userCode, expectedCode)
      };
    } else if (attemptNumber === 3) {
      return {
        message: "🎯 Let me give you a more specific hint.",
        encouragement: baseEncouragement,
        hint: this.generateDirectHint(expectedCode)
      };
    } else {
      return {
        message: `✨ Here's the solution: \`${expectedCode}\``,
        encouragement: "Learning takes practice! 🌱",
        hint: this.explainSolution(expectedCode)
      };
    }
  }

  private generateSpecificHint(userCode: string, expectedCode: string): string {
    if (!userCode.includes(';') && expectedCode.includes(';')) {
      return "Don't forget the semicolon at the end!";
    }
    if (!userCode.includes('let') && expectedCode.includes('let')) {
      return "You might need to use the 'let' keyword.";
    }
    if (!userCode.includes('for') && expectedCode.includes('for')) {
      return "This challenge requires a for loop.";
    }
    if (!userCode.includes('if') && expectedCode.includes('if')) {
      return "This challenge needs an if statement.";
    }
    if (!userCode.includes('function') && expectedCode.includes('function')) {
      return "You need to create a function for this challenge.";
    }
    return "Check the structure and syntax of your code.";
  }

  private generateDirectHint(expectedCode: string): string {
    if (expectedCode.includes('for')) {
      return "Try: for (let i = 0; i < number; i++) { }";
    }
    if (expectedCode.includes('if')) {
      return "Try: if (condition) { }";
    }
    if (expectedCode.includes('function')) {
      return "Try: function name(parameters) { }";
    }
    if (expectedCode.includes('let')) {
      return "Try: let variableName = value;";
    }
    return `The pattern you need is similar to the expected solution.`;
  }

  private explainSolution(expectedCode: string): string {
    if (expectedCode.includes('for')) {
      return "This for loop has three parts: initialization, condition, and increment.";
    }
    if (expectedCode.includes('if')) {
      return "This if statement checks a condition and executes code when true.";
    }
    if (expectedCode.includes('function')) {
      return "This function declaration creates reusable code with parameters.";
    }
    if (expectedCode.includes('let')) {
      return "This variable declaration creates a new variable with a value.";
    }
    return "This code follows the standard syntax for this programming construct.";
  }

  async generateHint(
    challengeDescription: string,
    language: string,
    playerLevel: 'beginner' | 'intermediate' | 'advanced',
    attemptNumber: number = 1
  ): Promise<string> {
    // Check cache first
    const cacheKey = `${challengeDescription}-${language}-${playerLevel}-${attemptNumber}`;
    const cached = this.hintCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('Using cached hint for:', cacheKey);
      return cached.hint;
    }

    if (this.isApiAvailable && this.model) {
      try {
        const hint = await this.throttledRequest(async () => {
          const prompt = `Generate a helpful hint for a ${playerLevel} level ${language} programming challenge:

          Challenge: ${challengeDescription}
          Player Level: ${playerLevel}
          Attempt Number: ${attemptNumber}

          Provide a hint that is:
          - Appropriate for ${playerLevel} level
          - Specific enough to be helpful
          - Not giving away the complete solution
          - Encouraging and educational

          Respond with just the hint text, no JSON formatting needed.`;

          const result = await this.model!.generateContent(prompt);
          const response = await result.response;
          return response.text().trim();
        });

        // Cache the result
        this.hintCache.set(cacheKey, {
          hint,
          timestamp: Date.now()
        });

        // Clean up old cache entries
        this.cleanupCache();

        return hint;
      } catch (error) {
        console.error('API call failed for hint generation:', error);
      }
    }

    // Fallback hints
    const levelHints = {
      beginner: [
        "Think about the basic syntax for this type of code.",
        "Remember to check brackets and semicolons.",
        "Break the problem into smaller parts."
      ],
      intermediate: [
        "Consider the logical flow of your code.",
        "Think about how different parts connect.",
        "Review the syntax for this concept."
      ],
      advanced: [
        "Consider edge cases and optimal solutions.",
        "Think about efficiency and best practices.",
        "Consider alternative approaches."
      ]
    };

    const hints = levelHints[playerLevel];
    return hints[Math.min(attemptNumber - 1, hints.length - 1)];
  }

  // Method to generate infinite dynamic levels
  async generateDynamicLevel(
    levelNumber: number,
    language: string = 'javascript'
  ): Promise<{ title: string; description: string; concept: string; difficulty: 'beginner' | 'intermediate' | 'advanced' }> {
    // Check cache first
    const cacheKey = `${levelNumber}-${language}`;
    const cached = this.levelCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('Using cached level for:', cacheKey);
      return {
        title: cached.title,
        description: cached.description,
        concept: cached.concept,
        difficulty: cached.difficulty
      };
    }

    // Define programming concepts for infinite level generation
    const concepts = [
      'variables', 'loops', 'conditionals', 'functions', 'arrays', 'objects',
      'string manipulation', 'mathematical operations', 'boolean logic', 'type conversion',
      'error handling', 'async programming', 'recursion', 'data structures', 'algorithms'
    ];

    // Calculate difficulty based on level number
    let difficulty: 'beginner' | 'intermediate' | 'advanced';
    if (levelNumber <= 5) {
      difficulty = 'beginner';
    } else if (levelNumber <= 15) {
      difficulty = 'intermediate';
    } else {
      difficulty = 'advanced';
    }

    // Select concept based on level (cycle through concepts)
    const concept = concepts[levelNumber % concepts.length];

    if (this.isApiAvailable && this.model) {
      try {
        const levelData = await this.throttledRequest(async () => {
          const prompt = `Generate a ${difficulty} level programming challenge for Level ${levelNumber}:

          Programming Language: ${language}
          Concept: ${concept}
          Difficulty: ${difficulty}

          Create a JSON response with:
          {
            "title": "Creative, engaging level title",
            "description": "Brief description of what the player will learn",
            "concept": "${concept}",
            "difficulty": "${difficulty}"
          }

          Make it educational, progressive, and fun!`;

          const result = await this.model!.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          
          try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              return {
                title: parsed.title,
                description: parsed.description,
                concept: parsed.concept,
                difficulty: parsed.difficulty
              };
            }
          } catch (parseError) {
            console.error('Failed to parse level data:', parseError);
          }
          
          throw new Error('Failed to parse API response');
        });

        // Cache the result
        this.levelCache.set(cacheKey, {
          ...levelData,
          timestamp: Date.now()
        });

        // Clean up old cache entries
        this.cleanupCache();

        return levelData;
      } catch (error) {
        console.error('API call failed for level generation:', error);
      }
    }

    // Fallback level generation
    const fallbackLevel = {
      title: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} ${concept.charAt(0).toUpperCase() + concept.slice(1)}`,
      description: `Master ${concept} with ${difficulty} level challenges`,
      concept: concept,
      difficulty: difficulty
    };

    // Cache the fallback result too
    this.levelCache.set(cacheKey, {
      ...fallbackLevel,
      timestamp: Date.now()
    });

    return fallbackLevel;
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();
