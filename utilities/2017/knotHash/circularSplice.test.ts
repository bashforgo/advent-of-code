import { assertEquals } from "@std/assert/equals";
import { circularSplice } from "@utilities/2017/knotHash/circularSplice.ts";

Deno.test("circularSplice([0, 1, 2, 3, 4], 0, [2, 1, 0]) === [2, 1, 0, 3, 4]", () => {
  const list = [0, 1, 2, 3, 4];
  circularSplice(list, 0, [2, 1, 0]);
  assertEquals(list, [2, 1, 0, 3, 4]);
});

Deno.test("circularSplice([2, 1, 0, 3, 4], 3, [1, 2, 4, 3]) === [4, 3, 0, 1, 2]", () => {
  const list = [2, 1, 0, 3, 4];
  circularSplice(list, 3, [1, 2, 4, 3]);
  assertEquals(list, [4, 3, 0, 1, 2]);
});

Deno.test("circularSplice([4, 3, 0, 1, 2], 1, [4, 2, 1, 0, 3]) === [3, 4, 2, 1, 0]", () => {
  const list = [4, 3, 0, 1, 2];
  circularSplice(list, 1, [4, 2, 1, 0, 3]);
  assertEquals(list, [3, 4, 2, 1, 0]);
});
