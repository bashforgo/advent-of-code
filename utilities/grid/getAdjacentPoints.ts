import { _8Directions, directions } from "@utilities/grid/Direction.ts";
import {
  get8DirectionalAdjacentPoint,
  getAdjacentPoint,
} from "@utilities/grid/getAdjacentPoint.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { isInBounds } from "@utilities/grid/isInBounds.ts";
import { Point } from "@utilities/grid/Point.ts";

export function* getAdjacentPoints(point: Point) {
  for (const direction of directions) {
    yield getAdjacentPoint(point, direction);
  }
}

export function* getAdjacentPointsInBounds(grid: Grid<unknown>, point: Point) {
  for (const direction of directions) {
    const adjacent = getAdjacentPoint(point, direction);
    if (isInBounds(grid, adjacent)) yield adjacent;
  }
}

export function* get8DirectionalAdjacentPoints(point: Point) {
  for (const directions of _8Directions) {
    yield get8DirectionalAdjacentPoint(point, ...directions);
  }
}
