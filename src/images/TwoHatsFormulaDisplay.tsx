import React from "react";

interface TwoHatsFormulaDisplayProps {
  formula: string;
  cursorPosition: number;
  onHighlightChange?: (highlight: PersonHighlight | null) => void;
  showCursor?: boolean;
}

export interface PersonHighlight {
  type: "current" | "other";
}

const TwoHatsFormulaDisplay: React.FC<TwoHatsFormulaDisplayProps> = ({
  formula,
  cursorPosition,
  onHighlightChange,
  showCursor = true,
}) => {
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
          // Allow for trailing spaces
          return { type: "current" };
        }
      }
    }

    // Check for 'other' - other person
    if (/\bother\b/.test(beforeCursor)) {
      const otherMatches = [...beforeCursor.matchAll(/\bother\b/g)];
      if (otherMatches.length > 0) {
        const lastMatch = otherMatches[otherMatches.length - 1];
        const matchEnd = lastMatch.index! + lastMatch[0].length;
        // Check if cursor is within reasonable distance of the match
        if (position - matchEnd <= 2) {
          // Allow for trailing spaces
          return { type: "other" };
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

    return (
      <span style={{ color: "black" }}>
        {formula.split("").map((char, index) => {
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
              <span>{char}</span>
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

export default TwoHatsFormulaDisplay;
