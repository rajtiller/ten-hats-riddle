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

  render(
    x: number,
    y: number,
    angle: number = 0,
    isCurrentPerson: boolean = false
  ): JSX.Element {
    if (this.type === "none") return <></>;

    const transform = `translate(${x}, ${y}) rotate(${angle})`;
    const hatNumber = hatColorToNumber[this.color] ?? "";

    // Show "???" for current person, number for others
    const displayText = isCurrentPerson ? "???" : hatNumber;

    const renderHatText = (yPos: number) => (
      <>
        <text
          x="0"
          y={yPos}
          textAnchor="middle"
          fontSize="18"
          fontFamily="monospace"
          fontWeight="900"
          fill="white"
          stroke="white"
          strokeWidth="2"
        >
          {displayText}
        </text>
        <text
          x="0"
          y={yPos}
          textAnchor="middle"
          fontSize="18"
          fontFamily="monospace"
          fontWeight="900"
          fill="black"
          stroke="black"
          strokeWidth="0.5"
        >
          {displayText}
        </text>
      </>
    );

    switch (this.type) {
      case "cap":
        return (
          <g transform={transform}>
            <ellipse
              cx="0"
              cy="-20"
              rx="22"
              ry="15"
              fill={this.color}
              stroke="#000"
              strokeWidth="1"
            />
            <ellipse
              cx="0"
              cy="-15"
              rx="28"
              ry="6"
              fill={this.color}
              stroke="#000"
              strokeWidth="1"
            />
            {renderHatText(-14)}
          </g>
        );
      case "beanie":
        return (
          <g transform={transform}>
            <ellipse
              cx="0"
              cy="-20"
              rx="22"
              ry="15"
              fill={this.color}
              stroke="#000"
              strokeWidth="1"
            />
            <rect
              x="-22"
              y="-8"
              width="44"
              height="6"
              fill={this.color}
              stroke="#000"
              strokeWidth="1"
            />
            {renderHatText(-14)}
          </g>
        );
      case "fedora":
        return (
          <g transform={transform}>
            <ellipse
              cx="0"
              cy="-15"
              rx="32"
              ry="8"
              fill={this.color}
              stroke="#000"
              strokeWidth="1"
            />
            <ellipse
              cx="0"
              cy="-25"
              rx="20"
              ry="12"
              fill={this.color}
              stroke="#000"
              strokeWidth="1"
            />
            <rect x="-20" y="-20" width="40" height="3" fill="#333" />
            {renderHatText(-19)}
          </g>
        );
      case "cowboy":
        return (
          <g transform={transform}>
            <ellipse
              cx="0"
              cy="-12"
              rx="38"
              ry="10"
              fill={this.color}
              stroke="#000"
              strokeWidth="1"
            />
            <ellipse
              cx="0"
              cy="-28"
              rx="18"
              ry="15"
              fill={this.color}
              stroke="#000"
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="-35"
              x2="0"
              y2="-20"
              stroke="#000"
              strokeWidth="1"
            />
            {renderHatText(-22)}
          </g>
        );
      default:
        return <></>;
    }
  }
}
