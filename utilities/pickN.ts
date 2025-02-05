import { assertEquals } from "@std/assert";

export function* pickN<T>(items: T[], n: number): Generator<T[]> {
  if (n === 0) {
    yield [];
    return;
  }

  if (n === 1) {
    yield* items.map((item) => [item]);
    return;
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const rest = items.slice(i + 1);
    for (const restCombination of pickN(rest, n - 1)) {
      yield [item, ...restCombination];
    }
  }
}

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
