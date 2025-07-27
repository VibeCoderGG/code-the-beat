import * as parser from '@babel/parser';
import * as t from '@babel/types';

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
 * Simplified AST validation for JavaScript/TypeScript
 */
export class SimpleASTValidator {
  static validate(userCode: string, expectedStructure: ExpectedStructure): ValidationResult {
    try {
      const ast = parser.parse(userCode, {
        sourceType: 'script',
        allowImportExportEverywhere: true,
        plugins: ['typescript']
      });

      switch (expectedStructure.type) {
        case 'variable':
          return this.validateVariable(ast, expectedStructure);
        case 'function':
          return this.validateFunction(ast, expectedStructure);
        case 'if-statement':
          return this.validateIfStatement(ast, expectedStructure);
        default:
          return { isCorrect: false, feedback: 'Unknown validation type' };
      }
    } catch (error) {
      return {
        isCorrect: false,
        feedback: 'Syntax error in your code',
        syntaxError: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private static validateVariable(ast: t.File, expected: ExpectedStructure): ValidationResult {
    const program = ast.program;
    if (!program.body || program.body.length === 0) {
      return { isCorrect: false, feedback: 'No code found' };
    }

    const firstStatement = program.body[0];

    if (!t.isVariableDeclaration(firstStatement)) {
      return { isCorrect: false, feedback: 'Expected a variable declaration (let, const, or var)' };
    }

    const declaration = firstStatement.declarations[0];
    if (!t.isVariableDeclarator(declaration) || !t.isIdentifier(declaration.id)) {
      return { isCorrect: false, feedback: 'Invalid variable declaration structure' };
    }

    const variableName = declaration.id.name;
    if (expected.name && variableName !== expected.name) {
      return { 
        isCorrect: false, 
        feedback: `Expected variable name '${expected.name}', but found '${variableName}'` 
      };
    }

    // Check variable value
    if (expected.value !== undefined && declaration.init) {
      let actualValue: string | number | boolean | null = null;
      
      if (t.isNumericLiteral(declaration.init)) {
        actualValue = declaration.init.value;
      } else if (t.isStringLiteral(declaration.init)) {
        actualValue = declaration.init.value;
      } else if (t.isBooleanLiteral(declaration.init)) {
        actualValue = declaration.init.value;
      } else if (t.isNullLiteral(declaration.init)) {
        actualValue = null;
      }

      if (actualValue !== expected.value) {
        return { 
          isCorrect: false, 
          feedback: `Expected value '${expected.value}', but found '${actualValue}'` 
        };
      }
    }

    // Check declaration kind
    if (expected.kind && firstStatement.kind !== expected.kind) {
      return { 
        isCorrect: false, 
        feedback: `Expected '${expected.kind}' declaration, but found '${firstStatement.kind}'` 
      };
    }

    return { isCorrect: true, feedback: 'Perfect! Variable declaration is correct.' };
  }

  private static validateFunction(ast: t.File, expected: ExpectedStructure): ValidationResult {
    const program = ast.program;
    if (!program.body || program.body.length === 0) {
      return { isCorrect: false, feedback: 'No code found' };
    }

    const firstStatement = program.body[0];

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

    // Check for return statement if expected
    if (expected.returns !== undefined) {
      let hasCorrectReturn = false;
      
      // Simple check for return statement in function body
      if (firstStatement.body && t.isBlockStatement(firstStatement.body)) {
        for (const stmt of firstStatement.body.body) {
          if (t.isReturnStatement(stmt) && stmt.argument) {
            if (t.isNumericLiteral(stmt.argument) && stmt.argument.value === expected.returns) {
              hasCorrectReturn = true;
            } else if (t.isStringLiteral(stmt.argument) && stmt.argument.value === expected.returns) {
              hasCorrectReturn = true;
            } else if (t.isBooleanLiteral(stmt.argument) && stmt.argument.value === expected.returns) {
              hasCorrectReturn = true;
            }
          }
        }
      }

      if (!hasCorrectReturn) {
        return { 
          isCorrect: false, 
          feedback: `Expected function to return '${expected.returns}'` 
        };
      }
    }

    return { isCorrect: true, feedback: 'Perfect! Function declaration is correct.' };
  }

  private static validateIfStatement(ast: t.File, expected: ExpectedStructure): ValidationResult {
    const program = ast.program;
    if (!program.body || program.body.length === 0) {
      return { isCorrect: false, feedback: 'No code found' };
    }

    const firstStatement = program.body[0];

    if (!t.isIfStatement(firstStatement)) {
      return { isCorrect: false, feedback: 'Expected an if statement' };
    }

    // Validate condition
    if (expected.condition && expected.condition.type === 'binary') {
      const condition = firstStatement.test;
      
      if (t.isBinaryExpression(condition)) {
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
          let rightValue: string | number | boolean | null = null;
          
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
      } else {
        return { isCorrect: false, feedback: 'Expected a comparison in the if condition' };
      }
    }

    return { isCorrect: true, feedback: 'Perfect! If statement is correct.' };
  }
}

/**
 * Simple Python validation using regex patterns
 */
export class SimplePythonValidator {
  static validate(userCode: string, expected: ExpectedStructure): ValidationResult {
    const cleanCode = userCode.trim();

    switch (expected.type) {
      case 'variable':
        return this.validateVariable(cleanCode, expected);
      case 'function':
        return this.validateFunction(cleanCode, expected);
      case 'if-statement':
        return this.validateIfStatement(cleanCode, expected);
      default:
        return { isCorrect: false, feedback: 'Unknown validation type for Python' };
    }
  }

  private static validateVariable(code: string, expected: ExpectedStructure): ValidationResult {
    const variableRegex = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/;
    const match = code.match(variableRegex);

    if (!match) {
      return { isCorrect: false, feedback: 'Expected a variable assignment' };
    }

    const [, varName, varValueStr] = match;

    if (expected.name && varName !== expected.name) {
      return { 
        isCorrect: false, 
        feedback: `Expected variable name '${expected.name}', but found '${varName}'` 
      };
    }

    if (expected.value !== undefined) {
      let actualValue: string | number | boolean | null = null;
      
      if (varValueStr === 'True') actualValue = true;
      else if (varValueStr === 'False') actualValue = false;
      else if (varValueStr === 'None') actualValue = null;
      else if (varValueStr.startsWith('"') || varValueStr.startsWith("'")) {
        actualValue = varValueStr.slice(1, -1);
      } else if (!isNaN(Number(varValueStr))) {
        actualValue = Number(varValueStr);
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

  private static validateFunction(code: string, expected: ExpectedStructure): ValidationResult {
    const functionRegex = /^def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*:/;
    const match = code.match(functionRegex);

    if (!match) {
      return { isCorrect: false, feedback: 'Expected a function definition starting with "def"' };
    }

    const [, funcName, paramStr] = match;

    if (expected.name && funcName !== expected.name) {
      return { 
        isCorrect: false, 
        feedback: `Expected function name '${expected.name}', but found '${funcName}'` 
      };
    }

    // Check parameters
    if (expected.params) {
      const actualParams = paramStr.trim() ? paramStr.split(',').map(p => p.trim()) : [];
      if (actualParams.length !== expected.params.length) {
        return { 
          isCorrect: false, 
          feedback: `Expected ${expected.params.length} parameters, but found ${actualParams.length}` 
        };
      }

      for (let i = 0; i < expected.params.length; i++) {
        if (actualParams[i] !== expected.params[i]) {
          return { 
            isCorrect: false, 
            feedback: `Expected parameter '${expected.params[i]}', but found '${actualParams[i]}'` 
          };
        }
      }
    }

    return { isCorrect: true, feedback: 'Perfect! Python function definition is correct.' };
  }

  private static validateIfStatement(code: string, _expected: ExpectedStructure): ValidationResult {
    const ifRegex = /^if\s+(.+)\s*:/;
    const match = code.match(ifRegex);

    if (!match) {
      return { isCorrect: false, feedback: 'Expected an if statement ending with a colon' };
    }

    return { isCorrect: true, feedback: 'Perfect! Python if statement is correct.' };
  }
}

/**
 * Main validation function that chooses the appropriate validator
 */
export function validateCodeWithAST(userCode: string, language: string, expectedStructure: ExpectedStructure): ValidationResult {
  switch (language) {
    case 'javascript':
    case 'typescript':
      return SimpleASTValidator.validate(userCode, expectedStructure);
    case 'python':
      return SimplePythonValidator.validate(userCode, expectedStructure);
    default: {
      // Fallback to string comparison for other languages
      const normalizedUser = userCode.trim().replace(/\s+/g, ' ');
      const normalizedExpected = expectedStructure.expectedCode?.replace(/\s+/g, ' ') || '';
      
      return {
        isCorrect: normalizedUser === normalizedExpected,
        feedback: normalizedUser === normalizedExpected 
          ? 'Correct!' 
          : 'Code does not match expected structure'
      };
    }
  }
}
