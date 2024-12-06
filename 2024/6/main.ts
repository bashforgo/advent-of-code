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

const walk = () => {
  let location = initialGuardLocation;
  let direction = Direction.North as Direction;
  const path = new Set<string>();

  const isWithinBounds = ({ x, y }: Point): boolean =>
    y >= 0 && y < map.length && x >= 0 && x < map[0].length;
  while (isWithinBounds(location)) {
    const nextLocation = (() => {
      switch (direction) {
        case Direction.North:
          return { x: location.x, y: location.y - 1 };
        case Direction.East:
          return { x: location.x + 1, y: location.y };
        case Direction.South:
          return { x: location.x, y: location.y + 1 };
        case Direction.West:
          return { x: location.x - 1, y: location.y };
      }
    })();

    const isObstacle = (point: Point): boolean =>
      map[point.y]?.[point.x] === Tile.Obstacle;
    if (isObstacle(nextLocation)) {
      const nextDirection = (() => {
        switch (direction) {
          case Direction.North:
            return Direction.East;
          case Direction.East:
            return Direction.South;
          case Direction.South:
            return Direction.West;
          case Direction.West:
            return Direction.North;
        }
      })();
      direction = nextDirection;
    } else {
      location = nextLocation;
      const key = `${direction} ${location.x},${location.y}`;
      const isLoop = path.has(key);
      if (isLoop) return [true, path] as const;
      path.add(key);
    }
  }

  return [false, path] as const;
};

const [, path] = walk();
console.log(
  new Set(Array.from(path).map((key) => key.slice(2))).size,
);

const loopOpportunities = new Set<string>();
for (const key of path) {
  const [x, y] = key.slice(2).split(",").map(Number);
  const tileBefore = map[y]?.[x];
  map[y][x] = Tile.Obstacle;
  const [isLoop] = walk();
  if (isLoop) loopOpportunities.add(`${x},${y}`);
  map[y][x] = tileBefore;
}
console.log(loopOpportunities.size);
