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
  rightPosition?: number; // Add right position
  isLeftSide?: boolean; // Add flag to determine left or right
  isHighlighted?: boolean;
  showIndexLabels?: boolean;
  showAsUnknown?: boolean;
  guess?: number;
  formula?: string;
  hatColors?: number[];
  sizeScale?: number; // Add size scale prop
  showOtherLabel?: boolean; // New prop for showing "other" label
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
  rightPosition: number; // Add right position
  isLeftSide: boolean; // Add left/right flag
  isHighlighted: boolean;
  showIndexLabels: boolean;
  showAsUnknown: boolean;
  guess?: number;
  formula?: string;
  hatColors?: number[];
  sizeScale: number; // Add size scale property
  showOtherLabel: boolean; // Add showOtherLabel property

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
    rightPosition = 0,
    isLeftSide = true,
    isHighlighted = false,
    showIndexLabels = false,
    showAsUnknown = false,
    guess = undefined,
    formula = undefined,
    hatColors = undefined,
    sizeScale = 1.13, // Default 13% larger (reduced from 1.15)
    showOtherLabel = false, // Default to false
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
    this.rightPosition = rightPosition;
    this.isLeftSide = isLeftSide;
    this.isHighlighted = isHighlighted;
    this.showIndexLabels = showIndexLabels;
    this.showAsUnknown = showAsUnknown;
    this.guess = guess;
    this.formula = formula;
    this.hatColors = hatColors;
    this.sizeScale = sizeScale;
    this.showOtherLabel = showOtherLabel;
  }

  renderIndexHighlight(): JSX.Element {
    if (!this.isHighlighted || !this.showIndexLabels) return <></>;

    if (this.isCurrentPerson) {
      const labelX = this.x + 28 * this.sizeScale;
      const labelY = this.y + 49 * this.sizeScale;

      return (
        <g>
          <circle
            cx={labelX}
            cy={labelY - 3 * this.sizeScale}
            r={17 * this.sizeScale}
            fill="none"
            stroke="#ffeb3b"
            strokeWidth={3 * this.sizeScale}
            opacity="0.8"
            style={{
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <style>
            {`
              @keyframes pulse {
                0%, 100% { 
                  stroke-width: ${3 * this.sizeScale};
                  opacity: 0.8;
                  r: ${17 * this.sizeScale};
                }
                50% { 
                  stroke-width: ${4 * this.sizeScale};
                  opacity: 1;
                  r: ${20 * this.sizeScale};
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
          cy={this.y - 21 * this.sizeScale}
          r={35 * this.sizeScale}
          fill="none"
          stroke="#ffeb3b"
          strokeWidth={4 * this.sizeScale}
          opacity="0.8"
          style={{
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <style>
          {`
            @keyframes pulse {
              0%, 100% { 
                stroke-width: ${4 * this.sizeScale};
                opacity: 0.8;
                r: ${35 * this.sizeScale};
              }
              50% { 
                stroke-width: ${6 * this.sizeScale};
                opacity: 1;
                r: ${39 * this.sizeScale};
              }
            }
          `}
        </style>
      </g>
    );
  }

  renderSuccessHighlight(): JSX.Element {
    // Check if this person guessed their own hat correctly
    if (
      this.guess === undefined ||
      this.guess === -1 ||
      !this.hatColors ||
      this.hatColors.length <= this.personNumber
    ) {
      return <></>;
    }

    const actualHatColor = this.hatColors[this.personNumber];
    const guessedCorrectly = this.guess === actualHatColor;

    if (!guessedCorrectly) return <></>;

    return (
      <g>
        <circle
          cx={this.x}
          cy={this.y - 45}
          r={35 * this.sizeScale} // Changed from 45 to 35 to match yellow circle size
          fill="none"
          stroke="#28a745"
          strokeWidth={4 * this.sizeScale}
          opacity="0.9"
          style={{
            animation: "successPulse 2s ease-in-out infinite",
          }}
        />
        <style>
          {`
            @keyframes successPulse {
              0%, 100% { 
                stroke-width: ${4 * this.sizeScale};
                opacity: 0.9;
                r: ${35 * this.sizeScale}; // Changed from 45 to 35
              }
              50% { 
                stroke-width: ${6 * this.sizeScale};
                opacity: 1;
                r: ${39 * this.sizeScale}; // Changed from 48 to 39
              }
            }
          `}
        </style>
      </g>
    );
  }

  renderHighlight(): JSX.Element {
    // First render success highlight if applicable
    const successHighlight = this.renderSuccessHighlight();

    // Then render regular highlight if needed
    if (!this.isHighlighted) return successHighlight;

    let regularHighlight = <></>;
    if (this.isCurrentPerson) {
      regularHighlight = this.renderIndexHighlight();
    } else {
      regularHighlight = this.renderHatHighlight();
    }

    return (
      <g>
        {successHighlight}
        {regularHighlight}
      </g>
    );
  }

  renderHead(): JSX.Element {
    const transform = `translate(${this.x}, ${this.y}) rotate(${this.angle}) scale(${this.sizeScale})`;

    return (
      <g transform={transform}>
        {/* Complete circular head without clipping */}
        <circle
          cx="0"
          cy="0"
          r="22"
          fill={this.skinColor}
          stroke="#000"
          strokeWidth="1.4"
        />
      </g>
    );
  }

  renderShoulders(): JSX.Element {
    const transform = `translate(${this.x}, ${this.y}) rotate(${this.angle}) scale(${this.sizeScale})`;
    return (
      <g transform={transform}>
        <ellipse
          cx="0"
          cy="39"
          rx="34"
          ry="17"
          fill={this.shirtColor}
          stroke="#000"
          strokeWidth="1.4"
        />
      </g>
    );
  }

  renderFace(): JSX.Element {
    if (!this.showFace) return <></>;

    const transform = `translate(${this.x}, ${this.y}) rotate(${this.angle}) scale(${this.sizeScale})`;

    return (
      <g transform={transform}>
        {/* Eyes - positioned prominently and visible */}
        <circle cx={-6} cy="-6" r="2.8" fill="#000" />
        <circle cx={6} cy="-6" r="2.8" fill="#000" />

        {/* Eye highlights for more life */}
        <circle cx={-5.2} cy="-6.5" r="0.8" fill="#fff" />
        <circle cx={6.8} cy="-6.5" r="0.8" fill="#fff" />

        {/* Eyebrows */}
        <ellipse cx={-6} cy="-10" rx="3" ry="1" fill="#8b4513" />
        <ellipse cx={6} cy="-10" rx="3" ry="1" fill="#8b4513" />

        {/* Nose */}
        <ellipse cx="0" cy="-1" rx="1.7" ry="3.4" fill="#d4a574" />

        {/* Mouth - more defined */}
        <path
          d="M -4 7 Q 0 11 4 7"
          stroke="#000"
          strokeWidth="1.8"
          fill="none"
        />

        {/* Optional: cheeks for more character */}
        <circle cx="-10" cy="3" r="3" fill="#ffb3ba" opacity="0.3" />
        <circle cx="10" cy="3" r="3" fill="#ffb3ba" opacity="0.3" />
      </g>
    );
  }

  renderPersonNumber(): JSX.Element {
    if (!this.showPersonNumber) return <></>;

    const labelX = this.x + 28 * this.sizeScale;
    const labelY = this.y + 49 * this.sizeScale;

    return (
      <g>
        <circle
          cx={labelX}
          cy={labelY - 3 * this.sizeScale}
          r={11 * this.sizeScale}
          fill="white"
          stroke="#333"
          strokeWidth={1.4 * this.sizeScale}
          opacity="0.9"
        />
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          fontSize={14 * this.sizeScale}
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

    const labelX = this.x + 28 * this.sizeScale;
    const labelY = this.y + 49 * this.sizeScale;

    if (this.isCurrentPerson) {
      return (
        <g>
          <circle
            cx={labelX}
            cy={labelY - 3 * this.sizeScale}
            r={11 * this.sizeScale}
            fill="white"
            stroke="#333"
            strokeWidth={1.4 * this.sizeScale}
            opacity="0.9"
          />
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            fontSize={14 * this.sizeScale}
            fontFamily="monospace"
            fontWeight="bold"
            fill="black"
          >
            i
          </text>
        </g>
      );
    } else {
      // For two hats riddle, the other person should be labeled "i+1"
      const indexLabel = "i+1";

      return (
        <g>
          <circle
            cx={labelX}
            cy={labelY - 3 * this.sizeScale}
            r={11 * this.sizeScale}
            fill="white"
            stroke="#333"
            strokeWidth={1.4 * this.sizeScale}
            opacity="0.9"
          />
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            fontSize={11 * this.sizeScale}
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
    const labelY = this.y + 95 * this.sizeScale;

    if (!this.showPersonNumber && !this.showIndexLabels) {
      return (
        <g>
          <text
            x={this.x}
            y={labelY}
            textAnchor="middle"
            fontSize={14 * this.sizeScale}
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
    // Updated to use the correct color mapping for 10 hats riddle
    const guessColors = [
      "#000000", // Black - 0
      "#ffffff", // White - 1 (changed from teal)
      "#ff0000", // Red - 2
      "#ffa500", // Orange - 3
      "#008000", // Green - 4
      "#0000ff", // Blue - 5
      "#8b00ff", // Violet - 6
      "#ff00ff", // Magenta - 7
      "#d2b48c", // Tan - 8
      "#8b4513", // Brown - 9
    ];

    return guessColors[guess] || "#666666";
  }

  getTextColor(backgroundColor: string): string {
    // Use white text for dark colors, black text for light colors
    const darkColors = ["#000000", "#8b00ff", "#0000ff", "#008000", "#8b4513"];
    return darkColors.includes(backgroundColor) ? "white" : "black";
  }

  // New method that renders guess without tooltip (used in Group.render())
  renderGuessWithoutTooltip(): JSX.Element {
    if (this.guess === undefined || this.guess === -1) return <></>;
    return <g></g>;
  }

  // Legacy method for backward compatibility (not used in new Group component)
  renderGuess(): JSX.Element {
    return this.renderGuessWithoutTooltip();
  }

  render(): JSX.Element {
    return (
      <g>
        {this.renderHighlight()}
        {this.renderShoulders()}
        {this.renderHead()}
        {this.renderFace()}
        {this.hat.render(
          this.x,
          this.y,
          this.angle,
          this.isCurrentPerson,
          true,
          this.sizeScale,
          this.leftPosition,
          this.rightPosition, // Pass right position
          this.isLeftSide, // Pass left/right flag
          this.showOtherLabel // Pass showOtherLabel to hat
        )}
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
    <svg width="200" height="200" viewBox="-80 -80 160 160">
      {person.render()}
    </svg>
  );
};

export default PersonComponent;
