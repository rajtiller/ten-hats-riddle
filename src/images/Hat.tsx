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
    isCurrentPerson: boolean = false,
    isOnPerson: boolean = true,
    sizeScale: number = 1.0,
    leftPosition?: number,
    rightPosition?: number,
    isLeftSide?: boolean
  ): JSX.Element {
    if (this.type === "none") return <></>;

    const transform = `translate(${x}, ${y}) rotate(${angle}) scale(${sizeScale})`;
    const hatNumber = hatColorToNumber[this.color];
    const isRainbow = this.color === "rainbow";
    const gradientId = `rainbow-gradient-${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    // Determine what text to display
    let displayText = "";

    if (isCurrentPerson) {
      // Current person always shows "YOU" regardless of hat color
      displayText = "???";
    } else if (isRainbow) {
      // Rainbow hats show position labels
      if (
        isLeftSide !== false &&
        leftPosition !== undefined &&
        leftPosition > 0
      ) {
        displayText = `l[${leftPosition}]`;
      } else if (
        isLeftSide === false &&
        rightPosition !== undefined &&
        rightPosition > 0
      ) {
        displayText = `r[${rightPosition}]`;
      }
    } else if (!isRainbow && hatNumber !== undefined) {
      // Colored hats show their number (including 0)
      displayText = hatNumber.toString();
    }

    const renderHatText = (yPos: number) =>
      displayText ? (
        <>
          <text
            x="0"
            y={yPos}
            textAnchor="middle"
            fontSize={displayText.length > 2 ? "14" : "20"}
            fontFamily="monospace"
            fontWeight="900"
            fill="white"
            stroke="white"
            strokeWidth="2.1"
          >
            {displayText}
          </text>
          <text
            x="0"
            y={yPos}
            textAnchor="middle"
            fontSize={displayText.length > 2 ? "14" : "20"}
            fontFamily="monospace"
            fontWeight="900"
            fill="black"
            stroke="black"
            strokeWidth="0.4"
          >
            {displayText}
          </text>
        </>
      ) : null;

    const fillColor = isRainbow ? `url(#${gradientId})` : this.color;

    // Apply small lift offset only for hats on people, not legend hats
    const liftOffset = isOnPerson ? -5 : 0;

    switch (this.type) {
      case "cap":
        return (
          <g transform={transform}>
            {isRainbow && this.createRainbowGradient(gradientId)}
            <ellipse
              cx="0"
              cy={-22 + liftOffset}
              rx="25"
              ry="17"
              fill={fillColor}
              stroke="#000"
              strokeWidth="1.4"
            />
            <ellipse
              cx="0"
              cy={-17 + liftOffset}
              rx="31"
              ry="7"
              fill={fillColor}
              stroke="#000"
              strokeWidth="1.4"
            />
            {renderHatText(-20 + liftOffset)}
          </g>
        );
      case "beanie":
        return (
          <g transform={transform}>
            {isRainbow && this.createRainbowGradient(gradientId)}
            <ellipse
              cx="0"
              cy={-22 + liftOffset}
              rx="25"
              ry="17"
              fill={fillColor}
              stroke="#000"
              strokeWidth="1.4"
            />
            <rect
              x="-25"
              y={-8 + liftOffset}
              width="50"
              height="7"
              fill={fillColor}
              stroke="#000"
              strokeWidth="1.4"
            />
            {renderHatText(-15 + liftOffset)}
          </g>
        );
      case "fedora":
        return (
          <g transform={transform}>
            {isRainbow && this.createRainbowGradient(gradientId)}
            <ellipse
              cx="0"
              cy={-17 + liftOffset}
              rx="36"
              ry="8"
              fill={fillColor}
              stroke="#000"
              strokeWidth="1.4"
            />
            <ellipse
              cx="0"
              cy={-28 + liftOffset}
              rx="22"
              ry="14"
              fill={fillColor}
              stroke="#000"
              strokeWidth="1.4"
            />
            <rect
              x="-22"
              y={-22 + liftOffset}
              width="45"
              height="3"
              fill="#333"
            />
            {renderHatText(-21 + liftOffset)}
          </g>
        );
      case "cowboy":
        return (
          <g transform={transform}>
            {isRainbow && this.createRainbowGradient(gradientId)}
            <ellipse
              cx="0"
              cy={-14 + liftOffset}
              rx="42"
              ry="11"
              fill={fillColor}
              stroke="#000"
              strokeWidth="1.4"
            />
            <ellipse
              cx="0"
              cy={-31 + liftOffset}
              rx="20"
              ry="17"
              fill={fillColor}
              stroke="#000"
              strokeWidth="1.4"
            />
            <line
              x1="0"
              y1={-39 + liftOffset}
              x2="0"
              y2={-22 + liftOffset}
              stroke="#000"
              strokeWidth="1.4"
            />
            {renderHatText(-25 + liftOffset)}
          </g>
        );
      default:
        return <></>;
    }
  }
}
