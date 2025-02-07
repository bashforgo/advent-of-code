import { BinaryHeap } from "@std/data-structures";
import { ObjectMap } from "@utilities/ObjectMap.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";

export const aStar = <T>(
  start: T,
  getNeighbors: (state: T) => Iterable<T>,
  getWeight: (from: T, to: T) => number,
  isGoalState: (state: T) => boolean,
  heuristic: (state: T) => number,
): T[] => {
  const cameFrom = new ObjectMap<T, T>();

  const gScore = new ObjectMap<T, number>();
  gScore.set(start, 0);
  const getGScore = (node: T) => gScore.get(node) ?? Infinity;

  const fScore = new ObjectMap<T, number>();
  fScore.set(start, heuristic(start));
  const getFScore = (node: T) => fScore.get(node) ?? Infinity;

  const openSet = ObjectSet.from([start]);
  const queue = new BinaryHeap<T>((a, b) => getFScore(a) - getFScore(b));
  queue.push(start);

  while (openSet.size > 0) {
    const current = queue.pop()!;
    openSet.delete(current);

    if (isGoalState(current)) {
      return reconstructPath(cameFrom, current);
    }

    for (const neighbor of getNeighbors(current)) {
      const tentativeGScore = getGScore(current) + getWeight(current, neighbor);

      if (tentativeGScore < getGScore(neighbor)) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeGScore);
        fScore.set(neighbor, tentativeGScore + heuristic(neighbor));

        if (!openSet.has(neighbor)) {
          openSet.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
  }

  throw new Error("No path found");
};

const reconstructPath = <T>(cameFrom: ObjectMap<T, T>, current: T): T[] => {
  const totalPath = [current];
  while (cameFrom.has(current)) {
    current = cameFrom.get(current)!;
    totalPath.unshift(current);
  }
  return totalPath;
};
