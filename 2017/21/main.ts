import { unreachable } from "@std/assert";
import { memoize } from "@std/cache/memoize";
import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { flipHorizontally, flipVertically } from "@utilities/grid/flip.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { getRow } from "@utilities/grid/getRow.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { makeGrid } from "@utilities/grid/makeGrid.ts";
import { mapGrid } from "@utilities/grid/mapGrid.ts";
import { point } from "@utilities/grid/Point.ts";
import {
  rotateClockwise,
  rotateCounterClockwise,
} from "@utilities/grid/rotate.ts";
import { identity } from "@utilities/identity.ts";
import { ObjectMap } from "@utilities/ObjectMap.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
../.# => ##./#../...
.#./..#/### => #..#/..../..../#..#
`
  : await getInput(2017, 21);

const lines = input.trim().split("\n");

enum Pixel {
  Off = 0,
  On = 1,
}

type Pattern = Grid<Pixel>;

const parsePattern = (pattern: string): Pattern => {
  return pattern.split("/")
    .map((row) =>
      row.split("").map((char) => char === "#" ? Pixel.On : Pixel.Off)
    );
};

const initialPattern = parsePattern(".#./..#/###");

const replacements = ObjectMap.from(
  lines.flatMap((line) => {
    const [pattern, replacement] = line.split(" => ")
      .map((p) => parsePattern(p));

    const clockwise = rotateClockwise(pattern);
    const counterClockwise = rotateCounterClockwise(pattern);
    const _180 = rotateClockwise(clockwise);

    return [
      [pattern, replacement],
      [flipHorizontally(pattern), replacement],
      [flipVertically(pattern), replacement],
      [clockwise, replacement],
      [flipHorizontally(clockwise), replacement],
      [flipVertically(clockwise), replacement],
      [counterClockwise, replacement],
      [flipHorizontally(counterClockwise), replacement],
      [flipVertically(counterClockwise), replacement],
      [_180, replacement],
      [flipHorizontally(_180), replacement],
      [flipVertically(_180), replacement],
    ] satisfies [Pattern, Pattern][];
  }),
);

const stringifyPattern = (pattern: Pattern, joinWith = "\n"): string => {
  return pattern.map((row) =>
    row.map((pixel) => pixel === Pixel.On ? "#" : ".").join("")
  ).join(joinWith);
};

const splitGrid = <T>(
  innerWidth: number,
  innerHeight: number,
  grid: Grid<T>,
): Grid<Grid<T>> => {
  const inputWidth = grid[0].length;
  const inputHeight = grid.length;

  const outputWidth = inputWidth / innerWidth;
  const outputHeight = inputHeight / innerHeight;

  console.assert(Number.isInteger(outputWidth), "Invalid width");
  console.assert(Number.isInteger(outputHeight), "Invalid height");

  return makeGrid(
    outputWidth,
    outputHeight,
    ({ x, y }) =>
      makeGrid(
        innerWidth,
        innerHeight,
        ({ x: dx, y: dy }) =>
          getPoint(grid, point(x * innerWidth + dx, y * innerHeight + dy))!,
      ),
  );
};

const joinGrid = <T>(
  gridOfGrids: Grid<Grid<T>>,
): Grid<T> => {
  return gridOfGrids.flatMap((rowOfGrids) =>
    rowOfGrids.reduce((result, innerGrid) =>
      result.map((resultRow, i) => [...resultRow, ...getRow(innerGrid, i)])
    )
  );
};

const iterate = (pattern: Pattern): Pattern => {
  const size = pattern.length;
  const grids = size % 2 === 0
    ? splitGrid(2, 2, pattern)
    : splitGrid(3, 3, pattern);

  return joinGrid(
    mapGrid(grids, (grid) => replacements.get(grid) ?? unreachable()),
  );
};

const part1 = () => {
  const numberOfIterations = DEBUG ? 2 : 5;

  let currentPattern = initialPattern;
  for (const _ of range(1, numberOfIterations)) {
    currentPattern = iterate(currentPattern);
  }

  return sumOf(currentPattern.flat(), identity);
};
console.log(part1());

const getNumberOfPixelsOnAfterNIterations = memoize((
  pattern: Pattern,
  n: number,
): number => {
  if (n === 0) return sumOf(pattern.flat(), identity);

  console.assert(pattern.length === 3, "Invalid pattern size");

  const size4 = iterate(pattern);
  if (n === 1) return sumOf(size4.flat(), identity);

  const size6 = iterate(size4);
  if (n === 2) return sumOf(size6.flat(), identity);

  const size9 = iterate(size6);
  if (n === 3) return sumOf(size9.flat(), identity);

  const size3s = splitGrid(3, 3, size9);
  return sumOf(
    size3s.flat(),
    (size3) => getNumberOfPixelsOnAfterNIterations(size3, n - 3),
  );
}, { getKey: (p, n) => `${stringifyPattern(p, "/")}:${n}` });

const part2 = () => {
  const numberOfIterations = DEBUG ? 2 : 18;
  return getNumberOfPixelsOnAfterNIterations(
    initialPattern,
    numberOfIterations,
  );
};
console.log(part2());
