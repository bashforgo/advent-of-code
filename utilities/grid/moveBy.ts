import { Direction } from "@utilities/grid/Direction.ts";
import { Point } from "@utilities/grid/Point.ts";
import { addPoints } from "@utilities/grid/addPoints.ts";
import { getDelta } from "@utilities/grid/getDelta.ts";
import { multiplyPoint } from "@utilities/grid/multiplyPoint.ts";

export const moveBy = (
  point: Point,
  amount: number,
  direction: Direction,
): Point => {
  return addPoints(point, multiplyPoint(getDelta(direction), amount));
};
