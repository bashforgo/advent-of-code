import { Direction } from "@utilities/grid/Direction.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { addPoints } from "@utilities/grid/addPoints.ts";

export const getDelta = (direction: Direction): Point => {
  switch (direction) {
    case Direction.North:
      return point(0, -1);
    case Direction.East:
      return point(1, 0);
    case Direction.South:
      return point(0, 1);
    case Direction.West:
      return point(-1, 0);
  }
};

export const get8DirectionalDelta = (d: Direction, d2?: Direction): Point =>
  d2 == null ? getDelta(d) : addPoints(getDelta(d), getDelta(d2));
