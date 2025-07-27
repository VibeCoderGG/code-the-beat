import { Level, Challenge } from '../types/game';

// Language-specific challenge data
const createLanguageVariants = (
  id: number,
  prompt: string,
  languages: Record<string, { expectedCode: string; hints: string[] }>,
  beatPosition: number
): Challenge[] => {
  return Object.entries(languages).map(([lang, data]) => ({
    id,
    prompt,
    expectedCode: data.expectedCode,
    hints: data.hints,
    beatPosition,
    timeSignature: 4,
    language: lang
  }));
};

// Multi-language challenges for Level 1: Variables & Values
const level1Challenges: Challenge[] = [
  // Challenge 1: Create a variable named 'score' with value 0
  ...createLanguageVariants(1, "Create a variable named 'score' with the value 0", {
    javascript: {
      expectedCode: "let score = 0;",
      hints: ["Use 'let' to declare a variable", "Numbers don't need quotes"]
    },
    python: {
      expectedCode: "score = 0",
      hints: ["Python doesn't need 'let' or 'var'", "No semicolon needed"]
    },
    java: {
      expectedCode: "int score = 0;",
      hints: ["Java requires type declaration", "Use 'int' for integers"]
    },
    typescript: {
      expectedCode: "let score: number = 0;",
      hints: ["TypeScript can include type annotations", "Use 'number' type for numeric values"]
    },
    cpp: {
      expectedCode: "int score = 0;",
      hints: ["C++ requires type declaration", "Use 'int' for integers"]
    },
    html: {
      expectedCode: "<span id=\"score\">0</span>",
      hints: ["HTML uses elements to display content", "Use id attribute for identification"]
    },
    css: {
      expectedCode: ".score { content: \"0\"; }",
      hints: ["CSS uses selectors and properties", "Content property can display text"]
    },
    go: {
      expectedCode: "var score int = 0",
      hints: ["Go uses 'var' keyword", "Type comes after variable name"]
    }
  }, 0),

  // Challenge 2: Create a string variable
  ...createLanguageVariants(2, "Create a variable named 'playerName' with the value 'Hero'", {
    javascript: {
      expectedCode: "let playerName = 'Hero';",
      hints: ["Use single or double quotes for strings", "Don't forget the semicolon!"]
    },
    python: {
      expectedCode: "player_name = 'Hero'",
      hints: ["Python uses snake_case convention", "Single or double quotes work"]
    },
    java: {
      expectedCode: "String playerName = \"Hero\";",
      hints: ["Java uses 'String' type for text", "Use double quotes for strings"]
    },
    typescript: {
      expectedCode: "let playerName: string = 'Hero';",
      hints: ["Use 'string' type annotation", "Single or double quotes work"]
    },
    cpp: {
      expectedCode: "string playerName = \"Hero\";",
      hints: ["C++ uses 'string' type", "Include <string> header if needed"]
    },
    html: {
      expectedCode: "<span class=\"player-name\">Hero</span>",
      hints: ["HTML elements contain text content", "Use class for styling hooks"]
    },
    css: {
      expectedCode: ".player-name::before { content: \"Hero\"; }",
      hints: ["CSS pseudo-elements can insert content", "Use ::before or ::after"]
    },
    go: {
      expectedCode: "var playerName string = \"Hero\"",
      hints: ["Go uses 'string' type", "Type declaration after variable name"]
    }
  }, 4),

  // Challenge 3: Boolean variable
  ...createLanguageVariants(3, "Create a boolean variable 'isGameOver' set to false", {
    javascript: {
      expectedCode: "let isGameOver = false;",
      hints: ["Boolean values are 'true' or 'false'", "No quotes around boolean values"]
    },
    python: {
      expectedCode: "is_game_over = False",
      hints: ["Python uses 'True' and 'False' (capitalized)", "Snake_case naming convention"]
    },
    java: {
      expectedCode: "boolean isGameOver = false;",
      hints: ["Java uses 'boolean' type", "Values are 'true' or 'false' (lowercase)"]
    },
    typescript: {
      expectedCode: "let isGameOver: boolean = false;",
      hints: ["Use 'boolean' type annotation", "Values are 'true' or 'false'"]
    },
    cpp: {
      expectedCode: "bool isGameOver = false;",
      hints: ["C++ uses 'bool' type", "Values are 'true' or 'false'"]
    },
    html: {
      expectedCode: "<input type=\"checkbox\" id=\"gameOver\">",
      hints: ["HTML checkbox represents boolean state", "Use 'checked' attribute for true"]
    },
    css: {
      expectedCode: ".game-over { display: none; }",
      hints: ["CSS can represent boolean states with display", "none = false, block = true"]
    },
    go: {
      expectedCode: "var isGameOver bool = false",
      hints: ["Go uses 'bool' type", "Values are 'true' or 'false'"]
    }
  }, 8),

  // Challenge 4: Constant variable
  ...createLanguageVariants(4, "Declare a constant variable 'gameTitle' with the value 'Code Beats'", {
    javascript: {
      expectedCode: "const gameTitle = 'Code Beats';",
      hints: ["Use 'const' for values that won't change", "Constants must be initialized"]
    },
    python: {
      expectedCode: "GAME_TITLE = 'Code Beats'",
      hints: ["Python uses ALL_CAPS for constants", "No special const keyword"]
    },
    java: {
      expectedCode: "final String gameTitle = \"Code Beats\";",
      hints: ["Java uses 'final' for constants", "Combine with type declaration"]
    },
    typescript: {
      expectedCode: "const gameTitle: string = 'Code Beats';",
      hints: ["TypeScript uses 'const' like JavaScript", "Can include type annotation"]
    },
    cpp: {
      expectedCode: "const string gameTitle = \"Code Beats\";",
      hints: ["C++ uses 'const' keyword", "Place before type declaration"]
    },
    html: {
      expectedCode: "<h1>Code Beats</h1>",
      hints: ["HTML elements can represent constant content", "Use semantic elements like h1"]
    },
    css: {
      expectedCode: ".game-title::after { content: \"Code Beats\"; }",
      hints: ["CSS content property creates constant text", "Use pseudo-elements for generated content"]
    },
    go: {
      expectedCode: "const gameTitle = \"Code Beats\"",
      hints: ["Go uses 'const' keyword", "Type is inferred automatically"]
    }
  }, 12),

  // Challenge 5: Assignment
  ...createLanguageVariants(5, "Declare a variable 'health' and assign it the value 100", {
    javascript: {
      expectedCode: "let health = 100;",
      hints: ["You can declare and assign in one line", "Use 'let' for variables that might change"]
    },
    python: {
      expectedCode: "health = 100",
      hints: ["Simple assignment in Python", "Type is inferred automatically"]
    },
    java: {
      expectedCode: "int health = 100;",
      hints: ["Declare type and assign value", "int for whole numbers"]
    },
    typescript: {
      expectedCode: "let health: number = 100;",
      hints: ["Include type annotation for clarity", "TypeScript can also infer types"]
    },
    cpp: {
      expectedCode: "int health = 100;",
      hints: ["C++ requires type declaration", "Similar to Java syntax"]
    },
    html: {
      expectedCode: "<meter value=\"100\" max=\"100\">100</meter>",
      hints: ["HTML meter element for numeric values", "Represents scalar measurement"]
    },
    css: {
      expectedCode: ".health-bar { width: 100%; }",
      hints: ["CSS can represent numeric values as percentages", "Visual representation of health"]
    },
    go: {
      expectedCode: "health := 100",
      hints: ["Go short variable declaration", "':=' declares and assigns"]
    }
  }, 16)
];

// Multi-language challenges for Level 2: Loops & Rhythm
const level2Challenges: Challenge[] = [
  // Challenge 1: For loop
  ...createLanguageVariants(1, "Create a for loop that counts from 1 to 5", {
    javascript: {
      expectedCode: "for (let i = 1; i <= 5; i++) {}",
      hints: ["For loop has three parts: init, condition, increment", "Use <= for inclusive range"]
    },
    python: {
      expectedCode: "for i in range(1, 6):",
      hints: ["Python range is exclusive of end value", "Use range(1, 6) for 1 to 5"]
    },
    java: {
      expectedCode: "for (int i = 1; i <= 5; i++) {}",
      hints: ["Similar to JavaScript but with type declaration", "Declare int i in the loop"]
    },
    typescript: {
      expectedCode: "for (let i: number = 1; i <= 5; i++) {}",
      hints: ["Include type annotation for i", "Same structure as JavaScript"]
    },
    cpp: {
      expectedCode: "for (int i = 1; i <= 5; i++) {}",
      hints: ["C++ for loop syntax", "Similar to Java"]
    },
    html: {
      expectedCode: "<ol><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ol>",
      hints: ["HTML ordered list represents sequence", "Each item is a list element"]
    },
    css: {
      expectedCode: ".counter { counter-reset: item; } .counter::before { counter-increment: item; content: counter(item); }",
      hints: ["CSS counters can create numbered sequences", "Use counter-increment and content"]
    },
    go: {
      expectedCode: "for i := 1; i <= 5; i++ {}",
      hints: ["Go for loop syntax", "Similar to C-style loops"]
    }
  }, 0),

  // Challenge 2: While loop
  ...createLanguageVariants(2, "Create a while loop that runs while 'count' is less than 10", {
    javascript: {
      expectedCode: "while (count < 10) {}",
      hints: ["While loops continue as long as condition is true", "Make sure to modify count inside the loop"]
    },
    python: {
      expectedCode: "while count < 10:",
      hints: ["Python while loop with colon", "Remember to indent the body"]
    },
    java: {
      expectedCode: "while (count < 10) {}",
      hints: ["Java while loop syntax", "Condition in parentheses"]
    },
    typescript: {
      expectedCode: "while (count < 10) {}",
      hints: ["TypeScript while loop", "Same as JavaScript syntax"]
    },
    cpp: {
      expectedCode: "while (count < 10) {}",
      hints: ["C++ while loop", "Condition in parentheses"]
    },
    html: {
      expectedCode: "<div class=\"loading\">Loading...</div>",
      hints: ["HTML can represent ongoing states", "Use CSS animations for loop-like behavior"]
    },
    css: {
      expectedCode: "@keyframes count-up { 0% { content: \"0\"; } 100% { content: \"10\"; } }",
      hints: ["CSS animations can simulate loops", "Keyframes define animation steps"]
    },
    go: {
      expectedCode: "for count < 10 {}",
      hints: ["Go uses 'for' for while-like loops", "Condition without init or increment"]
    }
  }, 4)
];

// Multi-language challenges for Level 3: Conditionals & Control
const level3Challenges: Challenge[] = [
  // Challenge 1: If statement
  ...createLanguageVariants(1, "Create an if statement that checks if 'score' is greater than 100", {
    javascript: {
      expectedCode: "if (score > 100) {}",
      hints: ["If statements check conditions", "Use comparison operators like >"]
    },
    python: {
      expectedCode: "if score > 100:",
      hints: ["Python if statement with colon", "No parentheses needed around condition"]
    },
    java: {
      expectedCode: "if (score > 100) {}",
      hints: ["Java if statement", "Condition must be in parentheses"]
    },
    typescript: {
      expectedCode: "if (score > 100) {}",
      hints: ["TypeScript if statement", "Same as JavaScript"]
    },
    cpp: {
      expectedCode: "if (score > 100) {}",
      hints: ["C++ if statement", "Parentheses required"]
    },
    html: {
      expectedCode: "<div class=\"high-score\" style=\"display: none;\">High Score!</div>",
      hints: ["HTML can use conditional styling", "JavaScript would control visibility"]
    },
    css: {
      expectedCode: ".score[data-value=\"high\"] { color: gold; }",
      hints: ["CSS attribute selectors for conditions", "Conditional styling based on attributes"]
    },
    go: {
      expectedCode: "if score > 100 {}",
      hints: ["Go if statement", "No parentheses needed around condition"]
    }
  }, 0),

  // Challenge 2: If-else statement
  ...createLanguageVariants(2, "Create an if-else statement. If 'lives' is 0, game over, else continue", {
    javascript: {
      expectedCode: "if (lives === 0) {} else {}",
      hints: ["Use === for strict equality", "Else block handles alternative case"]
    },
    python: {
      expectedCode: "if lives == 0:\n    pass\nelse:\n    pass",
      hints: ["Python uses == for equality", "Use proper indentation"]
    },
    java: {
      expectedCode: "if (lives == 0) {} else {}",
      hints: ["Java uses == for primitive comparison", "Braces for both blocks"]
    },
    typescript: {
      expectedCode: "if (lives === 0) {} else {}",
      hints: ["Use === for strict equality", "Same as JavaScript"]
    },
    cpp: {
      expectedCode: "if (lives == 0) {} else {}",
      hints: ["C++ equality operator ==", "Standard if-else syntax"]
    },
    html: {
      expectedCode: "<div class=\"game-status\"><span class=\"game-over\">Game Over</span><span class=\"continue\">Continue</span></div>",
      hints: ["HTML elements for different states", "Use CSS or JS to show/hide"]
    },
    css: {
      expectedCode: ".lives-zero .game-over { display: block; } .lives-zero .continue { display: none; }",
      hints: ["CSS conditional display", "Use classes to represent states"]
    },
    go: {
      expectedCode: "if lives == 0 {} else {}",
      hints: ["Go if-else statement", "No parentheses needed"]
    }
  }, 4)
];

// Multi-language challenges for Level 4: Functions & Methods
const level4Challenges: Challenge[] = [
  // Challenge 1: Basic function declaration
  ...createLanguageVariants(1, "Create a function named 'sayHello' that takes no parameters", {
    javascript: {
      expectedCode: "function sayHello() {}",
      hints: ["Use the 'function' keyword", "Function name followed by parentheses"]
    },
    python: {
      expectedCode: "def say_hello():",
      hints: ["Python uses 'def' keyword", "Function names use snake_case"]
    },
    java: {
      expectedCode: "public void sayHello() {}",
      hints: ["Java methods need access modifier and return type", "Use 'void' for no return value"]
    },
    typescript: {
      expectedCode: "function sayHello(): void {}",
      hints: ["Include return type annotation", "Use 'void' for no return"]
    },
    cpp: {
      expectedCode: "void sayHello() {}",
      hints: ["C++ functions specify return type first", "Use 'void' for no return"]
    },
    html: {
      expectedCode: "<button onclick=\"sayHello()\">Say Hello</button>",
      hints: ["HTML can call functions via event handlers", "Use onclick attribute"]
    },
    css: {
      expectedCode: ".hello-button:hover::after { content: \"Hello!\"; }",
      hints: ["CSS can simulate function behavior with pseudo-elements", "Use hover states for interactivity"]
    },
    go: {
      expectedCode: "func sayHello() {}",
      hints: ["Go uses 'func' keyword", "Simple function declaration"]
    }
  }, 0),

  // Challenge 2: Function with parameters
  ...createLanguageVariants(2, "Create a function 'greet' that takes a 'name' parameter", {
    javascript: {
      expectedCode: "function greet(name) {}",
      hints: ["Parameters go inside parentheses", "No type declaration needed"]
    },
    python: {
      expectedCode: "def greet(name):",
      hints: ["Parameter names inside parentheses", "Colon at the end"]
    },
    java: {
      expectedCode: "public void greet(String name) {}",
      hints: ["Java requires parameter types", "Use 'String' for text parameters"]
    },
    typescript: {
      expectedCode: "function greet(name: string): void {}",
      hints: ["Include parameter type annotations", "Use 'string' type for names"]
    },
    cpp: {
      expectedCode: "void greet(string name) {}",
      hints: ["C++ requires parameter types", "Use 'string' for text"]
    },
    html: {
      expectedCode: "<span id=\"greeting\" data-name=\"user\">Hello</span>",
      hints: ["HTML can store data in attributes", "Use data attributes for parameters"]
    },
    css: {
      expectedCode: ".greeting[data-name]::after { content: attr(data-name); }",
      hints: ["CSS can read attribute values", "Use attr() function to get data"]
    },
    go: {
      expectedCode: "func greet(name string) {}",
      hints: ["Go parameter type comes after name", "Space separated declaration"]
    }
  }, 4),

  // Challenge 3: Function with return value
  ...createLanguageVariants(3, "Create a function 'getScore' that returns the number 100", {
    javascript: {
      expectedCode: "function getScore() { return 100; }",
      hints: ["Use 'return' keyword to send back a value", "Return statements end function execution"]
    },
    python: {
      expectedCode: "def get_score():\n    return 100",
      hints: ["Python functions can return values", "Remember proper indentation"]
    },
    java: {
      expectedCode: "public int getScore() { return 100; }",
      hints: ["Change return type from 'void' to 'int'", "Must return a value of specified type"]
    },
    typescript: {
      expectedCode: "function getScore(): number { return 100; }",
      hints: ["Change return type to 'number'", "TypeScript infers return types but explicit is better"]
    },
    cpp: {
      expectedCode: "int getScore() { return 100; }",
      hints: ["Change return type from 'void' to 'int'", "Return an integer value"]
    },
    html: {
      expectedCode: "<output>100</output>",
      hints: ["HTML output element represents calculation results", "Shows the returned value"]
    },
    css: {
      expectedCode: ".score::before { content: \"100\"; }",
      hints: ["CSS can generate content as return values", "Use content property"]
    },
    go: {
      expectedCode: "func getScore() int { return 100 }",
      hints: ["Go return type comes after parameters", "Return keyword works the same"]
    }
  }, 8)
];

// Create the multi-language levels array with more levels
export const multiLanguageLevels: Level[] = [
  {
    id: 1,
    title: "Variables & Values",
    concept: "Variables",
    description: "Learn to store and use data in variables",
    tempo: 80,
    difficulty: 'beginner',
    unlocked: true,
    challenges: level1Challenges
  },
  {
    id: 2,
    title: "Loops & Rhythm",
    concept: "Loops",
    description: "Master repetitive patterns with loops",
    tempo: 100,
    difficulty: 'beginner',
    unlocked: false,
    challenges: level2Challenges
  },
  {
    id: 3,
    title: "Conditionals & Control",
    concept: "Conditionals",
    description: "Control program flow with conditions",
    tempo: 120,
    difficulty: 'intermediate',
    unlocked: false,
    challenges: level3Challenges
  },
  {
    id: 4,
    title: "Functions & Methods",
    concept: "Functions",
    description: "Create reusable code with functions",
    tempo: 140,
    difficulty: 'intermediate',
    unlocked: false,
    challenges: level4Challenges
  }
];

// Helper function to get challenges for a specific language
export const getChallengesForLanguage = (level: Level, language: string): Challenge[] => {
  return level.challenges.filter(challenge => challenge.language === language);
};

// Helper function to get all supported languages
export const getSupportedLanguages = (): string[] => {
  const languages = new Set<string>();
  multiLanguageLevels.forEach(level => {
    level.challenges.forEach(challenge => {
      languages.add(challenge.language);
    });
  });
  return Array.from(languages);
};
