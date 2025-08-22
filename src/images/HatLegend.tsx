import React from "react";
import { HatClass } from "./Hat";

interface HatLegendProps {
  counts?: { [color: string]: number };
}

const HatLegend: React.FC<HatLegendProps> = () => {
  const hatColors = [
    { name: "Black", color: "#000000", value: 0 },
    { name: "White", color: "#ffffff", value: 1 }, // Changed from Teal to White
    { name: "Red", color: "#ff0000", value: 2 },
    { name: "Orange", color: "#ffa500", value: 3 },
    { name: "Green", color: "#008000", value: 4 },
    { name: "Blue", color: "#0000ff", value: 5 },
    { name: "Violet", color: "#8b00ff", value: 6 },
    { name: "Magenta", color: "#ff00ff", value: 7 },
    { name: "Tan", color: "#d2b48c", value: 8 },
    { name: "Brown", color: "#8b4513", value: 9 },
  ];

  const sizeScale = 1.13; // Same scale as used for people in the group (reduced from 1.15)

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

      {hatColors.map((hatInfo, index) => {
        const hat = new HatClass(hatInfo.color, "cap");

        // Calculate scaled dimensions
        const scaledSize = Math.ceil(50 * sizeScale); // Scale the container size
        const viewBoxWidth = Math.ceil(70 * sizeScale); // Scale viewBox width
        const viewBoxHeight = Math.ceil(50 * sizeScale); // Scale viewBox height
        const viewBoxX = Math.ceil(-35 * sizeScale); // Scale viewBox x offset
        const viewBoxY = Math.ceil(-45 * sizeScale); // Scale viewBox y offset

        return (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
              fontSize: "14px",
              fontFamily: "monospace",
              height: `${scaledSize}px`, // Scale container height
            }}
          >
            <div
              style={{
                marginRight: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: `${scaledSize}px`, // Scale container width
                height: `${scaledSize}px`, // Scale container height
              }}
            >
              <svg
                width={scaledSize}
                height={scaledSize}
                viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`} // Apply scaled viewBox
                style={
                  {
                    // No border or background styles
                  }
                }
              >
                {hat.render(0, 0, 0, false, false, sizeScale)}{" "}
                {/* Pass the same sizeScale used for people */}
              </svg>
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
        );
      })}
    </div>
  );
};

export default HatLegend;
