import React from "react";
import { findMatchingBracket } from "./utils";

interface FormulaDisplayProps {
  formula: string;
  cursorPosition: number;
}

const FormulaDisplay: React.FC<FormulaDisplayProps> = ({
  formula,
  cursorPosition,
}) => {
  if (formula.length === 0) {
    return (
      <span style={{ color: "#999", fontStyle: "italic" }}>
        Click buttons to build your formula...
      </span>
    );
  }

  // Only check for bracket highlighting when cursor is immediately to the right of a bracket
  const leftChar = cursorPosition > 0 ? formula[cursorPosition - 1] : "";
  const matchingBracket = ["(", ")", "[", "]"].includes(leftChar)
    ? findMatchingBracket(formula, cursorPosition - 1)
    : null;

  return (
    <span style={{ color: "black" }}>
      {formula.split("").map((char, index) => {
        const isHighlighted =
          (index === cursorPosition - 1 && matchingBracket !== null) ||
          index === matchingBracket;

        const atCursor = index === cursorPosition;

        return (
          <React.Fragment key={index}>
            {atCursor && (
              <span
                style={{
                  borderLeft: "2px solid #333",
                  animation: "blink 1s infinite",
                  height: "1.2em",
                  display: "inline-block",
                }}
              >
                ‌
              </span>
            )}
            <span
              style={{
                backgroundColor: isHighlighted ? "#90EE90" : "transparent",
                padding: isHighlighted ? "2px" : "0",
                borderRadius: isHighlighted ? "2px" : "0",
              }}
            >
              {char}
            </span>
          </React.Fragment>
        );
      })}
      {cursorPosition === formula.length && (
        <span
          style={{
            borderLeft: "2px solid #333",
            animation: "blink 1s infinite",
            height: "1.2em",
            display: "inline-block",
          }}
        >
          ‌
        </span>
      )}
    </span>
  );
};

export default FormulaDisplay;
