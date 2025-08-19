import React, { useState } from "react";
import { type FormulaBarProps } from "./types";
import { insertTextAtPosition } from "./utils";
import { useKeyboardControls } from "./useKeyboardControls";
import { validateFormula } from "./validation";
import { handleDelete } from "./deleteHandlers";
import { handleButtonClick } from "./buttonHandlers";
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

  const deleteContext = {
    formula,
    cursorPosition,
    setFormula,
    setCursorPosition,
    setWaitingForBracketNumber,
    setErrorMessage,
    errorMessage,
  };

  const buttonContext = {
    insertAtCursor,
    setCursorPosition,
    cursorPosition,
    setWaitingForBracketNumber,
    handleDelete: () => handleDelete(deleteContext),
  };

  useKeyboardControls({
    cursorPosition,
    formula,
    setCursorPosition,
    onDelete: () => handleDelete(deleteContext),
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
          onButtonClick={(value) =>
            handleButtonClick(value, buttonContext, waitingForBracketNumber)
          }
          waitingForBracketNumber={waitingForBracketNumber}
        />
      </div>
    </div>
  );
};

export default FormulaBar;
