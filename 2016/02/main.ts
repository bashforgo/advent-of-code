import { unreachable } from "@std/assert";
import { getInput } from "@utilities/getInput.ts";
import { Direction } from "@utilities/grid/Direction.ts";
import { getAdjacentPoint } from "@utilities/grid/getAdjacentPoint.ts";
import { point } from "@utilities/grid/Point.ts";
import { ObjectMap } from "@utilities/ObjectMap.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
ULL
RRDDD
LURDL
UUUUD
`
  : await getInput(2016, 2);

const lines = input.trim().split("\n");
const instructions = lines.map((line) =>
  line.split("").map((char) => {
    switch (char) {
      case "U":
        return Direction.North;
      case "R":
        return Direction.East;
      case "D":
        return Direction.South;
      case "L":
        return Direction.West;
      default:
        unreachable();
    }
  })
);

const part1 = () => {
  /*
  1 2 3
  4 5 6
  7 8 9
  */
  const keypad = ObjectMap.from([
    [point(0, 0), 1],
    [point(1, 0), 2],
    [point(2, 0), 3],
    [point(0, 1), 4],
    [point(1, 1), 5],
    [point(2, 1), 6],
    [point(0, 2), 7],
    [point(1, 2), 8],
    [point(2, 2), 9],
  ]);

  const code: number[] = [];
  let position = point(1, 1); // 5
  for (const instruction of instructions) {
    for (const direction of instruction) {
      const newPositionCandidate = getAdjacentPoint(position, direction);
      if (!keypad.has(newPositionCandidate)) continue;
      position = newPositionCandidate;
    }
    code.push(keypad.get(position)!);
  }
  return code.join("");
};
console.log(part1());

const part2 = () => {
  /*
      1
    2 3 4
  5 6 7 8 9
    A B C
      D
  */
  const keypad = ObjectMap.from([
    [point(2, 0), "1"],
    [point(1, 1), "2"],
    [point(2, 1), "3"],
    [point(3, 1), "4"],
    [point(0, 2), "5"],
    [point(1, 2), "6"],
    [point(2, 2), "7"],
    [point(3, 2), "8"],
    [point(4, 2), "9"],
    [point(1, 3), "A"],
    [point(2, 3), "B"],
    [point(3, 3), "C"],
    [point(2, 4), "D"],
  ]);

  const code: string[] = [];
  let position = point(0, 2); // 5
  for (const instruction of instructions) {
    for (const direction of instruction) {
      const newPositionCandidate = getAdjacentPoint(position, direction);
      if (!keypad.has(newPositionCandidate)) continue;
      position = newPositionCandidate;
    }
    code.push(keypad.get(position)!);
  }
  return code.join("");
};
console.log(part2());
