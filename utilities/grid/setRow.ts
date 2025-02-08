import { Grid } from "@utilities/grid/Grid.ts";

export const setRow = <T>(grid: Grid<T>, row: number, newRow: T[]) => {
  grid[row] = newRow;
};
