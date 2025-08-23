import React, { useState, useEffect } from "react";
import { type FormulaBarProps } from "./types";
import { insertTextAtPosition } from "./utils";
import { useKeyboardControls } from "./useKeyboardControls";
import { validateFormula } from "./validation";
import { handleDelete, type DeleteContext } from "./deleteHandlers";
import {
  handleButtonClickEnhanced,
  type ButtonContext,
} from "./buttonHandlers";
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

  // Function to count symbols (excluding parentheses and spaces)
  const countSymbols = (text: string): number => {
    // First replace "all" with a single character to count it as 1 symbol
    // Then remove parentheses and spaces, then count remaining characters
    return text.replace(/all/g, "a").replace(/[() ]/g, "").length;
  };

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

    // Determine cursor position based on the last non-space character in the inserted text
    const trimmedText = text.trimEnd();
    const lastChar = trimmedText[trimmedText.length - 1];

    // Position cursor after space for operators and ')', otherwise at end of token
    if (["+", "-", "×", ")"].includes(lastChar)) {
      // Keep cursor after the trailing space for operators and closing parenthesis
      setCursorPosition(newPosition);
    } else {
      // Position cursor at end of token (before any trailing space) for variables, numbers, and opening parenthesis
      const tokenEndPosition = cursorPosition + trimmedText.length;
      setCursorPosition(tokenEndPosition);
    }

    if (errorMessage) setErrorMessage("");
  };

  // Helper function to check if we need a space before the current token
  const needsSpaceBefore = (
    currentPos: number,
    tokenType: "variable" | "operator" | "number" | "parenthesis"
  ): boolean => {
    if (currentPos === 0) return false;

    const charBefore = formula[currentPos - 1];

    // Never add space after opening parenthesis or before closing parenthesis
    if (
      charBefore === "(" ||
      (tokenType === "parenthesis" && formula[currentPos] === ")")
    ) {
      return false;
    }

    // Add space before variables and operators (except after opening parenthesis)
    if (tokenType === "variable" || tokenType === "operator") {
      return charBefore !== " " && charBefore !== "(";
    }

    // Numbers only need space if following a variable or closing parenthesis
    if (tokenType === "number") {
      return /[a-zA-Z\)]/.test(charBefore) && charBefore !== " ";
    }

    return false;
  };

  // Helper function to check if we need a space after the current token
  const needsSpaceAfter = (
    currentPos: number,
    tokenLength: number,
    tokenType: "variable" | "operator" | "number" | "parenthesis"
  ): boolean => {
    const nextPos = currentPos + tokenLength;
    if (nextPos >= formula.length) return false;

    const charAfter = formula[nextPos];

    // Never add space before closing parenthesis or after opening parenthesis
    if (
      charAfter === ")" ||
      (tokenType === "parenthesis" && formula[currentPos] === "(")
    ) {
      return false;
    }

    // Add space after variables and numbers (except before closing parenthesis)
    if (tokenType === "variable" || tokenType === "number") {
      return charAfter !== " " && charAfter !== ")";
    }

    // Operators always get space after (except before closing parenthesis)
    if (tokenType === "operator") {
      return charAfter !== " ";
    }

    return false;
  };

  // Enhanced delete handler matching TwoHatsFormulaBar
  const handleDeleteEnhanced = (context: DeleteContext) => {
    const {
      formula,
      cursorPosition,
      setFormula,
      setCursorPosition,
      setWaitingForBracketNumber,
      setErrorMessage,
      errorMessage,
    } = context;

    if (cursorPosition <= 0) return;

    const charAtCursor = formula[cursorPosition - 1];

    // Handle deletion when waiting for bracket number
    if (waitingForBracketNumber) {
      // Check if we're deleting an empty bracket construct like "r[]" or "l[]"
      if (charAtCursor === "]" && cursorPosition >= 3) {
        const bracketConstruct = formula.substring(
          cursorPosition - 3,
          cursorPosition + 1
        );
        if (bracketConstruct === "r[]" || bracketConstruct === "l[]") {
          // Delete the entire bracket construct
          let newFormula =
            formula.slice(0, cursorPosition - 3) +
            formula.slice(cursorPosition + 1);
          newFormula = newFormula.trimEnd();
          setFormula(newFormula);
          setCursorPosition(Math.min(cursorPosition - 3, newFormula.length));
          setWaitingForBracketNumber(false);
          if (errorMessage) setErrorMessage("");
          return;
        }
      }

      // Handle deletion of bracket opening when cursor is between brackets
      if (charAtCursor === "[" && cursorPosition >= 2) {
        const typeChar = formula[cursorPosition - 2];
        if (
          (typeChar === "r" || typeChar === "l") &&
          formula[cursorPosition] === "]"
        ) {
          // Delete the entire bracket construct
          let newFormula =
            formula.slice(0, cursorPosition - 2) +
            formula.slice(cursorPosition + 1);
          newFormula = newFormula.trimEnd();
          setFormula(newFormula);
          setCursorPosition(Math.min(cursorPosition - 2, newFormula.length));
          setWaitingForBracketNumber(false);
          if (errorMessage) setErrorMessage("");
          return;
        }
      }
    }

    // Check if cursor is at the end of "all" and delete the entire word
    if (
      cursorPosition >= 3 &&
      formula.substring(cursorPosition - 3, cursorPosition) === "all"
    ) {
      const charBeforeAll =
        cursorPosition > 3 ? formula[cursorPosition - 4] : "";
      if (!/[a-zA-Z]/.test(charBeforeAll)) {
        let newFormula =
          formula.slice(0, cursorPosition - 3) + formula.slice(cursorPosition);
        newFormula = newFormula.trimEnd();
        setFormula(newFormula);
        setCursorPosition(Math.min(cursorPosition - 3, newFormula.length));
        setWaitingForBracketNumber(false);
        if (errorMessage) setErrorMessage("");
        return;
      }
    }

    // Check for multi-character tokens like "l[1]", "r[2]", etc.
    const patterns = [
      { regex: /l\[\d*\]?$/, minLength: 2 }, // l[, l[1], l[1], etc.
      { regex: /r\[\d*\]?$/, minLength: 2 }, // r[, r[1], r[1], etc.
    ];

    for (const pattern of patterns) {
      const beforeCursor = formula.substring(0, cursorPosition);
      const match = beforeCursor.match(pattern.regex);
      if (match && match[0].length >= pattern.minLength) {
        let newFormula =
          formula.slice(0, cursorPosition - match[0].length) +
          formula.slice(cursorPosition);
        newFormula = newFormula.trimEnd();
        setFormula(newFormula);
        setCursorPosition(
          Math.min(cursorPosition - match[0].length, newFormula.length)
        );
        setWaitingForBracketNumber(false);
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

        // Handle "all" word - check if we're at the end of "all"
        if (
          deleteStart >= 3 &&
          formula.substring(deleteStart - 3, deleteStart) === "all"
        ) {
          const charBeforeAll = deleteStart > 3 ? formula[deleteStart - 4] : "";
          if (!/[a-zA-Z]/.test(charBeforeAll)) {
            deleteStart -= 3; // Delete "all"
          } else {
            deleteStart -= 1; // Just delete one character
          }
        }
        // Handle bracket expressions like l[1], r[2]
        else if (charBeforeSpaces === "]") {
          // Look backwards to find the opening bracket
          let bracketStart = deleteStart - 2;
          while (bracketStart >= 0 && formula[bracketStart] !== "[") {
            bracketStart--;
          }
          if (bracketStart >= 1 && /[lr]/.test(formula[bracketStart - 1])) {
            deleteStart = bracketStart - 1; // Delete entire l[x] or r[x]
          } else {
            deleteStart -= 1; // Just delete one character
          }
        }
        // Handle single character items (numbers, operators, parentheses, 'i')
        else if (/[0-9+\-×()i]/.test(charBeforeSpaces)) {
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
      setWaitingForBracketNumber(false);
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
        setWaitingForBracketNumber(false);
        if (errorMessage) setErrorMessage("");
        return;
      }
    }

    // Handle characters that are part of "all" - improved logic
    if (charAtCursor === "l") {
      // Check if this 'l' is part of "all"
      if (
        cursorPosition >= 3 &&
        formula.substring(cursorPosition - 3, cursorPosition) === "al"
      ) {
        const charBeforeAl =
          cursorPosition > 3 ? formula[cursorPosition - 4] : "";
        if (!/[a-zA-Z]/.test(charBeforeAl)) {
          // This 'l' is part of "all", delete the entire word
          let newFormula =
            formula.slice(0, cursorPosition - 3) +
            formula.slice(cursorPosition);
          newFormula = newFormula.trimEnd();
          setFormula(newFormula);
          setCursorPosition(Math.min(cursorPosition - 3, newFormula.length));
          setWaitingForBracketNumber(false);
          if (errorMessage) setErrorMessage("");
          return;
        }
      }
    }

    // Handle characters that are part of "all" - 'l' in middle
    if (charAtCursor === "l" && cursorPosition >= 2) {
      // Check if this 'l' is the second 'l' in "all"
      if (formula.substring(cursorPosition - 2, cursorPosition + 1) === "all") {
        const charBeforeAll =
          cursorPosition > 2 ? formula[cursorPosition - 3] : "";
        if (!/[a-zA-Z]/.test(charBeforeAll)) {
          // This 'l' is part of "all", delete the entire word
          let newFormula =
            formula.slice(0, cursorPosition - 2) +
            formula.slice(cursorPosition + 1);
          newFormula = newFormula.trimEnd();
          setFormula(newFormula);
          setCursorPosition(Math.min(cursorPosition - 2, newFormula.length));
          setWaitingForBracketNumber(false);
          if (errorMessage) setErrorMessage("");
          return;
        }
      }
    }

    // Handle 'a' that might be part of "all"
    if (charAtCursor === "a" && cursorPosition < formula.length - 1) {
      // Check if this 'a' is the start of "all"
      if (formula.substring(cursorPosition - 1, cursorPosition + 2) === "all") {
        const charBeforeA =
          cursorPosition > 1 ? formula[cursorPosition - 2] : "";
        if (!/[a-zA-Z]/.test(charBeforeA)) {
          // This 'a' is part of "all", delete the entire word
          let newFormula =
            formula.slice(0, cursorPosition - 1) +
            formula.slice(cursorPosition + 2);
          newFormula = newFormula.trimEnd();
          setFormula(newFormula);
          setCursorPosition(Math.min(cursorPosition - 1, newFormula.length));
          setWaitingForBracketNumber(false);
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
    setWaitingForBracketNumber(false);
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

  // Enhanced button handler for Ten Hats
  const handleButtonClickEnhanced = (
    value: string,
    context: ButtonContext,
    waitingForBracketNumber: boolean
  ) => {
    const {
      insertAtCursor,
      setCursorPosition,
      cursorPosition,
      setWaitingForBracketNumber,
      handleDelete,
    } = context;

    if (waitingForBracketNumber) {
      if (/^[1-9]$/.test(value)) {
        // Insert the number before the closing bracket
        const newFormula =
          formula.slice(0, cursorPosition) +
          value +
          formula.slice(cursorPosition);
        setFormula(newFormula);
        setCursorPosition(cursorPosition + 2); // Move cursor to after the closing bracket
        setWaitingForBracketNumber(false);
      } else if (value === "del") {
        handleDelete();
      }
      return;
    }

    switch (value) {
      case "(":
        const spaceBeforeParen = needsSpaceBefore(cursorPosition, "parenthesis")
          ? " "
          : "";
        insertAtCursor(spaceBeforeParen + "(");
        break;
      case ")":
        insertAtCursor(")");
        break;
      case "i":
        const spaceBeforeI = needsSpaceBefore(cursorPosition, "variable")
          ? " "
          : "";
        const spaceAfterI = needsSpaceAfter(
          cursorPosition,
          spaceBeforeI.length + 1,
          "variable"
        )
          ? " "
          : "";
        insertAtCursor(spaceBeforeI + "i" + spaceAfterI);
        break;
      case "l[":
        const spaceBeforeL = needsSpaceBefore(cursorPosition, "variable")
          ? " "
          : "";
        const spaceAfterL = needsSpaceAfter(
          cursorPosition,
          spaceBeforeL.length + 3,
          "variable"
        )
          ? " "
          : "";
        insertAtCursor(spaceBeforeL + "l[]" + spaceAfterL);
        setCursorPosition(cursorPosition + spaceBeforeL.length + 2); // Position cursor between brackets
        setWaitingForBracketNumber(true);
        break;
      case "r[":
        const spaceBeforeR = needsSpaceBefore(cursorPosition, "variable")
          ? " "
          : "";
        const spaceAfterR = needsSpaceAfter(
          cursorPosition,
          spaceBeforeR.length + 3,
          "variable"
        )
          ? " "
          : "";
        insertAtCursor(spaceBeforeR + "r[]" + spaceAfterR);
        setCursorPosition(cursorPosition + spaceBeforeR.length + 2); // Position cursor between brackets
        setWaitingForBracketNumber(true);
        break;
      case "all":
        const spaceBeforeAll = needsSpaceBefore(cursorPosition, "variable")
          ? " "
          : "";
        const spaceAfterAll = needsSpaceAfter(
          cursorPosition,
          spaceBeforeAll.length + 3,
          "variable"
        )
          ? " "
          : "";
        insertAtCursor(spaceBeforeAll + "all" + spaceAfterAll);
        break;
      case "del":
        handleDelete();
        break;
      case "+":
      case "-":
      case "×":
      case "x":
        const spaceBefore = needsSpaceBefore(cursorPosition, "operator")
          ? " "
          : "";
        const operatorChar = value === "x" ? "×" : value;
        // Always add space after operators, regardless of what follows
        insertAtCursor(spaceBefore + operatorChar + " ");
        break;
      default:
        if (/^[0-9]$/.test(value)) {
          const spaceBeforeNum = needsSpaceBefore(cursorPosition, "number")
            ? " "
            : "";
          const spaceAfterNum = needsSpaceAfter(
            cursorPosition,
            spaceBeforeNum.length + 1,
            "number"
          )
            ? " "
            : "";
          insertAtCursor(spaceBeforeNum + value + spaceAfterNum);
        }
        break;
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
    handleDelete: () => handleDeleteEnhanced(deleteContext),
  };

  useKeyboardControls({
    cursorPosition,
    formula,
    setCursorPosition,
    onDelete: () => handleDeleteEnhanced(deleteContext),
    disabled: showAsReadOnly,
  });

  const validation = validateFormula(formula);
  const displayError = validation.error && !errorMessage.startsWith("✅");

  return (
    <div
      style={{
        width,
        height: height + (errorMessage ? 30 : 0),
        border: "2px solid #333",
        padding: "8px",
        backgroundColor: "#f5f5f5",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
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
            top: "-32px",
            left: "-2px",
            right: "-2px",
            width: "auto",
            backgroundColor: "#ffebee",
            color: "#d32f2f",
            border: "2px solid #d32f2f",
            borderRadius: "0px",
            padding: "6px 8px",
            fontSize: "12px",
            fontFamily: "monospace",
            fontWeight: "bold",
            textAlign: "center",
            zIndex: 10,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            boxSizing: "border-box",
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
          {"??? = "}
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
            handleButtonClickEnhanced(
              value,
              buttonContext,
              waitingForBracketNumber
            )
          }
          waitingForBracketNumber={waitingForBracketNumber}
          disabled={showAsReadOnly}
        />
      </div>
    </div>
  );
};

export default FormulaBar;
