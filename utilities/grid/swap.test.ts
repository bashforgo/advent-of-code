import { assertEquals } from "@std/assert";
import { Grid } from "@utilities/grid/Grid.ts";
import { point } from "@utilities/grid/Point.ts";
import { swap } from "@utilities/grid/swap.ts";

Deno.test("swap elements in a grid", () => {
  const grid: Grid<number> = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];
  const pointA = point(0, 0);
  const pointB = point(2, 2);

  const result = swap(grid, pointA, pointB);

  assertEquals(result, [
    [9, 2, 3],
    [4, 5, 6],
    [7, 8, 1],
  ]);
});

Deno.test("swap elements in the same row", () => {
  const grid: Grid<number> = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];
  const pointA = point(0, 1);
  const pointB = point(2, 1);

  const result = swap(grid, pointA, pointB);

  assertEquals(result, [
    [1, 2, 3],
    [6, 5, 4],
    [7, 8, 9],
  ]);
});

Deno.test("swap elements in the same column", () => {
  const grid: Grid<number> = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];
  const pointA = point(1, 0);
  const pointB = point(1, 2);

  const result = swap(grid, pointA, pointB);

  assertEquals(result, [
    [1, 8, 3],
    [4, 5, 6],
    [7, 2, 9],
  ]);
});

Deno.test("swap elements in a single element grid", () => {
  const grid: Grid<number> = [
    [1],
  ];
  const pointA = point(0, 0);
  const pointB = point(0, 0);

  const result = swap(grid, pointA, pointB);

  assertEquals(result, [
    [1],
  ]);
});

Deno.test("swap does not mutate the input grid", () => {
  const grid: Grid<number> = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];
  const pointA = point(0, 0);
  const pointB = point(2, 2);

  swap(grid, pointA, pointB);

  assertEquals(grid, [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);
});
