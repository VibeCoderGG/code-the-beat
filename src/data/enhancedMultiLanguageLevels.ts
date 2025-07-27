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

// --- LEVEL 1: Variables & Values ---
const level1ChallengesAST: EnhancedChallenge[] = [
  // Challenge 1: Create a variable named 'score' with value 0
  ...createLanguageVariantsWithAST(1, "Create a variable named 'score' with the value 0", {
    javascript: {
      expectedCode: "let score = 0;",
      hints: ["Use 'let' to declare a variable", "Numbers don't need quotes"],
      astValidation: { type: 'variable', name: 'score', value: 0, kind: 'let' }
    },
    python: {
      expectedCode: "score = 0",
      hints: ["Python doesn't need 'let' or 'var'", "No semicolon needed"],
      astValidation: { type: 'variable', name: 'score', value: 0 }
    },
    java: {
      expectedCode: "int score = 0;",
      hints: ["Java is statically typed; use 'int' for integers", "Don't forget the semicolon!"]
    },
    typescript: {
      expectedCode: "let score: number = 0;",
      hints: ["TypeScript can include type annotations", "Use 'number' for numeric values"],
      astValidation: { type: 'variable', name: 'score', value: 0, kind: 'let' }
    },
    cpp: {
        expectedCode: "int score = 0;",
        hints: ["C++ requires you to declare the type of the variable", "Use 'int' for an integer."]
    },
    html: {
        expectedCode: `<div id="score">0</div>`,
        hints: ["HTML doesn't have variables in the same way", "Use an element's ID to identify it."]
    },
    css: {
        expectedCode: ":root { --score: 0; }",
        hints: ["CSS uses custom properties (variables) defined within a selector", "':root' is a good place for global variables."]
    }
  }, 0),

  // Challenge 2: Create a string variable
  ...createLanguageVariantsWithAST(2, "Create a variable named 'playerName' with the value 'Hero'", {
    javascript: {
      expectedCode: "let playerName = 'Hero';",
      hints: ["Use single or double quotes for strings", "Don't forget the semicolon!"],
      astValidation: { type: 'variable', name: 'playerName', value: 'Hero', kind: 'let' }
    },
    python: {
      expectedCode: "player_name = 'Hero'",
      hints: ["Python uses snake_case convention for variable names", "Single or double quotes work"],
      astValidation: { type: 'variable', name: 'player_name', value: 'Hero' }
    },
    java: {
        expectedCode: `String playerName = "Hero";`,
        hints: ["In Java, string types are capitalized: 'String'", "Use double quotes for strings."]
    },
    typescript: {
      expectedCode: "let playerName: string = 'Hero';",
      hints: ["Use 'string' type annotation", "Single or double quotes work"],
      astValidation: { type: 'variable', name: 'playerName', value: 'Hero', kind: 'let' }
    },
    cpp: {
        expectedCode: `#include <string>\nstd::string playerName = "Hero";`,
        hints: ["You need to include the <string> header", `Use 'std::string' for the string type.`]
    },
    html: {
        expectedCode: `<h1 class="player-name">Hero</h1>`,
        hints: ["Use an element's content to hold a string value", "A class is a good way to label the element's purpose."]
    },
    css: {
        expectedCode: ".player-name { content: 'Hero'; }",
        hints: ["The 'content' property is often used with pseudo-elements", "Use quotes for string values."]
    }
  }, 4),

  // Challenge 3: Boolean variable
  ...createLanguageVariantsWithAST(3, "Create a boolean variable 'isGameOver' set to false", {
    javascript: {
      expectedCode: "let isGameOver = false;",
      hints: ["Boolean values are 'true' or 'false'", "No quotes around boolean values"],
      astValidation: { type: 'variable', name: 'isGameOver', value: false, kind: 'let' }
    },
    python: {
      expectedCode: "is_game_over = False",
      hints: ["Python uses 'True' and 'False' (capitalized)", "Snake_case naming convention"],
      astValidation: { type: 'variable', name: 'is_game_over', value: false }
    },
    java: {
        expectedCode: "boolean isGameOver = false;",
        hints: ["Java's boolean type is 'boolean'", "Values are lowercase 'true' or 'false'."]
    },
    typescript: {
      expectedCode: "let isGameOver: boolean = false;",
      hints: ["Use 'boolean' type annotation", "Values are 'true' or 'false'"],
      astValidation: { type: 'variable', name: 'isGameOver', value: false, kind: 'let' }
    },
    cpp: {
        expectedCode: "bool isGameOver = false;",
        hints: ["C++ uses the 'bool' type for booleans", "Values are 'true' or 'false'."]
    },
    html: {
        expectedCode: `<div class="game-state" data-game-over="false"></div>`,
        hints: ["'data-*' attributes are a great way to store state or boolean-like values.", "The value itself is a string."]
    },
    css: {
        expectedCode: `[data-game-over="false"] { display: block; }`,
        hints: ["Attribute selectors can be used to check for values", "This is a way to apply styles conditionally."]
    }
  }, 8),

  // Challenge 4: Constant variable
  ...createLanguageVariantsWithAST(4, "Declare a constant 'GAME_TITLE' with the value 'Code Beats'", {
    javascript: {
      expectedCode: "const GAME_TITLE = 'Code Beats';",
      hints: ["Use 'const' for values that won't change", "Convention is often uppercase for constants"],
      astValidation: { type: 'variable', name: 'GAME_TITLE', value: 'Code Beats', kind: 'const' }
    },
    python: {
      expectedCode: "GAME_TITLE = 'Code Beats'",
      hints: ["Python uses ALL_CAPS for constants by convention", "There is no special 'const' keyword"],
      astValidation: { type: 'variable', name: 'GAME_TITLE', value: 'Code Beats' }
    },
    java: {
        expectedCode: `final String GAME_TITLE = "Code Beats";`,
        hints: ["Java uses the 'final' keyword to create constants", "Convention is to use uppercase."]
    },
    typescript: {
      expectedCode: "const GAME_TITLE: string = 'Code Beats';",
      hints: ["TypeScript uses 'const' like JavaScript", "Can include type annotation"],
      astValidation: { type: 'variable', name: 'GAME_TITLE', value: 'Code Beats', kind: 'const' }
    },
    cpp: {
        expectedCode: `const std::string GAME_TITLE = "Code Beats";`,
        hints: ["Use the 'const' keyword before the type", "Convention is often uppercase."]
    }
  }, 12)
];

// --- LEVEL 2: Functions & Methods ---
const level2ChallengesAST: EnhancedChallenge[] = [
  // Challenge 1: Basic function declaration
  ...createLanguageVariantsWithAST(1, "Create a function named 'sayHello' that takes no parameters", {
    javascript: {
      expectedCode: "function sayHello() {}",
      hints: ["Use the 'function' keyword", "Function name followed by parentheses"],
      astValidation: { type: 'function', name: 'sayHello', params: [] }
    },
    python: {
      expectedCode: "def say_hello():\n  pass",
      hints: ["Python uses 'def' keyword", "Use 'pass' for an empty function body"],
      astValidation: { type: 'function', name: 'say_hello', params: [] }
    },
    java: {
        expectedCode: "void sayHello() {}",
        hints: ["Specify the return type ('void' for none)", "Curly braces define the function body."]
    },
    typescript: {
      expectedCode: "function sayHello(): void {}",
      hints: ["Include return type annotation", "Use 'void' for no return"],
      astValidation: { type: 'function', name: 'sayHello', params: [] }
    },
    cpp: {
        expectedCode: "void sayHello() {}",
        hints: ["You must specify a return type, like 'void'", "Parentheses are required after the name."]
    },
    css: {
        expectedCode: ".say-hello { }",
        hints: ["A CSS class is a reusable block of styles", "It's the closest concept to a 'function' in CSS."]
    }
  }, 0),

  // Challenge 2: Function with a parameter
  ...createLanguageVariantsWithAST(2, "Create a function 'greet' that takes a 'name' parameter", {
    javascript: {
      expectedCode: "function greet(name) {}",
      hints: ["Parameters go inside parentheses", "No type declaration needed"],
      astValidation: { type: 'function', name: 'greet', params: ['name'] }
    },
    python: {
      expectedCode: "def greet(name):\n  pass",
      hints: ["Parameter names inside parentheses", "Colon at the end"],
      astValidation: { type: 'function', name: 'greet', params: ['name'] }
    },
    java: {
        expectedCode: "void greet(String name) {}",
        hints: ["You must specify the type of each parameter", "'String' is the type for text."]
    },
    typescript: {
      expectedCode: "function greet(name: string): void {}",
      hints: ["Include parameter type annotations", "Use 'string' type for names"],
      astValidation: { type: 'function', name: 'greet', params: ['name'] }
    },
    cpp: {
        expectedCode: "void greet(std::string name) {}",
        hints: ["You must specify the type for each parameter", "Use 'std::string' for text."]
    }
  }, 4),

  // Challenge 3: Function with a return value
  ...createLanguageVariantsWithAST(3, "Create a function 'getScore' that returns the number 100", {
    javascript: {
      expectedCode: "function getScore() { return 100; }",
      hints: ["Use 'return' keyword to send back a value", "Return statements end function execution"],
      astValidation: { type: 'function', name: 'getScore', params: [], returns: 100 }
    },
    python: {
      expectedCode: "def get_score():\n  return 100",
      hints: ["Python functions can return values", "Remember proper indentation"],
      astValidation: { type: 'function', name: 'get_score', params: [], returns: 100 }
    },
    java: {
        expectedCode: "int getScore() {\n  return 100;\n}",
        hints: ["The function's return type ('int') must match the returned value.", "Use the 'return' keyword."]
    },
    typescript: {
      expectedCode: "function getScore(): number { return 100; }",
      hints: ["Change return type to 'number'", "TypeScript infers return types but explicit is better"],
      astValidation: { type: 'function', name: 'getScore', params: [], returns: 100 }
    },
    cpp: {
        expectedCode: "int getScore() {\n  return 100;\n}",
        hints: ["The function return type ('int') must be declared before the name.", "Use the 'return' keyword."]
    }
  }, 8)
];

// --- LEVEL 3: Conditionals & Control ---
const level3ChallengesAST: EnhancedChallenge[] = [
  // Challenge 1: If statement
  ...createLanguageVariantsWithAST(1, "Create an if statement that checks if 'score' is greater than 100", {
    javascript: {
      expectedCode: "if (score > 100) {}",
      hints: ["If statements check conditions", "Use comparison operators like >"],
      astValidation: { type: 'if-statement', condition: { type: 'binary', operator: '>', left: 'score', right: 100 } }
    },
    python: {
      expectedCode: "if score > 100:",
      hints: ["Python if statement with colon", "No parentheses needed around condition"],
      astValidation: { type: 'if-statement', condition: { type: 'binary', operator: '>', left: 'score', right: 100 } }
    },
    java: {
        expectedCode: "if (score > 100) {}",
        hints: ["The condition must be inside parentheses", "The code to execute goes inside curly braces."]
    },
    typescript: {
      expectedCode: "if (score > 100) {}",
      hints: ["TypeScript if statement is the same as JavaScript", "Condition goes in parentheses"],
      astValidation: { type: 'if-statement', condition: { type: 'binary', operator: '>', left: 'score', right: 100 } }
    },
    cpp: {
        expectedCode: "if (score > 100) {}",
        hints: ["The syntax is very similar to Java and JavaScript", "The condition is enclosed in parentheses."]
    },
    css: {
        expectedCode: "@media (min-width: 100px) { }",
        hints: ["Media queries are CSS's way of handling conditions", "This one applies styles if the viewport is at least 100px wide."]
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
  // This function filters all challenges in a level and returns only those matching the specified language.
  return level.challenges.filter(challenge => challenge.language === language) as EnhancedChallenge[];
};

// Helper function to get AST validation structure for a challenge
export const getASTValidation = (challenge: Challenge): ExpectedStructure | undefined => {
  // This casts the challenge to the enhanced type to access the optional astValidation property.
  return (challenge as EnhancedChallenge).astValidation;
};
