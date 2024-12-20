import { sumOf } from "@std/collections";
import { dijkstras, getPath } from "@utilities/dijkstras.ts";
import { getInput } from "@utilities/getInput.ts";
import { getAdjacentPointsInBounds } from "@utilities/grid/getAdjacentPoints.ts";
import { getManhattanDistance } from "@utilities/grid/getManhattanDistance.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { point } from "@utilities/grid/Point.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
`
  : await getInput(20);

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

const start = (() => {
  const y = lines.findIndex((line) => line.includes("S"));
  return point(lines[y].indexOf("S"), y);
})();
const end = (() => {
  const y = lines.findIndex((line) => line.includes("E"));
  return point(lines[y].indexOf("E"), y);
})();

const noCheatResult = dijkstras(
  start,
  (point) =>
    getAdjacentPointsInBounds(map, point)
      .filter((point) => getPoint(map, point) === Tile.Empty),
  () => 1,
);
const noCheatPath = getPath(end, noCheatResult.previous);

function* cheatSavings(
  minTimeSaving: number,
  maxCheatDistance: number,
) {
  const length = noCheatPath.length;
  for (let i = 0; i < length; i++) {
    for (let j = i + 1 + minTimeSaving; j < length; j++) {
      const [a, b] = [noCheatPath[i], noCheatPath[j]];

      const distance = getManhattanDistance(a, b);
      if (distance > maxCheatDistance) continue;

      const timeSaving = j - i - distance;
      if (timeSaving < minTimeSaving) continue;

      yield timeSaving;
    }
  }
}

console.log(
  sumOf(cheatSavings(DEBUG ? 20 : 100, 2), () => 1),
);

console.log(
  sumOf(cheatSavings(DEBUG ? 70 : 100, 20), () => 1),
);
