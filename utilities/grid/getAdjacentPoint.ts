import { addPoints } from "@utilities/grid/addPoints.ts";
import { Direction } from "@utilities/grid/Direction.ts";
import { Point } from "@utilities/grid/Point.ts";

export const getAdjacentPoint = (point: Point, direction: Direction): Point => {
  const delta = getDelta(direction);
  return addPoints(point, delta);
};

const getDelta = (direction: Direction): Point => {
  switch (direction) {
    case Direction.North:
      return { x: 0, y: -1 };
    case Direction.East:
      return { x: 1, y: 0 };
    case Direction.South:
      return { x: 0, y: 1 };
    case Direction.West:
      return { x: -1, y: 0 };
  }
};
