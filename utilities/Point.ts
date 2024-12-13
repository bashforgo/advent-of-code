export interface Point {
  readonly x: number;
  readonly y: number;
}

export const point = (x: number, y: number): Point => ({ x, y });
