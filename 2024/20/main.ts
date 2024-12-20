import { sumOf } from "@std/collections/sum-of";
import { dijkstras, getPath } from "@utilities/dijkstras.ts";
import { getInput } from "@utilities/getInput.ts";
import { getAdjacentPointsInBounds } from "@utilities/grid/getAdjacentPoints.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { ObjectMap } from "@utilities/ObjectMap.ts";

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
const noCheatDistance = noCheatResult.distances.get(end)!;
const noCheatPath = getPath(end, noCheatResult.previous);

const isOuterWall = ({ x, y }: Point) =>
  x === 0 || y === 0 || x === map[0].length - 1 || y === map.length - 1;

const possibleCheatPoints = Array.from(noCheatPath)
  .flatMap((point) => Array.from(getAdjacentPointsInBounds(map, point)))
  .filter((point) => getPoint(map, point) === Tile.Wall)
  .filter((point) => !isOuterWall(point));

const pathLengthsByCheatPoint = ObjectMap.from(
  possibleCheatPoints.map((point) => [point, 0]),
);
for (const [cheatPoint] of pathLengthsByCheatPoint) {
  map[cheatPoint.y][cheatPoint.x] = Tile.Empty;
  const cheatResult = dijkstras(
    start,
    (point) =>
      getAdjacentPointsInBounds(map, point)
        .filter((point) => getPoint(map, point) === Tile.Empty),
    () => 1,
  );
  pathLengthsByCheatPoint.set(cheatPoint, cheatResult.distances.get(end)!);
  map[cheatPoint.y][cheatPoint.x] = Tile.Wall;
}
console.log(
  sumOf(
    Iterator.from(pathLengthsByCheatPoint)
      .filter(([_, length]) => length <= noCheatDistance - (DEBUG ? 20 : 100)),
    () => 1,
  ),
);
