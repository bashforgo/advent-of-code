import { Direction } from "@utilities/grid/Direction.ts";
import { Point } from "@utilities/grid/Point.ts";
import { addPoints } from "@utilities/grid/addPoints.ts";
import { multiplyPoint } from "@utilities/grid/multiplyPoint.ts";
import { getDelta } from "./getDelta.ts";

export const moveBy = (
  point: Point,
  amount: number,
  direction: Direction,
): Point => {
  return addPoints(point, multiplyPoint(getDelta(direction), amount));
};
