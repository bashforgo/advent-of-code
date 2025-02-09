import { memoize } from "@std/cache";
import { aStar } from "@utilities/aStar.ts";
import { dijkstras } from "@utilities/dijkstras.ts";
import { getInput } from "@utilities/getInput.ts";
import { getAdjacentPoints } from "@utilities/grid/getAdjacentPoints.ts";
import { getManhattanDistance } from "@utilities/grid/getManhattanDistance.ts";
import { Point, point } from "@utilities/grid/Point.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
10
`
  : await getInput(2016, 13);

const designersFavoriteNumber = Number(input.trim());

const countSetBits = (n: number) => {
  let count = 0;
  while (n) {
    n &= n - 1;
    count++;
  }
  return count;
};

const isWall = memoize((x: number, y: number) => {
  const sum = x * x +
    3 * x +
    2 * x * y +
    y +
    y * y +
    designersFavoriteNumber;
  return countSetBits(sum) % 2 === 1;
});

const part1 = () => {
  const goal = DEBUG ? point(7, 4) : point(31, 39);

  const path = aStar(
    point(1, 1),
    (point) =>
      getAdjacentPoints(point)
        .filter(({ x, y }) => x >= 0 && y >= 0)
        .filter(({ x, y }) => !isWall(x, y)),
    () => 1,
    (point) => getManhattanDistance(point, goal) === 0,
    (p) => getManhattanDistance(p, goal),
  );

  return path.length - 1;
};
console.log(part1());

const part2 = () => {
  const steps = Symbol("steps");
  interface State {
    position: Point;
    [steps]: number;
  }

  const { distances } = dijkstras<State>(
    { position: point(1, 1), [steps]: 0 },
    (state) => {
      if (state[steps] >= 50) return [];

      return getAdjacentPoints(state.position)
        .filter(({ x, y }) => x >= 0 && y >= 0)
        .filter(({ x, y }) => !isWall(x, y))
        .map((position) => ({ position, [steps]: state[steps] + 1 }));
    },
    () => 1,
  );

  return distances.size;
};
console.log(part2());
