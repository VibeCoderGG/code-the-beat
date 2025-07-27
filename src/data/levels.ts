import { Level } from '../types/game';

export const levels: Level[] = [
  // =================================================================
  // Level 1: Variables & Values
  // =================================================================
  {
    id: 1,
    title: "Variables & Values",
    concept: "Variables",
    description: "Learn to store and use data in variables",
    tempo: 80,
    difficulty: 'beginner',
    unlocked: true, // First level is always unlocked
    challenges: [
      // --- Basic Declarations ---
      { id: 1, prompt: "Create a variable named 'score' with the value 0", expectedCode: "let score = 0;", hints: ["Use 'let' to declare a variable", "Numbers don't need quotes"], beatPosition: 0, timeSignature: 4 },
      { id: 2, prompt: "Create a variable named 'playerName' with the value 'Hero'", expectedCode: "let playerName = 'Hero';", hints: ["Use single or double quotes for strings", "Don't forget the semicolon!"], beatPosition: 4, timeSignature: 4 },
      { id: 3, prompt: "Create a boolean variable 'isGameOver' set to false", expectedCode: "let isGameOver = false;", hints: ["Boolean values are 'true' or 'false'", "No quotes around boolean values"], beatPosition: 8, timeSignature: 4 },
      { id: 4, prompt: "Declare a constant variable 'gameTitle' with the value 'Code Beats'", expectedCode: "const gameTitle = 'Code Beats';", hints: ["Use 'const' for values that won't change", "Constants must be initialized"], beatPosition: 12, timeSignature: 4 },
      { id: 5, prompt: "Declare a variable 'health' and assign it the value 100", expectedCode: "let health = 100;", hints: ["You can declare and assign in one line", "Use 'let' for variables that might change"], beatPosition: 16, timeSignature: 4 },

      // --- Data Types ---
      { id: 6, prompt: "Create a variable 'mana' and set its value to 50.5", expectedCode: "let mana = 50.5;", hints: ["Numbers can have decimal points", "This is a floating-point number"], beatPosition: 20, timeSignature: 4 },
      { id: 7, prompt: "Create a variable 'enemyName' with the value \"Goblin\"", expectedCode: "let enemyName = \"Goblin\";", hints: ["You can use double quotes for strings too", "Be consistent with your quote style"], beatPosition: 24, timeSignature: 4 },
      { id: 8, prompt: "Create a constant 'GRAVITY' and set it to 9.8", expectedCode: "const GRAVITY = 9.8;", hints: ["It's a common convention to name constants in all uppercase letters", "This value shouldn't change during the game"], beatPosition: 28, timeSignature: 4 },
      { id: 9, prompt: "Declare a variable 'currentWeapon' without assigning a value", expectedCode: "let currentWeapon;", hints: ["A variable declared without a value is 'undefined'", "You can assign a value to it later"], beatPosition: 32, timeSignature: 4 },
      { id: 10, prompt: "Create a variable 'inventorySlot1' and set it to null", expectedCode: "let inventorySlot1 = null;", hints: ["'null' represents the intentional absence of any object value", "It's different from 'undefined'"], beatPosition: 36, timeSignature: 4 },

      // --- Reassignment and Naming ---
      { id: 11, prompt: "Declare 'level' as 1. Then, on a new line, change its value to 2", expectedCode: "let level = 1;\nlevel = 2;", hints: ["Use 'let' for variables you intend to change", "To change a value, just use the variable name"], beatPosition: 40, timeSignature: 4 },
      { id: 12, prompt: "Create a variable 'numberOfEnemies'", expectedCode: "let numberOfEnemies;", hints: ["Use camelCase for variable names with multiple words", "Start with a lowercase letter"], beatPosition: 44, timeSignature: 4 },
      { id: 13, prompt: "Create a variable for player speed, named 'playerMoveSpeed', set to 5", expectedCode: "let playerMoveSpeed = 5;", hints: ["Descriptive names make code easier to read", "camelCase is the standard"], beatPosition: 48, timeSignature: 4 },
      { id: 14, prompt: "Declare 'lives' as 3. Then, decrease its value by 1.", expectedCode: "let lives = 3;\nlives = 2;", hints: ["You can assign a new value based on the old one", "We'll learn easier ways to do this later!"], beatPosition: 52, timeSignature: 4 },
      { id: 15, prompt: "Try to change the value of 'gameTitle' (this will cause an error in real code!)", expectedCode: "const gameTitle = 'Code Beats';\n// gameTitle = 'New Title';", hints: ["You can't reassign a 'const' variable", "This is a key feature of constants"], beatPosition: 56, timeSignature: 4 },

      // --- Basic Operations ---
      { id: 16, prompt: "Create 'points' as 100. Create 'bonus' as 50. Create 'totalScore' as their sum.", expectedCode: "let points = 100;\nlet bonus = 50;\nlet totalScore = points + bonus;", hints: ["You can use variables in calculations", "The '+' operator adds numbers"], beatPosition: 60, timeSignature: 4 },
      { id: 17, prompt: "Create 'firstName' as 'Code' and 'lastName' as 'Master'. Combine them into 'fullName'.", expectedCode: "let firstName = 'Code';\nlet lastName = 'Master';\nlet fullName = firstName + ' ' + lastName;", hints: ["The '+' operator also concatenates strings", "Add a space ' ' in between for readability"], beatPosition: 64, timeSignature: 4 },
      { id: 18, prompt: "Create 'damage' as 25 and 'armor' as 10. Calculate 'actualDamage'.", expectedCode: "let damage = 25;\nlet armor = 10;\nlet actualDamage = damage - armor;", hints: ["Use the '-' operator for subtraction", "Order matters in subtraction"], beatPosition: 68, timeSignature: 4 },
      { id: 19, prompt: "Create 'items' as 3 and 'costPerItem' as 50. Find the 'totalCost'.", expectedCode: "let items = 3;\nlet costPerItem = 50;\nlet totalCost = items * costPerItem;", hints: ["Use the '*' operator for multiplication", "This is useful for many game calculations"], beatPosition: 72, timeSignature: 4 },
      { id: 20, prompt: "Create 'gold' as 100 and 'players' as 4. Calculate 'goldPerPlayer'.", expectedCode: "let gold = 100;\nlet players = 4;\nlet goldPerPlayer = gold / players;", hints: ["Use the '/' operator for division", "Make sure the divisor is not zero!"], beatPosition: 76, timeSignature: 4 },
      { id: 21, prompt: "Create 'cookies' as 10 and 'friends' as 3. Find the 'remainingCookies'.", expectedCode: "let cookies = 10;\nlet friends = 3;\nlet remainingCookies = cookies % friends;", hints: ["The '%' (modulo) operator gives the remainder of a division", "10 divided by 3 is 3 with a remainder of 1"], beatPosition: 80, timeSignature: 4 },
      { id: 22, prompt: "Create 'power' as 2. Raise it to the power of 5 to get 'superPower'.", expectedCode: "let power = 2;\nlet superPower = power ** 5;", hints: ["Use the '**' operator for exponentiation", "This is 2 * 2 * 2 * 2 * 2"], beatPosition: 84, timeSignature: 4 },
      { id: 23, prompt: "Create 'message' using a template literal: 'Level: 1'", expectedCode: "let message = `Level: 1`;", hints: ["Template literals use backticks ``", "They are very powerful for embedding variables"], beatPosition: 88, timeSignature: 4 },
      { id: 24, prompt: "Given 'currentLevel' is 5, create a string 'You are on level 5'", expectedCode: "let currentLevel = 5;\nlet report = `You are on level ${currentLevel}`;", hints: ["Inside a template literal, use ${variable} to insert a variable's value", "This is called interpolation"], beatPosition: 92, timeSignature: 4 },
      { id: 25, prompt: "Declare 'x' as 10. Increment it by 1.", expectedCode: "let x = 10;\nx++;", hints: ["'++' is a shorthand way to add 1 to a variable", "It's called the increment operator"], beatPosition: 96, timeSignature: 4 },
      { id: 26, prompt: "Declare 'y' as 5. Decrement it by 1.", expectedCode: "let y = 5;\ny--;", hints: ["'--' is a shorthand way to subtract 1 from a variable", "It's called the decrement operator"], beatPosition: 100, timeSignature: 4 },
      { id: 27, prompt: "Declare 'a' as 10. Add 5 to it using the shorthand operator.", expectedCode: "let a = 10;\na += 5;", hints: ["'a += 5' is shorthand for 'a = a + 5'", "This works for other operators too"], beatPosition: 104, timeSignature: 4 },
      { id: 28, prompt: "Declare 'b' as 20. Subtract 8 from it using shorthand.", expectedCode: "let b = 20;\nb -= 8;", hints: ["'b -= 8' is shorthand for 'b = b - 8'", "It's a common and useful shortcut"], beatPosition: 108, timeSignature: 4 },
      { id: 29, prompt: "Declare 'c' as 7. Multiply it by 3 using shorthand.", expectedCode: "let c = 7;\nc *= 3;", hints: ["'c *= 3' is shorthand for 'c = c * 3'", "Keeps your code concise"], beatPosition: 112, timeSignature: 4 },
      { id: 30, prompt: "Declare 'd' as 50. Divide it by 10 using shorthand.", expectedCode: "let d = 50;\nd /= 10;", hints: ["'d /= 10' is shorthand for 'd = d / 10'", "Very useful for updating values"], beatPosition: 116, timeSignature: 4 },

      // --- More Data Types & Edge Cases ---
      { id: 31, prompt: "Create a variable 'bigNumber' for 100 trillion using BigInt.", expectedCode: "let bigNumber = 100000000000000n;", hints: ["For integers larger than the standard Number type can hold, use BigInt", "Append 'n' to the end of the number"], beatPosition: 120, timeSignature: 4 },
      { id: 32, prompt: "Declare a variable 'secretCode' using the 'var' keyword, with value 1234", expectedCode: "var secretCode = 1234;", hints: ["'var' is an older way to declare variables. 'let' and 'const' are now preferred.", "Variables declared with 'var' have different scoping rules"], beatPosition: 124, timeSignature: 4 },
      { id: 33, prompt: "What is the type of the value `true`?", expectedCode: "let answer = 'boolean';", hints: ["Think about the category of data 'true' and 'false' belong to", "It's not a string"], beatPosition: 128, timeSignature: 4 },
      { id: 34, prompt: "What is the type of the value `'hello'`?", expectedCode: "let answer = 'string';", hints: ["Anything in quotes is a...", "It represents text"], beatPosition: 132, timeSignature: 4 },
      { id: 35, prompt: "What is the type of the value `99`?", expectedCode: "let answer = 'number';", hints: ["This is a fundamental data type for numeric values", "It can be an integer or a float"], beatPosition: 136, timeSignature: 4 },
      { id: 36, prompt: "What is the type of `null`?", expectedCode: "let answer = 'object';", hints: ["This is a famous, long-standing quirk in JavaScript!", "Even though it represents 'no value', its type is 'object'"], beatPosition: 140, timeSignature: 4 },
      { id: 37, prompt: "Create a variable 'isPlayerActive' and set it to true", expectedCode: "let isPlayerActive = true;", hints: ["Use camelCase", "Boolean values are keywords"], beatPosition: 144, timeSignature: 4 },
      { id: 38, prompt: "Create a constant 'MAX_PLAYERS' and set it to 8", expectedCode: "const MAX_PLAYERS = 8;", hints: ["Use uppercase for constants", "This value should not be changed"], beatPosition: 148, timeSignature: 4 },
      { id: 39, prompt: "Create a variable 'greeting' with the text 'Hello, World!'", expectedCode: "let greeting = 'Hello, World!';", hints: ["A classic first step in programming", "Use quotes for the string"], beatPosition: 152, timeSignature: 4 },
      { id: 40, prompt: "Declare 'ammo' as 50. Decrease it by 1.", expectedCode: "let ammo = 50;\nammo--;", hints: ["The decrement operator '--' is perfect for this", "Shorthand for `ammo = ammo - 1`"], beatPosition: 156, timeSignature: 4 },
      { id: 41, prompt: "Declare 'exp' as 150. Add 25 to it using shorthand.", expectedCode: "let exp = 150;\nexp += 25;", hints: ["Use the `+=` operator", "Efficiently updates the variable's value"], beatPosition: 160, timeSignature: 4 },
      { id: 42, prompt: "Create 'city' as 'Synth' and 'district' as 'Core'. Combine them into 'location'.", expectedCode: "let city = 'Synth';\nlet district = 'Core';\nlet location = city + district;", hints: ["String concatenation joins strings end-to-end", "Result will be 'SynthCore'"], beatPosition: 164, timeSignature: 4 },
      { id: 43, prompt: "Create 'dialogue' using a template literal: `I am 'Coder'`", expectedCode: "let dialogue = `I am 'Coder'`;", hints: ["Template literals can contain single or double quotes without issues", "No need to escape them"], beatPosition: 168, timeSignature: 4 },
      { id: 44, prompt: "Create 'playerX' for x-coordinate, set to 10. Create 'playerY' for y-coordinate, set to 20.", expectedCode: "let playerX = 10;\nlet playerY = 20;", hints: ["Use clear variable names for coordinates", "Both are numbers"], beatPosition: 172, timeSignature: 4 },
      { id: 45, prompt: "Declare a variable 'finalBoss' and set it to null for now.", expectedCode: "let finalBoss = null;", hints: ["'null' is a great placeholder for an object you'll define later", "It signifies an empty value"], beatPosition: 176, timeSignature: 4 },
      { id: 46, prompt: "Create a variable 'hasKey' and set it to false.", expectedCode: "let hasKey = false;", hints: ["Boolean variables are great for tracking states", "Does the player have the key? No."], beatPosition: 180, timeSignature: 4 },
      { id: 47, prompt: "Create a constant 'PI' with the value 3.14159", expectedCode: "const PI = 3.14159;", hints: ["Mathematical constants are perfect for 'const'", "This value will never change"], beatPosition: 184, timeSignature: 4 },
      { id: 48, prompt: "Create 'timeRemaining' as 60. Then update it to be half of its value.", expectedCode: "let timeRemaining = 60;\ntimeRemaining /= 2;", hints: ["The `/=` shorthand is great for this", "Divides the variable by the value and reassigns"], beatPosition: 188, timeSignature: 4 },
      { id: 49, prompt: "Create 'username' with a value of 'Player123'", expectedCode: "let username = 'Player123';", hints: ["Strings can contain numbers and letters", "Just enclose them in quotes"], beatPosition: 192, timeSignature: 4 },
      { id: 50, prompt: "Declare a variable 'questItem' without an initial value.", expectedCode: "let questItem;", hints: ["Its value will be 'undefined' by default", "Ready to be assigned later in the game"], beatPosition: 196, timeSignature: 4 },
    ]
  },
  // =================================================================
  // Level 2: Loops & Rhythm
  // =================================================================
  {
    id: 2,
    title: "Loops & Rhythm",
    concept: "For Loops",
    description: "Master repetition with for loops",
    tempo: 100,
    difficulty: 'beginner',
    unlocked: false,
    challenges: [
      // --- Basic For Loops ---
      { id: 1, prompt: "Create a for loop that runs 3 times (0, 1, 2)", expectedCode: "for (let i = 0; i < 3; i++) {}", hints: ["Start with for (let i = 0; ...)", "Condition: i < 3", "Increment: i++"], beatPosition: 0, timeSignature: 4 },
      { id: 2, prompt: "Create a for loop that counts from 1 to 5", expectedCode: "for (let i = 1; i <= 5; i++) {}", hints: ["Start at 1", "Use <= for an inclusive range", "The loop will run 5 times"], beatPosition: 4, timeSignature: 4 },
      { id: 3, prompt: "Create a for loop that counts down from 5 to 1", expectedCode: "for (let i = 5; i >= 1; i--) {}", hints: ["Initialize with the starting value (5)", "Condition checks if i is greater than or equal to 1", "Decrement with i--"], beatPosition: 8, timeSignature: 4 },
      { id: 4, prompt: "Create a loop that runs 10 times", expectedCode: "for (let i = 0; i < 10; i++) {}", hints: ["A common pattern for a specific number of iterations", "0 to 9 is 10 times"], beatPosition: 12, timeSignature: 4 },
      { id: 5, prompt: "Loop through even numbers from 2 to 10 (inclusive)", expectedCode: "for (let i = 2; i <= 10; i += 2) {}", hints: ["Change the increment part of the loop", "i += 2 will increase i by 2 each time"], beatPosition: 16, timeSignature: 4 },
      { id: 6, prompt: "Loop through odd numbers from 1 to 9 (inclusive)", expectedCode: "for (let i = 1; i < 10; i += 2) {}", hints: ["Start at 1", "Increment by 2 to get the next odd number"], beatPosition: 20, timeSignature: 4 },
      { id: 7, prompt: "Create a loop that counts down from 10 to 0", expectedCode: "for (let i = 10; i >= 0; i--) {}", hints: ["Start high, end low", "Use decrement i--"], beatPosition: 24, timeSignature: 4 },
      { id: 8, prompt: "Create a loop that generates multiples of 5 from 0 to 50", expectedCode: "for (let i = 0; i <= 50; i += 5) {}", hints: ["The step can be any number you want", "Increment by 5"], beatPosition: 28, timeSignature: 4 },
      { id: 9, prompt: "Create a loop that iterates 4 times, using 'j' as the variable", expectedCode: "for (let j = 0; j < 4; j++) {}", hints: ["The variable name can be anything, not just 'i'", "'j' and 'k' are common for nested loops"], beatPosition: 32, timeSignature: 4 },
      { id: 10, prompt: "Loop from -5 to 5", expectedCode: "for (let i = -5; i <= 5; i++) {}", hints: ["Loops can work with negative numbers too", "The condition and increment work the same way"], beatPosition: 36, timeSignature: 4 },

      // --- While Loops ---
      { id: 11, prompt: "Create a while loop that runs as long as 'health' is greater than 0", expectedCode: "while (health > 0) {}", hints: ["A while loop only needs a condition", "Make sure the condition eventually becomes false to avoid an infinite loop!"], beatPosition: 40, timeSignature: 4 },
      { id: 12, prompt: "Use a while loop to count from 1 to 5. Initialize 'counter' to 1.", expectedCode: "let counter = 1;\nwhile (counter <= 5) {\n  counter++;\n}", hints: ["Initialize the counter before the loop", "The condition is `counter <= 5`", "Don't forget to increment inside the loop!"], beatPosition: 44, timeSignature: 4 },
      { id: 13, prompt: "Create a while loop that runs as long as 'isGameOver' is false", expectedCode: "while (isGameOver === false) {}", hints: ["You can use boolean variables as conditions", "This is a common game loop pattern"], beatPosition: 48, timeSignature: 4 },
      { id: 14, prompt: "A shorter way to write `while (isGameOver === false)`", expectedCode: "while (!isGameOver) {}", hints: ["The '!' (NOT) operator inverts a boolean value", "`!false` is true, so the loop runs"], beatPosition: 52, timeSignature: 4 },
      { id: 15, prompt: "Use a while loop to count down from 10 to 1. Initialize 'countdown' to 10.", expectedCode: "let countdown = 10;\nwhile (countdown > 0) {\n  countdown--;\n}", hints: ["Initialize high", "Decrement inside the loop", "Condition is `countdown > 0`"], beatPosition: 56, timeSignature: 4 },
      
      // --- Do...While Loops ---
      { id: 16, prompt: "Create a do-while loop that runs at least once", expectedCode: "do {} while (false);", hints: ["A do-while loop executes the block once *before* checking the condition", "Useful when you need an action to happen at least one time"], beatPosition: 60, timeSignature: 4 },
      { id: 17, prompt: "Use a do-while loop to count from 1 to 5. Initialize 'i' to 1.", expectedCode: "let i = 1;\ndo {\n  i++;\n} while (i <= 5);", hints: ["The code inside `do` runs, then the condition `while` is checked", "Don't forget to initialize and increment"], beatPosition: 64, timeSignature: 4 },
      
      // --- Loop Control: break and continue ---
      { id: 18, prompt: "Create a for loop from 1 to 10 that stops when 'i' is 5", expectedCode: "for (let i = 1; i <= 10; i++) {\n  if (i === 5) {\n    break;\n  }\n}", hints: ["The 'break' statement immediately exits the entire loop", "The loop will not run for i = 5, 6, 7..."], beatPosition: 68, timeSignature: 4 },
      { id: 19, prompt: "Create a for loop from 1 to 5 that skips the number 3", expectedCode: "for (let i = 1; i <= 5; i++) {\n  if (i === 3) {\n    continue;\n  }\n}", hints: ["The 'continue' statement skips the rest of the current iteration and moves to the next one", "The loop will run for 1, 2, 4, 5"], beatPosition: 72, timeSignature: 4 },
      { id: 20, prompt: "Create a while loop that stops when a 'foundTreasure' variable becomes true", expectedCode: "while (!foundTreasure) {\n  if (search()) {\n    break;\n  }\n}", hints: ["'break' works in while loops too", "This is a common way to exit a loop based on an external event"], beatPosition: 76, timeSignature: 4 },
      { id: 21, prompt: "Loop from 1 to 20, but only process even numbers using 'continue'", expectedCode: "for (let i = 1; i <= 20; i++) {\n  if (i % 2 !== 0) {\n    continue;\n  }\n}", hints: ["`i % 2 !== 0` checks if a number is odd", "If it's odd, `continue` skips to the next iteration"], beatPosition: 80, timeSignature: 4 },
      
      // --- Nested Loops ---
      { id: 22, prompt: "Create a nested loop where the outer loop runs 3 times and the inner loop runs 2 times", expectedCode: "for (let i = 0; i < 3; i++) {\n  for (let j = 0; j < 2; j++) {}\n}", hints: ["The inner loop will complete all its iterations for each single iteration of the outer loop", "This is great for working with grids or 2D arrays"], beatPosition: 84, timeSignature: 4 },
      { id: 23, prompt: "Create a 3x3 grid pattern using nested loops", expectedCode: "for (let row = 0; row < 3; row++) {\n  for (let col = 0; col < 3; col++) {}\n}", hints: ["Use descriptive variable names like 'row' and 'col'", "This pattern is fundamental for board games"], beatPosition: 88, timeSignature: 4 },
      
      // --- More Variations ---
      { id: 24, prompt: "Loop backwards by 3s, from 30 down to 0", expectedCode: "for (let i = 30; i >= 0; i -= 3) {}", hints: ["The decrement can be any value", "Use `i -= 3`"], beatPosition: 92, timeSignature: 4 },
      { id: 25, prompt: "Create an infinite loop (don't run this for real!)", expectedCode: "for (;;) {}", hints: ["Leaving all three parts of a for loop empty creates an infinite loop", "You'd need a 'break' inside to ever get out"], beatPosition: 96, timeSignature: 4 },
      { id: 26, prompt: "Another way to write an infinite loop", expectedCode: "while (true) {}", hints: ["Since `true` is always true, this loop will never end on its own", "Requires a `break` statement"], beatPosition: 100, timeSignature: 4 },
      { id: 27, prompt: "Loop from 100 to 200", expectedCode: "for (let i = 100; i <= 200; i++) {}", hints: ["Loops can start and end at any number", "The logic remains the same"], beatPosition: 104, timeSignature: 4 },
      { id: 28, prompt: "Loop through the powers of 2, from 1 up to 128", expectedCode: "for (let i = 1; i <= 128; i *= 2) {}", hints: ["You can use multiplication in the final part of the loop", "`i *= 2` will double `i` each time"], beatPosition: 108, timeSignature: 4 },
      { id: 29, prompt: "Create a for loop that runs 100 times", expectedCode: "for (let i = 0; i < 100; i++) {}", hints: ["Simple and common", "Goes from 0 to 99"], beatPosition: 112, timeSignature: 4 },
      { id: 30, prompt: "Create a for loop that counts from 0 to 20 by 4s", expectedCode: "for (let i = 0; i <= 20; i += 4) {}", hints: ["The values of i will be 0, 4, 8, 12, 16, 20", "The step is 4"], beatPosition: 116, timeSignature: 4 },
      { id: 31, prompt: "Use a while loop to find the first multiple of 7 greater than 100", expectedCode: "let num = 101;\nwhile (num % 7 !== 0) {\n  num++;\n}", hints: ["Start checking at 101", "The loop stops when it finds a number divisible by 7"], beatPosition: 120, timeSignature: 4 },
      { id: 32, prompt: "Create a loop that counts down from 20 to 10", expectedCode: "for (let i = 20; i >= 10; i--) {}", hints: ["Initialize at 20", "Condition is `i >= 10`", "Decrement"], beatPosition: 124, timeSignature: 4 },
      { id: 33, prompt: "Create a loop that runs 5 times, but the counter starts at 5", expectedCode: "for (let i = 5; i < 10; i++) {}", hints: ["The loop will run for i = 5, 6, 7, 8, 9", "That's 5 iterations"], beatPosition: 128, timeSignature: 4 },
      { id: 34, prompt: "Skip all multiples of 5 in a loop from 1 to 20", expectedCode: "for (let i = 1; i <= 20; i++) {\n  if (i % 5 === 0) {\n    continue;\n  }\n}", hints: ["Use the modulo operator `%` to check for divisibility", "`continue` skips the current iteration"], beatPosition: 132, timeSignature: 4 },
      { id: 35, prompt: "Stop a loop as soon as you find a number greater than 10 that is divisible by 3", expectedCode: "for (let i = 11; i < 100; i++) {\n  if (i % 3 === 0) {\n    break;\n  }\n}", hints: ["Start searching from 11", "Use `break` to exit the loop once the condition is met"], beatPosition: 136, timeSignature: 4 },
      { id: 36, prompt: "Create a nested loop for a 5x5 grid", expectedCode: "for (let i = 0; i < 5; i++) {\n  for (let j = 0; j < 5; j++) {}\n}", hints: ["Five iterations for the outer loop", "Five iterations for the inner loop"], beatPosition: 140, timeSignature: 4 },
      { id: 37, prompt: "Create a loop that counts from 0 to 1, with a step of 0.2", expectedCode: "for (let i = 0; i <= 1; i += 0.2) {}", hints: ["Loops can work with floating-point numbers", "Be aware of potential precision issues with floats in real code"], beatPosition: 144, timeSignature: 4 },
      { id: 38, prompt: "Declare a counter 'c' at 0. Use a while loop to increment it to 10.", expectedCode: "let c = 0;\nwhile (c < 10) {\n  c++;\n}", hints: ["The loop runs as long as c is less than 10", "The last run happens when c is 9, then it becomes 10 and the loop stops"], beatPosition: 148, timeSignature: 4 },
      { id: 39, prompt: "Create a for loop that never runs", expectedCode: "for (let i = 0; i < 0; i++) {}", hints: ["If the condition is false from the start, the loop body never executes", "0 is not less than 0"], beatPosition: 152, timeSignature: 4 },
      { id: 40, prompt: "Loop from 1 to 100, but stop at 50", expectedCode: "for (let i = 1; i <= 100; i++) {\n  if (i > 50) {\n    break;\n  }\n}", hints: ["The `break` statement gives you precise control over when to exit", "The loop will process numbers 1 through 50"], beatPosition: 156, timeSignature: 4 },
      { id: 41, prompt: "Loop backwards from 100 to 0 by 10s", expectedCode: "for (let i = 100; i >= 0; i -= 10) {}", hints: ["The values will be 100, 90, 80, ... 0", "Decrement by 10"], beatPosition: 160, timeSignature: 4 },
      { id: 42, prompt: "Create a loop with a condition `i !== 5` that starts at 0", expectedCode: "for (let i = 0; i !== 5; i++) {}", hints: ["This loop will run for i = 0, 1, 2, 3, 4", "It stops when i becomes 5"], beatPosition: 164, timeSignature: 4 },
      { id: 43, prompt: "Create a `do-while` loop that runs as long as a variable `isCharging` is true", expectedCode: "do {} while (isCharging);", hints: ["The action in `do` will happen once, then the condition is checked", "Useful for things like 'fire weapon, then check if still has ammo'"], beatPosition: 168, timeSignature: 4 },
      { id: 44, prompt: "Create a loop that runs 8 times using a countdown", expectedCode: "for (let i = 8; i > 0; i--) {}", hints: ["Counts 8, 7, 6, 5, 4, 3, 2, 1", "That is 8 iterations"], beatPosition: 172, timeSignature: 4 },
      { id: 45, prompt: "Loop through numbers 1 to 30 and skip any number divisible by 4", expectedCode: "for (let i = 1; i <= 30; i++) {\n  if (i % 4 === 0) {\n    continue;\n  }\n}", hints: ["Use modulo `%` and `continue`", "This will skip 4, 8, 12, etc."], beatPosition: 176, timeSignature: 4 },
      { id: 46, prompt: "Create a loop that will run 6 times, for `i` values 0 through 5", expectedCode: "for (let i = 0; i <= 5; i++) {}", hints: ["Using `<=` includes the final number in the count", "0, 1, 2, 3, 4, 5 is 6 numbers"], beatPosition: 180, timeSignature: 4 },
      { id: 47, prompt: "Use a while loop to decrement 'mana' by 10 until it's 0 or less. Start with 100 mana.", expectedCode: "let mana = 100;\nwhile (mana > 0) {\n  mana -= 10;\n}", hints: ["The loop continues as long as there is mana", "Decrement by 10 inside the loop"], beatPosition: 184, timeSignature: 4 },
      { id: 48, prompt: "Create a loop that runs from 2 to 16, doubling the counter each time", expectedCode: "for (let i = 2; i <= 16; i *= 2) {}", hints: ["i will be 2, 4, 8, 16", "Use `*=` for the increment"], beatPosition: 188, timeSignature: 4 },
      { id: 49, prompt: "Create a 10x10 multiplication table structure with nested loops", expectedCode: "for (let i = 1; i <= 10; i++) {\n  for (let j = 1; j <= 10; j++) {}\n}", hints: ["The outer loop can represent the rows", "The inner loop can represent the columns"], beatPosition: 192, timeSignature: 4 },
      { id: 50, prompt: "Create a simple for loop that runs 7 times", expectedCode: "for (let i = 0; i < 7; i++) {}", hints: ["The standard, most common loop structure", "Starts at 0, ends before 7"], beatPosition: 196, timeSignature: 4 },
    ]
  },
  // =================================================================
  // Level 3: Conditional Beats
  // =================================================================
  {
    id: 3,
    title: "Conditional Beats",
    concept: "If Statements",
    description: "Make decisions with conditional logic",
    tempo: 120,
    difficulty: 'intermediate',
    unlocked: false,
    challenges: [
      // --- Basic If/Else ---
      { id: 1, prompt: "Check if 'score' is greater than 100", expectedCode: "if (score > 100) {}", hints: ["Use an if statement", "The greater than operator is `>`"], beatPosition: 0, timeSignature: 4 },
      { id: 2, prompt: "Check if 'health' is equal to 0", expectedCode: "if (health === 0) {}", hints: ["Use the strict equality operator `===`", "This checks for value and type"], beatPosition: 4, timeSignature: 4 },
      { id: 3, prompt: "If 'isGameOver' is true, run some code", expectedCode: "if (isGameOver === true) {}", hints: ["You can check boolean variables directly", "A shorter way is `if (isGameOver)`"], beatPosition: 8, timeSignature: 4 },
      { id: 4, prompt: "A shorter way to check if 'isGameOver' is true", expectedCode: "if (isGameOver) {}", hints: ["If a variable is 'truthy' (like true, non-zero numbers, non-empty strings), the code block will run", "This is very common"], beatPosition: 12, timeSignature: 4 },
      { id: 5, prompt: "Check if 'playerName' is not equal to 'Guest'", expectedCode: "if (playerName !== 'Guest') {}", hints: ["The strict inequality operator is `!==`", "Checks for both value and type"], beatPosition: 16, timeSignature: 4 },
      { id: 6, prompt: "Check if 'mana' is less than or equal to 10", expectedCode: "if (mana <= 10) {}", hints: ["The less than or equal to operator is `<=`", "Useful for checking resource thresholds"], beatPosition: 20, timeSignature: 4 },
      { id: 7, prompt: "Check if 'age' is greater than or equal to 18", expectedCode: "if (age >= 18) {}", hints: ["The greater than or equal to operator is `>=`", "Common for checking permissions"], beatPosition: 24, timeSignature: 4 },
      { id: 8, prompt: "Create an if-else statement. If 'x > 5', do one thing, otherwise do another.", expectedCode: "if (x > 5) {} else {}", hints: ["The `else` block runs if the `if` condition is false", "Provides an alternative path"], beatPosition: 28, timeSignature: 4 },
      { id: 9, prompt: "If 'hasKey' is true, open the door. Otherwise, say it's locked.", expectedCode: "if (hasKey) {} else {}", hints: ["A perfect use case for if-else", "Handles both possibilities"], beatPosition: 32, timeSignature: 4 },
      { id: 10, prompt: "Check if 'ammo' is 0. If so, reload. Otherwise, fire.", expectedCode: "if (ammo === 0) {} else {}", hints: ["Conditional logic is key to game mechanics", "One condition, two outcomes"], beatPosition: 36, timeSignature: 4 },

      // --- Else If ---
      { id: 11, prompt: "If 'temp' > 30 it's hot. Else if 'temp' > 20 it's warm. Otherwise it's cool.", expectedCode: "if (temp > 30) {} else if (temp > 20) {} else {}", hints: ["Use `else if` to check multiple conditions in a sequence", "The first one that is true will run"], beatPosition: 40, timeSignature: 4 },
      { id: 12, prompt: "Check 'grade'. 'A' for score > 90, 'B' for > 80, 'C' for > 70.", expectedCode: "if (score > 90) {} else if (score > 80) {} else if (score > 70) {}", hints: ["Order matters in an `else if` chain", "It checks from top to bottom"], beatPosition: 44, timeSignature: 4 },
      
      // --- Logical Operators (AND, OR, NOT) ---
      { id: 13, prompt: "Check if 'health' is greater than 0 AND 'mana' is greater than 10", expectedCode: "if (health > 0 && mana > 10) {}", hints: ["The AND operator `&&` requires *both* conditions to be true", "Useful for checking multiple requirements"], beatPosition: 48, timeSignature: 4 },
      { id: 14, prompt: "Check if 'hasRedKey' OR 'hasBlueKey' is true", expectedCode: "if (hasRedKey || hasBlueKey) {}", hints: ["The OR operator `||` requires *at least one* of the conditions to be true", "Useful for checking alternative options"], beatPosition: 52, timeSignature: 4 },
      { id: 15, prompt: "Check if 'isPlayerOnline' is NOT true", expectedCode: "if (!isPlayerOnline) {}", hints: ["The NOT operator `!` inverts a boolean value", "`!true` is false, `!false` is true"], beatPosition: 56, timeSignature: 4 },
      { id: 16, prompt: "Check if 'score' is between 50 and 100 (inclusive)", expectedCode: "if (score >= 50 && score <= 100) {}", hints: ["Combine two checks with `&&` to create a range", "A very common pattern"], beatPosition: 60, timeSignature: 4 },
      { id: 17, prompt: "Check if 'enemyType' is 'Goblin' OR 'Orc'", expectedCode: "if (enemyType === 'Goblin' || enemyType === 'Orc') {}", hints: ["Use `||` to see if a variable matches one of several values", "Both sides of the `||` must be complete conditions"], beatPosition: 64, timeSignature: 4 },
      { id: 18, prompt: "Check if player is ready: 'isAwake' is true AND 'hasWeapon' is true", expectedCode: "if (isAwake && hasWeapon) {}", hints: ["Use `&&` to ensure all conditions for a state are met", "Both must be true"], beatPosition: 68, timeSignature: 4 },
      { id: 19, prompt: "Check if 'level' is 10 OR 'isBossLevel' is true", expectedCode: "if (level === 10 || isBossLevel) {}", hints: ["A player might be on the boss level even if it's not level 10", "`||` is perfect for this"], beatPosition: 72, timeSignature: 4 },
      { id: 20, prompt: "Check if it's NOT game over", expectedCode: "if (!isGameOver) {}", hints: ["A concise way to check for a false condition", "Same as `isGameOver === false`"], beatPosition: 76, timeSignature: 4 },
      
      // --- Ternary Operator ---
      { id: 21, prompt: "Using a ternary operator, set 'message' to 'Win' if score > 100, else 'Lose'", expectedCode: "let message = score > 100 ? 'Win' : 'Lose';", hints: ["The ternary operator is a compact if-else: `condition ? value_if_true : value_if_false`", "Great for assigning one of two values to a variable"], beatPosition: 80, timeSignature: 4 },
      { id: 22, prompt: "Set 'playerStatus' to 'Active' if 'isOnline' is true, else 'Offline'", expectedCode: "let playerStatus = isOnline ? 'Active' : 'Offline';", hints: ["Ternary operators make code more concise", "Read it as: Is `isOnline` true? If so, 'Active'. If not, 'Offline'."], beatPosition: 84, timeSignature: 4 },
      { id: 23, prompt: "Set 'canProceed' to true if 'level' > 5, otherwise set it to false", expectedCode: "let canProceed = level > 5 ? true : false;", hints: ["A simple true/false assignment", "This can be simplified further"], beatPosition: 88, timeSignature: 4 },
      { id: 24, prompt: "A simpler way to do the previous challenge", expectedCode: "let canProceed = level > 5;", hints: ["The expression `level > 5` already evaluates to true or false", "You can assign its result directly to the variable"], beatPosition: 92, timeSignature: 4 },

      // --- Switch Statements ---
      { id: 25, prompt: "Create a switch statement for a variable 'weaponType'", expectedCode: "switch (weaponType) {}", hints: ["A switch statement is a good alternative to a long if-else if chain", "It checks a single variable against multiple possible values"], beatPosition: 96, timeSignature: 4 },
      { id: 26, prompt: "In a switch for 'weaponType', add a case for 'sword'", expectedCode: "switch (weaponType) {\n  case 'sword':\n    break;\n}", hints: ["Each possible value is a `case`", "Always end a case with `break` to prevent 'fall-through'"], beatPosition: 100, timeSignature: 4 },
      { id: 27, prompt: "Add cases for 'axe' and 'bow' to the weapon switch", expectedCode: "switch (weaponType) {\n  case 'sword':\n    break;\n  case 'axe':\n    break;\n  case 'bow':\n    break;\n}", hints: ["You can have as many cases as you need", "Each one checks for a specific value"], beatPosition: 104, timeSignature: 4 },
      { id: 28, prompt: "Add a 'default' case to the weapon switch", expectedCode: "switch (weaponType) {\n  case 'sword':\n    break;\n  default:\n    break;\n}", hints: ["The `default` case runs if none of the other cases match", "It's like the final `else` in an if-else chain"], beatPosition: 108, timeSignature: 4 },
      { id: 29, prompt: "Create a switch for 'dayOfWeek' (1-7). Case 1 is 'Monday', case 7 is 'Sunday'.", expectedCode: "switch (dayOfWeek) {\n  case 1:\n    break;\n  case 7:\n    break;\n}", hints: ["Switch statements can work with numbers too", "Match the variable against numeric cases"], beatPosition: 112, timeSignature: 4 },

      // --- More Complex Conditions & Nesting ---
      { id: 30, prompt: "Check if a player can enter a raid: level >= 50 AND (guild === 'Alpha' OR isVIP === true)", expectedCode: "if (level >= 50 && (guild === 'Alpha' || isVIP)) {}", hints: ["Use parentheses `()` to group conditions", "The `||` part is evaluated first, then the `&&` part"], beatPosition: 116, timeSignature: 4 },
      { id: 31, prompt: "Create a nested if statement. First check if 'isArmed', then inside, check if 'ammo > 0'.", expectedCode: "if (isArmed) {\n  if (ammo > 0) {}\n}", hints: ["Nesting allows for more detailed checks", "You only check for ammo if the player is armed"], beatPosition: 120, timeSignature: 4 },
      { id: 32, prompt: "Check if 'x' is not 0", expectedCode: "if (x !== 0) {}", hints: ["Use strict inequality `!==`", "A common check before division"], beatPosition: 124, timeSignature: 4 },
      { id: 33, prompt: "Check if a string 'username' is empty", expectedCode: "if (username === '') {}", hints: ["An empty string has a length of 0", "This checks if the user has entered a name"], beatPosition: 128, timeSignature: 4 },
      { id: 34, prompt: "Check if 'value' is less than 0 OR greater than 100", expectedCode: "if (value < 0 || value > 100) {}", hints: ["This checks if a value is outside a specific range", "Useful for validation"], beatPosition: 132, timeSignature: 4 },
      { id: 35, prompt: "Check if 'isLoggedIn' is true and 'isAdmin' is true", expectedCode: "if (isLoggedIn && isAdmin) {}", hints: ["Use `&&` to check for multiple permissions", "Both must be true to proceed"], beatPosition: 136, timeSignature: 4 },
      { id: 36, prompt: "Use a ternary to set 'price' to 10 if 'isMember' is true, else 20", expectedCode: "let price = isMember ? 10 : 20;", hints: ["Condition `isMember`", "Value if true is 10", "Value if false is 20"], beatPosition: 140, timeSignature: 4 },
      { id: 37, prompt: "Check if 'year' is a leap year (divisible by 4 but not 100, unless also by 400)", expectedCode: "if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {}", hints: ["This is a classic logic puzzle!", "Use parentheses to group the logic correctly"], beatPosition: 144, timeSignature: 4 },
      { id: 38, prompt: "If 'energy' is 0, do nothing. Else if 'isTired' is true, rest. Else, work.", expectedCode: "if (energy === 0) {} else if (isTired) {} else {}", hints: ["A three-tiered decision", "The order of checks is important"], beatPosition: 148, timeSignature: 4 },
      { id: 39, prompt: "Check if a variable 'input' has a 'truthy' value", expectedCode: "if (input) {}", hints: ["Values like `true`, 1, 'hello' are truthy. `false`, 0, '', `null`, `undefined` are falsy.", "This is a quick way to check if a variable has a usable value"], beatPosition: 152, timeSignature: 4 },
      { id: 40, prompt: "Check if a variable 'data' has a 'falsy' value", expectedCode: "if (!data) {}", hints: ["Using `!` on a falsy value makes the condition true", "This checks for `false`, 0, `''`, `null`, or `undefined`"], beatPosition: 156, timeSignature: 4 },
      { id: 41, prompt: "Check if 'a' is equal to 'b'", expectedCode: "if (a === b) {}", hints: ["Use `===` for strict equality", "This is generally safer than `==`"], beatPosition: 160, timeSignature: 4 },
      { id: 42, prompt: "Check if 'a' is less than 'b' AND 'b' is less than 'c'", expectedCode: "if (a < b && b < c) {}", hints: ["This checks if 'b' is between 'a' and 'c'", "A common way to check ordering"], beatPosition: 164, timeSignature: 4 },
      { id: 43, prompt: "Set 'access' to 'granted' if 'password' is '1234', else 'denied'. Use a ternary.", expectedCode: "let access = password === '1234' ? 'granted' : 'denied';", hints: ["A compact way to write a simple if-else assignment", "Very readable for simple cases"], beatPosition: 168, timeSignature: 4 },
      { id: 44, prompt: "Create a switch for 'direction'. Add cases for 'up', 'down', 'left', 'right'.", expectedCode: "switch (direction) {\n  case 'up': break;\n  case 'down': break;\n  case 'left': break;\n  case 'right': break;\n}", hints: ["Switch is perfect for handling a fixed set of string commands", "Don't forget `break`!"], beatPosition: 172, timeSignature: 4 },
      { id: 45, prompt: "Check if 'itemsInCart' is not zero", expectedCode: "if (itemsInCart !== 0) {}", hints: ["A simple check to see if a cart is empty or not", "Can also be written as `if (itemsInCart)`"], beatPosition: 176, timeSignature: 4 },
      { id: 46, prompt: "If 'mode' is 'hard', set 'lives' to 1. Else, set 'lives' to 3.", expectedCode: "if (mode === 'hard') {} else {}", hints: ["A classic if-else for game difficulty", "Handles the two main cases"], beatPosition: 180, timeSignature: 4 },
      { id: 47, prompt: "Check if 'name' is defined (not null or undefined)", expectedCode: "if (name != null) {}", hints: ["The `!= null` check conveniently handles both `null` and `undefined`", "This is a rare case where `!=` is often used instead of `!==`"], beatPosition: 184, timeSignature: 4 },
      { id: 48, prompt: "Check if 'isRaining' is false", expectedCode: "if (isRaining === false) {}", hints: ["The explicit check", "Can be shortened to `!isRaining`"], beatPosition: 188, timeSignature: 4 },
      { id: 49, prompt: "Check if 'player' can cast a spell: 'mana' > 20 AND 'isSilenced' is false", expectedCode: "if (mana > 20 && !isSilenced) {}", hints: ["Combine a numeric check with a boolean check", "Use `!` to check for the false case"], beatPosition: 192, timeSignature: 4 },
      { id: 50, prompt: "Check if 'x' is an even number", expectedCode: "if (x % 2 === 0) {}", hints: ["The modulo operator `%` is key", "If a number divided by 2 has no remainder, it's even"], beatPosition: 196, timeSignature: 4 },
    ]
  },
  // =================================================================
  // Level 4: Function Harmony
  // =================================================================
  {
    id: 4,
    title: "Function Harmony",
    concept: "Functions",
    description: "Create reusable code with functions",
    tempo: 140,
    difficulty: 'advanced',
    unlocked: false,
    challenges: [
      // --- Basic Function Declarations & Expressions ---
      { id: 1, prompt: "Create a function declaration named 'startGame'", expectedCode: "function startGame() {}", hints: ["Start with the 'function' keyword, followed by the name and parentheses", "This is the classic way to define a function"], beatPosition: 0, timeSignature: 4 },
      { id: 2, prompt: "Create a function expression assigned to a constant 'endGame'", expectedCode: "const endGame = function() {};", hints: ["A function expression is an anonymous function assigned to a variable", "It's often used with `const`"], beatPosition: 4, timeSignature: 4 },
      { id: 3, prompt: "Create an arrow function assigned to a constant 'playerJump'", expectedCode: "const playerJump = () => {};", hints: ["Arrow functions provide a shorter syntax: `() => {}`", "They are very common in modern JavaScript"], beatPosition: 8, timeSignature: 4 },
      { id: 4, prompt: "Declare a function 'displayScore' that takes one parameter, 'score'", expectedCode: "function displayScore(score) {}", hints: ["Parameters are variables listed inside the function's parentheses", "They act as placeholders for values you'll provide later"], beatPosition: 12, timeSignature: 4 },
      { id: 5, prompt: "Declare a function 'add' that takes two parameters, 'a' and 'b'", expectedCode: "function add(a, b) {}", hints: ["Separate multiple parameters with a comma", "These are local variables inside the function"], beatPosition: 16, timeSignature: 4 },
      
      // --- Return Values ---
      { id: 6, prompt: "Create a function 'getScore' that returns the number 100", expectedCode: "function getScore() {\n  return 100;\n}", hints: ["The `return` keyword sends a value back from the function", "Execution of the function stops after `return`"], beatPosition: 20, timeSignature: 4 },
      { id: 7, prompt: "Create a function 'isGameOver' that returns false", expectedCode: "function isGameOver() {\n  return false;\n}", hints: ["Functions can return any data type, including booleans", "Useful for checking game states"], beatPosition: 24, timeSignature: 4 },
      { id: 8, prompt: "Create a function 'getPlayerName' that returns the string 'Link'", expectedCode: "const getPlayerName = () => {\n  return 'Link';\n};", hints: ["Arrow functions can have a full body with a return statement", "Remember the curly braces `{}` for multi-line bodies"], beatPosition: 28, timeSignature: 4 },
      { id: 9, prompt: "Create a function 'add' that takes 'a' and 'b' and returns their sum", expectedCode: "function add(a, b) {\n  return a + b;\n}", hints: ["Use parameters in calculations", "The `return` statement passes the result out of the function"], beatPosition: 32, timeSignature: 4 },
      { id: 10, prompt: "Create a function 'multiply' that returns the product of 'x' and 'y'", expectedCode: "const multiply = (x, y) => {\n  return x * y;\n};", hints: ["An arrow function can perform calculations and return the result", "Parameters `x` and `y` are used inside"], beatPosition: 36, timeSignature: 4 },
      
      // --- Arrow Function Shorthands ---
      { id: 11, prompt: "Write a concise arrow function 'double' that takes 'x' and returns 'x * 2'", expectedCode: "const double = x => x * 2;", hints: ["If an arrow function has only one parameter, you can omit the parentheses `()`", "If the body is a single expression, you can omit the `{}` and `return`"], beatPosition: 40, timeSignature: 4 },
      { id: 12, prompt: "Write a concise arrow function 'getTrue' that returns true", expectedCode: "const getTrue = () => true;", hints: ["No parameters needs empty parentheses `()`", "Implicit return of the value `true`"], beatPosition: 44, timeSignature: 4 },
      { id: 13, prompt: "Write a concise arrow function 'add' for two numbers", expectedCode: "const add = (a, b) => a + b;", hints: ["Multiple parameters still need parentheses `()`", "The expression `a + b` is implicitly returned"], beatPosition: 48, timeSignature: 4 },
      
      // --- Default Parameters ---
      { id: 14, prompt: "Create a function 'greet' with a parameter 'name' that defaults to 'Guest'", expectedCode: "function greet(name = 'Guest') {}", hints: ["Set a default value using `=` in the parameter list", "This value is used if no argument is provided for 'name'"], beatPosition: 52, timeSignature: 4 },
      { id: 15, prompt: "Create a function 'createPlayer' with 'health' defaulting to 100 and 'mana' to 50", expectedCode: "function createPlayer(health = 100, mana = 50) {}", hints: ["You can have multiple default parameters", "This makes functions more flexible"], beatPosition: 56, timeSignature: 4 },
      
      // --- Function Scope ---
      { id: 16, prompt: "Create a function 'testScope' with a local variable 'localVar' set to 5", expectedCode: "function testScope() {\n  let localVar = 5;\n}", hints: ["Variables declared inside a function are only accessible within that function", "This is called local scope"], beatPosition: 60, timeSignature: 4 },
      { id: 17, prompt: "Given a global 'score', create a function 'updateScore' that changes it", expectedCode: "let score = 0;\nfunction updateScore() {\n  score = 10;\n}", hints: ["Functions can access and modify variables in the outer (global) scope", "Be careful with this, as it can lead to unexpected behavior"], beatPosition: 64, timeSignature: 4 },
      
      // --- Higher-Order Functions & Callbacks ---
      { id: 18, prompt: "Create a function 'doAction' that takes another function 'callback' as a parameter", expectedCode: "function doAction(callback) {}", hints: ["A function that takes another function as an argument is a 'higher-order function'", "This is a very powerful concept in JavaScript"], beatPosition: 68, timeSignature: 4 },
      { id: 19, prompt: "Inside 'doAction', call the 'callback' function", expectedCode: "function doAction(callback) {\n  callback();\n}", hints: ["You can execute the passed-in function by adding parentheses `()` to its name", "The function passed as an argument is called a 'callback'"], beatPosition: 72, timeSignature: 4 },
      { id: 20, prompt: "Create a function 'onTimerEnd' and pass it as a callback to 'setTimeout'", expectedCode: "setTimeout(onTimerEnd, 1000);", hints: ["`setTimeout` is a built-in higher-order function", "It calls your function (the callback) after a specified delay in milliseconds"], beatPosition: 76, timeSignature: 4 },
      { id: 21, prompt: "Pass an anonymous function directly as a callback to 'setTimeout'", expectedCode: "setTimeout(function() {}, 1000);", hints: ["You don't need to name a function if you're only using it once as a callback", "This is a very common pattern"], beatPosition: 80, timeSignature: 4 },
      { id: 22, prompt: "Pass an arrow function as a callback to 'setTimeout'", expectedCode: "setTimeout(() => {}, 1000);", hints: ["Arrow functions are excellent for concise callbacks", "This is the most modern way to write it"], beatPosition: 84, timeSignature: 4 },
      
      // --- More Function Examples ---
      { id: 23, prompt: "Create a function 'isEven' that returns true if a number is even, false otherwise", expectedCode: "function isEven(num) {\n  return num % 2 === 0;\n}", hints: ["The function should take one parameter `num`", "The expression `num % 2 === 0` evaluates to a boolean, which you can return directly"], beatPosition: 88, timeSignature: 4 },
      { id: 24, prompt: "Create a function 'max' that returns the larger of two numbers", expectedCode: "function max(a, b) {\n  return a > b ? a : b;\n}", hints: ["A ternary operator is perfect for this", "If a > b, return a, otherwise return b"], beatPosition: 92, timeSignature: 4 },
      { id: 25, prompt: "Create a function 'logMessage' that takes a 'message' and prints it", expectedCode: "function logMessage(message) {\n  console.log(message);\n}", hints: ["Functions that perform an action but don't return a value are common", "These are said to have 'side effects'"], beatPosition: 96, timeSignature: 4 },
      { id: 26, prompt: "Create a function 'createGreeting' that takes a 'name' and returns 'Hello, [name]'", expectedCode: "const createGreeting = name => `Hello, ${name}`;", hints: ["Use a template literal for easy string formatting", "A concise arrow function is a great choice here"], beatPosition: 100, timeSignature: 4 },
      { id: 27, prompt: "Create a function 'noop' (no operation) that does nothing and returns nothing", expectedCode: "function noop() {}", hints: ["Sometimes an empty function is useful as a placeholder or default callback", "It's a function that has no body"], beatPosition: 104, timeSignature: 4 },
      { id: 28, prompt: "Create a function that returns another function", expectedCode: "function createAdder() {\n  return function(x) {};\n}", hints: ["Functions are 'first-class citizens' in JS, they can be returned from other functions", "This is used in concepts like closures"], beatPosition: 108, timeSignature: 4 },
      { id: 29, prompt: "Define and immediately call a function (IIFE)", expectedCode: "(function() {})();", hints: ["An Immediately Invoked Function Expression (IIFE) runs as soon as it's defined", "Wrap the function in parentheses, then add `()` at the end to call it"], beatPosition: 112, timeSignature: 4 },
      { id: 30, prompt: "Create a function 'calculateArea' for a rectangle (width, height)", expectedCode: "function calculateArea(width, height) {\n  return width * height;\n}", hints: ["The function should take two parameters", "It should return their product"], beatPosition: 116, timeSignature: 4 },
      { id: 31, prompt: "Create a function 'toLower' that converts a string to lowercase", expectedCode: "function toLower(str) {\n  return str.toLowerCase();\n}", hints: ["Strings have built-in methods you can use inside functions", "`.toLowerCase()` is one of them"], beatPosition: 120, timeSignature: 4 },
      { id: 32, prompt: "Write an arrow function 'scream' that takes a string and adds '!!!' to it", expectedCode: "const scream = text => `${text}!!!`;", hints: ["Use a concise arrow function and a template literal", "A simple and effective one-liner"], beatPosition: 124, timeSignature: 4 },
      { id: 33, prompt: "Create a function 'hasItems' that returns true if an array's length is > 0", expectedCode: "function hasItems(arr) {\n  return arr.length > 0;\n}", hints: ["Functions can take arrays as parameters", "The `.length` property is key here"], beatPosition: 128, timeSignature: 4 },
      { id: 34, prompt: "Create a function with a rest parameter to accept any number of arguments", expectedCode: "function sumAll(...numbers) {}", hints: ["The rest parameter `...` gathers all arguments into a single array", "The array here will be named `numbers`"], beatPosition: 132, timeSignature: 4 },
      { id: 35, prompt: "Create a function 'getFirstElement' that returns the first item of an array", expectedCode: "function getFirstElement(arr) {\n  return arr[0];\n}", hints: ["Pass an array as an argument", "Access the first element using index `[0]`"], beatPosition: 136, timeSignature: 4 },
      { id: 36, prompt: "Write a function 'sayHi'. Then, create a new variable 'hello' and assign 'sayHi' to it.", expectedCode: "function sayHi() {}\nconst hello = sayHi;", hints: ["Functions can be assigned to variables just like any other value", "`hello` now refers to the same function"], beatPosition: 140, timeSignature: 4 },
      { id: 37, prompt: "Create a function 'setVolume' with a parameter 'level' defaulting to 50", expectedCode: "const setVolume = (level = 50) => {};", hints: ["Default parameters work with arrow functions too", "If `setVolume()` is called with no arguments, `level` will be 50"], beatPosition: 144, timeSignature: 4 },
      { id: 38, prompt: "Write a function that takes an object 'player' and returns its 'name' property", expectedCode: "function getPlayerName(player) {\n  return player.name;\n}", hints: ["Functions can accept objects as arguments", "Use dot notation to access properties"], beatPosition: 148, timeSignature: 4 },
      { id: 39, prompt: "Write the previous function using object destructuring in the parameter list", expectedCode: "function getPlayerName({ name }) {\n  return name;\n}", hints: ["Destructuring `{ name }` pulls the `name` property directly out of the object passed in", "This creates a local variable `name`"], beatPosition: 152, timeSignature: 4 },
      { id: 40, prompt: "Create a function 'playTrack' that takes 'trackId' and 'volume'", expectedCode: "const playTrack = (trackId, volume) => {};", hints: ["A standard arrow function with two parameters", "Parentheses are required for multiple parameters"], beatPosition: 156, timeSignature: 4 },
      { id: 41, prompt: "Create a function 'square' that returns a number times itself", expectedCode: "function square(n) {\n  return n * n;\n}", hints: ["A simple mathematical function", "Takes one number, returns another"], beatPosition: 160, timeSignature: 4 },
      { id: 42, prompt: "Write 'square' as a concise arrow function", expectedCode: "const square = n => n * n;", hints: ["One parameter, one expression body", "This is the most compact form"], beatPosition: 164, timeSignature: 4 },
      { id: 43, prompt: "Create a function 'combine' that returns two strings concatenated", expectedCode: "function combine(str1, str2) {\n  return str1 + str2;\n}", hints: ["Functions can operate on strings", "The `+` operator concatenates them"], beatPosition: 168, timeSignature: 4 },
      { id: 44, prompt: "Create a function 'doTwice' that takes a function 'fn' and calls it two times", expectedCode: "function doTwice(fn) {\n  fn();\n  fn();\n}", hints: ["A higher-order function that controls how many times a callback is run", "A simple loop could also work here"], beatPosition: 172, timeSignature: 4 },
      { id: 45, prompt: "Create a function 'getEmptyObject' that returns a new empty object", expectedCode: "const getEmptyObject = () => ({});", hints: ["To implicitly return an object from a concise arrow function, wrap it in parentheses `({})`", "Otherwise, the `{}` are mistaken for a function body"], beatPosition: 176, timeSignature: 4 },
      { id: 46, prompt: "Declare a function 'spawnEnemy'", expectedCode: "function spawnEnemy() {}", hints: ["A classic function declaration", "The name clearly states its purpose"], beatPosition: 180, timeSignature: 4 },
      { id: 47, prompt: "Create a function 'isPositive' that returns true if a number is > 0", expectedCode: "const isPositive = num => num > 0;", hints: ["The expression `num > 0` already results in a boolean", "Return that result directly"], beatPosition: 184, timeSignature: 4 },
      { id: 48, prompt: "Create a function 'getFinalScore' with a parameter 'baseScore' and 'bonus' defaulting to 0", expectedCode: "function getFinalScore(baseScore, bonus = 0) {\n  return baseScore + bonus;\n}", hints: ["You can mix regular and default parameters", "Default parameters should generally come after regular ones"], beatPosition: 188, timeSignature: 4 },
      { id: 49, prompt: "Create a function 'getOpposite' that returns the negative of a number", expectedCode: "function getOpposite(n) {\n  return -n;\n}", hints: ["The unary negation operator `-` can be used to flip the sign of a number", "Simple and effective"], beatPosition: 192, timeSignature: 4 },
      { id: 50, prompt: "Create a function 'call' that simply calls another function", expectedCode: "function call(func) {\n  func();\n}", hints: ["This demonstrates the core idea of a callback", "The function `call` invokes whatever function `func` it is given"], beatPosition: 196, timeSignature: 4 },
    ]
  }
];
