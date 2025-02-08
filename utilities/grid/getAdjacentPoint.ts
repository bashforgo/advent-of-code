import { addPoints } from "@utilities/grid/addPoints.ts";
import { Direction } from "@utilities/grid/Direction.ts";
import { getDelta } from "@utilities/grid/getDelta.ts";
import { Point } from "@utilities/grid/Point.ts";

export const getAdjacentPoint = (point: Point, direction: Direction): Point => {
  const delta = getDelta(direction);
  return addPoints(point, delta);
};
