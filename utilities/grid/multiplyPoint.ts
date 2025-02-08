import { Point, point } from "@utilities/grid/Point.ts";

export const multiplyPoint = ({ x, y }: Point, scalar: number) =>
  point(x * scalar, y * scalar);
