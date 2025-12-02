/**
 * Returns a generator that yields numbers from start to end (**inclusive**) with a specified step.
 */
export function* range(start: number, end: number, step = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}
