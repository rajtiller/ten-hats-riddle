import React, { useState, useEffect } from "react";

interface SimpleFormulaBarProps {
  width?: number;
  height?: number;
}

const SimpleFormulaBar: React.FC<SimpleFormulaBarProps> = ({
  width = 600, // Same as complex FormulaBar
  height = 120, // Same as complex FormulaBar
}) => {
  const [formula, setFormula] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);

  const insertAtCursor = (text: string) => {
    const newFormula =
      formula.slice(0, cursorPosition) + text + formula.slice(cursorPosition);
    setFormula(newFormula);
    setCursorPosition(cursorPosition + text.length);
  };

  const handleDelete = () => {
    if (cursorPosition > 0) {
      const newFormula =
        formula.slice(0, cursorPosition - 1) + formula.slice(cursorPosition);
      setFormula(newFormula);
      setCursorPosition(cursorPosition - 1);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        setCursorPosition(Math.max(cursorPosition - 1, 0));
        break;
      case "ArrowRight":
        event.preventDefault();
        setCursorPosition(Math.min(cursorPosition + 1, formula.length));
        break;
      case "Delete":
      case "Backspace":
        event.preventDefault();
        handleDelete();
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cursorPosition, formula]);

  const handleButtonClick = (value: string) => {
    switch (value) {
      case "del":
        handleDelete();
        break;
      case "(":
        insertAtCursor("(");
        break;
      case ")":
        insertAtCursor(")");
        break;
      case "me":
        insertAtCursor("me");
        break;
      case "other":
        insertAtCursor("other");
        break;
      case "mod":
        insertAtCursor(" mod ");
        break;
      case "+":
        insertAtCursor(" + ");
        break;
      case "-":
        insertAtCursor(" - ");
        break;
      case "÷":
        insertAtCursor(" ÷ ");
        break;
      case "x":
        insertAtCursor(" × ");
        break;
      default:
        // Numbers 0, 1
        if (["0", "1"].includes(value)) {
          insertAtCursor(value);
        }
        break;
    }
  };

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

  // Buttons for two hats riddle
  const buttons = [
    ["0", "1", "(", ")", "me", "other"],
    ["mod", "+", "-", "÷", "x", "del"],
  ];

  return (
    <div
      style={{
        width,
        height,
        border: "2px solid #333",
        padding: "5px",
        backgroundColor: "#f5f5f5",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "2px",
      }}
    >
      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>

      {/* Formula Display */}
      <div
        style={{
          height: "32px",
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
          flex: "0 0 auto",
        }}
      >
        {renderFormula()}
      </div>

      {/* Button Grid */}
      <div
        style={{ display: "grid", gap: "2px", width: "100%", flex: "1 1 auto" }}
      >
        {buttons.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${row.length}, 1fr)`,
              gap: "2px",
              width: "100%",
            }}
          >
            {row.map((buttonValue) => (
              <button
                key={buttonValue}
                onClick={() => handleButtonClick(buttonValue)}
                style={{
                  padding: "6px 4px",
                  border: "1px solid #666",
                  backgroundColor: "#e0e0e0",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontFamily: "monospace",
                  borderRadius: "3px",
                  minHeight: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#d0d0d0")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e0e0e0")
                }
              >
                {buttonValue}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleFormulaBar;
