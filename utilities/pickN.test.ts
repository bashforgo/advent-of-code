import { assertEquals } from "@std/assert/equals";
import { pickN } from "@utilities/pickN.ts";

Deno.test("pickN", () => {
  assertEquals([...pickN([1, 2, 3, 4], 1)], [
    [1],
    [2],
    [3],
    [4],
  ]);
  assertEquals([...pickN([1, 2, 3, 4], 2)], [
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 3],
    [2, 4],
    [3, 4],
  ]);
  assertEquals([...pickN([1, 2, 3, 4], 4)], [
    [1, 2, 3, 4],
  ]);
});
