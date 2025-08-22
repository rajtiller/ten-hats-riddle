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

    const char = formula[position - 1];

    // Check for 'i' - current person
    if (char === "i") {
      const prevChar = position > 1 ? formula[position - 2] : "";
      if (!/[a-zA-Z]/.test(prevChar)) {
        return { type: "current" };
      }
    }

    // Check for 'other' - other person
    if (
      position >= 5 &&
      formula.substring(position - 5, position) === "other"
    ) {
      const prevChar = position > 5 ? formula[position - 6] : "";
      if (!/[a-zA-Z]/.test(prevChar)) {
        return { type: "other" };
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
