import { Point } from "@utilities/grid/Point.ts";

export interface Rectangle extends Point {
  readonly width: number;
  readonly height: number;
}
