import { Point, point } from "@utilities/Point.ts";

export const addPoints = (a: Point, b: Point): Point =>
  point(a.x + b.x, a.y + b.y);
