import { Grid } from "@utilities/grid/Grid.ts";

export const getColumn = <T>(grid: Grid<T>, column: number): T[] =>
  grid.map((row) => row[column]);
