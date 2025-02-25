import { Grid } from "@utilities/grid/Grid.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { range } from "@utilities/range.ts";

export const makeGrid = <T>(
  width: number,
  height: number,
  getValue: (point: Point) => T,
): Grid<T> => {
  return range(0, height - 1).map((y) =>
    range(0, width - 1).map((x) => getValue(point(x, y))).toArray()
  ).toArray();
};
