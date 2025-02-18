import { memoize } from "@std/cache";
import { minOf, slidingWindows, sumOf } from "@std/collections";
import { aStar } from "@utilities/aStar.ts";
import { getInput } from "@utilities/getInput.ts";
import { findPosition } from "@utilities/grid/findPosition.ts";
import { getAdjacentPoints } from "@utilities/grid/getAdjacentPoints.ts";
import { getManhattanDistance } from "@utilities/grid/getManhattanDistance.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { gridEntries } from "@utilities/grid/gridEntries.ts";
import { isSamePoint } from "@utilities/grid/isSamePoint.ts";
import { mapGrid } from "@utilities/grid/mapGrid.ts";
import { Point } from "@utilities/grid/Point.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
###########
#0.1.....2#
#.#######.#
#4.......3#
###########
`
  : await getInput(2016, 24);

const lines = input.trim().split("\n");

const rawGrid: Grid<string> = lines.map((line) => line.split(""));

enum Tile {
  Wall = "#",
  Passage = " ",
}

const grid: Grid<Tile> = mapGrid(
  rawGrid,
  (char) => char === "#" ? Tile.Wall : Tile.Passage,
);

const startPosition = findPosition(rawGrid, (char) => char === "0")!;
const exposedWirePositions = ObjectSet.from(
  gridEntries(rawGrid)
    .filter(([, char]) => /[1-9]/.test(char))
    .map(([point]) => point),
);

const getShortestPath = memoize(
  (a: Point, b: Point) => {
    const path = aStar(
      a,
      function* (position) {
        for (const adjacent of getAdjacentPoints(position)) {
          const tile = getPoint(grid, adjacent);
          if (tile === Tile.Wall) continue;

          yield adjacent;
        }
      },
      () => 1,
      (position) => isSamePoint(position, b),
      (position) => getManhattanDistance(position, b),
    );

    return path.length - 1;
  },
  {
    getKey: (a, b) => `${a.x},${a.y},${b.x},${b.y}`,
  },
);

const part1 = () => {
  interface State {
    position: Point;
    unvisitedExposedWirePositions: ObjectSet<Point>;
  }

  const path = aStar<State>(
    {
      position: startPosition,
      unvisitedExposedWirePositions: ObjectSet.from(exposedWirePositions),
    },
    function* (state) {
      for (const exposedWirePosition of state.unvisitedExposedWirePositions) {
        yield {
          position: exposedWirePosition,
          unvisitedExposedWirePositions: state.unvisitedExposedWirePositions
            .without(exposedWirePosition),
        };
      }
    },
    (a, b) => getShortestPath(a.position, b.position),
    (state) => state.unvisitedExposedWirePositions.isEmpty(),
    (state) =>
      minOf(
        state.unvisitedExposedWirePositions,
        (unvisitedExposedWirePosition) =>
          getManhattanDistance(state.position, unvisitedExposedWirePosition),
      ) ?? 0,
  );

  return sumOf(
    slidingWindows(path, 2),
    ([a, b]) => getShortestPath(a.position, b.position),
  );
};
console.log(part1());

const part2 = () => {
  interface State {
    position: Point;
    unvisitedExposedWirePositions: ObjectSet<Point>;
  }

  const path = aStar<State>(
    {
      position: startPosition,
      unvisitedExposedWirePositions: ObjectSet.from(exposedWirePositions),
    },
    function* (state) {
      for (const exposedWirePosition of state.unvisitedExposedWirePositions) {
        yield {
          position: exposedWirePosition,
          unvisitedExposedWirePositions: state.unvisitedExposedWirePositions
            .without(exposedWirePosition),
        };
      }
      if (state.unvisitedExposedWirePositions.isEmpty()) {
        yield {
          position: startPosition,
          unvisitedExposedWirePositions: state.unvisitedExposedWirePositions,
        };
      }
    },
    (a, b) => getShortestPath(a.position, b.position),
    (state) =>
      state.unvisitedExposedWirePositions.isEmpty() &&
      isSamePoint(state.position, startPosition),
    (state) =>
      minOf(
        state.unvisitedExposedWirePositions,
        (unvisitedExposedWirePosition) =>
          getManhattanDistance(state.position, unvisitedExposedWirePosition),
      ) ?? 0 + getManhattanDistance(state.position, startPosition),
  );

  return sumOf(
    slidingWindows(path, 2),
    ([a, b]) => getShortestPath(a.position, b.position),
  );
};
console.log(part2());
