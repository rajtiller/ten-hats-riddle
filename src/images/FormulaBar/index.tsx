import React, { useState, useEffect } from "react";
import { type FormulaBarProps } from "./types";
import { insertTextAtPosition } from "./utils";
import { useKeyboardControls } from "./useKeyboardControls";
import { validateFormula } from "./validation";
import { handleDelete } from "./deleteHandlers";
import { handleButtonClick } from "./buttonHandlers";
import { testFormula } from "./testFunction";
import FormulaDisplay, { type PersonHighlight } from "./FormulaDisplay";
import ButtonGrid from "./ButtonGrid";

const FormulaBar: React.FC<
  FormulaBarProps & {
    onTestResult?: (result: number[], formula: string) => void;
    onPersonHighlight?: (highlight: PersonHighlight | null) => void;
    initialFormula?: string;
    showAsReadOnly?: boolean;
    onTryAgain?: () => void;
  }
> = ({
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
  const [waitingForBracketNumber, setWaitingForBracketNumber] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Update formula when initialFormula changes
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
    const validation = validateFormula(formula);

    if (!validation.isValid) {
      setErrorMessage(validation.error);
      return;
    }

    setErrorMessage("");

    // Use the centralized test function
    const result = testFormula(formula);

    // Call the callback to update parent state
    if (onTestResult) {
      onTestResult(result, formula);
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
    disabled: showAsReadOnly, // Disable keyboard controls when read-only
  });

  const validation = validateFormula(formula);
  const displayError = validation.error && !errorMessage.startsWith("✅");

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
            backgroundColor: showAsReadOnly ? "#f9f9f9" : "white",
            padding: "6px",
            fontFamily: "monospace",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            cursor: showAsReadOnly ? "default" : "default",
            userSelect: "none",
            boxSizing: "border-box",
          }}
        >
          <FormulaDisplay
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
          onClick={showAsReadOnly && onTryAgain ? onTryAgain : handleTest}
          disabled={!showAsReadOnly && !validation.isValid}
          style={{
            marginLeft: "8px",
            padding: "6px 12px",
            backgroundColor: showAsReadOnly
              ? "#dc3545"
              : validation.isValid
              ? "#4CAF50"
              : "#ccc",
            color: showAsReadOnly || validation.isValid ? "white" : "#999",
            border: "1px solid #666",
            borderRadius: "3px",
            cursor:
              showAsReadOnly || validation.isValid ? "pointer" : "not-allowed",
            fontFamily: "monospace",
            fontSize: "12px",
            fontWeight: "bold",
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          {showAsReadOnly ? "TRY AGAIN" : "TEST"}
        </button>
      </div>

      {/* Button grid - always show but disable when read-only */}
      <div style={{ flex: "1 1 auto" }}>
        <ButtonGrid
          onButtonClick={(value) =>
            handleButtonClick(value, buttonContext, waitingForBracketNumber)
          }
          waitingForBracketNumber={waitingForBracketNumber}
          disabled={showAsReadOnly} // Disable all buttons when in read-only mode
        />
      </div>
    </div>
  );
};

export default FormulaBar;
