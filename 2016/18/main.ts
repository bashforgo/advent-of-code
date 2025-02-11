import { getInput } from "@utilities/getInput.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
.^^.^.^^^^
`
  : await getInput(2016, 18);

const initialRow = input.trim();

enum Tile {
  Safe = ".",
  Trap = "^",
}

const isTrap = (left: Tile, center: Tile, right: Tile) => {
  const { Safe, Trap } = Tile;
  if (left === Trap && center === Trap && right === Safe) return true;
  if (left === Safe && center === Trap && right === Trap) return true;
  if (left === Trap && center === Safe && right === Safe) return true;
  if (left === Safe && center === Safe && right === Trap) return true;
  return false;
};

const computeGrid = (desiredNumberOfRows: number) => {
  const grid = [initialRow.split("")] as Grid<Tile>;

  for (const rowIndex of range(1, desiredNumberOfRows - 1)) {
    const previousRow = grid[rowIndex - 1];
    const currentRow = previousRow.entries()
      .map(([columnIndex, tile]) => {
        const left = previousRow[columnIndex - 1] ?? Tile.Safe;
        const center = tile;
        const right = previousRow[columnIndex + 1] ?? Tile.Safe;
        return isTrap(left, center, right) ? Tile.Trap : Tile.Safe;
      })
      .toArray();
    grid.push(currentRow);
  }

  return grid;
};

const part1 = () => {
  const grid = computeGrid(DEBUG ? 10 : 40);
  return grid.flat().filter((tile) => tile === Tile.Safe).length;
};
console.log(part1());

const part2 = () => {
  const grid = computeGrid(DEBUG ? 10 : 400_000);
  return grid.flat().filter((tile) => tile === Tile.Safe).length;
};
console.log(part2());
