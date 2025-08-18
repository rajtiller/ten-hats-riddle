import React, { type JSX } from "react";
import { Person } from "./Person";

interface GroupProps {
  numberOfPeople?: number;
  people?: Person[];
  radius?: number;
}

class Group {
  numberOfPeople: number;
  people: Person[];
  radius: number;

  constructor({ numberOfPeople = 5, people, radius = 5 }: GroupProps = {}) {
    this.numberOfPeople = numberOfPeople;
    this.radius = Math.max(1, Math.min(10, radius)); // Clamp between 1 and 10
    this.people = people || this.createPeople();
  }

  private createPeople(): Person[] {
    const people: Person[] = [];
    const angleStep = (2 * Math.PI) / this.numberOfPeople;

    for (let i = 0.5; i < this.numberOfPeople+1; i++) {
      const angle = i * angleStep;
      // Use default radius and center from Person class
      const defaultPerson = new Person();
      // Scale the radius (multiply by 20 to convert to reasonable pixel spacing)
      const scaledRadius = this.radius * 20;
      const x = defaultPerson.centerX + scaledRadius * Math.cos(angle);
      const y = defaultPerson.centerY + scaledRadius * Math.sin(angle);

      // Keep angle at 0 so heads are always horizontal
      const person = new Person({
        x,
        y,
        angle: 0,
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

// React component wrapper
const GroupComponent: React.FC<GroupProps> = (props = {}) => {
  const group = new Group(props);

  // Calculate SVG dimensions based on the actual radius used
  const padding = 80; // Extra padding for hats and shoulders
  const scaledRadius = group.radius * 20; // Same scaling as used in createPeople
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
