import { Grid } from "@utilities/grid/Grid.ts";

export const setColumn = <T>(grid: Grid<T>, column: number, newColumn: T[]) => {
  for (let y = 0; y < grid.length; y++) {
    grid[y][column] = newColumn[y];
  }
};
