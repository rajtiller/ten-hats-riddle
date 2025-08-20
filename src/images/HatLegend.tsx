import React from "react";
import { HatClass } from "./Hat";

interface HatLegendProps {
  counts?: { [color: string]: number };
}

const HatLegend: React.FC<HatLegendProps> = () => {
  const hatColors = [
    { name: "Black", color: "#000000", value: 0 },
    { name: "Teal", color: "#008080", value: 1 }, // Changed from Gray to Teal
    { name: "Red", color: "#ff0000", value: 2 },
    { name: "Orange", color: "#ffa500", value: 3 },
    { name: "Green", color: "#008000", value: 4 },
    { name: "Blue", color: "#0000ff", value: 5 },
    { name: "Violet", color: "#8b00ff", value: 6 },
    { name: "Magenta", color: "#ff00ff", value: 7 },
    { name: "Tan", color: "#d2b48c", value: 8 },
    { name: "Brown", color: "#8b4513", value: 9 },
  ];

  const renderHat = (color: string) => {
    const hat = new HatClass(color, "cap");
    return (
      <svg width="40" height="40" viewBox="-25 -40 50 40">
        {" "}
        {/* Increased height and adjusted viewBox */}
        {hat.render(0, 0, 0)}
      </svg>
    );
  };

  const getTextStyle = (color: string) => {
    return {
      color: color,
      fontWeight: "bold" as const,
    };
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "20px",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "#f5f5f5",
        border: "2px solid #333",
        borderRadius: "8px",
        padding: "15px",
        minWidth: "150px",
        zIndex: 10,
      }}
    >
      <h3
        style={{
          margin: "0 0 15px 0",
          fontSize: "16px",
          fontFamily: "monospace",
          textAlign: "center",
          borderBottom: "1px solid #666",
          paddingBottom: "8px",
          color: "#999",
        }}
      >
        Hat Colors
      </h3>

      {hatColors.map((hatInfo, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
            fontSize: "14px",
            fontFamily: "monospace",
            height: "40px", // Fixed height to maintain consistent spacing
          }}
        >
          <div
            style={{
              marginRight: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px", // Fixed width for consistent spacing
              height: "40px", // Fixed height
            }}
          >
            {renderHat(hatInfo.color)}
          </div>

          <span
            style={{
              marginRight: "8px",
              minWidth: "60px",
              display: "flex",
              alignItems: "center",
              ...getTextStyle(hatInfo.color),
            }}
          >
            {hatInfo.name}
          </span>

          <span
            style={{
              backgroundColor: "#d3d3d3",
              border: "1px solid #999",
              padding: "2px 6px",
              borderRadius: "3px",
              minWidth: "30px",
              textAlign: "center",
              color: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "24px", // Fixed height for the number badge
            }}
          >
            {hatInfo.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default HatLegend;
