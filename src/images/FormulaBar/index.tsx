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
    const { newText, newPosition } = deleteAtPosition(formula, cursorPosition);
    setFormula(newText);
    setCursorPosition(newPosition);
  };

  const handleButtonClick = (value: string) => {
    switch (value) {
      case "(":
      case ")":
      case "]":
      case "r[":
      case "l[":
      case "p[": // Keep p[ functionality even though button is removed
      case "i":
        insertAtCursor(value);
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
        <ButtonGrid onButtonClick={handleButtonClick} />
      </div>
    </div>
  );
};

export default FormulaBar;
