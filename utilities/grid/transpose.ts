import { Grid } from "@utilities/grid/Grid.ts";

export const transpose = <T>(grid: Grid<T>): Grid<T> => {
  return Array.from(columns(grid));
};

function* columns<T>(grid: Grid<T>): Generator<T[]> {
  const width = grid[0].length;
  for (let x = 0; x < width; x++) {
    yield grid.map((row) => row[x]);
  }
}
