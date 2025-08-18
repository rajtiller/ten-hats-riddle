import React, { type JSX } from "react";

// Hat class/interface
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
    const clipId = `hat-clip-${Math.random().toString(36).substr(2, 9)}`;

    switch (this.type) {
      case "cap":
        return (
          <g transform={transform}>
            <defs>
              <clipPath id={clipId}>
                {/* Clip the head circle to not show above the hat brim */}
                <rect x="-50" y="-9" width="100" height="100" />
              </clipPath>
            </defs>
            {/* Main cap dome */}
            <ellipse
              cx="0"
              cy="-20"
              rx="22"
              ry="15"
              fill={this.color}
              stroke="#000"
              strokeWidth="1"
            />
            {/* Cap brim */}
            <ellipse
              cx="0"
              cy="-15"
              rx="28"
              ry="6"
              fill={this.color}
              stroke="#000"
              strokeWidth="1"
            />
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
            {/* Beanie cuff */}
            <rect
              x="-22"
              y="-8"
              width="44"
              height="6"
              fill={this.color}
              stroke="#000"
              strokeWidth="1"
            />
          </g>
        );
      case "fedora":
        return (
          <g transform={transform}>
            {/* Hat brim */}
            <ellipse
              cx="0"
              cy="-15"
              rx="32"
              ry="8"
              fill={this.color}
              stroke="#000"
              strokeWidth="1"
            />
            {/* Hat crown */}
            <ellipse
              cx="0"
              cy="-25"
              rx="20"
              ry="12"
              fill={this.color}
              stroke="#000"
              strokeWidth="1"
            />
            {/* Hat band */}
            <rect x="-20" y="-20" width="40" height="3" fill="#333" />
          </g>
        );
      case "cowboy":
        return (
          <g transform={transform}>
            {/* Hat brim */}
            <ellipse
              cx="0"
              cy="-12"
              rx="38"
              ry="10"
              fill={this.color}
              stroke="#000"
              strokeWidth="1"
            />
            {/* Hat crown */}
            <ellipse
              cx="0"
              cy="-28"
              rx="18"
              ry="15"
              fill={this.color}
              stroke="#000"
              strokeWidth="1"
            />
            {/* Crown crease */}
            <line
              x1="0"
              y1="-35"
              x2="0"
              y2="-20"
              stroke="#000"
              strokeWidth="1"
            />
          </g>
        );
      default:
        return <></>;
    }
  }
}

// Person class
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
  }

  renderHead(): JSX.Element {
    const transform = `translate(${this.x}, ${this.y}) rotate(${this.angle})`;
    const clipId = `head-clip-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <g transform={transform}>
        <defs>
          <clipPath id={clipId}>
            {/* Only show the head below the hat line */}
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

    // Adjust face features based on angle
    const eyeOffset = Math.cos((this.angle * Math.PI) / 180) * 6;
    const noseOffset = Math.sin((this.angle * Math.PI) / 180) * 3;

    return (
      <g transform={transform}>
        {/* Eyes */}
        <circle cx={-eyeOffset} cy="-5" r="2" fill="#000" />
        <circle cx={eyeOffset} cy="-5" r="2" fill="#000" />

        {/* Nose */}
        <ellipse cx={noseOffset} cy="0" rx="1.5" ry="3" fill="#d4a574" />

        {/* Mouth */}
        <path d="M -4 6 Q 0 10 4 6" stroke="#000" strokeWidth="1" fill="none" />
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
      </g>
    );
  }
}

// React component wrapper
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
