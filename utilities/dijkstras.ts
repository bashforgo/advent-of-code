import { BinaryHeap } from "@std/data-structures";
import { ObjectMap } from "@utilities/ObjectMap.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";

export const dijkstras = <T>(
  start: T,
  getNeighbors: GetNeighbors<T>,
  getWeight: GetWeight<T>,
) => {
  const distances = new ObjectMap<T, number>();
  const previous = new ObjectMap<T, ObjectSet<T>>();
  const visited = new ObjectSet<T>();

  distances.set(start, 0);

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
  const path: T[] = [];
  let current: T | null = end;

  while (current != null) {
    path.unshift(current);
    for (const cameFrom of previous.get(current) ?? [null]) {
      current = cameFrom;
      break;
    }
  }

  return path;
};

export type GetNeighbors<T> = (node: T) => Iterable<T>;
export type GetWeight<T> = (a: T, b: T) => number;
