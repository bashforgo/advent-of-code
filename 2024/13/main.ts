import { sumOf } from "@std/collections";
import { addPoints } from "@utilities/addPoints.ts";
import { getInput } from "@utilities/getInput.ts";
import { Point, point } from "@utilities/Point.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
`
  : await getInput(13);

const clawMachineConfigStrings = input.trim().split("\n\n");
const clawMachineConfigs = clawMachineConfigStrings.map((configString) => {
  const [buttonA, buttonB, prize] = configString.split("\n");

  const [, ax, ay] = buttonA.match(/X\+(\d+), Y\+(\d+)/)!;
  const [, bx, by] = buttonB.match(/X\+(\d+), Y\+(\d+)/)!;
  const [, px, py] = prize.match(/X=(\d+), Y=(\d+)/)!;

  return {
    buttonA: point(Number(ax), Number(ay)),
    buttonB: point(Number(bx), Number(by)),
    prize: point(Number(px), Number(py)),
  };
});

/** Cramer's rule */
const solve = (A: Point, B: Point, P: Point) => {
  const det = A.x * B.y - B.x * A.y;
  const p = (P.x * B.y - B.x * P.y) / det;
  const q = (A.x * P.y - P.x * A.y) / det;
  return Number.isInteger(p) && Number.isInteger(q) ? 3 * p + q : NaN;
};

const part1Result = clawMachineConfigs.map(({ buttonA, buttonB, prize }) =>
  solve(buttonA, buttonB, prize)
);
console.log(sumOf(part1Result.filter((x) => !Number.isNaN(x)), (x) => x));

const part2Result = clawMachineConfigs
  .map(({ buttonA, buttonB, prize }) => ({
    buttonA,
    buttonB,
    prize: addPoints(point(10000000000000, 10000000000000), prize),
  }))
  .map(({ buttonA, buttonB, prize }) => solve(buttonA, buttonB, prize))
  .filter((x) => !Number.isNaN(x));
console.log(sumOf(part2Result, (x) => x));
