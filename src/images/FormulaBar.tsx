import React, { useState, useEffect } from "react";

interface FormulaBarProps {
  width?: number;
  height?: number;
}

const FormulaBar: React.FC<FormulaBarProps> = ({
  width = 600,
  height = 180,
}) => {
  const [formula, setFormula] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);

  const insertAtCursor = (text: string) => {
    const newFormula =
      formula.slice(0, cursorPosition) + text + formula.slice(cursorPosition);
    setFormula(newFormula);
    setCursorPosition(cursorPosition + text.length);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();

    switch (event.key) {
      case "ArrowLeft":
        setCursorPosition(Math.max(cursorPosition - 1, 0));
        break;
      case "ArrowRight":
        setCursorPosition(Math.min(cursorPosition + 1, formula.length));
        break;
      case "Delete":
      case "Backspace":
        if (cursorPosition > 0) {
          const newFormula =
            formula.slice(0, cursorPosition - 1) +
            formula.slice(cursorPosition);
          setFormula(newFormula);
          setCursorPosition(cursorPosition - 1);
        }
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
      case "(":
        insertAtCursor("(");
        break;
      case ")":
        insertAtCursor(")");
        break;
      case "r[":
        insertAtCursor("r[");
        break;
      case "l[":
        insertAtCursor("l[");
        break;
      case "p[":
        insertAtCursor("p[");
        break;
      case "]":
        insertAtCursor("]");
        break;
      case "del":
        if (cursorPosition > 0) {
          const newFormula =
            formula.slice(0, cursorPosition - 1) +
            formula.slice(cursorPosition);
          setFormula(newFormula);
          setCursorPosition(cursorPosition - 1);
        }
        break;
      case "mod":
        insertAtCursor(" mod ");
        break;
      case "i":
        insertAtCursor("i");
        break;
      case "+":
        insertAtCursor(" + ");
        break;
      case "-":
        insertAtCursor(" - ");
        break;
      case "x":
        insertAtCursor(" × ");
        break;
      case "÷":
        insertAtCursor(" ÷ ");
        break;
      default:
        // Numbers 1-9 (removed 0)
        if (/^[1-9]$/.test(value)) {
          insertAtCursor(value);
        }
        break;
    }
  };

  const findMatchingBracket = (position: number): number | null => {
    const char = formula[position];
    let stack = 0;
    let searchChar = "";
    let matchChar = "";
    let direction = 1;

    if (char === "(") {
      searchChar = "(";
      matchChar = ")";
      direction = 1;
    } else if (char === ")") {
      searchChar = ")";
      matchChar = "(";
      direction = -1;
    } else if (char === "[") {
      searchChar = "[";
      matchChar = "]";
      direction = 1;
    } else if (char === "]") {
      searchChar = "]";
      matchChar = "[";
      direction = -1;
    } else {
      return null;
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

    const matchingBracket = findMatchingBracket(cursorPosition - 1);
    const beforeMatchingBracket = findMatchingBracket(cursorPosition);

    return (
      <span style={{ color: "black" }}>
        {formula.split("").map((char, index) => {
          const isHighlighted =
            (index === cursorPosition - 1 && matchingBracket !== null) ||
            (index === cursorPosition && beforeMatchingBracket !== null) ||
            index === matchingBracket ||
            index === beforeMatchingBracket;

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

  const buttons = [
    ["i", "1", "2", "3", "4", "5", "6", "7", "8", "9", "del"],
    ["(", ")", "r[", "l[", "p[", "]", "+", "-", "x", "÷", "mod"],
  ];

  return (
    <div
      style={{
        width,
        height,
        border: "2px solid #333",
        padding: "10px",
        backgroundColor: "#f5f5f5",
        boxSizing: "border-box",
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
          height: "50px",
          border: "1px solid #666",
          backgroundColor: "white",
          padding: "10px",
          marginBottom: "10px",
          fontFamily: "monospace",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          minHeight: "30px",
          overflow: "hidden",
          cursor: "default",
          userSelect: "none",
        }}
      >
        {renderFormula()}
      </div>

      {/* Button Grid */}
      <div style={{ display: "grid", gap: "3px", width: "100%" }}>
        {buttons.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${row.length}, 1fr)`,
              gap: "3px",
              width: "100%",
            }}
          >
            {row.map((buttonValue) => (
              <button
                key={buttonValue}
                onClick={() => handleButtonClick(buttonValue)}
                style={{
                  padding: "10px 4px",
                  border: "1px solid #666",
                  backgroundColor: "#e0e0e0",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontFamily: "monospace",
                  borderRadius: "3px",
                  minHeight: "40px",
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

export default FormulaBar;
