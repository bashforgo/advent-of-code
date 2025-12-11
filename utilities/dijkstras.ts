import { memoize } from "@std/cache";
import { sumOf } from "@std/collections";
import { BinaryHeap } from "@std/data-structures";
import { ObjectMap } from "./ObjectMap.ts";
import { ObjectSet } from "./ObjectSet.ts";

export const dijkstras = <T>(
  start: T,
  getNeighbors: GetNeighbors<T>,
  getWeight: GetWeight<T>,
) => {
  const distances = new ObjectMap<T, number>();
  const previous = new ObjectMap<T, ObjectSet<T>>();
  const visited = new ObjectSet<T>();

  distances.set(start, 0);
  previous.set(start, new ObjectSet());

  const getDistance = (node: T) => distances.get(node) ?? Infinity;
  const queue = new BinaryHeap<T>((a, b) => getDistance(a) - getDistance(b));
  queue.push(start);

  while (!queue.isEmpty()) {
    const current = queue.pop()!;

    if (visited.has(current)) continue;
    visited.add(current);

    for (const neighbor of getNeighbors(current)) {
      const distance = getDistance(current) + getWeight(current, neighbor);
      const previousDistance = getDistance(neighbor);

      if (distance < previousDistance) {
        distances.set(neighbor, distance);
        previous.set(neighbor, ObjectSet.from([current]));
        queue.push(neighbor);
      } else if (distance === previousDistance) {
        previous.get(neighbor)?.add(current);
      }
    }
  }

  return { distances, previous };
};

export const getPath = <T>(
  end: T,
  previous: ObjectMap<T, ObjectSet<T>>,
) => {
  return getPaths(end, previous).next().value ?? [];
};

export function* getPaths<T>(
  end: T,
  previous: ObjectMap<T, ObjectSet<T>>,
) {
  yield* inner(end, []);
  return;

  function* inner(current: T, path: T[]): Generator<T[]> {
    path.unshift(current);

    const previousNodes = previous.get(current);
    if (previousNodes == null) return;
    if (previousNodes.size === 0) yield path;
    for (const previousNode of previousNodes) {
      yield* inner(previousNode, [...path]);
    }
  }
}

export function getNumberOfPaths<T>(
  end: T,
  previous: ObjectMap<T, ObjectSet<T>>,
): number {
  const inner = (end: T): number => {
    const previousNodes = previous.get(end);
    if (previousNodes == null) return 0;
    if (previousNodes.size === 0) return 1;
    return sumOf(
      previousNodes,
      (node) => memoized(node),
    );
  };
  const memoized = memoize<typeof inner, T, ObjectMap<T, number>>(inner, {
    cache: new ObjectMap(),
    getKey: (end) => end,
  });
  return memoized(end);
}

export type GetNeighbors<T> = (node: T) => Iterable<T>;
export type GetWeight<T> = (a: T, b: T) => number;
