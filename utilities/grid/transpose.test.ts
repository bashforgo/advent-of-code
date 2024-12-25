import { assertEquals } from "@std/assert";
import { transpose } from "@utilities/grid/transpose.ts";

Deno.test("transpose", () => {
  const grid = [
    [1, 2, 3],
    [4, 5, 6],
  ];
  const expected = [
    [1, 4],
    [2, 5],
    [3, 6],
  ];
  assertEquals(transpose(grid), expected);
});
