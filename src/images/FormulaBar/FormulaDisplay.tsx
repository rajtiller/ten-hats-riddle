import React from "react";

interface FormulaDisplayProps {
  formula: string;
  cursorPosition: number;
  onHighlightChange?: (highlight: PersonHighlight | null) => void;
  showCursor?: boolean;
}

export interface PersonHighlight {
  type: "current" | "all" | "left" | "right";
  position?: number; // For l[n] or r[n]
}

const FormulaDisplay: React.FC<FormulaDisplayProps> = ({
  formula,
  cursorPosition,
  onHighlightChange,
  showCursor = true,
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

  const detectPersonReference = (position: number): PersonHighlight | null => {
    if (position === 0) return null;

    // Check what's immediately to the left of cursor
    const char = formula[position - 1];

    // console.log(`Cursor at ${position}, char to left: "${char}"`);

    // Check for 'i' - current person
    if (char === "i") {
      // Make sure it's not part of a longer word
      const prevChar = position > 1 ? formula[position - 2] : "";
      if (!/[a-zA-Z]/.test(prevChar)) {
        // console.log("Detected current person (i)");
        return { type: "current" };
      }
    }

    // Check for 'all' - all other people
    if (position >= 3 && formula.substring(position - 3, position) === "all") {
      const prevChar = position > 3 ? formula[position - 4] : "";
      if (!/[a-zA-Z]/.test(prevChar)) {
        // console.log("Detected all people (all)");
        return { type: "all" };
      }
    }

    // Check for closing bracket - could be l[n] or r[n]
    if (char === "]") {
      // console.log("Found closing bracket, checking for l[n] or r[n]");
      // Look backwards to find the opening bracket and type
      let bracketStart = position - 2;
      let numberStr = "";

      // Collect the number inside brackets
      while (bracketStart >= 0 && formula[bracketStart] !== "[") {
        if (/[0-9]/.test(formula[bracketStart])) {
          numberStr = formula[bracketStart] + numberStr;
        }
        bracketStart--;
      }

      // Check if we found a valid bracket with l or r before it
      if (bracketStart > 0 && formula[bracketStart] === "[") {
        const typeChar = formula[bracketStart - 1];
        // console.log(`Found bracket pattern: ${typeChar}[${numberStr}]`);
        if (typeChar === "l" || typeChar === "r") {
          const position = parseInt(numberStr);
          if (!isNaN(position) && position >= 1 && position <= 9) {
            // console.log(`Detected ${typeChar}[${position}]`);
            return {
              type: typeChar === "l" ? "left" : "right",
              position,
            };
          }
        }
      }
    }

    return null;
  };

  // Detect current highlight and notify parent
  React.useEffect(() => {
    const highlight = detectPersonReference(cursorPosition);
    // console.log("Highlight detected:", highlight);
    if (onHighlightChange) {
      onHighlightChange(highlight);
    }
  }, [cursorPosition, formula, onHighlightChange]);

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
              {atCursor && showCursor && (
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
        {cursorPosition === formula.length && showCursor && (
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
