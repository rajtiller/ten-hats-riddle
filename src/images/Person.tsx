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
  showAsUnknown?: boolean; // New prop to show ??? instead of hat
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
  }

  renderIndexHighlight(): JSX.Element {
    if (!this.isHighlighted || !this.showIndexLabels) return <></>;

    // Highlight the index label specifically for current person
    if (this.isCurrentPerson) {
      const labelX = this.x + 25;
      const labelY = this.y + 45;

      return (
        <g>
          {/* Pulsing highlight circle around the index label */}
          <circle
            cx={labelX}
            cy={labelY - 3}
            r="15"
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
                  r: 15;
                }
                50% { 
                  stroke-width: 4;
                  opacity: 1;
                  r: 18;
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

    // Highlight around the hat for other people
    return (
      <g>
        {/* Pulsing highlight circle around the hat */}
        <circle
          cx={this.x}
          cy={this.y - 20} // Position around hat area
          r="30"
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
                r: 30;
              }
              50% { 
                stroke-width: 6;
                opacity: 1;
                r: 35;
              }
            }
          `}
        </style>
      </g>
    );
  }

  renderHighlight(): JSX.Element {
    if (!this.isHighlighted) return <></>;

    // Use different highlighting based on whether it's current person or others
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
            <rect x="-25" y="-9" width="50" height="50" />
          </clipPath>
        </defs>
        <circle
          cx="0"
          cy="0"
          r="20"
          fill={this.skinColor}
          stroke="#000"
          strokeWidth="1"
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
          cy="35"
          rx="30"
          ry="15"
          fill={this.shirtColor}
          stroke="#000"
          strokeWidth="1"
        />
      </g>
    );
  }

  renderFace(): JSX.Element {
    if (!this.showFace) return <></>;

    const transform = `translate(${this.x}, ${this.y}) rotate(${this.angle})`;
    const eyeOffset = Math.cos((this.angle * Math.PI) / 180) * 6;
    const noseOffset = Math.sin((this.angle * Math.PI) / 180) * 3;

    return (
      <g transform={transform}>
        <circle cx={-eyeOffset} cy="-5" r="2" fill="#000" />
        <circle cx={eyeOffset} cy="-5" r="2" fill="#000" />
        <ellipse cx={noseOffset} cy="0" rx="1.5" ry="3" fill="#d4a574" />
        <path d="M -4 6 Q 0 10 4 6" stroke="#000" strokeWidth="1" fill="none" />
      </g>
    );
  }

  renderPersonNumber(): JSX.Element {
    if (!this.showPersonNumber) return <></>;

    // Position the label at bottom right relative to the person
    const labelX = this.x + 25;
    const labelY = this.y + 45;

    return (
      <g>
        {/* White background circle for better readability */}
        <circle
          cx={labelX}
          cy={labelY - 3}
          r="10"
          fill="white"
          stroke="#333"
          strokeWidth="1"
          opacity="0.9"
        />
        {/* Person number text - always show absolute person number */}
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          fontSize="12"
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

    // Position the label at bottom right relative to the person (same as person numbers)
    const labelX = this.x + 25;
    const labelY = this.y + 45;

    if (this.isCurrentPerson) {
      // Show "i" for current person
      return (
        <g>
          {/* White background circle for better readability */}
          <circle
            cx={labelX}
            cy={labelY - 3}
            r="10"
            fill="white"
            stroke="#333"
            strokeWidth="1"
            opacity="0.9"
          />
          {/* Index label text */}
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            fontSize="12"
            fontFamily="monospace"
            fontWeight="bold"
            fill="black"
          >
            i
          </text>
        </g>
      );
    } else {
      // Show relative index (i-1, i+1, etc.) for others in same format
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
          {/* White background circle for better readability */}
          <circle
            cx={labelX}
            cy={labelY - 3}
            r="10"
            fill="white"
            stroke="#333"
            strokeWidth="1"
            opacity="0.9"
          />
          {/* Index label text */}
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            fontSize="10"
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
    const labelY = this.y + 85; // Position below index labels

    if (!this.showPersonNumber && !this.showIndexLabels) {
      // Show l[n] labels only when neither person numbers nor index labels are shown
      return (
        <g>
          <text
            x={this.x}
            y={labelY}
            textAnchor="middle"
            fontSize="12"
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

  render(): JSX.Element {
    return (
      <g>
        {this.renderHighlight()}
        {this.renderShoulders()}
        {this.renderHead()}
        {this.renderFace()}
        {/* Always show the hat - no ??? logic */}
        {this.hat.render(this.x, this.y, this.angle, this.isCurrentPerson)}
        {/* Show either person numbers (absolute) OR index labels (relative), not both */}
        {this.showPersonNumber
          ? this.renderPersonNumber()
          : this.renderIndexLabel()}
        {this.renderPersonLabel()}
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
