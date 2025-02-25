import { assertEquals } from "@std/assert/equals";
import { flipHorizontally, flipVertically } from "@utilities/grid/flip.ts";

const square = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

Deno.test("flip square horizontally", () => {
  const flipped = flipHorizontally(square);
  assertEquals(flipped, [
    [3, 2, 1],
    [6, 5, 4],
    [9, 8, 7],
  ]);
});

Deno.test("flip square horizontally twice", () => {
  const flipped = flipHorizontally(flipHorizontally(square));
  assertEquals(flipped, square);
});

Deno.test("flip square vertically", () => {
  const flipped = flipVertically(square);
  assertEquals(flipped, [
    [7, 8, 9],
    [4, 5, 6],
    [1, 2, 3],
  ]);
});

Deno.test("flip square vertically twice", () => {
  const flipped = flipVertically(flipVertically(square));
  assertEquals(flipped, square);
});

const rectangle = [
  [1, 2, 3],
  [4, 5, 6],
];

Deno.test("flip rectangle horizontally", () => {
  const flipped = flipHorizontally(rectangle);
  assertEquals(flipped, [
    [3, 2, 1],
    [6, 5, 4],
  ]);
});

Deno.test("flip rectangle horizontally twice", () => {
  const flipped = flipHorizontally(flipHorizontally(rectangle));
  assertEquals(flipped, rectangle);
});

Deno.test("flip rectangle vertically", () => {
  const flipped = flipVertically(rectangle);
  assertEquals(flipped, [
    [4, 5, 6],
    [1, 2, 3],
  ]);
});

Deno.test("flip rectangle vertically twice", () => {
  const flipped = flipVertically(flipVertically(rectangle));
  assertEquals(flipped, rectangle);
});
