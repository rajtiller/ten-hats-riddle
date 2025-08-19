import { type JSX } from "react";

export const hatColorToNumber: { [color: string]: number } = {
  "#000000": 0,
  "#008080": 1, // Changed from #808080 (gray) to #008080 (teal)
  "#ff0000": 2,
  "#ffa500": 3,
  "#008000": 4,
  "#0000ff": 5,
  "#8b00ff": 6,
  "#ff00ff": 7,
  "#d2b48c": 8,
  "#8b4513": 9,
};

export interface Hat {
  color: string;
  type: "cap" | "beanie" | "fedora" | "cowboy" | "none";
}

export class HatClass implements Hat {
  color: string;
  type: "cap" | "beanie" | "fedora" | "cowboy" | "none";

  constructor(
    color: string = "#ff0000",
    type: "cap" | "beanie" | "fedora" | "cowboy" | "none" = "cap"
  ) {
    this.color = color;
    this.type = type;
  }

  private createRainbowGradient(id: string): JSX.Element {
    const allColors = [
      "#000000", // Black
      "#008080", // Teal
      "#ff0000", // Red
      "#ffa500", // Orange
      "#008000", // Green
      "#0000ff", // Blue
      "#8b00ff", // Violet
      "#ff00ff", // Magenta
      "#d2b48c", // Tan
      "#8b4513", // Brown
    ];

    return (
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          {allColors.map((color, index) => (
            <stop
              key={index}
              offset={`${(index / (allColors.length - 1)) * 100}%`}
              stopColor={color}
            />
          ))}
        </linearGradient>
      </defs>
    );
  }

  render(
    x: number,
    y: number,
    angle: number = 0,
    isCurrentPerson: boolean = false
  ): JSX.Element {
    if (this.type === "none") return <></>;

    const transform = `translate(${x}, ${y}) rotate(${angle})`;
    const hatNumber = hatColorToNumber[this.color] ?? "";
    const isRainbow = this.color === "rainbow";
    const gradientId = `rainbow-gradient-${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    // Show "???" for current person, number for others, nothing for rainbow
    let displayText = "?";
    if (isCurrentPerson && this.color === "#d3d3d3") {
      displayText = "???";
    } else if (!isRainbow) {
      displayText = hatNumber.toString();
    }

    const renderHatText = (yPos: number) =>
      displayText ? (
        <>
          <text
            x="0"
            y={yPos}
            textAnchor="middle"
            fontSize="14" // Reduced from 18 to 14
            fontFamily="monospace"
            fontWeight="900"
            fill="white"
            stroke="white"
            strokeWidth="1.5" // Reduced from 2 to 1.5
          >
            {displayText}
          </text>
          <text
            x="0"
            y={yPos}
            textAnchor="middle"
            fontSize="14" // Reduced from 18 to 14
            fontFamily="monospace"
            fontWeight="900"
            fill="black"
            stroke="black"
            strokeWidth="0.3" // Reduced from 0.5 to 0.3
          >
            {displayText}
          </text>
        </>
      ) : null;

    const fillColor = isRainbow ? `url(#${gradientId})` : this.color;

    switch (this.type) {
      case "cap":
        return (
          <g transform={transform}>
            {isRainbow && this.createRainbowGradient(gradientId)}
            <ellipse
              cx="0"
              cy="-16" // Reduced from -20 to -16
              rx="18" // Reduced from 22 to 18
              ry="12" // Reduced from 15 to 12
              fill={fillColor}
              stroke="#000"
              strokeWidth="1"
            />
            <ellipse
              cx="0"
              cy="-12" // Reduced from -15 to -12
              rx="22" // Reduced from 28 to 22
              ry="5" // Reduced from 6 to 5
              fill={fillColor}
              stroke="#000"
              strokeWidth="1"
            />
            {renderHatText(-11)} {/* Adjusted position */}
          </g>
        );
      case "beanie":
        return (
          <g transform={transform}>
            {isRainbow && this.createRainbowGradient(gradientId)}
            <ellipse
              cx="0"
              cy="-16"
              rx="18"
              ry="12"
              fill={fillColor}
              stroke="#000"
              strokeWidth="1"
            />
            <rect
              x="-18"
              y="-6"
              width="36"
              height="5"
              fill={fillColor}
              stroke="#000"
              strokeWidth="1"
            />
            {renderHatText(-11)}
          </g>
        );
      case "fedora":
        return (
          <g transform={transform}>
            {isRainbow && this.createRainbowGradient(gradientId)}
            <ellipse
              cx="0"
              cy="-12"
              rx="26"
              ry="6"
              fill={fillColor}
              stroke="#000"
              strokeWidth="1"
            />
            <ellipse
              cx="0"
              cy="-20"
              rx="16"
              ry="10"
              fill={fillColor}
              stroke="#000"
              strokeWidth="1"
            />
            <rect x="-16" y="-16" width="32" height="2" fill="#333" />
            {renderHatText(-15)}
          </g>
        );
      case "cowboy":
        return (
          <g transform={transform}>
            {isRainbow && this.createRainbowGradient(gradientId)}
            <ellipse
              cx="0"
              cy="-10"
              rx="30"
              ry="8"
              fill={fillColor}
              stroke="#000"
              strokeWidth="1"
            />
            <ellipse
              cx="0"
              cy="-22"
              rx="14"
              ry="12"
              fill={fillColor}
              stroke="#000"
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="-28"
              x2="0"
              y2="-16"
              stroke="#000"
              strokeWidth="1"
            />
            {renderHatText(-18)}
          </g>
        );
      default:
        return <></>;
    }
  }
}
