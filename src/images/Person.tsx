import React, { type JSX } from "react";

const hatColorToNumber: { [color: string]: number } = {
  "#000000": 0,
  "#808080": 1,
  "#ff0000": 2,
  "#ffa500": 3,
  "#008000": 4,
  "#0000ff": 5,
  "#8b00ff": 6,
  "#ff00ff": 7,
  "#d2b48c": 8,
  "#8b4513": 9,
};

interface Hat {
  color: string;
  type: "cap" | "beanie" | "fedora" | "cowboy" | "none";
}

class HatClass implements Hat {
  color: string;
  type: "cap" | "beanie" | "fedora" | "cowboy" | "none";

  constructor(
    color: string = "#ff0000",
    type: "cap" | "beanie" | "fedora" | "cowboy" | "none" = "cap"
  ) {
    this.color = color;
    this.type = type;
  }

  render(x: number, y: number, angle: number = 0): JSX.Element {
    if (this.type === "none") return <></>;

    const transform = `translate(${x}, ${y}) rotate(${angle})`;
    const hatNumber = hatColorToNumber[this.color] ?? "?";

    const renderHatNumber = (yPos: number) => (
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
          {hatNumber}
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
          {hatNumber}
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
            {renderHatNumber(-14)}
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
            {renderHatNumber(-14)}
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
            {renderHatNumber(-19)}
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
            {renderHatNumber(-22)}
          </g>
        );
      default:
        return <></>;
    }
  }
}

interface PersonProps {
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

class Person {
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
    const clipId = `head-clip-${Math.random().toString(36).substr(2, 9)}`;

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

    return (
      <text
        x={this.x}
        y={this.y + 55}
        textAnchor="middle"
        fontSize="14"
        fontFamily="monospace"
        fontWeight="bold"
        fill="black"
        stroke="white"
        strokeWidth="0.5"
      >
        {this.personNumber}
      </text>
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
export { Person, HatClass };
