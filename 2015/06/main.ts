import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { setPoint } from "@utilities/grid/setPoint.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
turn on 0,0 through 999,999
toggle 0,0 through 999,0
turn off 499,499 through 500,500
`
  : await getInput(2015, 6);

enum InstructionType {
  TurnOn = "TurnOn",
  Toggle = "Toggle",
  TurnOff = "TurnOff",
}

interface Instruction {
  type: InstructionType;
  start: Point;
  end: Point;
}

const instructions = input.trim().split("\n").map((line): Instruction => {
  let match = line.match(/turn on (\d+),(\d+) through (\d+),(\d+)/);
  if (match != null) {
    const [, x1, y1, x2, y2] = match.map(Number);
    return {
      type: InstructionType.TurnOn,
      start: point(x1, y1),
      end: point(x2, y2),
    };
  }
  match = line.match(/toggle (\d+),(\d+) through (\d+),(\d+)/);
  if (match != null) {
    const [, x1, y1, x2, y2] = match.map(Number);
    return {
      type: InstructionType.Toggle,
      start: point(x1, y1),
      end: point(x2, y2),
    };
  }
  match = line.match(/turn off (\d+),(\d+) through (\d+),(\d+)/);
  if (match != null) {
    const [, x1, y1, x2, y2] = match.map(Number);
    return {
      type: InstructionType.TurnOff,
      start: point(x1, y1),
      end: point(x2, y2),
    };
  }
  throw new Error();
});

const part1 = () => {
  const lights: Grid<boolean> = Array.from(
    { length: 1000 },
    () => Array.from({ length: 1000 }, () => false),
  );

  for (const { type, start, end } of instructions) {
    for (let y = start.y; y <= end.y; y++) {
      for (let x = start.x; x <= end.x; x++) {
        const p = point(x, y);
        switch (type) {
          case InstructionType.TurnOn:
            setPoint(lights, p, true);
            break;
          case InstructionType.Toggle:
            setPoint(lights, p, !getPoint(lights, p));
            break;
          case InstructionType.TurnOff:
            setPoint(lights, p, false);
            break;
        }
      }
    }
  }

  return sumOf(
    lights.values().flatMap((x) => x.values()),
    (light) => (light ? 1 : 0),
  );
};
console.log(part1());

const part2 = () => {
  const lights: Grid<number> = Array.from(
    { length: 1000 },
    () => Array.from({ length: 1000 }, () => 0),
  );

  for (const { type, start, end } of instructions) {
    for (let y = start.y; y <= end.y; y++) {
      for (let x = start.x; x <= end.x; x++) {
        const p = point(x, y);
        const v = getPoint(lights, p)!;
        switch (type) {
          case InstructionType.TurnOn:
            setPoint(lights, p, v + 1);
            break;
          case InstructionType.Toggle:
            setPoint(lights, p, v + 2);
            break;
          case InstructionType.TurnOff:
            setPoint(lights, p, Math.max(0, v - 1));
            break;
        }
      }
    }
  }

  return sumOf(
    lights.values().flatMap((x) => x.values()),
    (x) => x,
  );
};
console.log(part2());
