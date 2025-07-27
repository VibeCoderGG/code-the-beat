import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

/**
 * AST-based code validation utilities for different programming languages
 */

export interface ValidationResult {
  isCorrect: boolean;
  feedback: string;
  syntaxError?: string;
}

export interface ExpectedStructure {
  type: 'variable' | 'function' | 'if-statement' | 'for-loop' | 'while-loop';
  name?: string;
  value?: string | number | boolean | null;
  kind?: 'let' | 'const' | 'var';
  params?: string[];
  returns?: string | number | boolean | null;
  condition?: {
    type: string;
    operator?: string;
    left?: string;
    right?: string | number | boolean | null;
    variable?: string;
  };
  init?: {
    variable?: string;
    value?: string | number | boolean | null;
  };
  expectedCode?: string;
}

/**
 * JavaScript AST validation using Babel parser
 */
export class JavaScriptValidator {
  /**
   * Validates JavaScript code using AST parsing
   * @param userCode - The code submitted by the user
   * @param expectedStructure - Expected code structure definition
   * @returns ValidationResult
   */
  static validate(userCode: string, expectedStructure: ExpectedStructure): ValidationResult {
    try {
      // Parse the user's code into an AST
      const ast = parser.parse(userCode, {
        sourceType: 'script',
        allowImportExportEverywhere: true,
        plugins: ['jsx', 'typescript']
      });

      // Delegate to specific validation based on expected structure type
      switch (expectedStructure.type) {
        case 'variable':
          return this.validateVariable(ast, expectedStructure);
        case 'function':
          return this.validateFunction(ast, expectedStructure);
        case 'if-statement':
          return this.validateIfStatement(ast, expectedStructure);
        case 'for-loop':
          return this.validateForLoop(ast, expectedStructure);
        case 'while-loop':
          return this.validateWhileLoop(ast, expectedStructure);
        default:
          return { isCorrect: false, feedback: 'Unknown validation type' };
      }
    } catch (error: any) {
      return {
        isCorrect: false,
        feedback: 'Syntax error in your code',
        syntaxError: error.message
      };
    }
  }

  /**
   * Validates variable declarations
   */
  private static validateVariable(ast: any, expected: any): ValidationResult {
    const program = ast.program;
    if (!program.body || program.body.length === 0) {
      return { isCorrect: false, feedback: 'No code found' };
    }

    const firstStatement = program.body[0];

    // Check if it's a variable declaration
    if (!t.isVariableDeclaration(firstStatement)) {
      return { isCorrect: false, feedback: 'Expected a variable declaration (let, const, or var)' };
    }

    const declaration = firstStatement.declarations[0];
    if (!t.isVariableDeclarator(declaration)) {
      return { isCorrect: false, feedback: 'Invalid variable declaration structure' };
    }

    // Check variable name
    if (!t.isIdentifier(declaration.id)) {
      return { isCorrect: false, feedback: 'Variable name should be an identifier' };
    }

    const variableName = declaration.id.name;
    if (expected.name && variableName !== expected.name) {
      return { 
        isCorrect: false, 
        feedback: `Expected variable name '${expected.name}', but found '${variableName}'` 
      };
    }

    // Check variable value
    if (expected.value !== undefined) {
      if (!declaration.init) {
        return { isCorrect: false, feedback: 'Variable should be initialized with a value' };
      }

      let actualValue: any;
      if (t.isNumericLiteral(declaration.init)) {
        actualValue = declaration.init.value;
      } else if (t.isStringLiteral(declaration.init)) {
        actualValue = declaration.init.value;
      } else if (t.isBooleanLiteral(declaration.init)) {
        actualValue = declaration.init.value;
      } else if (t.isNullLiteral(declaration.init)) {
        actualValue = null;
      } else {
        return { isCorrect: false, feedback: 'Unsupported value type' };
      }

      if (actualValue !== expected.value) {
        return { 
          isCorrect: false, 
          feedback: `Expected value '${expected.value}', but found '${actualValue}'` 
        };
      }
    }

    // Check declaration kind (let, const, var)
    if (expected.kind && firstStatement.kind !== expected.kind) {
      return { 
        isCorrect: false, 
        feedback: `Expected '${expected.kind}' declaration, but found '${firstStatement.kind}'` 
      };
    }

    return { isCorrect: true, feedback: 'Perfect! Variable declaration is correct.' };
  }

  /**
   * Validates function declarations
   */
  private static validateFunction(ast: any, expected: any): ValidationResult {
    const program = ast.program;
    if (!program.body || program.body.length === 0) {
      return { isCorrect: false, feedback: 'No code found' };
    }

    const firstStatement = program.body[0];

    // Check if it's a function declaration
    if (!t.isFunctionDeclaration(firstStatement)) {
      return { isCorrect: false, feedback: 'Expected a function declaration' };
    }

    // Check function name
    if (expected.name) {
      if (!firstStatement.id || firstStatement.id.name !== expected.name) {
        return { 
          isCorrect: false, 
          feedback: `Expected function name '${expected.name}', but found '${firstStatement.id?.name || 'anonymous'}'` 
        };
      }
    }

    // Check parameters
    if (expected.params) {
      if (firstStatement.params.length !== expected.params.length) {
        return { 
          isCorrect: false, 
          feedback: `Expected ${expected.params.length} parameters, but found ${firstStatement.params.length}` 
        };
      }

      for (let i = 0; i < expected.params.length; i++) {
        const param = firstStatement.params[i];
        if (!t.isIdentifier(param) || param.name !== expected.params[i]) {
          return { 
            isCorrect: false, 
            feedback: `Expected parameter '${expected.params[i]}', but found '${t.isIdentifier(param) ? param.name : 'invalid'}'` 
          };
        }
      }
    }

    // Check return statement if expected
    if (expected.returns !== undefined) {
      let hasCorrectReturn = false;
      traverse(ast, {
        ReturnStatement(path) {
          const returnValue = path.node.argument;
          if (returnValue) {
            if (t.isNumericLiteral(returnValue) && returnValue.value === expected.returns) {
              hasCorrectReturn = true;
            } else if (t.isStringLiteral(returnValue) && returnValue.value === expected.returns) {
              hasCorrectReturn = true;
            } else if (t.isBooleanLiteral(returnValue) && returnValue.value === expected.returns) {
              hasCorrectReturn = true;
            }
          }
        }
      });

      if (!hasCorrectReturn) {
        return { 
          isCorrect: false, 
          feedback: `Expected function to return '${expected.returns}'` 
        };
      }
    }

    return { isCorrect: true, feedback: 'Perfect! Function declaration is correct.' };
  }

  /**
   * Validates if statements
   */
  private static validateIfStatement(ast: any, expected: any): ValidationResult {
    const program = ast.program;
    if (!program.body || program.body.length === 0) {
      return { isCorrect: false, feedback: 'No code found' };
    }

    const firstStatement = program.body[0];

    // Check if it's an if statement
    if (!t.isIfStatement(firstStatement)) {
      return { isCorrect: false, feedback: 'Expected an if statement' };
    }

    // Validate condition
    if (expected.condition) {
      const condition = firstStatement.test;
      
      // Check for binary expressions (comparisons)
      if (expected.condition.type === 'binary' && t.isBinaryExpression(condition)) {
        const left = condition.left;
        const right = condition.right;
        const operator = condition.operator;

        if (expected.condition.operator && operator !== expected.condition.operator) {
          return { 
            isCorrect: false, 
            feedback: `Expected '${expected.condition.operator}' operator, but found '${operator}'` 
          };
        }

        if (expected.condition.left && t.isIdentifier(left) && left.name !== expected.condition.left) {
          return { 
            isCorrect: false, 
            feedback: `Expected left operand '${expected.condition.left}', but found '${left.name}'` 
          };
        }

        if (expected.condition.right !== undefined) {
          let rightValue: any;
          if (t.isNumericLiteral(right)) {
            rightValue = right.value;
          } else if (t.isStringLiteral(right)) {
            rightValue = right.value;
          } else if (t.isBooleanLiteral(right)) {
            rightValue = right.value;
          }

          if (rightValue !== expected.condition.right) {
            return { 
              isCorrect: false, 
              feedback: `Expected right operand '${expected.condition.right}', but found '${rightValue}'` 
            };
          }
        }
      }
    }

    return { isCorrect: true, feedback: 'Perfect! If statement is correct.' };
  }

  /**
   * Validates for loops
   */
  private static validateForLoop(ast: any, expected: any): ValidationResult {
    const program = ast.program;
    if (!program.body || program.body.length === 0) {
      return { isCorrect: false, feedback: 'No code found' };
    }

    const firstStatement = program.body[0];

    // Check if it's a for statement
    if (!t.isForStatement(firstStatement)) {
      return { isCorrect: false, feedback: 'Expected a for loop' };
    }

    // Validate initialization
    if (expected.init) {
      const init = firstStatement.init;
      if (!t.isVariableDeclaration(init)) {
        return { isCorrect: false, feedback: 'For loop should have a variable declaration in initialization' };
      }

      const declaration = init.declarations[0];
      if (!t.isVariableDeclarator(declaration) || !t.isIdentifier(declaration.id)) {
        return { isCorrect: false, feedback: 'Invalid for loop initialization' };
      }

      if (expected.init.variable && declaration.id.name !== expected.init.variable) {
        return { 
          isCorrect: false, 
          feedback: `Expected loop variable '${expected.init.variable}', but found '${declaration.id.name}'` 
        };
      }

      if (expected.init.value !== undefined && declaration.init) {
        if (t.isNumericLiteral(declaration.init) && declaration.init.value !== expected.init.value) {
          return { 
            isCorrect: false, 
            feedback: `Expected initial value '${expected.init.value}', but found '${declaration.init.value}'` 
          };
        }
      }
    }

    return { isCorrect: true, feedback: 'Perfect! For loop is correct.' };
  }

  /**
   * Validates while loops
   */
  private static validateWhileLoop(ast: any, expected: any): ValidationResult {
    const program = ast.program;
    if (!program.body || program.body.length === 0) {
      return { isCorrect: false, feedback: 'No code found' };
    }

    const firstStatement = program.body[0];

    // Check if it's a while statement
    if (!t.isWhileStatement(firstStatement)) {
      return { isCorrect: false, feedback: 'Expected a while loop' };
    }

    // Validate condition
    if (expected.condition) {
      const condition = firstStatement.test;
      
      if (expected.condition.type === 'binary' && t.isBinaryExpression(condition)) {
        const left = condition.left;
        const operator = condition.operator;

        if (expected.condition.operator && operator !== expected.condition.operator) {
          return { 
            isCorrect: false, 
            feedback: `Expected '${expected.condition.operator}' operator, but found '${operator}'` 
          };
        }

        if (expected.condition.variable && t.isIdentifier(left) && left.name !== expected.condition.variable) {
          return { 
            isCorrect: false, 
            feedback: `Expected variable '${expected.condition.variable}', but found '${left.name}'` 
          };
        }
      }
    }

    return { isCorrect: true, feedback: 'Perfect! While loop is correct.' };
  }
}

/**
 * Python validation using simple parsing (can be extended with Python AST)
 */
export class PythonValidator {
  static validate(userCode: string, expectedStructure: any): ValidationResult {
    const cleanCode = userCode.trim();

    switch (expectedStructure.type) {
      case 'variable':
        return this.validateVariable(cleanCode, expectedStructure);
      case 'function':
        return this.validateFunction(cleanCode, expectedStructure);
      case 'if-statement':
        return this.validateIfStatement(cleanCode, expectedStructure);
      case 'for-loop':
        return this.validateForLoop(cleanCode, expectedStructure);
      default:
        return { isCorrect: false, feedback: 'Unknown validation type for Python' };
    }
  }

  private static validateVariable(code: string, expected: any): ValidationResult {
    // Simple regex-based validation for Python variables
    const variableRegex = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/;
    const match = code.match(variableRegex);

    if (!match) {
      return { isCorrect: false, feedback: 'Expected a variable assignment' };
    }

    const [, varName, varValue] = match;

    if (expected.name && varName !== expected.name) {
      return { 
        isCorrect: false, 
        feedback: `Expected variable name '${expected.name}', but found '${varName}'` 
      };
    }

    if (expected.value !== undefined) {
      let actualValue: any;
      
      // Parse the value
      if (varValue === 'True') actualValue = true;
      else if (varValue === 'False') actualValue = false;
      else if (varValue === 'None') actualValue = null;
      else if (varValue.startsWith('"') || varValue.startsWith("'")) {
        actualValue = varValue.slice(1, -1); // Remove quotes
      } else if (!isNaN(Number(varValue))) {
        actualValue = Number(varValue);
      } else {
        actualValue = varValue;
      }

      if (actualValue !== expected.value) {
        return { 
          isCorrect: false, 
          feedback: `Expected value '${expected.value}', but found '${actualValue}'` 
        };
      }
    }

    return { isCorrect: true, feedback: 'Perfect! Python variable assignment is correct.' };
  }

  private static validateFunction(code: string, expected: any): ValidationResult {
    const functionRegex = /^def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)\s*:/;
    const match = code.match(functionRegex);

    if (!match) {
      return { isCorrect: false, feedback: 'Expected a function definition starting with "def"' };
    }

    const [, funcName] = match;

    if (expected.name && funcName !== expected.name) {
      return { 
        isCorrect: false, 
        feedback: `Expected function name '${expected.name}', but found '${funcName}'` 
      };
    }

    return { isCorrect: true, feedback: 'Perfect! Python function definition is correct.' };
  }

  private static validateIfStatement(code: string, expected: any): ValidationResult {
    const ifRegex = /^if\s+(.+)\s*:/;
    const match = code.match(ifRegex);

    if (!match) {
      return { isCorrect: false, feedback: 'Expected an if statement ending with a colon' };
    }

    return { isCorrect: true, feedback: 'Perfect! Python if statement is correct.' };
  }

  private static validateForLoop(code: string, expected: any): ValidationResult {
    const forRegex = /^for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+(.+)\s*:/;
    const match = code.match(forRegex);

    if (!match) {
      return { isCorrect: false, feedback: 'Expected a for loop with "for variable in iterable:" syntax' };
    }

    return { isCorrect: true, feedback: 'Perfect! Python for loop is correct.' };
  }
}

/**
 * Main validation dispatcher
 */
export function validateCode(userCode: string, language: string, expectedStructure: any): ValidationResult {
  switch (language) {
    case 'javascript':
    case 'typescript':
      return JavaScriptValidator.validate(userCode, expectedStructure);
    case 'python':
      return PythonValidator.validate(userCode, expectedStructure);
    default:
      // Fallback to string comparison for other languages
      return {
        isCorrect: userCode.trim().replace(/\s+/g, ' ') === expectedStructure.expectedCode?.replace(/\s+/g, ' '),
        feedback: userCode.trim().replace(/\s+/g, ' ') === expectedStructure.expectedCode?.replace(/\s+/g, ' ') 
          ? 'Correct!' 
          : 'Code does not match expected structure'
      };
  }
}
