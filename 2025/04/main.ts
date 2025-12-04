import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { get8DirectionalAdjacentPointsInBounds } from "@utilities/grid/getAdjacentPoints.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { gridEntries } from "@utilities/grid/gridEntries.ts";
import { mapGrid } from "@utilities/grid/mapGrid.ts";
import { setPoint } from "@utilities/grid/setPoint.ts";
import { identity } from "@utilities/identity.ts";
import { throw_ } from "@utilities/throw.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.
`
  : await getInput(2025, 4);

enum Cell {
  Empty = ".",
  RollOfPaper = "@",
}

const inputMap: Grid<Cell> = input
  .trim()
  .split("\n")
  .map((line) => line.split("") as Cell[]);

const iterateAccessibleRollsOfPaper = (map: Grid<Cell>) => {
  return gridEntries(map)
    .filter(([, cell]) => cell === Cell.RollOfPaper)
    .filter(([p]) => {
      const isAccessible = get8DirectionalAdjacentPointsInBounds(map, p)
        .map((adjacent) => getPoint(map, adjacent) ?? throw_())
        .filter((adjacentCell) => adjacentCell === Cell.RollOfPaper)
        .toArray()
        .length < 4;
      return isAccessible;
    });
};

const part1 = () => {
  return sumOf(
    iterateAccessibleRollsOfPaper(inputMap),
    () => 1,
  );
};
console.log(part1());

const part2 = () => {
  const map = mapGrid(inputMap, identity);

  let numberOfRemovedRollsOfPaper = 0;
  while (true) {
    const accessibleRollsOfPaper = iterateAccessibleRollsOfPaper(map)
      .toArray();

    if (accessibleRollsOfPaper.length === 0) break;

    for (const [point] of accessibleRollsOfPaper) {
      setPoint(map, point, Cell.Empty);
    }

    numberOfRemovedRollsOfPaper += accessibleRollsOfPaper.length;
  }

  return numberOfRemovedRollsOfPaper;
};
console.log(part2());
