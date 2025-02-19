import { minBy, sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import {
  Direction,
  getNextDirectionCounterClockwise,
} from "@utilities/grid/Direction.ts";
import { getAdjacentPoint } from "@utilities/grid/getAdjacentPoint.ts";
import { get8DirectionalAdjacentPoints } from "@utilities/grid/getAdjacentPoints.ts";
import { point } from "@utilities/grid/Point.ts";
import { ObjectMap } from "@utilities/ObjectMap.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
1024
`
  : await getInput(2017, 3);

const square = Number(input.trim());

const calculateHighValue = (ring: number) => (2 * ring + 1) ** 2;

const getRing = (square: number) => {
  for (let ring = 0;; ring++) {
    const highValue = calculateHighValue(ring);
    if (highValue >= square) {
      return ring;
    }
  }
};

const part1 = () => {
  const ring = getRing(square);
  const highValue = calculateHighValue(ring);
  const lowValue = calculateHighValue(ring - 1) + 1;
  const ringSize = highValue - lowValue + 1;
  const sideSize = ringSize / 4;
  const midpoints = [
    highValue - sideSize / 2,
    highValue - 3 * sideSize / 2,
    highValue - 5 * sideSize / 2,
    highValue - 7 * sideSize / 2,
  ];
  const closestMidpoint = minBy(
    midpoints,
    (midpoint) => Math.abs(midpoint - square),
  )!;
  const distanceToClosestMidpoint = Math.abs(closestMidpoint - square);
  return ring + distanceToClosestMidpoint;
};
console.log(part1());

const part2 = () => {
  const start = point(0, 0);
  const grid = ObjectMap.from([[start, 1]]);
  let direction = Direction.North;
  let position = getAdjacentPoint(start, Direction.East);

  while (true) {
    const sum = sumOf(
      get8DirectionalAdjacentPoints(position),
      (adjacent) => grid.get(adjacent) ?? 0,
    );
    grid.set(position, sum);

    if (sum > square) {
      return sum;
    }

    const nextDirection = getNextDirectionCounterClockwise(direction);
    const nextPositionCandidate = getAdjacentPoint(position, nextDirection);
    if (grid.has(nextPositionCandidate)) {
      position = getAdjacentPoint(position, direction);
    } else {
      direction = nextDirection;
      position = nextPositionCandidate;
    }
  }
};
console.log(part2());
