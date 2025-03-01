import { Grid } from "@utilities/grid/Grid.ts";
import { Point } from "@utilities/grid/Point.ts";
import { Rectangle } from "@utilities/grid/Rectangle.ts";

export const isInBounds = <T>(grid: Grid<T>, { x, y }: Point): boolean =>
  isInBoundsRaw(grid[0].length, grid.length, { x, y });

export const isInBoundsRaw = (
  width: number,
  height: number,
  { x, y }: Point,
): boolean => y >= 0 && y < height && x >= 0 && x < width;

export const isInBoundsOfRectangle = (
  bounds: Rectangle,
  { x, y }: Point,
) => {
  const { x: minX, y: minY, width, height } = bounds;
  if (x < minX) return false;
  if (y < minY) return false;
  if (x >= minX + width) return false;
  if (y >= minY + height) return false;
  return true;
};
