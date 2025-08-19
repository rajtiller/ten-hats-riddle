import React from "react";
import { HatClass } from "./Person";

interface HatLegendProps {
  counts?: { [color: string]: number };
}

const HatLegend: React.FC<HatLegendProps> = ({ counts = {} }) => {
  const hatColors = [
    { name: "Black", color: "#000000" },
    { name: "White", color: "#ffffff" },
    { name: "Red", color: "#ff0000" },
    { name: "Orange", color: "#ffa500" },
    { name: "Yellow", color: "#ffff00" },
    { name: "Green", color: "#008000" },
    { name: "Blue", color: "#0000ff" },
    { name: "Violet", color: "#8b00ff" },
    { name: "Pink", color: "#ffc0cb" },
    { name: "Brown", color: "#8b4513" },
  ];

  const renderHat = (color: string) => {
    const hat = new HatClass(color, "cap");

    return (
      <svg width="40" height="30" viewBox="-25 -35 50 35">
        {hat.render(0, 0, 0)}
      </svg>
    );
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
          }}
        >
          <div style={{ marginRight: "10px" }}>{renderHat(hatInfo.color)}</div>

          <span style={{ marginRight: "8px", minWidth: "60px" }}>
            {hatInfo.name}
          </span>

          <span
            style={{
              backgroundColor: "white",
              border: "1px solid #666",
              padding: "2px 6px",
              borderRadius: "3px",
              minWidth: "30px",
              textAlign: "center",
            }}
          >
            - {counts[hatInfo.color] || 0}
          </span>
        </div>
      ))}
    </div>
  );
};

export default HatLegend;
