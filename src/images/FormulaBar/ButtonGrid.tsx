import React from "react";

interface ButtonGridProps {
  onButtonClick: (value: string) => void;
}

const ButtonGrid: React.FC<ButtonGridProps> = ({ onButtonClick }) => {
  const buttons = [
    [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "del"],
    ["i", "all","r[", "l[", "(", ")", "+", "-", "x", "÷", "mod"],
  ];

  return (
    <div style={{ display: "grid", gap: "2px", width: "100%", height: "100%" }}>
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
              onClick={() => onButtonClick(buttonValue)}
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
  );
};

export default ButtonGrid;
