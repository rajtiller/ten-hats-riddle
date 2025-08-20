import React, { type JSX } from "react";
import { HatClass } from "./Hat";

export interface PersonProps {
  x?: number;
  y?: number;
  angle?: number;
  skinColor?: string;
  shirtColor?: string;
  hat?: HatClass;
  showFace?: boolean;
  radius?: number;
  centerX?: number;
  centerY?: number;
  width?: number;
  height?: number;
  hatType?: "cap" | "beanie" | "fedora" | "cowboy" | "none";
  hatColor?: string;
  personNumber?: number;
  showPersonNumber?: boolean;
  isCurrentPerson?: boolean;
  leftPosition?: number;
  isHighlighted?: boolean;
  showIndexLabels?: boolean;
  showAsUnknown?: boolean;
  guess?: number; // The person's guess (0-9 or -1 for error)
}

export class Person {
  x: number;
  y: number;
  angle: number;
  skinColor: string;
  shirtColor: string;
  hat: HatClass;
  showFace: boolean;
  radius: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  personNumber: number;
  showPersonNumber: boolean;
  isCurrentPerson: boolean;
  leftPosition: number;
  isHighlighted: boolean;
  showIndexLabels: boolean;
  showAsUnknown: boolean;
  guess?: number;

  constructor({
    x = 0,
    y = 0,
    angle = 0,
    skinColor = "#fdbcb4",
    shirtColor = "#4a90e2",
    hat,
    showFace = true,
    radius = 100,
    centerX = 0,
    centerY = 0,
    width = 320,
    height = 320,
    hatType = "cap",
    hatColor = "#ff0000",
    personNumber = 0,
    showPersonNumber = true,
    isCurrentPerson = false,
    leftPosition = 0,
    isHighlighted = false,
    showIndexLabels = false,
    showAsUnknown = false,
    guess = undefined,
  }: PersonProps = {}) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.skinColor = skinColor;
    this.shirtColor = shirtColor;
    this.hat = hat || new HatClass(hatColor, hatType);
    this.showFace = showFace;
    this.radius = radius;
    this.centerX = centerX;
    this.centerY = centerY;
    this.width = width;
    this.height = height;
    this.personNumber = personNumber;
    this.showPersonNumber = showPersonNumber;
    this.isCurrentPerson = isCurrentPerson;
    this.leftPosition = leftPosition;
    this.isHighlighted = isHighlighted;
    this.showIndexLabels = showIndexLabels;
    this.showAsUnknown = showAsUnknown;
    this.guess = guess;
  }

  renderIndexHighlight(): JSX.Element {
    if (!this.isHighlighted || !this.showIndexLabels) return <></>;

    if (this.isCurrentPerson) {
      const labelX = this.x + 28; // Increased from 20 (20 * 1.4)
      const labelY = this.y + 49; // Increased from 35 (35 * 1.4)

      return (
        <g>
          <circle
            cx={labelX}
            cy={labelY - 3}
            r="17" // Increased from 12 (12 * 1.4)
            fill="none"
            stroke="#ffeb3b"
            strokeWidth="3" // Increased from 2 (2 * 1.4)
            opacity="0.8"
            style={{
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <style>
            {`
              @keyframes pulse {
                0%, 100% { 
                  stroke-width: 3;
                  opacity: 0.8;
                  r: 17;
                }
                50% { 
                  stroke-width: 4;
                  opacity: 1;
                  r: 20;
                }
              }
            `}
          </style>
        </g>
      );
    }

    return <></>;
  }

  renderHatHighlight(): JSX.Element {
    if (!this.isHighlighted || this.isCurrentPerson) return <></>;

    return (
      <g>
        <circle
          cx={this.x}
          cy={this.y - 21} // Increased from -15 (-15 * 1.4)
          r="35" // Increased from 25 (25 * 1.4)
          fill="none"
          stroke="#ffeb3b"
          strokeWidth="4" // Increased from 3 (3 * 1.4)
          opacity="0.8"
          style={{
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <style>
          {`
            @keyframes pulse {
              0%, 100% { 
                stroke-width: 4;
                opacity: 0.8;
                r: 35;
              }
              50% { 
                stroke-width: 6;
                opacity: 1;
                r: 39;
              }
            }
          `}
        </style>
      </g>
    );
  }

  renderHighlight(): JSX.Element {
    if (!this.isHighlighted) return <></>;

    if (this.isCurrentPerson) {
      return this.renderIndexHighlight();
    } else {
      return this.renderHatHighlight();
    }
  }

  renderHead(): JSX.Element {
    const transform = `translate(${this.x}, ${this.y}) rotate(${this.angle})`;
    const clipId = `head-clip-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <g transform={transform}>
        <defs>
          <clipPath id={clipId}>
            <rect x="-28" y="-10" width="56" height="56" />{" "}
            {/* Increased from 40x40 (40 * 1.4) */}
          </clipPath>
        </defs>
        <circle
          cx="0"
          cy="0"
          r="22" // Increased from 16 (16 * 1.4)
          fill={this.skinColor}
          stroke="#000"
          strokeWidth="1.4" // Increased from 1 (1 * 1.4)
          clipPath={`url(#${clipId})`}
        />
      </g>
    );
  }

  renderShoulders(): JSX.Element {
    const transform = `translate(${this.x}, ${this.y}) rotate(${this.angle})`;
    return (
      <g transform={transform}>
        <ellipse
          cx="0"
          cy="39" // Increased from 28 (28 * 1.4)
          rx="34" // Increased from 24 (24 * 1.4)
          ry="17" // Increased from 12 (12 * 1.4)
          fill={this.shirtColor}
          stroke="#000"
          strokeWidth="1.4" // Increased from 1 (1 * 1.4)
        />
      </g>
    );
  }

  renderFace(): JSX.Element {
    if (!this.showFace) return <></>;

    const transform = `translate(${this.x}, ${this.y}) rotate(${this.angle})`;
    const eyeOffset = Math.cos((this.angle * Math.PI) / 180) * 7; // Increased from 5 (5 * 1.4)
    const noseOffset = Math.sin((this.angle * Math.PI) / 180) * 3.5; // Increased from 2.5 (2.5 * 1.4)

    return (
      <g transform={transform}>
        <circle cx={-eyeOffset} cy="-6" r="2.1" fill="#000" />{" "}
        {/* Increased from 1.5 and -4 */}
        <circle cx={eyeOffset} cy="-6" r="2.1" fill="#000" />
        <ellipse cx={noseOffset} cy="0" rx="1.7" ry="3.4" fill="#d4a574" />{" "}
        {/* Increased from 1.2 and 2.4 */}
        <path
          d="M -4 7 Q 0 11 4 7"
          stroke="#000"
          strokeWidth="1.4"
          fill="none"
        />{" "}
        {/* Increased size */}
      </g>
    );
  }

  renderPersonNumber(): JSX.Element {
    if (!this.showPersonNumber) return <></>;

    const labelX = this.x + 28; // Increased from 20 (20 * 1.4)
    const labelY = this.y + 49; // Increased from 35 (35 * 1.4)

    return (
      <g>
        <circle
          cx={labelX}
          cy={labelY - 3}
          r="11" // Increased from 8 (8 * 1.4)
          fill="white"
          stroke="#333"
          strokeWidth="1.4" // Increased from 1 (1 * 1.4)
          opacity="0.9"
        />
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          fontSize="14" // Increased from 10 (10 * 1.4)
          fontFamily="monospace"
          fontWeight="bold"
          fill="black"
        >
          {this.personNumber}
        </text>
      </g>
    );
  }

  renderIndexLabel(): JSX.Element {
    if (!this.showIndexLabels) return <></>;

    const labelX = this.x + 28; // Increased from 20 (20 * 1.4)
    const labelY = this.y + 49; // Increased from 35 (35 * 1.4)

    if (this.isCurrentPerson) {
      return (
        <g>
          <circle
            cx={labelX}
            cy={labelY - 3}
            r="11" // Increased from 8 (8 * 1.4)
            fill="white"
            stroke="#333"
            strokeWidth="1.4" // Increased from 1 (1 * 1.4)
            opacity="0.9"
          />
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            fontSize="14" // Increased from 10 (10 * 1.4)
            fontFamily="monospace"
            fontWeight="bold"
            fill="black"
          >
            i
          </text>
        </g>
      );
    } else {
      const relativeIndex = this.leftPosition;
      let indexLabel = "";

      if (relativeIndex === 1) {
        indexLabel = "i+1";
      } else if (relativeIndex === 9) {
        indexLabel = "i-1";
      } else if (relativeIndex <= 5) {
        indexLabel = `i+${relativeIndex}`;
      } else {
        indexLabel = `i-${10 - relativeIndex}`;
      }

      return (
        <g>
          <circle
            cx={labelX}
            cy={labelY - 3}
            r="11" // Increased from 8 (8 * 1.4)
            fill="white"
            stroke="#333"
            strokeWidth="1.4" // Increased from 1 (1 * 1.4)
            opacity="0.9"
          />
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            fontSize="11" // Increased from 8 (8 * 1.4)
            fontFamily="monospace"
            fontWeight="bold"
            fill="black"
          >
            {indexLabel}
          </text>
        </g>
      );
    }
  }

  renderPersonLabel(): JSX.Element {
    const labelY = this.y + 95; // Increased from 68 (68 * 1.4)

    if (!this.showPersonNumber && !this.showIndexLabels) {
      return (
        <g>
          <text
            x={this.x}
            y={labelY}
            textAnchor="middle"
            fontSize="14" // Increased from 10 (10 * 1.4)
            fontFamily="monospace"
            fontWeight="bold"
            fill="#0066cc"
          >
            l[{this.leftPosition}]
          </text>
        </g>
      );
    }

    return <></>;
  }

  getGuessColor(guess: number): string {
    const guessColors = [
      "#000000", // Black - 0
      "#008080", // Teal - 1
      "#ff0000", // Red - 2
      "#ffa500", // Orange - 3
      "#008000", // Green - 4
      "#0000ff", // Blue - 5
      "#8b00ff", // Violet - 6
      "#ff00ff", // Magenta - 7
      "#d2b48c", // Tan - 8
      "#8b4513", // Brown - 9
    ];

    return guessColors[guess] || "#666666"; // Fallback gray for invalid guesses
  }

  getTextColor(backgroundColor: string): string {
    // Determine if we need light or dark text based on background color
    const darkBackgrounds = [
      "#000000",
      "#008080",
      "#008000",
      "#0000ff",
      "#8b00ff",
      "#8b4513",
    ];
    return darkBackgrounds.includes(backgroundColor) ? "white" : "black";
  }

  renderGuess(): JSX.Element {
    if (this.guess === undefined || this.guess === -1) return <></>;

    // Position the guess above the person
    const guessY = this.y - 63; // Increased from -45 (-45 * 1.4)
    const guessColor = this.getGuessColor(this.guess);
    const textColor = this.getTextColor(guessColor);

    return (
      <g>
        {/* Background circle for guess */}
        <circle
          cx={this.x}
          cy={guessY+15}
          r="14" // Increased from 10 (10 * 1.4)
          fill={guessColor}
          stroke="#333"
          strokeWidth="2.1" // Increased from 1.5 (1.5 * 1.4)
          opacity="0.9"
        />
        {/* Guess text with contrasting color */}
        <text
          x={this.x}
          y={guessY + 19} // Increased from 3 (3 * 1.4)
          textAnchor="middle"
          fontSize="17" // Increased from 12 (12 * 1.4)
          fontFamily="monospace"
          fontWeight="bold"
          fill={textColor}
        >
          {this.guess}
        </text>
      </g>
    );
  }

  render(): JSX.Element {
    return (
      <g>
        {this.renderHighlight()}
        {this.renderShoulders()}
        {this.renderHead()}
        {this.renderFace()}
        {this.hat.render(this.x, this.y, this.angle, this.isCurrentPerson)}
        {this.showPersonNumber
          ? this.renderPersonNumber()
          : this.renderIndexLabel()}
        {this.renderPersonLabel()}
        {this.renderGuess()}
      </g>
    );
  }
}

const PersonComponent: React.FC<PersonProps> = (props = {}) => {
  const person = new Person(props);
  return (
    <svg width="200" height="200" viewBox="-50 -50 100 100">
      {person.render()}
    </svg>
  );
};

export default PersonComponent;
