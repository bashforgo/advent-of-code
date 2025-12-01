import { assertEquals } from "@std/assert";
import { Grid } from "@utilities/grid/Grid.ts";
import { rectangle } from "@utilities/grid/Rectangle.ts";
import { subGrid } from "@utilities/grid/subGrid.ts";

const grid: Grid<number> = [
  [10, 11, 12, 13],
  [20, 21, 22, 23],
  [30, 31, 32, 33],
  [40, 41, 42, 43],
];

Deno.test("1x1 subGrid", () => {
  assertEquals(subGrid(grid, rectangle(1, 1, 1, 1)), [[21]]);
});

Deno.test("1x3 subGrid", () => {
  assertEquals(
    subGrid(grid, rectangle(1, 1, 1, 3)),
    [[21], [31], [41]],
  );
});

Deno.test("2x2 subGrid", () => {
  assertEquals(
    subGrid(grid, rectangle(1, 1, 2, 2)),
    [
      [21, 22],
      [31, 32],
    ],
  );
});

Deno.test("3x3 subGrid", () => {
  assertEquals(
    subGrid(grid, rectangle(1, 1, 3, 3)),
    [
      [21, 22, 23],
      [31, 32, 33],
      [41, 42, 43],
    ],
  );
});

Deno.test("0x2 subGrid", () => {
  assertEquals(
    subGrid(grid, rectangle(1, 1, 0, 2)),
    [],
  );
});

Deno.test("2x0 subGrid", () => {
  assertEquals(
    subGrid(grid, rectangle(1, 1, 2, 0)),
    [],
  );
});
