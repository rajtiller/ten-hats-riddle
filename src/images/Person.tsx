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
    // Offset from the person's center position
    const labelX = this.x + 25; // 25 pixels to the right
    const labelY = this.y + 45; // 45 pixels down (below shoulders)

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
        {/* Person number text */}
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

  render(): JSX.Element {
    return (
      <g>
        {this.renderShoulders()}
        {this.renderHead()}
        {this.renderFace()}
        {this.hat.render(this.x, this.y, this.angle)}
        {this.renderPersonNumber()}
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
