export const productOf = <T>(
  items: Iterable<T>,
  selector: (el: T) => number,
): number =>
  Iterator.from(items)
    .map(selector)
    .reduce((a, b) => a * b);
