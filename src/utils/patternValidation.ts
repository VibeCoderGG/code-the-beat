// Pattern-based code validation for multiple programming languages
// This avoids browser compatibility issues with AST parsing

export interface ValidationResult {
  isValid: boolean;
  feedback: string;
  score: number;
}

export interface ExpectedPattern {
  type: 'variable' | 'function' | 'if' | 'for' | 'class' | 'import' | 'syntax';
  pattern: RegExp;
  description: string;
  points: number;
}

interface ChallengeValidation {
  patterns?: ExpectedPattern[];
}

interface ValidationChallenge {
  validation?: ChallengeValidation;
  expectedKeywords?: string | string[];
}

export class PatternValidator {
  private static readonly LANGUAGE_PATTERNS: Record<string, ExpectedPattern[]> = {
    javascript: [
      {
        type: 'variable',
        pattern: /\b(let|const|var)\s+\w+\s*=/,
        description: 'Variable declaration',
        points: 10
      },
      {
        type: 'function',
        pattern: /function\s+\w+\s*\([^)]*\)\s*\{|const\s+\w+\s*=\s*\([^)]*\)\s*=>/,
        description: 'Function declaration',
        points: 20
      },
      {
        type: 'if',
        pattern: /if\s*\([^)]+\)\s*\{/,
        description: 'If statement',
        points: 15
      }
    ],
    typescript: [
      {
        type: 'variable',
        pattern: /\b(let|const|var)\s+\w+\s*:\s*\w+\s*=/,
        description: 'Typed variable declaration',
        points: 15
      },
      {
        type: 'function',
        pattern: /function\s+\w+\s*\([^)]*\)\s*:\s*\w+\s*\{|const\s+\w+\s*=\s*\([^)]*\)\s*:\s*\w+\s*=>/,
        description: 'Typed function declaration',
        points: 25
      },
      {
        type: 'if',
        pattern: /if\s*\([^)]+\)\s*\{/,
        description: 'If statement',
        points: 15
      }
    ],
    python: [
      {
        type: 'variable',
        pattern: /^\s*\w+\s*=\s*.+$/m,
        description: 'Variable assignment',
        points: 10
      },
      {
        type: 'function',
        pattern: /def\s+\w+\s*\([^)]*\)\s*:/,
        description: 'Function definition',
        points: 20
      },
      {
        type: 'if',
        pattern: /if\s+.+\s*:/,
        description: 'If statement',
        points: 15
      }
    ],
    java: [
      {
        type: 'variable',
        pattern: /\b(int|String|double|boolean|float|long|char)\s+\w+\s*=/,
        description: 'Variable declaration',
        points: 15
      },
      {
        type: 'function',
        pattern: /(public|private|protected)?\s*(static)?\s*\w+\s+\w+\s*\([^)]*\)\s*\{/,
        description: 'Method declaration',
        points: 25
      },
      {
        type: 'class',
        pattern: /(public|private)?\s*class\s+\w+/,
        description: 'Class declaration',
        points: 30
      }
    ],
    cpp: [
      {
        type: 'variable',
        pattern: /\b(int|string|double|bool|float|long|char)\s+\w+\s*=/,
        description: 'Variable declaration',
        points: 15
      },
      {
        type: 'function',
        pattern: /\w+\s+\w+\s*\([^)]*\)\s*\{/,
        description: 'Function declaration',
        points: 25
      },
      {
        type: 'class',
        pattern: /class\s+\w+/,
        description: 'Class declaration',
        points: 30
      }
    ],
    html: [
      {
        type: 'syntax',
        pattern: /<\w+[^>]*>/,
        description: 'HTML tag',
        points: 10
      },
      {
        type: 'syntax',
        pattern: /<\/\w+>/,
        description: 'Closing HTML tag',
        points: 5
      }
    ],
    css: [
      {
        type: 'syntax',
        pattern: /[\w\-#.]+\s*\{[^}]*\}/,
        description: 'CSS rule',
        points: 15
      },
      {
        type: 'syntax',
        pattern: /[\w-]+\s*:\s*[^;]+;/,
        description: 'CSS property',
        points: 10
      }
    ],
    go: [
      {
        type: 'variable',
        pattern: /var\s+\w+\s+\w+|:\s*=/,
        description: 'Variable declaration',
        points: 15
      },
      {
        type: 'function',
        pattern: /func\s+\w+\s*\([^)]*\)/,
        description: 'Function declaration',
        points: 25
      }
    ]
  };

  static validateCode(code: string, language: string, expectedPatterns?: ExpectedPattern[]): ValidationResult {
    if (!code.trim()) {
      return {
        isValid: false,
        feedback: "Please enter some code!",
        score: 0
      };
    }

    const patterns = expectedPatterns || this.LANGUAGE_PATTERNS[language.toLowerCase()] || [];
    
    if (patterns.length === 0) {
      // Fallback: basic syntax check
      return {
        isValid: code.trim().length > 5,
        feedback: code.trim().length > 5 ? "Code looks good!" : "Code seems too short",
        score: code.trim().length > 5 ? 50 : 0
      };
    }

    let score = 0;
    const foundPatterns: string[] = [];
    const missedPatterns: string[] = [];

    for (const pattern of patterns) {
      if (pattern.pattern.test(code)) {
        score += pattern.points;
        foundPatterns.push(pattern.description);
      } else {
        missedPatterns.push(pattern.description);
      }
    }

    const totalPossibleScore = patterns.reduce((sum, p) => sum + p.points, 0);
    const percentage = totalPossibleScore > 0 ? Math.round((score / totalPossibleScore) * 100) : 0;
    
    let feedback = "";
    if (foundPatterns.length > 0) {
      feedback += `✅ Found: ${foundPatterns.join(", ")}. `;
    }
    if (missedPatterns.length > 0) {
      feedback += `❌ Missing: ${missedPatterns.join(", ")}.`;
    }

    return {
      isValid: percentage >= 50,
      feedback: feedback || "Great job!",
      score: percentage
    };
  }

  static validateChallenge(code: string, language: string, challenge: ValidationChallenge): ValidationResult {
    // If the challenge has specific validation patterns, use those
    if (challenge.validation && challenge.validation.patterns) {
      return this.validateCode(code, language, challenge.validation.patterns);
    }

    // If the challenge has expected keywords, check for those
    if (challenge.expectedKeywords) {
      const keywords = Array.isArray(challenge.expectedKeywords) 
        ? challenge.expectedKeywords 
        : [challenge.expectedKeywords];
      
      const foundKeywords = keywords.filter((keyword: string) => 
        code.toLowerCase().includes(keyword.toLowerCase())
      );
      
      const percentage = Math.round((foundKeywords.length / keywords.length) * 100);
      
      return {
        isValid: percentage >= 50,
        feedback: foundKeywords.length === keywords.length 
          ? "Perfect! All required elements found." 
          : `Found ${foundKeywords.length}/${keywords.length} required elements.`,
        score: percentage
      };
    }

    // Fallback to language patterns
    return this.validateCode(code, language);
  }
}

// Export patterns for use in level definitions
export const VALIDATION_PATTERNS = PatternValidator['LANGUAGE_PATTERNS'];
