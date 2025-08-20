import React, { type JSX, useState, useEffect } from "react";
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
  guess?: number;
  formula?: string; // Add formula prop for calculation display
  hatColors?: number[]; // Add hat colors for calculation
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
  formula?: string;
  hatColors?: number[];

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
    formula = undefined,
    hatColors = undefined,
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
    this.formula = formula;
    this.hatColors = hatColors;
  }

  renderIndexHighlight(): JSX.Element {
    if (!this.isHighlighted || !this.showIndexLabels) return <></>;

    if (this.isCurrentPerson) {
      const labelX = this.x + 28;
      const labelY = this.y + 49;

      return (
        <g>
          <circle
            cx={labelX}
            cy={labelY - 3}
            r="17"
            fill="none"
            stroke="#ffeb3b"
            strokeWidth="3"
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
          cy={this.y - 21}
          r="35"
          fill="none"
          stroke="#ffeb3b"
          strokeWidth="4"
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
    const transform = `translate(${this.x}, ${this.y}) rotate(${this.angle})`;
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

    const transform = `translate(${this.x}, ${this.y}) rotate(${this.angle})`;

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

    const labelX = this.x + 28;
    const labelY = this.y + 49;

    return (
      <g>
        <circle
          cx={labelX}
          cy={labelY - 3}
          r="11"
          fill="white"
          stroke="#333"
          strokeWidth="1.4"
          opacity="0.9"
        />
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          fontSize="14"
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

    const labelX = this.x + 28;
    const labelY = this.y + 49;

    if (this.isCurrentPerson) {
      return (
        <g>
          <circle
            cx={labelX}
            cy={labelY - 3}
            r="11"
            fill="white"
            stroke="#333"
            strokeWidth="1.4"
            opacity="0.9"
          />
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            fontSize="14"
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
            r="11"
            fill="white"
            stroke="#333"
            strokeWidth="1.4"
            opacity="0.9"
          />
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            fontSize="11"
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
    const labelY = this.y + 95;

    if (!this.showPersonNumber && !this.showIndexLabels) {
      return (
        <g>
          <text
            x={this.x}
            y={labelY}
            textAnchor="middle"
            fontSize="14"
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

    return guessColors[guess] || "#666666";
  }

  getTextColor(backgroundColor: string): string {
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

    const guessY = this.y - 48; // Adjusted for lifted hats
    const guessColor = this.getGuessColor(this.guess);
    const textColor = this.getTextColor(guessColor);

    return (
      <GuessWithTooltip
        x={this.x}
        y={guessY}
        guess={this.guess}
        guessColor={guessColor}
        textColor={textColor}
        personNumber={this.personNumber}
        formula={this.formula}
        hatColors={this.hatColors}
      />
    );
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
          true
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

// New component for guess with hover tooltip
interface GuessWithTooltipProps {
  x: number;
  y: number;
  guess: number;
  guessColor: string;
  textColor: string;
  personNumber: number;
  formula?: string;
  hatColors?: number[];
}

const GuessWithTooltip: React.FC<GuessWithTooltipProps> = ({
  x,
  y,
  guess,
  guessColor,
  textColor,
  personNumber,
  formula,
  hatColors,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [animationToggle, setAnimationToggle] = useState(false);

  // Animation timer for switching between variable names and values
  useEffect(() => {
    if (!showTooltip) return;

    const interval = setInterval(() => {
      setAnimationToggle((prev) => !prev);
    }, 1500); // Switch every 1.5 seconds

    return () => clearInterval(interval);
  }, [showTooltip]);

  const generateCalculationSteps = (): {
    originalFormula: string;
    substitutedFormula: string;
    animatedFormula: string;
    calculatedValue: number;
    finalResult: number;
  } | null => {
    if (!formula || !hatColors || hatColors.length !== 10) return null;

    try {
      // Original formula
      const originalFormula = formula;

      // Create substituted formula (all variables replaced with values)
      let substitutedFormula = formula;

      // Replace 'i' with person's guessed hat color
      substitutedFormula = substitutedFormula.replace(
        /\bi\b/g,
        guess.toString()
      );

      // Replace 'all' with sum of all visible hat colors (excluding this person)
      const visibleHats = hatColors.filter(
        (_, index) => index !== personNumber
      );
      const allSum = visibleHats.reduce((sum, color) => sum + color, 0);
      substitutedFormula = substitutedFormula.replace(
        /\ball\b/g,
        allSum.toString()
      );

      // Replace l[n] patterns
      substitutedFormula = substitutedFormula.replace(
        /l\[(\d+)\]/g,
        (match, position) => {
          const pos = parseInt(position);
          const targetPersonIndex = (personNumber + pos) % 10;
          return hatColors[targetPersonIndex].toString();
        }
      );

      // Replace r[n] patterns
      substitutedFormula = substitutedFormula.replace(
        /r\[(\d+)\]/g,
        (match, position) => {
          const pos = parseInt(position);
          const targetPersonIndex = (personNumber - pos + 10) % 10;
          return hatColors[targetPersonIndex].toString();
        }
      );

      // Create animated formula (switches between variables and values)
      let animatedFormula = formula;

      if (animationToggle) {
        // Show values
        animatedFormula = animatedFormula.replace(/\bi\b/g, guess.toString());
        animatedFormula = animatedFormula.replace(
          /\ball\b/g,
          allSum.toString()
        );
        animatedFormula = animatedFormula.replace(
          /l\[(\d+)\]/g,
          (match, position) => {
            const pos = parseInt(position);
            const targetPersonIndex = (personNumber + pos) % 10;
            return hatColors[targetPersonIndex].toString();
          }
        );
        animatedFormula = animatedFormula.replace(
          /r\[(\d+)\]/g,
          (match, position) => {
            const pos = parseInt(position);
            const targetPersonIndex = (personNumber - pos + 10) % 10;
            return hatColors[targetPersonIndex].toString();
          }
        );
      } else {
        // Show original variables (no changes needed)
        animatedFormula = formula;
      }

      // Calculate the result
      const processedFormula = substitutedFormula.replace(/x/g, "*");
      const calculatedValue = new Function(
        `"use strict"; return (${processedFormula})`
      )();
      const finalResult = ((calculatedValue % 10) + 10) % 10;

      return {
        originalFormula,
        substitutedFormula,
        animatedFormula,
        calculatedValue,
        finalResult: Math.floor(finalResult),
      };
    } catch (error) {
      console.error("Error generating calculation:", error);
      return null;
    }
  };

  const calculation = generateCalculationSteps();

  return (
    <g>
      {/* Guess circle */}
      <circle
        cx={x}
        cy={y}
        r="14"
        fill={guessColor}
        stroke="#333"
        strokeWidth="2.1"
        opacity="0.9"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{ cursor: calculation ? "pointer" : "default" }}
      />

      {/* Guess text */}
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fontSize="17"
        fontFamily="monospace"
        fontWeight="bold"
        fill={textColor}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          cursor: calculation ? "pointer" : "default",
          pointerEvents: "none",
        }}
      >
        {guess}
      </text>

      {/* Small "guess" label */}
      <text
        x={x}
        y={y - 20}
        textAnchor="middle"
        fontSize="10"
        fontFamily="monospace"
        fill="#666"
        style={{ pointerEvents: "none" }}
      >
        guess
      </text>

      {/* Tooltip */}
      {showTooltip && calculation && (
        <g>
          {/* Tooltip background */}
          <rect
            x={x - 150}
            y={y - 120}
            width="300"
            height="90"
            fill="rgba(0, 0, 0, 0.9)"
            stroke="#fff"
            strokeWidth="1"
            rx="5"
            ry="5"
          />

          {/* Tooltip title */}
          <text
            x={x}
            y={y - 100}
            textAnchor="middle"
            fontSize="12"
            fontFamily="monospace"
            fontWeight="bold"
            fill="#fff"
          >
            Person {personNumber} Calculation:
          </text>

          {/* Animated formula */}
          <text
            x={x}
            y={y - 80}
            textAnchor="middle"
            fontSize="11"
            fontFamily="monospace"
            fill="#90EE90"
          >
            {calculation.animatedFormula}
          </text>

          {/* Equals to calculated value */}
          <text
            x={x}
            y={y - 60}
            textAnchor="middle"
            fontSize="11"
            fontFamily="monospace"
            fill="#FFD700"
          >
            = {calculation.calculatedValue}
          </text>

          {/* Mod 10 operation */}
          <text
            x={x}
            y={y - 40}
            textAnchor="middle"
            fontSize="11"
            fontFamily="monospace"
            fill="#FFA500"
          >
            {calculation.calculatedValue} mod 10 = {calculation.finalResult}
          </text>
        </g>
      )}
    </g>
  );
};

const PersonComponent: React.FC<PersonProps> = (props = {}) => {
  const person = new Person(props);
  return (
    <svg width="200" height="200" viewBox="-80 -80 160 160">
      {person.render()}
    </svg>
  );
};

export default PersonComponent;
