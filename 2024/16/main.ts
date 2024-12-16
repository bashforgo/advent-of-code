import { minBy } from "@std/collections/min-by";
import { getInput } from "@utilities/getInput.ts";
import {
  Direction,
  perpendicularDirections,
} from "@utilities/grid/Direction.ts";
import { getAdjacentPoint } from "@utilities/grid/getAdjacentPoint.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { isSamePoint } from "@utilities/grid/isSamePoint.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { ObjectMap } from "@utilities/ObjectMap.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";

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
  : await getInput(16);

const lines = input.trim().split("\n");

enum Tile {
  Wall = "#",
  Empty = ".",
  Start = "S",
  End = "E",
}

const map: Grid<Tile> = lines.map((line) => line.split("") as Tile[]);
const start = (() => {
  const y = map.findIndex((row) => row.includes(Tile.Start));
  return point(map[y].indexOf(Tile.Start), y);
})();
const end = (() => {
  const y = map.findIndex((row) => row.includes(Tile.End));
  return point(map[y].indexOf(Tile.End), y);
})();

const distance = (a: Point, b: Point) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

interface State {
  point: Point;
  direction: Direction;
}

const aStar = (
  start: State,
  goal: Point,
  getNeighbors: (state: State) => { state: State; cost: number }[],
  heuristic = ({ point }: State) => distance(point, goal),
) => {
  const open = new ObjectSet<State>();
  open.add(start);

  const closed = new ObjectSet<State>();

  const costFromStart = new ObjectMap<State, number>();
  costFromStart.set(start, 0);

  const estimatedTotalCost = new ObjectMap<State, number>();
  estimatedTotalCost.set(start, heuristic(start));

  const cameFrom = new ObjectMap<State, State[]>();

  let optimalCost = Infinity;
  let optimalGoalStates = new ObjectSet<State>();

  while (open.size > 0) {
    const current = minBy(open, (point) => estimatedTotalCost.get(point)!)!;
    open.delete(current);

    if (isSamePoint(current.point, goal)) {
      const cost = costFromStart.get(current)!;

      if (cost < optimalCost) {
        optimalCost = cost;
        optimalGoalStates = new ObjectSet();
        optimalGoalStates.add(current);
      } else if (cost === optimalCost) {
        optimalGoalStates.add(current);
      }

      continue;
    }

    closed.add(current);

    const neighbors = getNeighbors(current);
    for (const { state: neighbor, cost } of neighbors) {
      const score = costFromStart.get(current)! + cost;
      const neighborCost = costFromStart.get(neighbor) ?? Infinity;

      if (closed.has(neighbor) && score > neighborCost) continue;

      if (score < neighborCost) {
        open.add(neighbor);
        cameFrom.set(neighbor, [current]);
        costFromStart.set(neighbor, score);
        estimatedTotalCost.set(neighbor, score + heuristic(neighbor));
      } else if (score === neighborCost) {
        cameFrom.get(neighbor)!.push(current);
      }
    }
  }

  const paths = [] as State[][];

  const reconstructPath = (state: State, path: State[] = []) => {
    path.unshift(state);
    const previousStates = cameFrom.get(state);
    if (previousStates == null) {
      paths.push(path);
    } else {
      for (const previousState of previousStates) {
        reconstructPath(previousState, path);
      }
    }
  };

  for (const goalState of optimalGoalStates) {
    reconstructPath(goalState);
  }

  return paths;
};

const paths = aStar(
  { point: start, direction: Direction.East },
  end,
  ({ point, direction }) => {
    const adjacent = getAdjacentPoint(point, direction);
    const adjacentTile = getPoint(map, adjacent);
    return [
      ...adjacentTile !== Tile.Wall
        ? [{ state: { point: adjacent, direction }, cost: 1 }]
        : [],
      ...perpendicularDirections[direction].map((newDirection) => ({
        state: { point, direction: newDirection },
        cost: 1000,
      })),
    ];
  },
);

const points = new ObjectSet<Point>();
for (const path of paths) {
  for (const { point } of path) {
    points.add(point);
  }
}
console.log(points.size);
