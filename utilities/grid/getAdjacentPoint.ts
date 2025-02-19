import { addPoints } from "@utilities/grid/addPoints.ts";
import { Direction } from "@utilities/grid/Direction.ts";
import { get8DirectionalDelta, getDelta } from "@utilities/grid/getDelta.ts";
import { Point } from "@utilities/grid/Point.ts";

export const getAdjacentPoint = (point: Point, direction: Direction): Point => {
  const delta = getDelta(direction);
  return addPoints(point, delta);
};

export const get8DirectionalAdjacentPoint = (
  point: Point,
  d: Direction,
  d2?: Direction,
): Point => {
  const delta = get8DirectionalDelta(d, d2);
  return addPoints(point, delta);
};
