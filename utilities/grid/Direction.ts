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
