import { Direction } from "@utilities/grid/Direction.ts";
import { Point } from "@utilities/grid/Point.ts";

export const directionFromAdjacent = (
  from: Point,
  to: Point,
): Direction | null => {
  if (from.x < to.x) return Direction.East;
  if (from.x > to.x) return Direction.West;
  if (from.y < to.y) return Direction.South;
  if (from.y > to.y) return Direction.North;
  return null;
};
