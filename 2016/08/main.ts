import { unreachable } from "@std/assert";
import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { getColumn } from "@utilities/grid/getColumn.ts";
import { getRow } from "@utilities/grid/getRow.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { point } from "@utilities/grid/Point.ts";
import { setColumn } from "@utilities/grid/setColumn.ts";
import { setPoint } from "@utilities/grid/setPoint.ts";
import { setRow } from "@utilities/grid/setRow.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
rect 3x2
rotate column x=1 by 1
rotate row y=0 by 4
rotate column x=1 by 1
`
  : await getInput(2016, 8);

const [width, height] = DEBUG ? [7, 3] : [50, 6];

const lines = input.trim().split("\n");

enum InstructionType {
  Rect = "rect",
  RotateRow = "rotate row",
  RotateColumn = "rotate column",
}

type Instruction =
  | { type: InstructionType.Rect; width: number; height: number }
  | { type: InstructionType.RotateRow; row: number; amount: number }
  | { type: InstructionType.RotateColumn; column: number; amount: number };

const instructions = lines.map((line): Instruction => {
  const [, type, ...rest] = line.match(/(rect) (\d+)x(\d+)/) ??
    line.match(/(rotate row) y=(\d+) by (\d+)/) ??
    line.match(/(rotate column) x=(\d+) by (\d+)/) ??
    unreachable();

  switch (type) {
    case InstructionType.Rect: {
      const [width, height] = rest.map(Number);
      return { type, width, height };
    }
    case InstructionType.RotateRow: {
      const [row, amount] = rest.map(Number);
      return { type, row, amount };
    }
    case InstructionType.RotateColumn: {
      const [column, amount] = rest.map(Number);
      return { type, column, amount };
    }
    default:
      unreachable();
  }
});

type Screen = Grid<boolean>;

const applyRect = (screen: Screen, width: number, height: number) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      setPoint(screen, point(x, y), true);
    }
  }
};

const applyRotateRow = (screen: Screen, row: number, amount: number) => {
  const currentRow = getRow(screen, row);
  const shiftedPixels = currentRow.slice(0, -amount);
  const rotatedPixels = currentRow.slice(-amount);
  setRow(screen, row, [...rotatedPixels, ...shiftedPixels]);
};

const applyRotateColumn = (screen: Screen, column: number, amount: number) => {
  const currentColumn = getColumn(screen, column);
  const shiftedPixels = currentColumn.slice(0, -amount);
  const rotatedPixels = currentColumn.slice(-amount);
  setColumn(screen, column, [...rotatedPixels, ...shiftedPixels]);
};

const applyInstruction = (screen: Screen, instruction: Instruction) => {
  switch (instruction.type) {
    case InstructionType.Rect:
      applyRect(screen, instruction.width, instruction.height);
      break;
    case InstructionType.RotateRow:
      applyRotateRow(screen, instruction.row, instruction.amount);
      break;
    case InstructionType.RotateColumn:
      applyRotateColumn(screen, instruction.column, instruction.amount);
      break;
  }
};

const part1 = () => {
  const screen: Screen = range(1, height).map(() =>
    range(1, width).map(() => false).toArray()
  ).toArray();

  for (const instruction of instructions) {
    applyInstruction(screen, instruction);
  }

  return sumOf(screen.flat(), (pixel) => pixel ? 1 : 0);
};
console.log(part1());

const part2 = () => {
  const screen: Screen = range(1, height).map(() =>
    range(1, width).map(() => false).toArray()
  ).toArray();

  for (const instruction of instructions) {
    applyInstruction(screen, instruction);
  }

  return screen
    .map((row) => row.map((pixel) => pixel ? "#" : ".").join(""))
    .join("\n");
};
console.log(part2());
