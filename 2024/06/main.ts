import { getInput } from "@utilities/getInput.ts";
import {
  Direction,
  getNextDirectionClockwise,
} from "@utilities/grid/Direction.ts";
import { getAdjacentPoint } from "@utilities/grid/getAdjacentPoint.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { isInBounds } from "@utilities/grid/isInBounds.ts";
import { isSamePoint } from "@utilities/grid/isSamePoint.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";

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
  : await getInput(2024, 6);

enum Tile {
  Empty = ".",
  Obstacle = "#",
}

const parseMap = () => {
  const lines = input.trim().split("\n");
  const map: Grid<Tile> = lines.map((row) =>
    row.split("").map((c) => {
      switch (c) {
        case "#":
          return Tile.Obstacle;
        default:
          return Tile.Empty;
      }
    })
  );
  const robotY = lines.findIndex((line) => line.includes("^"));
  const robotX = lines[robotY].indexOf("^");
  return { map, robot: point(robotX, robotY) };
};

const { map, robot } = parseMap();

const walk = (map: Grid<Tile>, robot: Point) => {
  const getNextTurn = (
    robot: Point,
    direction: Direction,
  ): [isTurn: boolean, turnPoint: Point] => {
    let position = robot;
    while (true) {
      const next = getAdjacentPoint(position, direction);
      if (!isInBounds(map, next)) {
        return [false, position];
      } else if (getPoint(map, next) === Tile.Empty) {
        position = next;
      } else {
        return [true, position];
      }
    }
  };

  const path = new ObjectSet<{ direction: Direction; position: Point }>();

  let direction = Direction.North;
  let position = robot;
  let isLoop = false;
  path.add({ direction, position });

  while (true) {
    const [isTurn, turnPoint] = getNextTurn(position, direction);

    position = turnPoint;
    direction = isTurn ? getNextDirectionClockwise(direction) : direction;

    isLoop = path.has({ direction, position });
    if (isLoop) break;

    path.add({ direction, position });

    if (!isTurn) break;
  }

  const steps = function* () {
    const iterator = Iterator.from(path);
    let { position, direction } = iterator.next().value!;

    yield position;

    for (const next of iterator) {
      while (!isSamePoint(position, next.position)) {
        position = getAdjacentPoint(position, direction);
        yield position;
      }
      direction = next.direction;
    }
  };

  return [steps, isLoop] as const;
};

// deno-lint-ignore no-unused-vars
const printMap = (map: Grid<Tile>, robot: Point) => {
  const lines = map.map((row, y) =>
    row.map((tile, x) => isSamePoint(robot, point(x, y)) ? "@" : tile)
  );
  console.log(lines.map((line) => line.join("")).join("\n"));
};

const [steps] = walk(map, robot);
const uniquePoints = ObjectSet.from(steps());
console.log(uniquePoints.size);

const loopOpportunities = new ObjectSet<Point>();
for (const step of steps()) {
  if (isSamePoint(step, robot)) continue;
  if (loopOpportunities.has(step)) continue;

  map[step.y][step.x] = Tile.Obstacle;
  const [, isLoop] = walk(map, robot);
  if (isLoop) loopOpportunities.add(step);
  map[step.y][step.x] = Tile.Empty;
}
console.log(loopOpportunities.size);
