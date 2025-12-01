import { Point } from "@utilities/grid/Point.ts";

export interface Rectangle extends Point {
  readonly width: number;
  readonly height: number;
}

export const rectangle = (
  x: number,
  y: number,
  width: number,
  height: number,
): Rectangle => ({
  x,
  y,
  width,
  height,
});
