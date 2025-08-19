import React from "react";

interface ButtonGridProps {
  onButtonClick: (value: string) => void;
  waitingForBracketNumber?: boolean;
  disabled?: boolean; // New prop to disable all buttons
}

const ButtonGrid: React.FC<ButtonGridProps> = ({
  onButtonClick,
  waitingForBracketNumber = false,
  disabled = false, // Default to enabled
}) => {
  const buttons = [
    ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "del"],
    ["i", "r[", "l[", "all", "(", ")", "+", "-", "x"],
  ];

  const isButtonEnabled = (buttonValue: string): boolean => {
    if (disabled) return false; // Disable all buttons when disabled prop is true
    if (!waitingForBracketNumber) return true;

    // When waiting for bracket number, only allow 1-9 and del (not 0)
    return /^[1-9]$/.test(buttonValue) || buttonValue === "del";
  };

  const getButtonStyle = (buttonValue: string) => {
    const isEnabled = isButtonEnabled(buttonValue);

    return {
      padding: "6px 4px",
      border: "1px solid #666",
      backgroundColor: isEnabled ? "#e0e0e0" : "#ccc",
      cursor: isEnabled ? "pointer" : "not-allowed",
      fontSize: "12px",
      fontFamily: "monospace",
      borderRadius: "3px",
      minHeight: "28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: isEnabled ? "black" : "#999",
      opacity: isEnabled ? 1 : 0.5,
    };
  };

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
          {row.map((buttonValue) => {
            const isEnabled = isButtonEnabled(buttonValue);

            return (
              <button
                key={buttonValue}
                onClick={() => isEnabled && onButtonClick(buttonValue)}
                disabled={!isEnabled}
                style={getButtonStyle(buttonValue)}
                onMouseOver={(e) => {
                  if (isEnabled) {
                    e.currentTarget.style.backgroundColor = "#d0d0d0";
                  }
                }}
                onMouseOut={(e) => {
                  if (isEnabled) {
                    e.currentTarget.style.backgroundColor = "#e0e0e0";
                  }
                }}
              >
                {buttonValue}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ButtonGrid;
