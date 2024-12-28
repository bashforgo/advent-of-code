import { maxOf, minOf, slidingWindows, sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { ObjectMap } from "@utilities/ObjectMap.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141
`
  : await getInput(2015, 9);

const distances = ObjectMap.from(
  input
    .trim()
    .split("\n")
    .map((line) => {
      const [, from, to, distance] = line.match(/(\w+) to (\w+) = (\d+)/)!;
      return [{ from, to }, Number(distance)] as const;
    }),
);
const getDistance = (from: string, to: string) =>
  distances.get({ from, to }) ?? distances.get({ from: to, to: from })!;

const cities = new Set(distances.keys().flatMap(({ from, to }) => [from, to]));

function* permutations<T>(elements: readonly T[]): Generator<T[]> {
  if (elements.length === 1) {
    yield elements as T[];
  } else {
    for (let i = 0; i < elements.length; i++) {
      const [first, ...rest] = elements;
      for (const permutation of permutations(rest)) {
        yield [first, ...permutation];
      }
      elements = [...rest, first];
    }
  }
}

const part1 = () => {
  return minOf(
    permutations(Array.from(cities)),
    (path) =>
      sumOf(slidingWindows(path, 2), ([from, to]) => getDistance(from, to)),
  );
};
console.log(part1());

const part2 = () => {
  return maxOf(
    permutations(Array.from(cities)),
    (path) =>
      sumOf(slidingWindows(path, 2), ([from, to]) => getDistance(from, to)),
  );
};
console.log(part2());
