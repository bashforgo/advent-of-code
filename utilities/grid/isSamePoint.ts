import { Point } from "@utilities/grid/Point.ts";

export const isSamePoint = (left: Point, right: Point): boolean => {
  return left.x === right.x && left.y === right.y;
};
