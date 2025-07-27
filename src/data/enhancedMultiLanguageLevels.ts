import { Level, Challenge } from '../types/game';
import { ExpectedStructure } from '../utils/astValidation';

// Enhanced challenge interface with AST validation support
interface EnhancedChallenge extends Challenge {
  astValidation?: ExpectedStructure;
}

// Language-specific challenge data with AST validation
const createLanguageVariantsWithAST = (
  id: number,
  prompt: string,
  languages: Record<string, { 
    expectedCode: string; 
    hints: string[];
    astValidation?: ExpectedStructure;
  }>,
  beatPosition: number
): EnhancedChallenge[] => {
  return Object.entries(languages).map(([lang, data]) => ({
    id,
    prompt,
    expectedCode: data.expectedCode,
    hints: data.hints,
    beatPosition,
    timeSignature: 4,
    language: lang,
    astValidation: data.astValidation
  }));
};

// Multi-language challenges for Level 1: Variables & Values with AST validation
const level1ChallengesAST: EnhancedChallenge[] = [
  // Challenge 1: Create a variable named 'score' with value 0
  ...createLanguageVariantsWithAST(1, "Create a variable named 'score' with the value 0", {
    javascript: {
      expectedCode: "let score = 0;",
      hints: ["Use 'let' to declare a variable", "Numbers don't need quotes"],
      astValidation: {
        type: 'variable',
        name: 'score',
        value: 0,
        kind: 'let'
      }
    },
    python: {
      expectedCode: "score = 0",
      hints: ["Python doesn't need 'let' or 'var'", "No semicolon needed"],
      astValidation: {
        type: 'variable',
        name: 'score',
        value: 0
      }
    },
    java: {
      expectedCode: "int score = 0;",
      hints: ["Java requires type declaration", "Use 'int' for integers"]
    },
    typescript: {
      expectedCode: "let score: number = 0;",
      hints: ["TypeScript can include type annotations", "Use 'number' type for numeric values"],
      astValidation: {
        type: 'variable',
        name: 'score',
        value: 0,
        kind: 'let'
      }
    }
  }, 0),

  // Challenge 2: Create a string variable
  ...createLanguageVariantsWithAST(2, "Create a variable named 'playerName' with the value 'Hero'", {
    javascript: {
      expectedCode: "let playerName = 'Hero';",
      hints: ["Use single or double quotes for strings", "Don't forget the semicolon!"],
      astValidation: {
        type: 'variable',
        name: 'playerName',
        value: 'Hero',
        kind: 'let'
      }
    },
    python: {
      expectedCode: "player_name = 'Hero'",
      hints: ["Python uses snake_case convention", "Single or double quotes work"],
      astValidation: {
        type: 'variable',
        name: 'player_name',
        value: 'Hero'
      }
    },
    typescript: {
      expectedCode: "let playerName: string = 'Hero';",
      hints: ["Use 'string' type annotation", "Single or double quotes work"],
      astValidation: {
        type: 'variable',
        name: 'playerName',
        value: 'Hero',
        kind: 'let'
      }
    }
  }, 4),

  // Challenge 3: Boolean variable
  ...createLanguageVariantsWithAST(3, "Create a boolean variable 'isGameOver' set to false", {
    javascript: {
      expectedCode: "let isGameOver = false;",
      hints: ["Boolean values are 'true' or 'false'", "No quotes around boolean values"],
      astValidation: {
        type: 'variable',
        name: 'isGameOver',
        value: false,
        kind: 'let'
      }
    },
    python: {
      expectedCode: "is_game_over = False",
      hints: ["Python uses 'True' and 'False' (capitalized)", "Snake_case naming convention"],
      astValidation: {
        type: 'variable',
        name: 'is_game_over',
        value: false
      }
    },
    typescript: {
      expectedCode: "let isGameOver: boolean = false;",
      hints: ["Use 'boolean' type annotation", "Values are 'true' or 'false'"],
      astValidation: {
        type: 'variable',
        name: 'isGameOver',
        value: false,
        kind: 'let'
      }
    }
  }, 8),

  // Challenge 4: Constant variable
  ...createLanguageVariantsWithAST(4, "Declare a constant variable 'gameTitle' with the value 'Code Beats'", {
    javascript: {
      expectedCode: "const gameTitle = 'Code Beats';",
      hints: ["Use 'const' for values that won't change", "Constants must be initialized"],
      astValidation: {
        type: 'variable',
        name: 'gameTitle',
        value: 'Code Beats',
        kind: 'const'
      }
    },
    python: {
      expectedCode: "GAME_TITLE = 'Code Beats'",
      hints: ["Python uses ALL_CAPS for constants", "No special const keyword"],
      astValidation: {
        type: 'variable',
        name: 'GAME_TITLE',
        value: 'Code Beats'
      }
    },
    typescript: {
      expectedCode: "const gameTitle: string = 'Code Beats';",
      hints: ["TypeScript uses 'const' like JavaScript", "Can include type annotation"],
      astValidation: {
        type: 'variable',
        name: 'gameTitle',
        value: 'Code Beats',
        kind: 'const'
      }
    }
  }, 12)
];

// Multi-language challenges for Level 2: Functions with AST validation
const level2ChallengesAST: EnhancedChallenge[] = [
  // Challenge 1: Basic function declaration
  ...createLanguageVariantsWithAST(1, "Create a function named 'sayHello' that takes no parameters", {
    javascript: {
      expectedCode: "function sayHello() {}",
      hints: ["Use the 'function' keyword", "Function name followed by parentheses"],
      astValidation: {
        type: 'function',
        name: 'sayHello',
        params: []
      }
    },
    python: {
      expectedCode: "def say_hello():",
      hints: ["Python uses 'def' keyword", "Function names use snake_case"],
      astValidation: {
        type: 'function',
        name: 'say_hello',
        params: []
      }
    },
    typescript: {
      expectedCode: "function sayHello(): void {}",
      hints: ["Include return type annotation", "Use 'void' for no return"],
      astValidation: {
        type: 'function',
        name: 'sayHello',
        params: []
      }
    }
  }, 0),

  // Challenge 2: Function with parameters
  ...createLanguageVariantsWithAST(2, "Create a function 'greet' that takes a 'name' parameter", {
    javascript: {
      expectedCode: "function greet(name) {}",
      hints: ["Parameters go inside parentheses", "No type declaration needed"],
      astValidation: {
        type: 'function',
        name: 'greet',
        params: ['name']
      }
    },
    python: {
      expectedCode: "def greet(name):",
      hints: ["Parameter names inside parentheses", "Colon at the end"],
      astValidation: {
        type: 'function',
        name: 'greet',
        params: ['name']
      }
    },
    typescript: {
      expectedCode: "function greet(name: string): void {}",
      hints: ["Include parameter type annotations", "Use 'string' type for names"],
      astValidation: {
        type: 'function',
        name: 'greet',
        params: ['name']
      }
    }
  }, 4),

  // Challenge 3: Function with return value
  ...createLanguageVariantsWithAST(3, "Create a function 'getScore' that returns the number 100", {
    javascript: {
      expectedCode: "function getScore() { return 100; }",
      hints: ["Use 'return' keyword to send back a value", "Return statements end function execution"],
      astValidation: {
        type: 'function',
        name: 'getScore',
        params: [],
        returns: 100
      }
    },
    python: {
      expectedCode: "def get_score():\n    return 100",
      hints: ["Python functions can return values", "Remember proper indentation"],
      astValidation: {
        type: 'function',
        name: 'get_score',
        params: [],
        returns: 100
      }
    },
    typescript: {
      expectedCode: "function getScore(): number { return 100; }",
      hints: ["Change return type to 'number'", "TypeScript infers return types but explicit is better"],
      astValidation: {
        type: 'function',
        name: 'getScore',
        params: [],
        returns: 100
      }
    }
  }, 8)
];

// Multi-language challenges for Level 3: Conditionals with AST validation
const level3ChallengesAST: EnhancedChallenge[] = [
  // Challenge 1: If statement
  ...createLanguageVariantsWithAST(1, "Create an if statement that checks if 'score' is greater than 100", {
    javascript: {
      expectedCode: "if (score > 100) {}",
      hints: ["If statements check conditions", "Use comparison operators like >"],
      astValidation: {
        type: 'if-statement',
        condition: {
          type: 'binary',
          operator: '>',
          left: 'score',
          right: 100
        }
      }
    },
    python: {
      expectedCode: "if score > 100:",
      hints: ["Python if statement with colon", "No parentheses needed around condition"],
      astValidation: {
        type: 'if-statement',
        condition: {
          type: 'binary',
          operator: '>',
          left: 'score',
          right: 100
        }
      }
    },
    typescript: {
      expectedCode: "if (score > 100) {}",
      hints: ["TypeScript if statement", "Same as JavaScript"],
      astValidation: {
        type: 'if-statement',
        condition: {
          type: 'binary',
          operator: '>',
          left: 'score',
          right: 100
        }
      }
    }
  }, 0)
];

// Create the enhanced multi-language levels array
export const enhancedMultiLanguageLevels: Level[] = [
  {
    id: 1,
    title: "Variables & Values",
    concept: "Variables",
    description: "Learn to store and use data in variables",
    tempo: 80,
    difficulty: 'beginner',
    unlocked: true,
    challenges: level1ChallengesAST as Challenge[]
  },
  {
    id: 2,
    title: "Functions & Methods",
    concept: "Functions",
    description: "Create reusable code with functions",
    tempo: 100,
    difficulty: 'beginner',
    unlocked: false,
    challenges: level2ChallengesAST as Challenge[]
  },
  {
    id: 3,
    title: "Conditionals & Control",
    concept: "Conditionals",
    description: "Control program flow with conditions",
    tempo: 120,
    difficulty: 'intermediate',
    unlocked: false,
    challenges: level3ChallengesAST as Challenge[]
  }
];

// Helper function to get challenges for a specific language with AST validation
export const getChallengesForLanguageWithAST = (level: Level, language: string): EnhancedChallenge[] => {
  return level.challenges.filter(challenge => challenge.language === language) as EnhancedChallenge[];
};

// Helper function to get AST validation structure for a challenge
export const getASTValidation = (challenge: Challenge): ExpectedStructure | undefined => {
  return (challenge as EnhancedChallenge).astValidation;
};
