export interface ValidationResult {
  isValid: boolean;
  error: string;
}

export interface Token {
  type: "number" | "variable" | "operator";
  value: string;
}

export const validateFormula = (formula: string): ValidationResult => {
  if (!formula.trim()) {
    return { isValid: false, error: "Formula cannot be empty" };
  }

  // Remove spaces for easier parsing
  const cleanFormula = formula.replace(/\s+/g, "");

  // Check parentheses matching
  let parenCount = 0;
  for (const char of cleanFormula) {
    if (char === "(") parenCount++;
    if (char === ")") parenCount--;
    if (parenCount < 0) {
      return { isValid: false, error: "Unmatched closing parenthesis ')'" };
    }
  }
  if (parenCount > 0) {
    return { isValid: false, error: "Unmatched opening parenthesis '('" };
  }

  // Check bracket constructs
  const bracketRegex = /[rl]\[([^\]]*)\]/g;
  let match;
  while ((match = bracketRegex.exec(cleanFormula)) !== null) {
    const content = match[1];
    if (!/^[1-9]$/.test(content)) {
      return {
        isValid: false,
        error: `Invalid bracket content '${content || "empty"}' - must be 1-9`,
      };
    }
  }

  // Check for empty brackets
  if (/[rl]\[\]/.test(cleanFormula)) {
    return {
      isValid: false,
      error: "Empty brackets found - must contain a number 1-9",
    };
  }

  // Check for orphaned brackets
  if (cleanFormula.includes("[") && !cleanFormula.match(/[rl]\[[1-9]\]/)) {
    return {
      isValid: false,
      error: "Invalid bracket syntax - use r[1-9] or l[1-9]",
    };
  }

  // Check for valid characters
  const invalidChars = cleanFormula.replace(/[irl\[\]\(\)0-9\+\-×]|all/g, "");
  if (invalidChars) {
    return { isValid: false, error: `Invalid characters: '${invalidChars}'` };
  }

  // Check for meaningful content
  const hasNumber = /[0-9]/.test(cleanFormula);
  const hasVariable = cleanFormula.includes("i");
  const hasBracketConstruct = /[rl]\[[1-9]\]/.test(cleanFormula);
  const hasAll = cleanFormula.includes("all");

  if (!hasNumber && !hasVariable && !hasBracketConstruct && !hasAll) {
    return {
      isValid: false,
      error:
        "Formula must contain at least one number, 'i', 'r[?]', 'l[?]', or 'all'",
    };
  }

  // Enhanced tokenization to handle multi-digit numbers
  const tokens = tokenizeFormula(cleanFormula);
  return validateTokens(tokens);
};

const tokenizeFormula = (cleanFormula: string): Token[] => {
  const tokens: Token[] = [];
  let i = 0;

  while (i < cleanFormula.length) {
    const char = cleanFormula[i];

    if (char === "(" || char === ")") {
      // Skip parentheses for structural analysis
      i++;
      continue;
    } else if (char === "a" && cleanFormula.substring(i, i + 3) === "all") {
      tokens.push({ type: "variable", value: "all" });
      i += 3;
    } else if (char === "i") {
      tokens.push({ type: "variable", value: "i" });
      i++;
    } else if ((char === "r" || char === "l") && cleanFormula[i + 1] === "[") {
      // Find the closing bracket
      const bracketEnd = cleanFormula.indexOf("]", i + 2);
      if (bracketEnd !== -1) {
        const bracketContent = cleanFormula.substring(i, bracketEnd + 1);
        tokens.push({ type: "variable", value: bracketContent });
        i = bracketEnd + 1;
      } else {
        i++;
      }
    } else if (/[0-9]/.test(char)) {
      // Handle multi-digit numbers
      let numberStr = "";
      while (i < cleanFormula.length && /[0-9]/.test(cleanFormula[i])) {
        numberStr += cleanFormula[i];
        i++;
      }
      tokens.push({ type: "number", value: numberStr });
    } else if (["+", "-", "×"].includes(char)) {
      tokens.push({ type: "operator", value: char });
      i++;
    } else {
      i++;
    }
  }

  return tokens;
};

const validateTokens = (tokens: Token[]): ValidationResult => {
  // Rule 1: Must start and end with a number or variable
  if (tokens.length === 0) {
    return { isValid: false, error: "Formula cannot be empty" };
  }

  const firstToken = tokens[0];
  const lastToken = tokens[tokens.length - 1];

  if (firstToken.type !== "number" && firstToken.type !== "variable") {
    return {
      isValid: false,
      error:
        "Formula must start with a number or variable (i, all, r[?], l[?])",
    };
  }

  if (lastToken.type !== "number" && lastToken.type !== "variable") {
    return {
      isValid: false,
      error: "Formula must end with a number or variable (i, all, r[?], l[?])",
    };
  }

  // Rule 2: Never have two operators in a row
  for (let j = 0; j < tokens.length - 1; j++) {
    if (tokens[j].type === "operator" && tokens[j + 1].type === "operator") {
      return {
        isValid: false,
        error: `Cannot have two operators in a row: '${tokens[j].value}${
          tokens[j + 1].value
        }'`,
      };
    }
  }

  // Rule 3: Variables must never be adjacent to numbers or other variables
  for (let j = 0; j < tokens.length - 1; j++) {
    const current = tokens[j];
    const next = tokens[j + 1];

    // Variable followed by anything (number or variable) is prohibited
    if (
      current.type === "variable" &&
      (next.type === "number" || next.type === "variable")
    ) {
      return {
        isValid: false,
        error: `Missing operator between '${current.value}' and '${next.value}' - variables must be separated from numbers and other variables by operators`,
      };
    }

    // Number followed by variable is prohibited
    if (current.type === "number" && next.type === "variable") {
      return {
        isValid: false,
        error: `Missing operator between '${current.value}' and '${next.value}' - numbers and variables must be separated by operators`,
      };
    }
  }

  // Rule 4: Operators must be between numbers/variables
  for (let j = 0; j < tokens.length; j++) {
    if (tokens[j].type === "operator") {
      const prevToken = tokens[j - 1];
      const nextToken = tokens[j + 1];

      if (
        !prevToken ||
        (prevToken.type !== "number" && prevToken.type !== "variable")
      ) {
        return {
          isValid: false,
          error: `Operator '${tokens[j].value}' must follow a number or variable`,
        };
      }

      if (
        !nextToken ||
        (nextToken.type !== "number" && nextToken.type !== "variable")
      ) {
        return {
          isValid: false,
          error: `Operator '${tokens[j].value}' must be followed by a number or variable`,
        };
      }
    }
  }

  return { isValid: true, error: "" };
};
