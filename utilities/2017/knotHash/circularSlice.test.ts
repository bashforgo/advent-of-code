import { assertEquals } from "@std/assert";
import { circularSlice } from "@utilities/2017/knotHash/circularSlice.ts";

Deno.test("circularSlice([0, 1, 2, 3, 4], 0, 3) === [0, 1, 2]", () => {
  assertEquals(circularSlice([0, 1, 2, 3, 4], 0, 3), [0, 1, 2]);
});

Deno.test("circularSlice([2, 1, 0, 3, 4], 3, 4) === [3, 4, 2, 1]", () => {
  assertEquals(circularSlice([2, 1, 0, 3, 4], 3, 4), [3, 4, 2, 1]);
});

Deno.test("circularSlice([4, 3, 0, 1, 2], 1, 5) === [3, 0, 1, 2, 4]", () => {
  assertEquals(circularSlice([4, 3, 0, 1, 2], 1, 5), [3, 0, 1, 2, 4]);
});
