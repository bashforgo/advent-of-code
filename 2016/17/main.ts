import { memoize } from "@std/cache";
import { aStar } from "@utilities/aStar.ts";
import { getInput } from "@utilities/getInput.ts";
import { Direction, directions } from "@utilities/grid/Direction.ts";
import { getAdjacentPoint } from "@utilities/grid/getAdjacentPoint.ts";
import { getManhattanDistance } from "@utilities/grid/getManhattanDistance.ts";
import { isInBoundsRaw } from "@utilities/grid/isInBounds.ts";
import { isSamePoint } from "@utilities/grid/isSamePoint.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { md5 } from "@utilities/md5.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
ulqzkmiv
`
  : await getInput(2016, 17);

const [width, height] = [4, 4];
const start = point(0, 0);
const goal = point(3, 3);

const passcode = input.trim();

const memoizedMd5 = memoize(md5);

const directionToPathCharacter = (direction: Direction): string => {
  switch (direction) {
    case Direction.North:
      return "U";
    case Direction.East:
      return "R";
    case Direction.South:
      return "D";
    case Direction.West:
      return "L";
  }
};

const openDoorCharacters = new Set(["b", "c", "d", "e", "f"]);
const isAbleToMoveInDirection = (
  position: Point,
  hash: string,
  direction: Direction,
) => {
  const adjacentPoint = getAdjacentPoint(position, direction);
  if (!isInBoundsRaw(width, height, adjacentPoint)) return false;

  const hashIndexToCheck = (() => {
    switch (direction) {
      case Direction.North:
        return 0;
      case Direction.South:
        return 1;
      case Direction.West:
        return 2;
      case Direction.East:
        return 3;
    }
  })();
  const hashCharacter = hash[hashIndexToCheck];

  return openDoorCharacters.has(hashCharacter);
};

const part1 = () => {
  interface State {
    position: Point;
    steps: string;
  }

  const path = aStar<State>(
    { position: start, steps: "" },
    (state) => {
      const hash = memoizedMd5(`${passcode}${state.steps}`);
      return directions
        .filter((direction) =>
          isAbleToMoveInDirection(state.position, hash, direction)
        )
        .map((direction) => ({
          position: getAdjacentPoint(state.position, direction),
          steps: `${state.steps}${directionToPathCharacter(direction)}`,
        }));
    },
    () => 1,
    (state) => isSamePoint(state.position, goal),
    (state) => getManhattanDistance(state.position, goal),
  );

  return path.at(-1)!.steps;
};
console.log(part1());

const part2 = () => {
  interface State {
    position: Point;
    steps: string;
  }

  const path = aStar<State>(
    { position: start, steps: "" },
    (state) => {
      const hash = memoizedMd5(`${passcode}${state.steps}`);
      return directions
        .filter((direction) =>
          isAbleToMoveInDirection(state.position, hash, direction)
        )
        .map((direction) => ({
          position: getAdjacentPoint(state.position, direction),
          steps: `${state.steps}${directionToPathCharacter(direction)}`,
        }));
    },
    (_state, neighbor) => isSamePoint(neighbor.position, goal) ? 9999 : 1,
    (state) => isSamePoint(state.position, goal),
    (state) => -2 * state.steps.length,
  );

  return path.at(-1)!.steps.length;
};
console.log(part2());
