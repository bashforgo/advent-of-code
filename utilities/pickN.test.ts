import { assertEquals } from "@std/assert";
import { pickN } from "@utilities/pickN.ts";

Deno.test("pick n=0 from 4", () => {
  assertEquals([...pickN([1, 2, 3, 4], 0)], [[]]);
});

Deno.test("pick n=1 from 4", () => {
  assertEquals([...pickN([1, 2, 3, 4], 1)], [
    [1],
    [2],
    [3],
    [4],
  ]);
});

Deno.test("pick n=2 from 4", () => {
  assertEquals([...pickN([1, 2, 3, 4], 2)], [
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 3],
    [2, 4],
    [3, 4],
  ]);
});

Deno.test("pick n=4 from 4", () => {
  assertEquals([...pickN([1, 2, 3, 4], 4)], [
    [1, 2, 3, 4],
  ]);
});

Deno.test("pick n=5 from 4", () => {
  assertEquals([...pickN([1, 2, 3, 4], 5)], []);
});
