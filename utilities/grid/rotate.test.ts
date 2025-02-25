import { assertEquals } from "@std/assert";
import { Grid } from "@utilities/grid/Grid.ts";
import {
  rotateClockwise as cw,
  rotateCounterClockwise as ccw,
} from "@utilities/grid/rotate.ts";

const square: Grid<number> = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

Deno.test("rotate square clockwise once", () => {
  const rotated = cw(square);
  assertEquals(rotated, [
    [7, 4, 1],
    [8, 5, 2],
    [9, 6, 3],
  ]);
});

Deno.test("rotate square clockwise twice", () => {
  const rotated = cw(cw(square));
  assertEquals(rotated, [
    [9, 8, 7],
    [6, 5, 4],
    [3, 2, 1],
  ]);
});

Deno.test("rotate square clockwise three times", () => {
  const rotated = cw(cw(cw(square)));
  assertEquals(rotated, [
    [3, 6, 9],
    [2, 5, 8],
    [1, 4, 7],
  ]);
});

Deno.test("rotate square clockwise four times", () => {
  const rotated = cw(cw(cw(cw(square))));
  assertEquals(rotated, square);
});

Deno.test("rotate square counter clockwise once", () => {
  const rotated = ccw(square);
  assertEquals(rotated, [
    [3, 6, 9],
    [2, 5, 8],
    [1, 4, 7],
  ]);
});

Deno.test("rotate square counter clockwise twice", () => {
  const rotated = ccw(ccw(square));
  assertEquals(rotated, [
    [9, 8, 7],
    [6, 5, 4],
    [3, 2, 1],
  ]);
});

Deno.test("rotate square counter clockwise three times", () => {
  const rotated = ccw(ccw(ccw(square)));
  assertEquals(rotated, [
    [7, 4, 1],
    [8, 5, 2],
    [9, 6, 3],
  ]);
});

Deno.test("rotate square counter clockwise four times", () => {
  const rotated = ccw(ccw(ccw(ccw(square))));
  assertEquals(rotated, square);
});

Deno.test("rotate square once clockwise and once counter clockwise", () => {
  const rotated = ccw(cw(square));
  assertEquals(rotated, square);
});

Deno.test("rotate square once counter clockwise and once clockwise", () => {
  const rotated = cw(ccw(square));
  assertEquals(rotated, square);
});

const rectangle: Grid<number> = [
  [1, 2, 3],
  [4, 5, 6],
];

Deno.test("rotate rectangle clockwise once", () => {
  const rotated = cw(rectangle);
  assertEquals(rotated, [
    [4, 1],
    [5, 2],
    [6, 3],
  ]);
});

Deno.test("rotate rectangle clockwise twice", () => {
  const rotated = cw(cw(rectangle));
  assertEquals(rotated, [
    [6, 5, 4],
    [3, 2, 1],
  ]);
});

Deno.test("rotate rectangle clockwise three times", () => {
  const rotated = cw(cw(cw(rectangle)));
  assertEquals(rotated, [
    [3, 6],
    [2, 5],
    [1, 4],
  ]);
});

Deno.test("rotate rectangle clockwise four times", () => {
  const rotated = cw(cw(cw(cw(rectangle))));
  assertEquals(rotated, rectangle);
});

Deno.test("rotate rectangle counter clockwise once", () => {
  const rotated = ccw(rectangle);
  assertEquals(rotated, [
    [3, 6],
    [2, 5],
    [1, 4],
  ]);
});

Deno.test("rotate rectangle counter clockwise twice", () => {
  const rotated = ccw(ccw(rectangle));
  assertEquals(rotated, [
    [6, 5, 4],
    [3, 2, 1],
  ]);
});

Deno.test("rotate rectangle counter clockwise three times", () => {
  const rotated = ccw(ccw(ccw(rectangle)));
  assertEquals(rotated, [
    [4, 1],
    [5, 2],
    [6, 3],
  ]);
});

Deno.test("rotate rectangle counter clockwise four times", () => {
  const rotated = ccw(ccw(ccw(ccw(rectangle))));
  assertEquals(rotated, rectangle);
});

Deno.test("rotate rectangle once clockwise and once counter clockwise", () => {
  const rotated = ccw(cw(rectangle));
  assertEquals(rotated, rectangle);
});

Deno.test("rotate rectangle once counter clockwise and once clockwise", () => {
  const rotated = cw(ccw(rectangle));
  assertEquals(rotated, rectangle);
});
