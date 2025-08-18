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

  const insertAtCursor = (text: string) => {
    const { newText, newPosition } = insertTextAtPosition(
      formula,
      cursorPosition,
      text
    );
    setFormula(newText);
    setCursorPosition(newPosition);
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

  const handleDelete = () => {
    // Special delete behavior for bracket constructs
    const charAtCursor = formula[cursorPosition - 1];
    const charBeforeCursor = formula[cursorPosition - 2];
    const charAfterCursor = formula[cursorPosition];
    const charTwoAfterCursor = formula[cursorPosition + 1];

    // Case 1: Cursor is after ] in a complete bracket like r[4]
    if (charAtCursor === "]") {
      // Find the start of the bracket construct
      let bracketStart = cursorPosition - 2; // Start looking before the ]
      while (bracketStart >= 0 && formula[bracketStart] !== "[") {
        bracketStart--;
      }

      if (bracketStart > 0 && ["r", "l"].includes(formula[bracketStart - 1])) {
        // Delete the entire construct (e.g., "r[4]")
        const constructStart = bracketStart - 1;
        const newFormula =
          formula.slice(0, constructStart) + formula.slice(cursorPosition);
        setFormula(newFormula);
        setCursorPosition(constructStart);
        setWaitingForBracketNumber(false);
        return;
      }
    }

    // Case 2: Cursor is after a number inside brackets like r[4|]
    if (
      charAtCursor &&
      /^[1-9]$/.test(charAtCursor) &&
      charAfterCursor === "]"
    ) {
      // Check if this is inside a bracket construct
      let bracketStart = cursorPosition - 2;
      while (bracketStart >= 0 && formula[bracketStart] !== "[") {
        bracketStart--;
      }

      if (bracketStart > 0 && ["r", "l"].includes(formula[bracketStart - 1])) {
        // Delete the entire construct
        const constructStart = bracketStart - 1;
        const newFormula =
          formula.slice(0, constructStart) + formula.slice(cursorPosition + 1);
        setFormula(newFormula);
        setCursorPosition(constructStart);
        setWaitingForBracketNumber(false);
        return;
      }
    }

    // Case 3: Cursor is right after r[ or l[ (waiting for number)
    if (
      charAtCursor === "[" &&
      charBeforeCursor &&
      ["r", "l"].includes(charBeforeCursor)
    ) {
      // Delete both characters (r[ or l[)
      const newFormula =
        formula.slice(0, cursorPosition - 2) +
        formula.slice(cursorPosition + 1); // +1 to also remove the ]
      setFormula(newFormula);
      setCursorPosition(cursorPosition - 2);
      setWaitingForBracketNumber(false);
      return;
    }

    // Case 4: Cursor is right after ] in an empty bracket r[]
    if (charAtCursor === "]" && charBeforeCursor === "[") {
      let bracketTypePos = cursorPosition - 3;
      if (bracketTypePos >= 0 && ["r", "l"].includes(formula[bracketTypePos])) {
        // Delete the entire empty construct
        const newFormula =
          formula.slice(0, bracketTypePos) + formula.slice(cursorPosition);
        setFormula(newFormula);
        setCursorPosition(bracketTypePos);
        setWaitingForBracketNumber(false);
        return;
      }
    }

    // Default delete behavior
    const { newText, newPosition } = deleteAtPosition(formula, cursorPosition);
    setFormula(newText);
    setCursorPosition(newPosition);
    setWaitingForBracketNumber(false);
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

  return (
    <div
      style={{
        width,
        height,
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
      </div>

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
