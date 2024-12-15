import { directions } from "@utilities/grid/Direction.ts";
import { getAdjacentPoint } from "@utilities/grid/getAdjacentPoint.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { isInBounds } from "@utilities/grid/isInBounds.ts";
import { Point } from "@utilities/grid/Point.ts";

export const getAdjacentPoints = function* (point: Point) {
  for (const direction of directions) {
    yield getAdjacentPoint(point, direction);
  }
};

export const getAdjacentPointsInBounds = function* (
  grid: Grid<unknown>,
  point: Point,
) {
  for (const direction of directions) {
    const adjacent = getAdjacentPoint(point, direction);
    if (isInBounds(grid, adjacent)) yield adjacent;
  }
};
