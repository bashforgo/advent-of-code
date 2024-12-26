import { minBy } from "@std/collections";
import { dijkstras, GetWeight } from "@utilities/dijkstras.ts";
import { getInput } from "@utilities/getInput.ts";
import {
  Direction,
  perpendicularDirections,
} from "@utilities/grid/Direction.ts";
import { getAdjacentPoint } from "@utilities/grid/getAdjacentPoint.ts";
import { getManhattanDistance } from "@utilities/grid/getManhattanDistance.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { isSamePoint } from "@utilities/grid/isSamePoint.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { printBraille } from "@utilities/grid/printBraille.ts";
import { ObjectMap } from "@utilities/ObjectMap.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";
import { throw_ } from "@utilities/throw.ts";

const DEBUG = false;
const input = DEBUG
  ? [
    `\
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
`,
    `\
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
`,
  ][1]
  : await getInput(2024, 16);

const lines = input.trim().split("\n");

enum Tile {
  Wall = "#",
  Empty = ".",
}

const map: Grid<Tile> = lines.map((line) =>
  line.split("").map((c) => {
    switch (c) {
      case "#":
        return Tile.Wall;
      default:
        return Tile.Empty;
    }
  })
);

printBraille(map, (tile) => tile === Tile.Wall);

const start = (() => {
  const y = lines.findIndex((line) => line.includes("S"));
  return point(lines[y].indexOf("S"), y);
})();
const end = (() => {
  const y = lines.findIndex((line) => line.includes("E"));
  return point(lines[y].indexOf("E"), y);
})();

interface State {
  readonly point: Point;
  readonly direction: Direction;
}

const maze = new ObjectMap<State, ObjectSet<State>>();
const open = ObjectSet.from<State>([{
  point: start,
  direction: Direction.East,
}]);

while (open.size > 0) {
  const [previousState] = Array.from(Iterator.from(open).take(1));
  open.delete(previousState);
  maze.set(previousState, new ObjectSet<State>());

  let currentLocation = previousState.point;
  const currentDirection = previousState.direction;

  while (true) {
    const turns = perpendicularDirections[currentDirection].filter((turn) => {
      const nextLocation = getAdjacentPoint(currentLocation, turn);
      const nextTile = getPoint(map, nextLocation);
      return nextTile === Tile.Empty;
    });
    for (const turn of turns) {
      const state = { point: currentLocation, direction: turn };
      if (maze.has(state)) continue;
      maze.get(previousState)!.add(state);
      open.add(state);
    }

    const nextLocation = getAdjacentPoint(currentLocation, currentDirection);
    const nextTile = getPoint(map, nextLocation);

    if (nextTile === Tile.Wall) {
      const state = { point: currentLocation, direction: currentDirection };
      if (!isSamePoint(currentLocation, previousState.point)) {
        maze.get(previousState)!.add(state);
      }
      if (!maze.has(state)) open.add(state);
      break;
    }

    currentLocation = nextLocation;
  }
}

interface State {
  readonly point: Point;
  readonly direction: Direction;
}

const getWeight: GetWeight<State> = (a, b) =>
  (a.direction === b.direction ? 0 : 1000) +
  getManhattanDistance(a.point, b.point);

const { distances, previous } = dijkstras<State>(
  { point: start, direction: Direction.East },
  (state) => Array.from(maze.get(state)!),
  getWeight,
);

const [endState, cost] = minBy(
  Iterator.from(distances).filter(([state]) => isSamePoint(state.point, end)),
  ([, distance]) => distance,
) ?? throw_("No path found");

console.log(cost);

const reconstructPaths = function* (
  state: State,
): Generator<State[]> {
  const previousStates = previous.get(state);

  if (previousStates == null) {
    yield [state];
    return;
  }

  for (const previousState of previousStates) {
    for (const path of reconstructPaths(previousState)) {
      yield [...path, state];
    }
  }
};

const paths = Array.from(reconstructPaths(endState));

const pathToPoints = function* ([first, ...path]: State[]) {
  let currentLocation = first.point;
  let currentDirection = first.direction;

  yield currentLocation;

  for (const targetState of path) {
    while (!isSamePoint(currentLocation, targetState.point)) {
      currentLocation = getAdjacentPoint(currentLocation, currentDirection);
      yield currentLocation;
    }
    currentDirection = targetState.direction;
  }
};

const pointsOnAnyPath = ObjectSet.from(
  Iterator.from(paths).flatMap((ps) => pathToPoints(ps)),
);
console.log(pointsOnAnyPath.size);
