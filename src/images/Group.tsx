import React, { type JSX, useState } from "react";
import { Person } from "./Person";
import { type PersonHighlight } from "./FormulaBar/FormulaDisplay";

interface GroupProps {
  numberOfPeople?: number;
  people?: Person[];
  radius?: number;
  hatColors?: string[];
  showPersonNumbers?: boolean;
  currentPersonIndex?: number;
  personHighlight?: PersonHighlight | null;
  showIndexLabels?: boolean;
  showCurrentPersonAsUnknown?: boolean;
  personGuesses?: number[];
  formula?: string; // Add formula prop
  hatColorNumbers?: number[]; // Add numerical hat colors for calculation
}

// Interface for tooltip data
interface TooltipData {
  x: number;
  y: number;
  guess: number;
  guessColor: string;
  textColor: string;
  personNumber: number;
  formula?: string;
  hatColors?: number[];
  show: boolean;
}

export class Group {
  numberOfPeople: number;
  people: Person[];
  radius: number;

  constructor({
    numberOfPeople = 5,
    people,
    radius = 5,
    hatColors = [],
    showPersonNumbers = false,
    currentPersonIndex = 0,
    personHighlight = null,
    showIndexLabels = false,
    showCurrentPersonAsUnknown = false,
    personGuesses = [],
    formula = undefined,
    hatColorNumbers = undefined,
  }: GroupProps = {}) {
    this.numberOfPeople = numberOfPeople;
    this.radius = Math.max(1, Math.min(10, radius));

    console.log("Group constructor - personHighlight:", personHighlight);

    this.people =
      people ||
      this.createPeople(
        hatColors,
        showPersonNumbers,
        currentPersonIndex,
        personHighlight,
        showIndexLabels,
        showCurrentPersonAsUnknown,
        personGuesses,
        formula,
        hatColorNumbers
      );
  }

  private shouldHighlightPerson(
    personIndex: number,
    currentPersonIndex: number,
    highlight: PersonHighlight | null
  ): boolean {
    if (!highlight) return false;

    console.log(
      `Checking highlight for person ${personIndex}, highlight:`,
      highlight
    );

    switch (highlight.type) {
      case "current":
        const shouldHighlightCurrent = personIndex === currentPersonIndex;
        console.log(
          `Current person check: ${personIndex} === ${currentPersonIndex} = ${shouldHighlightCurrent}`
        );
        return shouldHighlightCurrent;

      case "all":
        const shouldHighlightAll = personIndex !== currentPersonIndex;
        console.log(
          `All people check: ${personIndex} !== ${currentPersonIndex} = ${shouldHighlightAll}`
        );
        return shouldHighlightAll;

      case "left":
        if (highlight.position && personIndex !== currentPersonIndex) {
          const relativePosition =
            (personIndex - currentPersonIndex + this.numberOfPeople) %
            this.numberOfPeople;
          const shouldHighlightLeft = relativePosition === highlight.position;
          console.log(
            `Left position check: person ${personIndex}, relative pos ${relativePosition}, target ${highlight.position} = ${shouldHighlightLeft}`
          );
          return shouldHighlightLeft;
        }
        return false;

      case "right":
        if (highlight.position && personIndex !== currentPersonIndex) {
          const relativePosition =
            (currentPersonIndex - personIndex + this.numberOfPeople) %
            this.numberOfPeople;
          const shouldHighlightRight = relativePosition === highlight.position;
          console.log(
            `Right position check: person ${personIndex}, relative pos ${relativePosition}, target ${highlight.position} = ${shouldHighlightRight}`
          );
          return shouldHighlightRight;
        }
        return false;

      default:
        return false;
    }
  }

  private createPeople(
    hatColors: string[],
    showPersonNumbers: boolean,
    currentPersonIndex: number,
    personHighlight: PersonHighlight | null = null,
    showIndexLabels: boolean = false,
    showCurrentPersonAsUnknown: boolean = false,
    personGuesses: number[] = [],
    formula?: string,
    hatColorNumbers?: number[]
  ): Person[] {
    const people: Person[] = [];
    const angleStep = (2 * Math.PI) / this.numberOfPeople;
    const sizeScale = 1.13; // 13% larger (reduced from 1.15)

    for (let i = 0; i < this.numberOfPeople; i++) {
      const adjustedIndex =
        (i - currentPersonIndex + this.numberOfPeople) % this.numberOfPeople;

      const angle = Math.PI / 2 + adjustedIndex * angleStep;
      const scaledRadius = this.radius * 20 * sizeScale; // Scale the radius
      const x = scaledRadius * Math.cos(angle);
      const y =
        scaledRadius * Math.sin(angle) -
        (i > 2 && i < 8 ? 15 * sizeScale : 0) -
        20; // Scale the y offset

      const isCurrentPerson = i === currentPersonIndex;
      const isHighlighted = this.shouldHighlightPerson(
        i,
        currentPersonIndex,
        personHighlight
      );

      console.log(
        `Person ${i}: isCurrentPerson=${isCurrentPerson}, isHighlighted=${isHighlighted}`
      );

      const hatColor = hatColors[i] || "#ff0000";

      // Calculate position and determine if it's left or right
      let leftPosition = 0;
      let rightPosition = 0;
      let isLeftSide = true;

      if (!isCurrentPerson) {
        // Calculate relative position from current person
        const relativePosition =
          (i - currentPersonIndex + this.numberOfPeople) % this.numberOfPeople;

        // Positions 1-5 are to the left (l[1] through l[5])
        // Positions 6-9 are to the right (r[4] through r[1])
        if (relativePosition <= 5) {
          // Left side: l[1], l[2], l[3], l[4], l[5]
          leftPosition = relativePosition;
          isLeftSide = true;
        } else {
          // Right side: r[4], r[3], r[2], r[1]
          // relativePosition 6 = r[4], 7 = r[3], 8 = r[2], 9 = r[1]
          rightPosition = 10 - relativePosition;
          isLeftSide = false;
        }
      }

      const person = new Person({
        x,
        y,
        angle: 0,
        personNumber: i,
        showPersonNumber: showPersonNumbers,
        hatColor: hatColor,
        isCurrentPerson: isCurrentPerson,
        leftPosition: isLeftSide ? leftPosition : 0,
        rightPosition: !isLeftSide ? rightPosition : 0,
        isLeftSide: isLeftSide,
        isHighlighted: isHighlighted,
        showIndexLabels: showIndexLabels,
        showAsUnknown: isCurrentPerson && showCurrentPersonAsUnknown,
        guess: personGuesses.length > i ? personGuesses[i] : undefined,
        formula: formula,
        hatColors: hatColorNumbers,
        sizeScale: sizeScale, // Pass scale to Person
      });

      people.push(person);
    }

    return people;
  }

  render(): JSX.Element {
    return (
      <g>
        {/* Render all people (including guesses but WITHOUT tooltips) */}
        {this.people.map((person, index) => (
          <g key={`person-${index}`}>
            {person.renderHighlight()}
            {person.renderShoulders()}
            {person.renderHead()}
            {person.renderFace()}
            {person.hat.render(
              person.x,
              person.y,
              person.angle,
              person.isCurrentPerson,
              true,
              person.sizeScale, // Pass sizeScale
              person.leftPosition, // Pass leftPosition
              person.rightPosition, // Pass rightPosition
              person.isLeftSide // Pass isLeftSide flag
            )}
            {person.showPersonNumber
              ? person.renderPersonNumber()
              : person.renderIndexLabel()}
            {person.renderPersonLabel()}
            {person.renderGuessWithoutTooltip()}{" "}
            {/* New method without tooltip */}
          </g>
        ))}
      </g>
    );
  }
}

const GroupComponent: React.FC<GroupProps> = (props = {}) => {
  console.log("GroupComponent props:", props);
  const [activeTooltip, setActiveTooltip] = useState<TooltipData | null>(null);

  const group = new Group(props);
  const padding = 80;
  const scaledRadius = group.radius * 20;
  const canvasHeight = (scaledRadius + padding) * 2 + 40;
  const canvasWidth = (scaledRadius + padding) * 2 + 140; // fixed cut off for guess boxes

  // Adjust viewBox to show more space at the top for person 5's hat/guess bubble
  const extraTopSpace = 60; // Additional space at the top
  const shiftUp = -4; // Shift entire group up by 5 pixels
  const viewBox = `-${canvasHeight / 2} -${
    canvasHeight / 2 + extraTopSpace + shiftUp
  } ${canvasHeight} ${canvasHeight + extraTopSpace}`;

  return (
    <div style={{ position: "relative" }}>
      <svg width={canvasWidth} height={canvasHeight} viewBox={viewBox}>
        {/* Main group content */}
        {group.render()}

        {/* Render all guess circles with hover handlers LAST for top z-index */}
        {group.people.map((person, index) => {
          if (person.guess === undefined || person.guess === -1) return null;

          const guessY = person.y - 63;
          const guessColor = person.getGuessColor(person.guess);
          const textColor = person.getTextColor(guessColor);

          return (
            <g key={`top-guess-${index}`}>
              <circle
                cx={person.x}
                cy={guessY - 6}
                r="14"
                fill={guessColor}
                stroke="#333"
                strokeWidth="2.1"
                opacity="0.9"
                onMouseEnter={() =>
                  setActiveTooltip({
                    x: 0, // Center the tooltip at (0, 0) - the center of the circle
                    y: 0,
                    guess: person.guess!,
                    guessColor,
                    textColor,
                    personNumber: person.personNumber,
                    formula: person.formula,
                    hatColors: person.hatColors,
                    show: true,
                  })
                }
                onMouseLeave={() => setActiveTooltip(null)}
                style={{ cursor: person.formula ? "pointer" : "default" }}
              />
              <text
                x={person.x}
                y={guessY - 2}
                textAnchor="middle"
                fontSize="17"
                fontFamily="monospace"
                fontWeight="bold"
                fill={textColor}
                style={{ pointerEvents: "none" }}
              >
                {person.guess}
              </text>
            </g>
          );
        })}

        {/* Render active tooltip on top of everything */}
        {activeTooltip && (
          <TooltipComponent
            tooltipData={activeTooltip}
            onClose={() => setActiveTooltip(null)}
          />
        )}
      </svg>
    </div>
  );
};

// Separate tooltip component
interface TooltipComponentProps {
  tooltipData: TooltipData;
  onClose: () => void;
}

const TooltipComponent: React.FC<TooltipComponentProps> = ({ tooltipData }) => {
  const [animationToggle, setAnimationToggle] = useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAnimationToggle((prev) => !prev);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const generateCalculationSteps = (): {
    animatedFormula: string;
    calculatedValue: number;
    finalResult: number;
  } | null => {
    const { formula, hatColors, personNumber, guess } = tooltipData;

    if (!formula || !hatColors || hatColors.length !== 10) return null;

    try {
      // Create substituted formula
      let substitutedFormula = formula;

      // Replace 'i' with the person's NUMBER (not their guess)
      substitutedFormula = substitutedFormula.replace(
        /\bi\b/g,
        personNumber.toString()
      );

      const visibleHats = hatColors.filter(
        (_, index) => index !== personNumber
      );
      const allSum = visibleHats.reduce((sum, color) => sum + color, 0);
      substitutedFormula = substitutedFormula.replace(
        /\ball\b/g,
        allSum.toString()
      );

      substitutedFormula = substitutedFormula.replace(
        /l\[(\d+)\]/g,
        (match, position) => {
          const pos = parseInt(position);
          const targetPersonIndex = (personNumber + pos) % 10;
          return hatColors[targetPersonIndex].toString();
        }
      );

      substitutedFormula = substitutedFormula.replace(
        /r\[(\d+)\]/g,
        (match, position) => {
          const pos = parseInt(position);
          const targetPersonIndex = (personNumber - pos + 10) % 10;
          return hatColors[targetPersonIndex].toString();
        }
      );

      // Replace BOTH 'x' and '×' with '*' BEFORE evaluation
      const processedFormula = substitutedFormula.replace(/[x×]/g, "*");

      // Create animated formula
      let animatedFormula = formula;

      if (animationToggle) {
        // Show values - replace 'i' with person number
        animatedFormula = animatedFormula.replace(
          /\bi\b/g,
          personNumber.toString()
        );
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
        // Also replace both 'x' and '×' with '*' in animated formula for display consistency
        animatedFormula = animatedFormula.replace(/[x×]/g, "*");
      }

      console.log(`Original formula: ${formula}`);
      console.log(`Substituted formula: ${substitutedFormula}`);
      console.log(`Processed formula: ${processedFormula}`);

      const calculatedValue = new Function(
        `"use strict"; return (${processedFormula})`
      )();
      const finalResult = ((calculatedValue % 10) + 10) % 10;

      return {
        animatedFormula,
        calculatedValue,
        finalResult: Math.floor(finalResult),
      };
    } catch (error) {
      console.error("Error generating calculation:", error);
      console.error("Failed at formula processing");
      return null;
    }
  };

  const calculation = generateCalculationSteps();

  if (!calculation) return null;

  const { x, y, personNumber } = tooltipData;

  return (
    <g>
      {/* Tooltip background - centered at (0, 0) */}
      <rect
        x={x - 150}
        y={y - 60}
        width="300"
        height="90"
        fill="rgba(0, 0, 0, 0.95)"
        stroke="#fff"
        strokeWidth="2"
        rx="5"
        ry="5"
      />

      {/* Tooltip title */}
      <text
        x={x}
        y={y - 40}
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
        y={y - 20}
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
        y={y}
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
        y={y + 20}
        textAnchor="middle"
        fontSize="11"
        fontFamily="monospace"
        fill="#FFA500"
      >
        {calculation.calculatedValue} mod 10 = {calculation.finalResult}
      </text>
    </g>
  );
};

export default GroupComponent;
