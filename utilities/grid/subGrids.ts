import { Grid } from "@utilities/grid/Grid.ts";

export function* subGrids<T>(width: number, height: number, grid: Grid<T>) {
  console.assert(
    grid.length % height === 0,
    "Height should divide grid height",
  );
  console.assert(
    grid[0].length % width === 0,
    "Width should divide grid width",
  );

  for (let i = 0; i < grid.length - height + 1; i++) {
    for (let j = 0; j < grid.length - width + 1; j++) {
      const subGrid = Array.from(
        { length: height },
        (_, k) => grid[i + k].slice(j, j + width),
      );
      yield subGrid;
    }
  }
}
