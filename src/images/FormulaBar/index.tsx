import React, { useState } from "react";
import { type FormulaBarProps } from "./types";
import { insertTextAtPosition, deleteAtPosition } from "./utils";
import { useKeyboardControls } from "./useKeyboardControls";
import FormulaDisplay from "./FormulaDisplay";
import ButtonGrid from "./ButtonGrid";

const FormulaBar: React.FC<FormulaBarProps> = ({
  width = 600,
  height = 120,
}) => {
  const [formula, setFormula] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [waitingForBracketNumber, setWaitingForBracketNumber] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const insertAtCursor = (text: string) => {
    const { newText, newPosition } = insertTextAtPosition(
      formula,
      cursorPosition,
      text
    );
    setFormula(newText);
    setCursorPosition(newPosition);
    if (errorMessage) setErrorMessage("");
  };

  const validateFormula = (
    formula: string
  ): { isValid: boolean; error: string } => {
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
          error: `Invalid bracket content '${
            content || "empty"
          }' - must be 1-9`,
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

    // Check for valid characters (removed ÷ from valid chars)
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
    const tokens = [];
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
      } else if (
        (char === "r" || char === "l") &&
        cleanFormula[i + 1] === "["
      ) {
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
        error:
          "Formula must end with a number or variable (i, all, r[?], l[?])",
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
    // BUT numbers can be adjacent to other numbers (multi-digit is OK)
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

  // Test function placeholder
  const testFunction = (formula: string): number[] => {
    // TODO: Implement actual test logic
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  };

  const handleTest = () => {
    const validation = validateFormula(formula);

    if (!validation.isValid) {
      setErrorMessage(validation.error);
      return;
    }

    setErrorMessage("");
    const result = testFunction(formula);

    if (result.length === 0) {
      setErrorMessage("✅ Correct solution!");
    } else {
      setErrorMessage(
        `❌ Counter example: People guess [${result.join(", ")}]`
      );
    }
  };

  const handleDelete = () => {
    const charAtCursor = formula[cursorPosition - 1];
    const charBeforeCursor = formula[cursorPosition - 2];
    const charAfterCursor = formula[cursorPosition];

    // Handle bracket construct deletion
    if (charAtCursor === "]") {
      let bracketStart = cursorPosition - 2;
      while (bracketStart >= 0 && formula[bracketStart] !== "[") {
        bracketStart--;
      }
      if (bracketStart > 0 && ["r", "l"].includes(formula[bracketStart - 1])) {
        const constructStart = bracketStart - 1;
        const newFormula =
          formula.slice(0, constructStart) + formula.slice(cursorPosition);
        setFormula(newFormula);
        setCursorPosition(constructStart);
        setWaitingForBracketNumber(false);
        if (errorMessage) setErrorMessage("");
        return;
      }
    }

    // Handle number inside bracket deletion
    if (
      charAtCursor &&
      /^[1-9]$/.test(charAtCursor) &&
      charAfterCursor === "]"
    ) {
      let bracketStart = cursorPosition - 2;
      while (bracketStart >= 0 && formula[bracketStart] !== "[") {
        bracketStart--;
      }
      if (bracketStart > 0 && ["r", "l"].includes(formula[bracketStart - 1])) {
        const constructStart = bracketStart - 1;
        const newFormula =
          formula.slice(0, constructStart) + formula.slice(cursorPosition + 1);
        setFormula(newFormula);
        setCursorPosition(constructStart);
        setWaitingForBracketNumber(false);
        if (errorMessage) setErrorMessage("");
        return;
      }
    }

    // Handle incomplete bracket deletion
    if (
      charAtCursor === "[" &&
      charBeforeCursor &&
      ["r", "l"].includes(charBeforeCursor)
    ) {
      const newFormula =
        formula.slice(0, cursorPosition - 2) +
        formula.slice(cursorPosition + 1);
      setFormula(newFormula);
      setCursorPosition(cursorPosition - 2);
      setWaitingForBracketNumber(false);
      if (errorMessage) setErrorMessage("");
      return;
    }

    // Handle empty bracket deletion
    if (charAtCursor === "]" && charBeforeCursor === "[") {
      let bracketTypePos = cursorPosition - 3;
      if (bracketTypePos >= 0 && ["r", "l"].includes(formula[bracketTypePos])) {
        const newFormula =
          formula.slice(0, bracketTypePos) + formula.slice(cursorPosition);
        setFormula(newFormula);
        setCursorPosition(bracketTypePos);
        setWaitingForBracketNumber(false);
        if (errorMessage) setErrorMessage("");
        return;
      }
    }

    // Default delete behavior
    const { newText, newPosition } = deleteAtPosition(formula, cursorPosition);
    setFormula(newText);
    setCursorPosition(newPosition);
    setWaitingForBracketNumber(false);
    if (errorMessage) setErrorMessage("");
  };

  const handleButtonClick = (value: string) => {
    if (waitingForBracketNumber) {
      if (/^[1-9]$/.test(value)) {
        insertAtCursor(value);
        setCursorPosition(cursorPosition + 2);
        setWaitingForBracketNumber(false);
      } else if (value === "del") {
        handleDelete();
      }
      return;
    }

    switch (value) {
      case "(":
      case ")":
      case "i":
        insertAtCursor(value);
        break;
      case "r[":
        insertAtCursor("r[]");
        setCursorPosition(cursorPosition + 2);
        setWaitingForBracketNumber(true);
        break;
      case "l[":
        insertAtCursor("l[]");
        setCursorPosition(cursorPosition + 2);
        setWaitingForBracketNumber(true);
        break;
      case "all":
        insertAtCursor("all");
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
      case "x":
        insertAtCursor(" × ");
        break;
      default:
        if (/^[0-9]$/.test(value)) {
          insertAtCursor(value);
        }
        break;
    }
  };

  useKeyboardControls({
    cursorPosition,
    formula,
    setCursorPosition,
    onDelete: handleDelete,
  });

  const validation = validateFormula(formula);
  const displayError =
    validation.error &&
    !errorMessage.startsWith("✅") &&
    !errorMessage.startsWith("❌ Counter");

  return (
    <div
      style={{
        width,
        height: height + (errorMessage ? 30 : 0),
        border: "2px solid #333",
        padding: "5px",
        backgroundColor: "#f5f5f5",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "2px",
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
            top: "-35px",
            left: "0",
            right: "0",
            backgroundColor: "#ffebee",
            color: "#d32f2f",
            border: "1px solid #d32f2f",
            borderRadius: "3px",
            padding: "6px 8px",
            fontSize: "12px",
            fontFamily: "monospace",
            fontWeight: "bold",
            textAlign: "center",
            zIndex: 10,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          ⚠️ {validation.error}
        </div>
      )}

      {/* Formula input with labels */}
      <div
        style={{
          height: "32px",
          display: "flex",
          alignItems: "center",
          gap: "0px",
          flex: "0 0 auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#f5f5f5",
            color: "black",
            fontFamily: "monospace",
            fontSize: "14px",
            padding: "6px 8px",
            display: "flex",
            alignItems: "center",
            userSelect: "none",
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          Person i:
        </div>

        <div
          style={{
            flex: 1,
            height: "100%",
            border: "1px solid #666",
            backgroundColor: "white",
            padding: "6px",
            fontFamily: "monospace",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            cursor: "default",
            userSelect: "none",
            boxSizing: "border-box",
          }}
        >
          <FormulaDisplay formula={formula} cursorPosition={cursorPosition} />
        </div>

        <div
          style={{
            backgroundColor: "#f5f5f5",
            color: "black",
            fontFamily: "monospace",
            fontSize: "14px",
            padding: "6px 8px",
            display: "flex",
            alignItems: "center",
            userSelect: "none",
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          mod 10
        </div>

        <button
          onClick={handleTest}
          disabled={!validation.isValid}
          style={{
            marginLeft: "8px",
            padding: "6px 12px",
            backgroundColor: validation.isValid ? "#4CAF50" : "#ccc",
            color: validation.isValid ? "white" : "#999",
            border: "1px solid #666",
            borderRadius: "3px",
            cursor: validation.isValid ? "pointer" : "not-allowed",
            fontFamily: "monospace",
            fontSize: "12px",
            fontWeight: "bold",
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          TEST
        </button>
      </div>

      {/* Test result message */}
      {(errorMessage.startsWith("✅") ||
        errorMessage.startsWith("❌ Counter")) && (
        <div
          style={{
            backgroundColor: errorMessage.startsWith("✅")
              ? "#d4edda"
              : "#f8d7da",
            color: errorMessage.startsWith("✅") ? "#155724" : "#721c24",
            border: `1px solid ${
              errorMessage.startsWith("✅") ? "#c3e6cb" : "#f5c6cb"
            }`,
            borderRadius: "3px",
            padding: "4px 8px",
            fontSize: "12px",
            fontFamily: "monospace",
            marginBottom: "2px",
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Button grid */}
      <div style={{ flex: "1 1 auto" }}>
        <ButtonGrid
          onButtonClick={handleButtonClick}
          waitingForBracketNumber={waitingForBracketNumber}
        />
      </div>
    </div>
  );
};

export default FormulaBar;
