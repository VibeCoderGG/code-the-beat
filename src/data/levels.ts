import { Level } from '../types/game';

export const levels: Level[] = [
  {
    id: 1,
    title: "Variables & Values",
    concept: "Variables",
    description: "Learn to store and use data in variables",
    tempo: 80,
    difficulty: 'beginner',
    unlocked: true, // First level is always unlocked
    challenges: [
      {
        id: 1,
        prompt: "Create a variable named 'name' with value 'Coder'",
        expectedCode: "let name = 'Coder';",
        hints: ["Use 'let' to declare a variable", "Don't forget the semicolon!"],
        beatPosition: 0,
        timeSignature: 4
      },
      {
        id: 2,
        prompt: "Create a variable 'age' with value 25",
        expectedCode: "let age = 25;",
        hints: ["Numbers don't need quotes", "Use 'let' keyword"],
        beatPosition: 4,
        timeSignature: 4
      },
      {
        id: 3,
        prompt: "Create a boolean variable 'isActive' set to true",
        expectedCode: "let isActive = true;",
        hints: ["Boolean values: true or false", "No quotes around boolean values"],
        beatPosition: 8,
        timeSignature: 4
      }
    ]
  },
  {
    id: 2,
    title: "Loops & Rhythm",
    concept: "For Loops",
    description: "Master repetition with for loops",
    tempo: 100,
    difficulty: 'beginner',
    unlocked: false, // Locked until level 1 is completed
    challenges: [
      {
        id: 1,
        prompt: "Create a for loop that runs 5 times",
        expectedCode: "for (let i = 0; i < 5; i++) {}",
        hints: ["Start with for (let i = 0; ...)", "Condition: i < 5", "Increment: i++"],
        beatPosition: 0,
        timeSignature: 4
      },
      {
        id: 2,
        prompt: "Loop from 1 to 10",
        expectedCode: "for (let i = 1; i <= 10; i++) {}",
        hints: ["Start at 1", "Use <= for inclusive range"],
        beatPosition: 4,
        timeSignature: 4
      }
    ]
  },
  {
    id: 3,
    title: "Conditional Beats",
    concept: "If Statements",
    description: "Make decisions with conditional logic",
    tempo: 120,
    difficulty: 'intermediate',
    unlocked: false, // Locked until level 2 is completed
    challenges: [
      {
        id: 1,
        prompt: "Check if x is greater than 10",
        expectedCode: "if (x > 10) {}",
        hints: ["Use if statement", "Greater than: >"],
        beatPosition: 0,
        timeSignature: 4
      },
      {
        id: 2,
        prompt: "Check if name equals 'John'",
        expectedCode: "if (name === 'John') {}",
        hints: ["Use strict equality ===", "Strings need quotes"],
        beatPosition: 4,
        timeSignature: 4
      }
    ]
  },
  {
    id: 4,
    title: "Function Harmony",
    concept: "Functions",
    description: "Create reusable code with functions",
    tempo: 140,
    difficulty: 'advanced',
    unlocked: false, // Locked until level 3 is completed
    challenges: [
      {
        id: 1,
        prompt: "Create a function named 'greet' that takes no parameters",
        expectedCode: "function greet() {}",
        hints: ["Start with 'function' keyword", "Function name: greet"],
        beatPosition: 0,
        timeSignature: 4
      },
      {
        id: 2,
        prompt: "Create function 'add' that takes two parameters",
        expectedCode: "function add(a, b) {}",
        hints: ["Two parameters: a and b", "Separate parameters with comma"],
        beatPosition: 4,
        timeSignature: 4
      }
    ]
  }
];