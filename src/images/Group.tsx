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
    this.radius = Math.max(1, Math.min(10, radius));
    this.people = people || this.createPeople();
  }

  private createPeople(): Person[] {
    const people: Person[] = [];
    const angleStep = (2 * Math.PI) / this.numberOfPeople;

    for (let i = 0; i < this.numberOfPeople; i++) {
      // Start from bottom (person 0) and go clockwise
      const angle = (i + 0.5) * angleStep;
      const scaledRadius = this.radius * 20;
      const x = scaledRadius * Math.cos(angle);
      const y = scaledRadius * Math.sin(angle);

      const person = new Person({
        x,
        y,
        angle: 0,
        personNumber: (i+8) % 10,
        showPersonNumber: true,
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
