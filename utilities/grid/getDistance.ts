import { Point } from "@utilities/grid/Point.ts";

export const getDistance = (a: Point, b: Point) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
