import { ascend } from "@std/data-structures";
import { Point } from "@utilities/grid/Point.ts";

export const comparePoints = (a: Point, b: Point): -1 | 0 | 1 => {
  const yOrd = ascend(a.y, b.y);
  if (yOrd !== 0) return yOrd;
  return ascend(a.x, b.x);
};
