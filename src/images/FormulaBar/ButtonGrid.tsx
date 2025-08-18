import React from "react";

interface ButtonGridProps {
  onButtonClick: (value: string) => void;
}

const ButtonGrid: React.FC<ButtonGridProps> = ({ onButtonClick }) => {
  const buttons = [
    ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    ["(", ")", "r[", "l[", "p[", "]", "mod", "i", "+", "-", "x", "÷", "del"],
  ];

  return (
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
              onClick={() => onButtonClick(buttonValue)}
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
  );
};

export default ButtonGrid;
