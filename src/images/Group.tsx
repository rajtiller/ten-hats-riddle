import React, { type JSX } from "react";
import { Person } from "./Person";

interface GroupProps {
  numberOfPeople?: number;
  people?: Person[];
  radius?: number;
  hatColors?: string[];
  showPersonNumbers?: boolean;
  currentPersonIndex?: number; // New prop to specify which person is current
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
    currentPersonIndex = 0, // Default to person 0 being current
  }: GroupProps = {}) {
    this.numberOfPeople = numberOfPeople;
    this.radius = Math.max(1, Math.min(10, radius));
    this.people =
      people ||
      this.createPeople(hatColors, showPersonNumbers, currentPersonIndex);
  }

  private createPeople(
    hatColors: string[],
    showPersonNumbers: boolean,
    currentPersonIndex: number
  ): Person[] {
    const people: Person[] = [];
    const angleStep = (2 * Math.PI) / this.numberOfPeople;

    for (let i = 0; i < this.numberOfPeople; i++) {
      // Arrange people so that person at currentPersonIndex is at the bottom
      // Bottom position is at angle π/2 (90 degrees) in standard coordinates
      // but we want to offset so currentPersonIndex person is at bottom
      const adjustedIndex =
        (i - currentPersonIndex + this.numberOfPeople) % this.numberOfPeople;

      // Start from bottom (π/2) and go clockwise
      const angle = Math.PI / 2 + adjustedIndex * angleStep;
      const scaledRadius = this.radius * 20;
      const x = scaledRadius * Math.cos(angle);
      const y = scaledRadius * Math.sin(angle);

      const isCurrentPerson = i === currentPersonIndex;

      // Use light gray for current person, provided colors for others
      let hatColor;
      if (isCurrentPerson) {
        hatColor = "#d3d3d3"; // Light gray for current person
      } else {
        hatColor = hatColors[i] || "#ff0000";
      }

      // Calculate left position relative to current person
      // l[1] is the person to the immediate left of current person (counter-clockwise)
      let leftPosition = 1;
      if (!isCurrentPerson) {
        // Calculate relative position from current person's perspective
        // In a circle going clockwise, "left" means counter-clockwise from current person
        const relativePosition =
          (i - currentPersonIndex + this.numberOfPeople) % this.numberOfPeople;
        leftPosition = relativePosition;

        // Adjust so position 0 (current person) doesn't get a label
        // and others get sequential numbering starting from 1
        if (relativePosition === 0) {
          leftPosition = this.numberOfPeople; // This shouldn't happen for non-current person
        }
      }

      const person = new Person({
        x,
        y,
        angle: 0,
        personNumber: i, // Keep original numbering for results display
        showPersonNumber: showPersonNumbers,
        hatColor: hatColor,
        isCurrentPerson: isCurrentPerson,
        leftPosition: leftPosition,
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
