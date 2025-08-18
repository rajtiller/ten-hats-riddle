import React from "react";

interface FormulaDisplayProps {
  formula: string;
  cursorPosition: number;
}

const FormulaDisplay: React.FC<FormulaDisplayProps> = ({
  formula,
  cursorPosition,
}) => {
  const renderFormula = () => {
    if (formula.length === 0) {
      return (
        <span style={{ color: "#999", fontStyle: "italic" }}>
          Click buttons to build your formula...
        </span>
      );
    }

    const beforeCursor = formula.slice(0, cursorPosition);
    const afterCursor = formula.slice(cursorPosition);

    return (
      <span style={{ color: "black" }}>
        {beforeCursor}
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
        {afterCursor}
      </span>
    );
  };

  return <>{renderFormula()}</>;
};

export default FormulaDisplay;
