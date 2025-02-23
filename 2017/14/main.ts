import { unreachable } from "@std/assert";
import { sumOf } from "@std/collections";
import { decodeHex } from "@std/encoding";
import { knotHash } from "@utilities/2017/knotHash/knotHash.ts";
import { countSetBits } from "@utilities/countSetBits.ts";
import { getInput } from "@utilities/getInput.ts";
import { getAdjacentPointsInBounds } from "@utilities/grid/getAdjacentPoints.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { gridEntries } from "@utilities/grid/gridEntries.ts";
import { Point } from "@utilities/grid/Point.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
flqrgnkx
`
  : await getInput(2017, 14);

const keyString = input.trim();

const part1 = () => {
  return sumOf(
    range(0, 127),
    (i) => {
      const key = `${keyString}-${i}`;
      const hash = knotHash(key);
      const bytes = decodeHex(hash);
      return sumOf(bytes, (byte) => countSetBits(byte));
    },
  );
};
console.log(part1());

const floodFill = (
  grid: Grid<unknown>,
  from: Point,
  predicate?: (point: Point) => boolean,
): ObjectSet<Point> => {
  const filled = new ObjectSet<Point>();

  const fill = (point: Point): void => {
    const shouldFill = predicate?.(point) ?? true;
    if (!shouldFill) return;

    if (filled.has(point)) return;

    filled.add(point);

    for (const neighbor of getAdjacentPointsInBounds(grid, point)) {
      fill(neighbor);
    }
  };
  fill(from);

  return filled;
};

// deno-lint-ignore no-unused-vars
const stringifyGrid = (grid: Grid<boolean>): string =>
  grid.map((row) => row.map((cell) => (cell ? "#" : ".")).join("")).join("\n");

const part2 = () => {
  const grid: Grid<boolean> = range(0, 127)
    .map((i) => {
      const key = `${keyString}-${i}`;
      const hash = knotHash(key);
      const bytes = decodeHex(hash);
      return bytes
        .values()
        .flatMap((byte) =>
          range(0, 7).map((i) => ((byte >> (7 - i)) & 1) === 1)
        )
        .toArray();
    })
    .toArray();

  let seen = new ObjectSet<Point>();
  let numberOfRegions = 0;
  const predicate = (point: Point) => getPoint(grid, point) ?? unreachable();
  for (const [point] of gridEntries(grid)) {
    if (seen.has(point)) continue;
    if (!predicate(point)) continue;

    const region = floodFill(grid, point, predicate);
    seen = seen.union(region);
    numberOfRegions++;
  }

  return numberOfRegions;
};
console.log(part2());
