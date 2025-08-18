import React from "react";

interface FormulaDisplayProps {
  formula: string;
  cursorPosition: number;
}

const FormulaDisplay: React.FC<FormulaDisplayProps> = ({
  formula,
  cursorPosition,
}) => {
  const findMatchingParenthesis = (position: number): number | null => {
    const char = formula[position];
    if (char !== "(" && char !== ")") return null;

    let stack = 0;
    let direction = 1;
    let searchChar = "";
    let matchChar = "";

    if (char === "(") {
      searchChar = "(";
      matchChar = ")";
      direction = 1;
    } else if (char === ")") {
      searchChar = ")";
      matchChar = "(";
      direction = -1;
    }

    for (
      let i = position + direction;
      i >= 0 && i < formula.length;
      i += direction
    ) {
      if (formula[i] === searchChar) {
        stack++;
      } else if (formula[i] === matchChar) {
        if (stack === 0) {
          return i;
        }
        stack--;
      }
    }
    return null;
  };

  const renderFormula = () => {
    if (formula.length === 0) {
      return (
        <span style={{ color: "#999", fontStyle: "italic" }}>
          Click buttons to build your formula...
        </span>
      );
    }

    // Find parentheses to highlight
    let highlightPositions = new Set<number>();

    // ONLY check character to the left of cursor (cursor is "to the right of" the parenthesis)
    if (cursorPosition > 0) {
      const leftChar = formula[cursorPosition - 1];
      if (leftChar === "(" || leftChar === ")") {
        const matchPos = findMatchingParenthesis(cursorPosition - 1);
        if (matchPos !== null) {
          highlightPositions.add(cursorPosition - 1);
          highlightPositions.add(matchPos);
        }
      }
    }

    return (
      <span style={{ color: "black" }}>
        {formula.split("").map((char, index) => {
          const isHighlighted = highlightPositions.has(index);
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

  return <>{renderFormula()}</>;
};

export default FormulaDisplay;
