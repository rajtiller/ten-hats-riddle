import React, { type JSX } from "react";
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
  showIndexLabels?: boolean; // New prop for showing index labels
}

class Group {
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
        showIndexLabels
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
          // Calculate the person's position relative to current person
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
          // Calculate the person's position relative to current person (right side)
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
    showIndexLabels: boolean = false
  ): Person[] {
    const people: Person[] = [];
    const angleStep = (2 * Math.PI) / this.numberOfPeople;

    for (let i = 0; i < this.numberOfPeople; i++) {
      // Arrange people so that person at currentPersonIndex is at the bottom
      const adjustedIndex =
        (i - currentPersonIndex + this.numberOfPeople) % this.numberOfPeople;

      // Start from bottom (π/2) and go clockwise
      const angle = Math.PI / 2 + adjustedIndex * angleStep;
      const scaledRadius = this.radius * 20;
      const x = scaledRadius * Math.cos(angle);
      const y = scaledRadius * Math.sin(angle);

      const isCurrentPerson = i === currentPersonIndex;
      const isHighlighted = this.shouldHighlightPerson(
        i,
        currentPersonIndex,
        personHighlight
      );

      console.log(
        `Person ${i}: isCurrentPerson=${isCurrentPerson}, isHighlighted=${isHighlighted}`
      );

      // Use light gray for current person, provided colors for others
      let hatColor;
      if (isCurrentPerson) {
        hatColor = "#d3d3d3"; // Light gray for current person
      } else {
        hatColor = hatColors[i] || "#ff0000";
      }

      // Calculate left position relative to current person
      let leftPosition = 1;
      if (!isCurrentPerson) {
        const relativePosition =
          (i - currentPersonIndex + this.numberOfPeople) % this.numberOfPeople;
        leftPosition = relativePosition;

        if (relativePosition === 0) {
          leftPosition = this.numberOfPeople;
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
        leftPosition: leftPosition,
        isHighlighted: isHighlighted,
        showIndexLabels: showIndexLabels,
      });

      people.push(person);
    }

    return people;
  }

  render(): JSX.Element {
    return (
      <g>
        {this.people.map((person, index) => (
          <g key={index}>{person.render()}</g>
        ))}
      </g>
    );
  }
}

const GroupComponent: React.FC<GroupProps> = (props = {}) => {
  console.log("GroupComponent props:", props);

  const group = new Group(props);
  const padding = 80;
  const scaledRadius = group.radius * 20;
  const canvasSize = (scaledRadius + padding) * 2;
  const viewBox = `-${canvasSize / 2} -${
    canvasSize / 2
  } ${canvasSize} ${canvasSize}`;

  return (
    <svg width={canvasSize} height={canvasSize} viewBox={viewBox}>
      {group.render()}
    </svg>
  );
};

export default GroupComponent;
export { Group };
