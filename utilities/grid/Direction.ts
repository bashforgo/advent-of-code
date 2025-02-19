export enum Direction {
  North = "North",
  East = "East",
  South = "South",
  West = "West",
}

export const directions = [
  Direction.North,
  Direction.East,
  Direction.South,
  Direction.West,
] as const;

export const perpendicularDirections = {
  [Direction.North]: [Direction.West, Direction.East],
  [Direction.East]: [Direction.North, Direction.South],
  [Direction.South]: [Direction.East, Direction.West],
  [Direction.West]: [Direction.South, Direction.North],
} as const;

export const getNextDirectionClockwise = (direction: Direction) => {
  const [, clockwise] = perpendicularDirections[direction];
  return clockwise;
};

export const getNextDirectionCounterClockwise = (direction: Direction) => {
  const [counterClockwise] = perpendicularDirections[direction];
  return counterClockwise;
};

export const _8Directions = [
  [Direction.North],
  [Direction.North, Direction.East],
  [Direction.East],
  [Direction.South, Direction.East],
  [Direction.South],
  [Direction.South, Direction.West],
  [Direction.West],
  [Direction.North, Direction.West],
] as [d: Direction, d2?: Direction][];
