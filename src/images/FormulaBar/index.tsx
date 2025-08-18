import React, { useState } from "react";
import { type FormulaBarProps } from "./types";
import { insertTextAtPosition, deleteAtPosition } from "./utils";
import { useKeyboardControls } from "./useKeyboardControls";
import FormulaDisplay from "./FormulaDisplay";
import ButtonGrid from "./ButtonGrid";

const FormulaBar: React.FC<FormulaBarProps> = ({
  width = 600,
  height = 180,
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
      case "p[":
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
        // Numbers 0-9
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

  return (
    <div
      style={{
        width,
        height,
        border: "2px solid #333",
        padding: "10px",
        backgroundColor: "#f5f5f5",
        boxSizing: "border-box",
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

      {/* Formula Display */}
      <div
        style={{
          height: "50px",
          border: "1px solid #666",
          backgroundColor: "white",
          padding: "10px",
          marginBottom: "10px",
          fontFamily: "monospace",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          minHeight: "30px",
          overflow: "hidden",
          cursor: "default",
          userSelect: "none",
        }}
      >
        <FormulaDisplay formula={formula} cursorPosition={cursorPosition} />
      </div>

      <ButtonGrid onButtonClick={handleButtonClick} />
    </div>
  );
};

export default FormulaBar;
