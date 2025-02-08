import { Grid } from "@utilities/grid/Grid.ts";

export const getRow = <T>(grid: Grid<T>, row: number): T[] => grid[row];
