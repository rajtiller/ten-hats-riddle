import React, { useState, useEffect } from "react";
import { insertTextAtPosition } from "./FormulaBar/utils";
import { useKeyboardControls } from "./FormulaBar/useKeyboardControls";
import TwoHatsFormulaDisplay, {
  type PersonHighlight,
} from "./TwoHatsFormulaDisplay";
import TwoHatsButtonGrid from "./TwoHatsButtonGrid";

interface TwoHatsFormulaBarProps {
  width?: number;
  height?: number;
  onTestResult?: (result: number[], formula: string) => void;
  onPersonHighlight?: (highlight: PersonHighlight | null) => void;
  initialFormula?: string;
  showAsReadOnly?: boolean;
  onTryAgain?: () => void;
}

interface ValidationResult {
  isValid: boolean;
  error: string;
}

interface Token {
  type: "number" | "variable" | "operator";
  value: string;
}

const validateTwoHatsFormula = (formula: string): ValidationResult => {
  if (!formula.trim()) {
    return { isValid: false, error: "Formula cannot be empty" };
  }

  const cleanFormula = formula.replace(/\s+/g, "");

  // Check parentheses matching and content
  const parenResult = validateParentheses(cleanFormula);
  if (!parenResult.isValid) {
    return parenResult;
  }

  // Check for valid characters - only allow: i, other, 0, 1, +, -, ×, (, )
  const invalidChars = cleanFormula.replace(/[iother01+\-×()]|other/g, "");
  if (invalidChars) {
    return { isValid: false, error: `Invalid characters: '${invalidChars}'` };
  }

  // Check for meaningful content
  const hasNumber = /[01]/.test(cleanFormula);
  const hasVariable =
    cleanFormula.includes("i") || cleanFormula.includes("other");

  if (!hasNumber && !hasVariable) {
    return {
      isValid: false,
      error: "Formula must contain at least one number or variable (i, other)",
    };
  }

  // Enhanced tokenization to handle multi-digit numbers and validate structure
  const tokens = tokenizeFormula(cleanFormula);
  return validateTokens(tokens);
};

const validateParentheses = (cleanFormula: string): ValidationResult => {
  let parenCount = 0;
  let openPositions: number[] = [];

  // First pass: check balance and collect positions
  for (let i = 0; i < cleanFormula.length; i++) {
    const char = cleanFormula[i];
    if (char === "(") {
      parenCount++;
      openPositions.push(i);
    } else if (char === ")") {
      parenCount--;
      if (parenCount < 0) {
        return { isValid: false, error: "Unmatched closing parenthesis ')'" };
      }

      // Check content between this closing paren and its matching opening paren
      const openPos = openPositions.pop();
      if (openPos !== undefined) {
        const content = cleanFormula.substring(openPos + 1, i);
        const contentResult = validateParenthesesContent(content);
        if (!contentResult.isValid) {
          return contentResult;
        }
      }
    }
  }

  if (parenCount > 0) {
    return { isValid: false, error: "Unmatched opening parenthesis '('" };
  }

  return { isValid: true, error: "" };
};

const validateParenthesesContent = (content: string): ValidationResult => {
  if (!content.trim()) {
    return { isValid: false, error: "Empty parentheses '()' are not allowed" };
  }

  // Remove nested parentheses for this check by replacing them with 'X'
  let simplified = content;
  let depth = 0;
  let result = "";

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === "(") {
      depth++;
      result += "X"; // Replace nested parens with placeholder
    } else if (char === ")") {
      depth--;
      result += "X"; // Replace nested parens with placeholder
    } else if (depth === 0) {
      result += char; // Keep only top-level content
    } else {
      result += "X"; // Replace nested content with placeholder
    }
  }

  simplified = result;

  // Check if parentheses contain valid content (numbers, variables, operators)
  // Must have at least one number or variable
  const hasNumber = /[01]/.test(simplified);
  const hasVariable = /i/.test(simplified) || /other/.test(simplified);
  const hasNestedContent = /X/.test(simplified);

  if (!hasNumber && !hasVariable && !hasNestedContent) {
    return {
      isValid: false,
      error:
        "Parentheses must contain numbers, variables (i, other), or nested expressions",
    };
  }

  // Check for operator-only content
  const onlyOperators = simplified.replace(/[+\-×\s]/g, "");
  if (onlyOperators === "") {
    return {
      isValid: false,
      error: "Parentheses cannot contain only operators",
    };
  }

  // Check for leading/trailing operators inside parentheses
  const trimmed = simplified.trim();
  if (/^[+\-×]/.test(trimmed)) {
    return {
      isValid: false,
      error: "Parentheses cannot start with an operator",
    };
  }
  if (/[+\-×]$/.test(trimmed)) {
    return {
      isValid: false,
      error: "Parentheses cannot end with an operator",
    };
  }

  return { isValid: true, error: "" };
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
    } else if (char === "o" && cleanFormula.substring(i, i + 5) === "other") {
      tokens.push({ type: "variable", value: "other" });
      i += 5;
    } else if (char === "i") {
      tokens.push({ type: "variable", value: "i" });
      i++;
    } else if (/[01]/.test(char)) {
      // Handle numbers (0 or 1 for two hats)
      tokens.push({ type: "number", value: char });
      i++;
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
  if (tokens.length > 12) {
    return {
      isValid: false,
       error: `Token count of [${tokens.length}] exceeds limit of 12`,
    };
  }
  // Rule 1: Must start and end with a number or variable
  if (tokens.length === 0) {
    return { isValid: false, error: "Formula cannot be empty" };
  }

  const firstToken = tokens[0];
  const lastToken = tokens[tokens.length - 1];

  if (firstToken.type !== "number" && firstToken.type !== "variable") {
    return {
      isValid: false,
      error: "Formula must start with a number or variable (i, other)",
    };
  }

  if (lastToken.type !== "number" && lastToken.type !== "variable") {
    return {
      isValid: false,
      error: "Formula must end with a number or variable (i, other)",
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
        error: `Missing operator between '${current.value}' and '${next.value}'`,
      };
    }

    // Number followed by variable is prohibited
    if (current.type === "number" && next.type === "variable") {
      return {
        isValid: false,
        error: `Missing operator between '${current.value}' and '${next.value}'`,
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

const testTwoHatsFormula = (formula: string): number[] => {
  const calculatePersonGuess = (
    allHatColors: number[],
    formula: string,
    personIndex: number
  ): number => {
    let processedFormula = formula.trim();
    processedFormula = processedFormula.replace(
      /\bi\b/g,
      personIndex.toString()
    );

    const otherPersonIndex = personIndex === 0 ? 1 : 0;
    processedFormula = processedFormula.replace(
      /\bother\b/g,
      allHatColors[otherPersonIndex].toString()
    );

    processedFormula = processedFormula.replace(/×/g, "*");

    try {
      const result = new Function(
        `"use strict"; return (${processedFormula})`
      )();
      if (Number.isFinite(result)) {
        const modResult = ((result % 2) + 2) % 2;
        return Math.floor(modResult);
      }
    } catch (error) {
      return -1;
    }
    return -1;
  };

  // Test all 4 combinations
  const allCombinations = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ];

  for (const combination of allCombinations) {
    // Check if at least one person guesses correctly
    let someoneGuessedCorrectly = false;

    for (let personIndex = 0; personIndex < 2; personIndex++) {
      try {
        const guess = calculatePersonGuess(combination, formula, personIndex);
        const actualHatColor = combination[personIndex];

        if (guess === actualHatColor) {
          someoneGuessedCorrectly = true;
          break;
        }
      } catch (error) {
        continue;
      }
    }

    // If no one guessed correctly, this is a counter-example
    if (!someoneGuessedCorrectly) {
      return combination;
    }
  }

  // No counter-example found - formula is correct
  // Return a valid example with special marker
  let ret = allCombinations[Math.floor(Math.random() * 4)];
  return [...ret, -1]; // -1 indicates correct formula
};

interface DeleteContext {
  formula: string;
  cursorPosition: number;
  setFormula: (formula: string) => void;
  setCursorPosition: (position: number) => void;
  setErrorMessage: (message: string) => void;
  errorMessage: string;
}

const handleDelete = (context: DeleteContext) => {
  const {
    formula,
    cursorPosition,
    setFormula,
    setCursorPosition,
    setErrorMessage,
    errorMessage,
  } = context;

  if (cursorPosition <= 0) return;

  const charAtCursor = formula[cursorPosition - 1];

  // Check if cursor is at the end of "other" and delete the entire word
  if (
    cursorPosition >= 5 &&
    formula.substring(cursorPosition - 5, cursorPosition) === "other"
  ) {
    const charBeforeOther =
      cursorPosition > 5 ? formula[cursorPosition - 6] : "";
    if (!/[a-zA-Z]/.test(charBeforeOther)) {
      let newFormula =
        formula.slice(0, cursorPosition - 5) + formula.slice(cursorPosition);
      newFormula = newFormula.trimEnd();
      setFormula(newFormula);
      setCursorPosition(Math.min(cursorPosition - 5, newFormula.length));
      if (errorMessage) setErrorMessage("");
      return;
    }
  }

  // Enhanced delete behavior for space + preceding item
  if (charAtCursor === " ") {
    let deleteStart = cursorPosition - 1; // Start at the space

    // Skip any additional spaces
    while (deleteStart > 0 && formula[deleteStart - 1] === " ") {
      deleteStart--;
    }

    // Now find the start of the non-space item before the space(s)
    if (deleteStart > 0) {
      const charBeforeSpaces = formula[deleteStart - 1];

      // Handle "other" word
      if (
        deleteStart >= 5 &&
        formula.substring(deleteStart - 5, deleteStart) === "other"
      ) {
        const charBeforeOther = deleteStart > 5 ? formula[deleteStart - 6] : "";
        if (!/[a-zA-Z]/.test(charBeforeOther)) {
          deleteStart -= 5; // Delete "other"
        } else {
          deleteStart -= 1; // Just delete one character
        }
      }
      // Handle single character items (numbers, operators, parentheses, 'i')
      else if (/[01+\-×()i]/.test(charBeforeSpaces)) {
        deleteStart -= 1; // Delete one character
      }
      // Default: delete one character
      else {
        deleteStart -= 1;
      }
    }

    // Delete from deleteStart to cursorPosition (inclusive of space(s))
    let newFormula =
      formula.slice(0, deleteStart) + formula.slice(cursorPosition);
    newFormula = newFormula.trimEnd();
    setFormula(newFormula);
    setCursorPosition(Math.min(deleteStart, newFormula.length));
    if (errorMessage) setErrorMessage("");
    return;
  }

  // Handle 'i' variable deletion
  if (charAtCursor === "i") {
    const charBeforeI = cursorPosition > 1 ? formula[cursorPosition - 2] : "";
    const charAfterI =
      cursorPosition < formula.length ? formula[cursorPosition] : "";

    if (!/[a-zA-Z]/.test(charBeforeI) && !/[a-zA-Z]/.test(charAfterI)) {
      let newFormula =
        formula.slice(0, cursorPosition - 1) + formula.slice(cursorPosition);
      newFormula = newFormula.trimEnd();
      setFormula(newFormula);
      setCursorPosition(Math.min(cursorPosition - 1, newFormula.length));
      if (errorMessage) setErrorMessage("");
      return;
    }
  }

  // Handle characters that are part of "other" - improved logic
  if (charAtCursor === "r") {
    // Check if this 'r' is the last character of "other"
    if (
      cursorPosition >= 5 &&
      formula.substring(cursorPosition - 5, cursorPosition) === "othe"
    ) {
      const charBeforeOther =
        cursorPosition > 5 ? formula[cursorPosition - 6] : "";
      if (!/[a-zA-Z]/.test(charBeforeOther)) {
        // This 'r' is part of "other", delete the entire word
        let newFormula =
          formula.slice(0, cursorPosition - 5) + formula.slice(cursorPosition);
        newFormula = newFormula.trimEnd();
        setFormula(newFormula);
        setCursorPosition(Math.min(cursorPosition - 5, newFormula.length));
        if (errorMessage) setErrorMessage("");
        return;
      }
    }
  }

  // Handle 'e' that might be part of "other"
  if (charAtCursor === "e") {
    // Check if this 'e' is part of "other"
    if (
      cursorPosition >= 4 &&
      cursorPosition <= formula.length - 1 &&
      formula.substring(cursorPosition - 4, cursorPosition + 1) === "other"
    ) {
      const charBeforeOther =
        cursorPosition > 4 ? formula[cursorPosition - 5] : "";
      if (!/[a-zA-Z]/.test(charBeforeOther)) {
        // This 'e' is part of "other", delete the entire word
        let newFormula =
          formula.slice(0, cursorPosition - 4) +
          formula.slice(cursorPosition + 1);
        newFormula = newFormula.trimEnd();
        setFormula(newFormula);
        setCursorPosition(Math.min(cursorPosition - 4, newFormula.length));
        if (errorMessage) setErrorMessage("");
        return;
      }
    }
  }

  // Handle 'h' that might be part of "other"
  if (charAtCursor === "h") {
    // Check if this 'h' is part of "other"
    if (
      cursorPosition >= 3 &&
      cursorPosition <= formula.length - 2 &&
      formula.substring(cursorPosition - 3, cursorPosition + 2) === "other"
    ) {
      const charBeforeOther =
        cursorPosition > 3 ? formula[cursorPosition - 4] : "";
      if (!/[a-zA-Z]/.test(charBeforeOther)) {
        // This 'h' is part of "other", delete the entire word
        let newFormula =
          formula.slice(0, cursorPosition - 3) +
          formula.slice(cursorPosition + 2);
        newFormula = newFormula.trimEnd();
        setFormula(newFormula);
        setCursorPosition(Math.min(cursorPosition - 3, newFormula.length));
        if (errorMessage) setErrorMessage("");
        return;
      }
    }
  }

  // Handle 't' that might be part of "other"
  if (charAtCursor === "t") {
    // Check if this 't' is part of "other"
    if (
      cursorPosition >= 2 &&
      cursorPosition <= formula.length - 3 &&
      formula.substring(cursorPosition - 2, cursorPosition + 3) === "other"
    ) {
      const charBeforeOther =
        cursorPosition > 2 ? formula[cursorPosition - 3] : "";
      if (!/[a-zA-Z]/.test(charBeforeOther)) {
        // This 't' is part of "other", delete the entire word
        let newFormula =
          formula.slice(0, cursorPosition - 2) +
          formula.slice(cursorPosition + 3);
        newFormula = newFormula.trimEnd();
        setFormula(newFormula);
        setCursorPosition(Math.min(cursorPosition - 2, newFormula.length));
        if (errorMessage) setErrorMessage("");
        return;
      }
    }
  }

  // Handle 'o' that might be part of "other"
  if (charAtCursor === "o") {
    // Check if this 'o' is the start of "other"
    if (
      cursorPosition <= formula.length - 4 &&
      formula.substring(cursorPosition - 1, cursorPosition + 4) === "other"
    ) {
      const charBeforeOther =
        cursorPosition > 1 ? formula[cursorPosition - 2] : "";
      if (!/[a-zA-Z]/.test(charBeforeOther)) {
        // This 'o' is part of "other", delete the entire word
        let newFormula =
          formula.slice(0, cursorPosition - 1) +
          formula.slice(cursorPosition + 4);
        newFormula = newFormula.trimEnd();
        setFormula(newFormula);
        setCursorPosition(Math.min(cursorPosition - 1, newFormula.length));
        if (errorMessage) setErrorMessage("");
        return;
      }
    }
  }

  // Default delete behavior - single character
  let newFormula =
    formula.slice(0, cursorPosition - 1) + formula.slice(cursorPosition);
  newFormula = newFormula.trimEnd();
  setFormula(newFormula);
  setCursorPosition(Math.min(cursorPosition - 1, newFormula.length));
  if (errorMessage) setErrorMessage("");
};

interface ButtonContext {
  insertAtCursor: (text: string) => void;
  setCursorPosition: (position: number) => void;
  cursorPosition: number;
  handleDelete: () => void;
}

const handleButtonClick = (value: string, context: ButtonContext) => {
  const { insertAtCursor, handleDelete } = context;

  switch (value) {
    case "(":
    case ")":
    case "i":
      insertAtCursor(value);
      break;
    case "other":
      insertAtCursor(" other ");
      break;
    case "del":
      handleDelete();
      break;
    case "+":
      insertAtCursor(" + ");
      break;
    case "-":
      insertAtCursor(" - ");
      break;
    case "×":
      insertAtCursor(" × ");
      break;
    default:
      if (["0", "1"].includes(value)) {
        insertAtCursor(value);
      }
      break;
  }
};

const TwoHatsFormulaBar: React.FC<TwoHatsFormulaBarProps> = ({
  width = 600,
  height = 120,
  onTestResult,
  onPersonHighlight,
  initialFormula = "",
  showAsReadOnly = false,
  onTryAgain,
}) => {
  const [formula, setFormula] = useState(initialFormula);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialFormula !== undefined) {
      setFormula(initialFormula);
      setCursorPosition(initialFormula.length);
    }
  }, [initialFormula]);

  const insertAtCursor = (text: string) => {
    if (showAsReadOnly) return;

    const { newText, newPosition } = insertTextAtPosition(
      formula,
      cursorPosition,
      text
    );
    setFormula(newText);
    setCursorPosition(newPosition);
    if (errorMessage) setErrorMessage("");
  };

  const handleTest = () => {
    const validation = validateTwoHatsFormula(formula);

    if (!validation.isValid) {
      setErrorMessage(validation.error);
      return;
    }

    setErrorMessage("");

    const result = testTwoHatsFormula(formula);

    if (onTestResult) {
      onTestResult(result, formula);
    }
  };

  const deleteContext = {
    formula,
    cursorPosition,
    setFormula,
    setCursorPosition,
    setErrorMessage,
    errorMessage,
  };

  const buttonContext = {
    insertAtCursor,
    setCursorPosition,
    cursorPosition,
    handleDelete: () => handleDelete(deleteContext),
  };

  useKeyboardControls({
    cursorPosition,
    formula,
    setCursorPosition,
    onDelete: () => handleDelete(deleteContext),
    disabled: showAsReadOnly,
  });

  const validation = validateTwoHatsFormula(formula);
  const displayError = validation.error && !errorMessage.startsWith("✅");

  return (
    <div
      style={{
        width,
        height: height + (errorMessage ? 30 : 0),
        border: "2px solid #333",
        padding: "8px", // Increased padding for better spacing
        backgroundColor: "#f5f5f5",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "8px", // Increased gap between elements
        position: "relative",
      }}
    >
      <style>
        {`@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }`}
      </style>

      {/* Error message above formula bar */}
      {displayError && (
        <div
          style={{
            position: "absolute",
            top: "-32px", // Changed from "-35px" to be flush
            left: "-2px", // Align with border of container below
            right: "-2px", // Align with border of container below
            width: "auto", // Let left/right positioning determine width
            backgroundColor: "#ffebee",
            color: "#d32f2f",
            border: "2px solid #d32f2f", // Match border width of container below
            borderRadius: "0px", // Remove border radius to be flush
            padding: "6px 8px",
            fontSize: "12px",
            fontFamily: "monospace",
            fontWeight: "bold",
            textAlign: "center",
            zIndex: 10,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            boxSizing: "border-box", // Include border in width calculation
          }}
        >
          ⚠️ {validation.error}
        </div>
      )}

      {/* Formula input with labels */}
      <div
        style={{
          height: "36px", // Slightly increased height
          display: "flex",
          alignItems: "center",
          gap: "6px", // Added gap between formula elements
          flex: "0 0 auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#f5f5f5",
            color: "black",
            fontFamily: "monospace",
            fontSize: "14px",
            padding: "8px 10px", // Increased padding
            display: "flex",
            alignItems: "center",
            userSelect: "none",
            height: "100%",
            boxSizing: "border-box",
            borderRadius: "3px", // Added border radius
          }}
        >
          {"??? = "}
        </div>

        <div
          style={{
            flex: 1,
            height: "100%",
            border: "1px solid #666",
            backgroundColor: showAsReadOnly ? "#f9f9f9" : "white",
            padding: "8px", // Increased padding
            fontFamily: "monospace",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            cursor: showAsReadOnly ? "default" : "default",
            userSelect: "none",
            boxSizing: "border-box",
            borderRadius: "3px", // Added border radius
          }}
        >
          <TwoHatsFormulaDisplay
            formula={formula}
            cursorPosition={cursorPosition}
            onHighlightChange={onPersonHighlight}
            showCursor={!showAsReadOnly}
          />
        </div>

        <div
          style={{
            backgroundColor: "#f5f5f5",
            color: "black",
            fontFamily: "monospace",
            fontSize: "14px",
            padding: "8px 10px", // Increased padding
            display: "flex",
            alignItems: "center",
            userSelect: "none",
            height: "100%",
            boxSizing: "border-box",
            borderRadius: "3px", // Added border radius
          }}
        >
          mod 2
        </div>

        <button
          onClick={showAsReadOnly && onTryAgain ? onTryAgain : handleTest}
          disabled={!showAsReadOnly && !validation.isValid}
          style={{
            marginLeft: "6px", // Increased margin
            padding: "8px 14px", // Increased padding
            backgroundColor: showAsReadOnly
              ? "#dc3545"
              : validation.isValid
              ? "#4CAF50"
              : "#ccc",
            color: showAsReadOnly || validation.isValid ? "white" : "#999",
            border: "1px solid #666",
            borderRadius: "6px", // Increased border radius
            cursor:
              showAsReadOnly || validation.isValid ? "pointer" : "not-allowed",
            fontFamily: "monospace",
            fontSize: "12px",
            fontWeight: "bold",
            height: "100%",
            boxSizing: "border-box",
            transition: "background-color 0.2s", // Added transition
          }}
        >
          {showAsReadOnly ? "TRY AGAIN" : "TEST"}
        </button>
      </div>

      {/* Button grid */}
      <div style={{ flex: "1 1 auto" }}>
        <TwoHatsButtonGrid
          onButtonClick={(value) => handleButtonClick(value, buttonContext)}
          disabled={showAsReadOnly}
        />
      </div>
    </div>
  );
};

export default TwoHatsFormulaBar;
