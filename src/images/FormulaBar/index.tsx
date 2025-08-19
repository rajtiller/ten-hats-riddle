import React, { useState, useEffect } from "react";
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
    // Clear error when user modifies formula
    if (errorMessage) setErrorMessage("");
  };

  const validateBracketContent = (text: string): boolean => {
    // Check if inserting this would create invalid bracket content
    const testFormula =
      formula.slice(0, cursorPosition) + text + formula.slice(cursorPosition);

    // Find all bracket pairs and validate their content
    const bracketRegex = /[rl]\[([^\]]*)\]/g;
    let match;

    while ((match = bracketRegex.exec(testFormula)) !== null) {
      const content = match[1];
      // Content must be a single digit 1-9
      if (!/^[1-9]$/.test(content)) {
        return false;
      }
    }

    return true;
  };

  const validateFormula = (
    formula: string
  ): { isValid: boolean; error: string } => {
    if (!formula.trim()) {
      return { isValid: false, error: "Formula cannot be empty" };
    }

    // Check for unmatched parentheses
    let parenCount = 0;
    for (const char of formula) {
      if (char === "(") parenCount++;
      if (char === ")") parenCount--;
      if (parenCount < 0) {
        return { isValid: false, error: "Unmatched closing parenthesis" };
      }
    }
    if (parenCount > 0) {
      return { isValid: false, error: "Unmatched opening parenthesis" };
    }

    // Check for valid bracket constructs
    const bracketRegex = /[rl]\[([^\]]*)\]/g;
    let match;
    while ((match = bracketRegex.exec(formula)) !== null) {
      const content = match[1];
      if (!/^[1-9]$/.test(content)) {
        return {
          isValid: false,
          error: `Invalid bracket content: ${content || "empty"}`,
        };
      }
    }

    // Check for incomplete brackets
    if (
      (formula.includes("r[") && !formula.includes("r[")) ||
      (formula.includes("l[") && !formula.includes("l["))
    ) {
      if (/[rl]\[\]/.test(formula)) {
        return { isValid: false, error: "Empty bracket found" };
      }
    }

    // Check for valid operators
    const invalidChars = formula.replace(
      /[irl\[\]\(\)0-9\+\-×÷\s]|mod|all/g,
      ""
    );
    if (invalidChars) {
      return { isValid: false, error: `Invalid characters: ${invalidChars}` };
    }

    return { isValid: true, error: "" };
  };

  // Test function (placeholder for now)
  const testFunction = (formula: string): number[] => {
    // For now, always return this test array
    // Later you'll implement the actual logic
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  };

  const handleTest = () => {
    const validation = validateFormula(formula);

    if (!validation.isValid) {
      setErrorMessage(validation.error);
      return;
    }

    // Clear any previous error
    setErrorMessage("");

    // Call test function
    const result = testFunction(formula);

    if (result.length === 0) {
      // Correct solution
      setErrorMessage("✅ Correct solution!");
    } else {
      // Counter example found
      setErrorMessage(
        `❌ Counter example: People guess [${result.join(", ")}]`
      );
    }
  };

  const handleDelete = () => {
    const { newText, newPosition } = deleteAtPosition(formula, cursorPosition);
    setFormula(newText);
    setCursorPosition(newPosition);
    setWaitingForBracketNumber(false);
    // Clear error when user modifies formula
    if (errorMessage) setErrorMessage("");
  };

  const handleButtonClick = (value: string) => {
    // If waiting for bracket number, only allow 1-9 and del
    if (waitingForBracketNumber) {
      if (/^[1-9]$/.test(value)) {
        // Insert the number
        insertAtCursor(value);
        // Move cursor after the closing bracket (which is already there)
        setCursorPosition(cursorPosition + 2); // +1 for number, +1 to move past ]
        setWaitingForBracketNumber(false);
      } else if (value === "del") {
        handleDelete();
      }
      return; // Ignore all other buttons when waiting
    }

    switch (value) {
      case "(":
      case ")":
      case "i":
        insertAtCursor(value);
        break;
      case "r[":
        // Insert "r[]" and position cursor between brackets
        insertAtCursor("r[]");
        setCursorPosition(cursorPosition + 2); // Position cursor between [ and ]
        setWaitingForBracketNumber(true);
        break;
      case "l[":
        // Insert "l[]" and position cursor between brackets
        insertAtCursor("l[]");
        setCursorPosition(cursorPosition + 2); // Position cursor between [ and ]
        setWaitingForBracketNumber(true);
        break;
      case "all":
        insertAtCursor("all");
        break;
      case "del":
        handleDelete();
        break;
      case "mod":
        insertAtCursor(" mod ");
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
      case "÷":
        insertAtCursor(" ÷ ");
        break;
      default:
        // Numbers 1-9 (validate if inside brackets)
        if (/^[1-9]$/.test(value)) {
          if (validateBracketContent(value)) {
            insertAtCursor(value);
          }
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

  return (
    <div
      style={{
        width,
        height: height + (errorMessage ? 30 : 0), // Extend height if there's an error message
        border: "2px solid #333",
        padding: "5px",
        backgroundColor: "#f5f5f5",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "2px",
      }}
    >
      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>

      {/* Formula Display with Person i: prefix */}
      <div
        style={{
          height: "32px",
          display: "flex",
          alignItems: "center",
          gap: "0px",
          flex: "0 0 auto",
        }}
      >
        {/* Person i: label in gray area - no border */}
        <div
          style={{
            backgroundColor: "#f5f5f5", // Same as surrounding
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

        {/* White input area - complete border */}
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

        {/* Test Button */}
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

      {/* Error/Result Message */}
      {errorMessage && (
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

      {/* Button Container */}
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
