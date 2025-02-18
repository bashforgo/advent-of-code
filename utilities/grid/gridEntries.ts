import { Grid } from "@utilities/grid/Grid.ts";
import { point } from "@utilities/grid/Point.ts";

export function* gridEntries<T>(grid: Grid<T>) {
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      yield [point(x, y), row[x]] as const;
    }
  }
}
