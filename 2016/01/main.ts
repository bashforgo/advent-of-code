import { unreachable } from "@std/assert";
import { ObjectMap } from "@utilities/ObjectMap.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";
import { getInput } from "@utilities/getInput.ts";
import { Direction } from "@utilities/grid/Direction.ts";
import { point } from "@utilities/grid/Point.ts";
import { getAdjacentPoint } from "@utilities/grid/getAdjacentPoint.ts";
import { getManhattanDistance } from "@utilities/grid/getManhattanDistance.ts";
import { moveBy } from "@utilities/grid/moveBy.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
R8, R4, R4, R8
`
  : await getInput(2016, 1);

enum Turn {
  Left = "L",
  Right = "R",
}

interface Instruction {
  turn: Turn;
  distance: number;
}

const instructions = input.trim().split(", ").map((s): Instruction => {
  const [, turn, distance] = s.match(/(L|R)(\d+)/)!;
  return { turn: turn as Turn, distance: Number(distance) };
});

const turnToDirection = ObjectMap.from<[Turn, Direction], Direction>(
  [
    [[Turn.Right, Direction.North], Direction.East],
    [[Turn.Right, Direction.East], Direction.South],
    [[Turn.Right, Direction.South], Direction.West],
    [[Turn.Right, Direction.West], Direction.North],
    [[Turn.Left, Direction.North], Direction.West],
    [[Turn.Left, Direction.West], Direction.South],
    [[Turn.Left, Direction.South], Direction.East],
    [[Turn.Left, Direction.East], Direction.North],
  ],
);

const part1 = () => {
  const initialPosition = point(0, 0);
  let position = initialPosition;
  let direction = Direction.North;
  for (const { turn, distance } of instructions) {
    direction = turnToDirection.get([turn, direction])!;
    position = moveBy(position, distance, direction);
  }
  return getManhattanDistance(initialPosition, position);
};
console.log(part1());

const part2 = () => {
  const initialPosition = point(0, 0);
  const seen = ObjectSet.from([initialPosition]);
  let position = initialPosition;
  let direction = Direction.North;
  for (const { turn, distance } of instructions) {
    direction = turnToDirection.get([turn, direction])!;

    for (const _ of range(1, distance)) {
      position = getAdjacentPoint(position, direction);

      if (seen.has(position)) {
        return getManhattanDistance(initialPosition, position);
      }
      seen.add(position);
    }
  }
  unreachable();
};
console.log(part2());
