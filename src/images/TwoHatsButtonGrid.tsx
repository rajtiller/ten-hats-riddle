import React from "react";

interface TwoHatsButtonGridProps {
  onButtonClick: (value: string) => void;
  disabled?: boolean;
}

const TwoHatsButtonGrid: React.FC<TwoHatsButtonGridProps> = ({
  onButtonClick,
  disabled = false,
}) => {
  const buttons = [
    ["0", "1", "(", ")", "del"],
    ["i", "other", "+", "-", "×"], // Removed ÷ as requested
  ];

  const getButtonStyle = (_: string) => {
    const isEnabled = !disabled;

    return {
      padding: "8px 6px",
      border: "none",
      backgroundColor: isEnabled ? "#f8fafc" : "#e2e8f0",
      cursor: isEnabled ? "pointer" : "not-allowed",
      fontSize: "13px",
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: "600",
      borderRadius: "6px",
      minHeight: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: isEnabled ? "#2d3748" : "#a0aec0",
      opacity: isEnabled ? 1 : 0.6,
      boxShadow: isEnabled ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
      transition: "all 0.15s ease",
    };
  };

  return (
    <div style={{ display: "grid", gap: "6px", width: "100%", height: "100%" }}>
      {buttons.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${row.length}, 1fr)`,
            gap: "6px",
            width: "100%",
          }}
        >
          {row.map((buttonValue) => {
            const isEnabled = !disabled;

            return (
              <button
                key={buttonValue}
                onClick={() => isEnabled && onButtonClick(buttonValue)}
                disabled={!isEnabled}
                style={getButtonStyle(buttonValue)}
                onMouseOver={(e) => {
                  if (isEnabled) {
                    e.currentTarget.style.backgroundColor = "#e2e8f0";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
                  }
                }}
                onMouseOut={(e) => {
                  if (isEnabled) {
                    e.currentTarget.style.backgroundColor = "#f8fafc";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
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

export default TwoHatsButtonGrid;
