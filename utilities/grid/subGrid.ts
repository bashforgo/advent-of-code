import { getPoint } from "@utilities/grid/getPoint.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { makeGrid } from "@utilities/grid/makeGrid.ts";
import { Rectangle } from "@utilities/grid/Rectangle.ts";

export const subGrid = <T>(
  grid: Grid<T>,
  { x, y, width, height }: Rectangle,
): Grid<T> => {
  return makeGrid(
    width,
    height,
    ({ x: dx, y: dy }) => getPoint(grid, { x: x + dx, y: y + dy })!,
  );
};

export function* subGridValues<T>(
  grid: Grid<T>,
  { x, y, width, height }: Rectangle,
): Generator<T> {
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      yield getPoint(grid, { x: x + dx, y: y + dy })!;
    }
  }
}
