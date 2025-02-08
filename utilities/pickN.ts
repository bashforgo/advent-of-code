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
