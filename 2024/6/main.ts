import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`
  : await getInput(6);

enum Tile {
  Obstacle = "#",
  Empty = ".",
}

enum Direction {
  North = "^",
  East = ">",
  South = "v",
  West = "<",
}

interface Point {
  readonly x: number;
  readonly y: number;
}

const lines = input.trim().split("\n");
const map = lines.map((line) =>
  line.split("").map((char) =>
    char === Tile.Obstacle ? Tile.Obstacle : Tile.Empty
  )
);
const initialGuardLocation = ((): Point => {
  const y = lines.findIndex((line) => line.includes(Direction.North));
  const x = lines[y].indexOf(Direction.North);
  return { x, y };
})();

class Guard {
  constructor(
    public readonly location: Point,
    public readonly direction: Direction,
  ) {}

  getNextLocation(): Point {
    switch (this.direction) {
      case Direction.North:
        return { x: this.location.x, y: this.location.y - 1 };
      case Direction.East:
        return { x: this.location.x + 1, y: this.location.y };
      case Direction.South:
        return { x: this.location.x, y: this.location.y + 1 };
      case Direction.West:
        return { x: this.location.x - 1, y: this.location.y };
    }
  }

  getNextDirection(): Direction {
    switch (this.direction) {
      case Direction.North:
        return Direction.East;
      case Direction.East:
        return Direction.South;
      case Direction.South:
        return Direction.West;
      case Direction.West:
        return Direction.North;
    }
  }

  hasLeftMap(): boolean {
    const { x, y } = this.location;
    return x < 0 || y < 0 || x >= map[0].length || y >= map.length;
  }

  step(): void {
    const nextLocation = this.getNextLocation();
    const isObstacle = map[nextLocation.y]?.[nextLocation.x] === Tile.Obstacle;
    if (isObstacle) {
      Object.assign(this, { direction: this.getNextDirection() });
      this.step();
    } else {
      Object.assign(this, { location: nextLocation });
    }
  }
}

const guard = new Guard(initialGuardLocation, Direction.North);

class LocationSet {
  #set = new Set<string>();

  add(value: Point): this {
    this.#set.add(`${value.x},${value.y}`);
    return this;
  }

  has(value: Point): boolean {
    return this.#set.has(`${value.x},${value.y}`);
  }

  size(): number {
    return this.#set.size;
  }
}

const visited = new LocationSet();

while (!guard.hasLeftMap()) {
  visited.add(guard.location);
  guard.step();
}

console.log(visited.size());
