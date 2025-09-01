import React from "react";

interface FormulaDisplayProps {
  formula: string;
  cursorPosition: number;
  onHighlightChange?: (highlight: PersonHighlight | null) => void;
  showCursor?: boolean;
}

export interface PersonHighlight {
  type: "current" | "all" | "left" | "right" | "other";
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

    // Get the portion of formula up to cursor position
    const beforeCursor = formula.substring(0, position);

    // Check for 'i' - current person (standalone)
    if (/\bi\b/.test(beforeCursor)) {
      const iMatches = [...beforeCursor.matchAll(/\bi\b/g)];
      if (iMatches.length > 0) {
        const lastMatch = iMatches[iMatches.length - 1];
        const matchEnd = lastMatch.index! + lastMatch[0].length;
        // Check if cursor is within reasonable distance of the match
        if (position - matchEnd <= 2) {
          return { type: "current" };
        }
      }
    }

    // Check for 'all' - all other people
    if (/\ball\b/.test(beforeCursor)) {
      const allMatches = [...beforeCursor.matchAll(/\ball\b/g)];
      if (allMatches.length > 0) {
        const lastMatch = allMatches[allMatches.length - 1];
        const matchEnd = lastMatch.index! + lastMatch[0].length;
        // Check if cursor is within reasonable distance of the match
        if (position - matchEnd <= 2) {
          return { type: "all" };
        }
      }
    }

    // Check for l[n] patterns
    const lMatches = [...beforeCursor.matchAll(/l\[(\d+)\]/g)];
    if (lMatches.length > 0) {
      const lastMatch = lMatches[lMatches.length - 1];
      const matchEnd = lastMatch.index! + lastMatch[0].length;
      if (position - matchEnd <= 2) {
        const positionNum = parseInt(lastMatch[1]);
        if (positionNum >= 1 && positionNum <= 9) {
          return { type: "left", position: positionNum };
        }
      }
    }

    // Check for r[n] patterns
    const rMatches = [...beforeCursor.matchAll(/r\[(\d+)\]/g)];
    if (rMatches.length > 0) {
      const lastMatch = rMatches[rMatches.length - 1];
      const matchEnd = lastMatch.index! + lastMatch[0].length;
      if (position - matchEnd <= 2) {
        const positionNum = parseInt(lastMatch[1]);
        if (positionNum >= 1 && positionNum <= 9) {
          return { type: "right", position: positionNum };
        }
      }
    }

    return null;
  };

  // Detect current highlight and notify parent
  React.useEffect(() => {
    const highlight = detectPersonReference(cursorPosition);
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
