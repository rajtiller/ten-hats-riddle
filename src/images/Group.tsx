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
  formula?: string;
  hatColorNumbers?: number[];
  isTwoHatsRiddle?: boolean;
}

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
  isTwoHatsRiddle: boolean;

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
    isTwoHatsRiddle = false,
  }: GroupProps = {}) {
    this.numberOfPeople = numberOfPeople;
    this.radius = Math.max(1, Math.min(10, radius));
    this.isTwoHatsRiddle = isTwoHatsRiddle;

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

    switch (highlight.type) {
      case "current":
        return personIndex === currentPersonIndex;
      case "all":
        return personIndex !== currentPersonIndex;
      case "other":
        // For two hats riddle, "other" means the other person
        return this.numberOfPeople === 2 && personIndex !== currentPersonIndex;
      case "left":
        return (
          (personIndex - currentPersonIndex) % this.numberOfPeople ===
          highlight.position
        );

      case "right":
        return (
          (-personIndex + currentPersonIndex + 10) % this.numberOfPeople ===
          highlight.position
        );
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
    const sizeScale = this.numberOfPeople === 2 ? 1.5 : 1.13; // Larger for 2 people

    if (this.numberOfPeople === 2) {
      // Special layout for 2 people - vertical arrangement with more space
      const spacing = 175 * sizeScale; // Increased from 150 to 200

      for (let i = 0; i < 2; i++) {
        const x = 0; // Both centered horizontally
        // Swap positions: person 1 (other) at top, person 0 (current) at bottom
        const y = i === 1 ? -spacing / 2 : spacing / 2; // Swapped positions

        const isCurrentPerson = i === currentPersonIndex;
        const isHighlighted = this.shouldHighlightPerson(
          i,
          currentPersonIndex,
          personHighlight
        );

        // Swap hat assignments too
        const hatColor =
          hatColors[i] || (i === 1 ? "half-black-white" : "#d3d3d3");

        // Show "other" label only for the other person and only during input state
        const showOtherLabel = i === 1 && showIndexLabels && !showPersonNumbers;

        const person = new Person({
          x,
          y,
          angle: 0,
          personNumber: i,
          showPersonNumber: showPersonNumbers,
          hatColor: hatColor,
          isCurrentPerson: isCurrentPerson,
          leftPosition: 0,
          rightPosition: 0,
          isLeftSide: true,
          isHighlighted: isHighlighted,
          showIndexLabels: showIndexLabels,
          showAsUnknown: isCurrentPerson && showCurrentPersonAsUnknown,
          guess: personGuesses.length > i ? personGuesses[i] : undefined,
          formula: formula,
          hatColors: hatColorNumbers,
          sizeScale: sizeScale,
          showOtherLabel: showOtherLabel, // Pass the showOtherLabel flag
        });

        people.push(person);
      }
    } else {
      // Original circular layout for 10+ people
      const angleStep = (2 * Math.PI) / this.numberOfPeople;

      for (let i = 0; i < this.numberOfPeople; i++) {
        const adjustedIndex =
          (i - currentPersonIndex + this.numberOfPeople) % this.numberOfPeople;

        const angle = Math.PI / 2 + adjustedIndex * angleStep;
        const scaledRadius = this.radius * 20 * sizeScale;
        const x = scaledRadius * Math.cos(angle);
        const y =
          scaledRadius * Math.sin(angle) -
          (i > 2 && i < 8 ? 15 * sizeScale : 0) -
          20;

        const isCurrentPerson = i === currentPersonIndex;
        const isHighlighted = this.shouldHighlightPerson(
          i,
          currentPersonIndex,
          personHighlight
        );

        const hatColor = hatColors[i] || "#ff0000";

        let leftPosition = 0;
        let rightPosition = 0;
        let isLeftSide = true;

        if (!isCurrentPerson) {
          const relativePosition =
            (i - currentPersonIndex + this.numberOfPeople) %
            this.numberOfPeople;

          if (relativePosition <= 5) {
            leftPosition = relativePosition;
            isLeftSide = true;
          } else {
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
          sizeScale: sizeScale,
          showOtherLabel: false, // No "other" label for 10-hat version
        });

        people.push(person);
      }
    }

    return people;
  }

  render(): JSX.Element {
    return (
      <g>
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
              person.sizeScale,
              person.leftPosition,
              person.rightPosition,
              person.isLeftSide,
              person.showOtherLabel
            )}
            {person.showPersonNumber
              ? person.renderPersonNumber()
              : person.renderIndexLabel()}
            {person.renderPersonLabel()}
            {person.renderGuessWithoutTooltip()}
          </g>
        ))}
      </g>
    );
  }
}

const GroupComponent: React.FC<GroupProps> = (props = {}) => {
  const [activeTooltip, setActiveTooltip] = useState<TooltipData | null>(null);

  const group = new Group(props);
  const padding = 80;

  let canvasHeight, canvasWidth, viewBox;

  if (group.numberOfPeople === 2) {
    // Canvas for 2 people - vertical arrangement
    canvasWidth = 400;
    canvasHeight = 500;
    viewBox = `-200 -200 400 400`;
  } else {
    // Original canvas size for 10+ people
    const scaledRadius = group.radius * 20;
    canvasHeight = (scaledRadius + padding) * 2 + 40;
    canvasWidth = (scaledRadius + padding) * 2 + 140;
    const extraTopSpace = 60;
    const shiftUp = -4;
    viewBox = `-${canvasHeight / 2} -${
      canvasHeight / 2 + extraTopSpace + shiftUp
    } ${canvasHeight} ${canvasHeight + extraTopSpace}`;
  }

  return (
    <div style={{ position: "relative" }}>
      <svg width={canvasWidth} height={canvasHeight} viewBox={viewBox}>
        {group.render()}

        {group.people.map((person, index) => {
          if (person.guess === undefined || person.guess === -1) return null;

          // For two hats riddle, position guess boxes above the heads
          let guessX, guessY;
          if (group.numberOfPeople === 2) {
            guessX = person.x; // Center above head
            guessY = person.y - 80; // Position above head
          } else {
            guessX = person.x;
            guessY = person.y - 63; // Original position for 10 hat version
          }

          const guessColor = person.getGuessColor(person.guess);
          const textColor = person.getTextColor(guessColor);

          return (
            <g key={`top-guess-${index}`}>
              <circle
                cx={guessX}
                cy={guessY - 6}
                r="14"
                fill={guessColor}
                stroke="#333"
                strokeWidth="2.1"
                opacity="0.9"
                onMouseEnter={() =>
                  setActiveTooltip({
                    x: 0,
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
                x={guessX}
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
    const { formula, hatColors, personNumber } = tooltipData;

    if (!formula || !hatColors) return null;

    try {
      let substitutedFormula = formula;

      // Replace 'i' with person number
      substitutedFormula = substitutedFormula.replace(
        /\bi\b/g,
        personNumber.toString()
      );

      // Handle different riddle types
      if (hatColors.length === 2) {
        // Two hats riddle - handle "other"
        const otherPersonIndex = personNumber === 0 ? 1 : 0;
        substitutedFormula = substitutedFormula.replace(
          /\bother\b/g,
          hatColors[otherPersonIndex].toString()
        );
      } else if (hatColors.length === 10) {
        // Ten hats riddle - handle "all", "l[n]", "r[n]"

        // Calculate visible hat colors (excluding current person)
        const visibleHatColors = hatColors.filter(
          (_, index) => index !== personNumber
        );
        const allSum = visibleHatColors.reduce((sum, color) => sum + color, 0);

        // Replace 'all' with sum of visible hat colors
        substitutedFormula = substitutedFormula.replace(
          /\ball\b/g,
          allSum.toString()
        );

        // Replace l[n] patterns
        substitutedFormula = substitutedFormula.replace(
          /l\[(\d+)\]/g,
          (_, position) => {
            const pos = parseInt(position);
            if (pos < 1 || pos > 9) return "0";

            // Calculate which person this refers to relative to personNumber
            const targetPersonIndex = (personNumber + pos) % 10;

            if (
              targetPersonIndex >= 0 &&
              targetPersonIndex < hatColors.length
            ) {
              return hatColors[targetPersonIndex].toString();
            }
            return "0";
          }
        );

        // Replace r[n] patterns
        substitutedFormula = substitutedFormula.replace(
          /r\[(\d+)\]/g,
          (_, position) => {
            const pos = parseInt(position);
            if (pos < 1 || pos > 9) return "0";

            // Calculate which person this refers to relative to personNumber
            const targetPersonIndex = (personNumber - pos + 10) % 10;

            if (
              targetPersonIndex >= 0 &&
              targetPersonIndex < hatColors.length
            ) {
              return hatColors[targetPersonIndex].toString();
            }
            return "0";
          }
        );
      }

      // Create animated formula
      let animatedFormula = formula;

      if (animationToggle) {
        // Apply same substitutions for animation
        animatedFormula = animatedFormula.replace(
          /\bi\b/g,
          personNumber.toString()
        );

        if (hatColors.length === 2) {
          const otherPersonIndex = personNumber === 0 ? 1 : 0;
          animatedFormula = animatedFormula.replace(
            /\bother\b/g,
            hatColors[otherPersonIndex].toString()
          );
        } else if (hatColors.length === 10) {
          const visibleHatColors = hatColors.filter(
            (_, index) => index !== personNumber
          );
          const allSum = visibleHatColors.reduce(
            (sum, color) => sum + color,
            0
          );

          animatedFormula = animatedFormula.replace(
            /\ball\b/g,
            allSum.toString()
          );

          animatedFormula = animatedFormula.replace(
            /l\[(\d+)\]/g,
            (_, position) => {
              const pos = parseInt(position);
              if (pos < 1 || pos > 9) return "0";
              const targetPersonIndex = (personNumber + pos) % 10;
              if (
                targetPersonIndex >= 0 &&
                targetPersonIndex < hatColors.length
              ) {
                return hatColors[targetPersonIndex].toString();
              }
              return "0";
            }
          );

          animatedFormula = animatedFormula.replace(
            /r\[(\d+)\]/g,
            (_, position) => {
              const pos = parseInt(position);
              if (pos < 1 || pos > 9) return "0";
              const targetPersonIndex = (personNumber - pos + 10) % 10;
              if (
                targetPersonIndex >= 0 &&
                targetPersonIndex < hatColors.length
              ) {
                return hatColors[targetPersonIndex].toString();
              }
              return "0";
            }
          );
        }
      }

      // Evaluate the processed formula
      const processedFormula = substitutedFormula.replace(/[×]/g, "*");
      const calculatedValue = new Function(
        `"use strict"; return (${processedFormula})`
      )();

      // Apply correct modulo based on riddle type
      const modValue = hatColors.length === 2 ? 2 : 10;
      const finalResult = ((calculatedValue % modValue) + modValue) % modValue;

      return {
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

  if (!calculation) return null;

  const { x, y, personNumber } = tooltipData;

  // Determine modulo text based on riddle type
  const modText = tooltipData.hatColors?.length === 2 ? "mod 2" : "mod 10";

  return (
    <g>
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

      <text
        x={x}
        y={y + 20}
        textAnchor="middle"
        fontSize="11"
        fontFamily="monospace"
        fill="#FFA500"
      >
        {calculation.calculatedValue} {modText} = {calculation.finalResult}
      </text>
    </g>
  );
};

export default GroupComponent;
