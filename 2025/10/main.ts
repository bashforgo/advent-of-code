import { sumOf } from "@std/collections/sum-of";
import { dijkstras, getPath } from "@utilities/dijkstras.ts";
import { getInput } from "@utilities/getInput.ts";
import { throw_ } from "@utilities/throw.ts";
import { equalTo, solve } from "yalps";

const DEBUG = false;
const input = DEBUG
  ? `\
[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}
`
  : await getInput(2025, 10);

type Bitmask = number & { Bitmask: true };
const asBitmask = (n: number) => n as Bitmask;

interface Machine {
  readonly targetState: Bitmask;
  readonly buttons: readonly number[][];
  readonly buttonBitmasks: readonly Bitmask[];
  readonly joltage: readonly number[];
}

const lines = input.trim().split("\n");
const targetStateRegExp = /\[([.#]+)\]/;
const buttonRegExp = /\(([\d,]+)\)/g;
const joltageRegExp = /\{([\d,]+)\}/;
const machines = lines.map((line): Machine => {
  const [, targetStateMatch] = line.match(targetStateRegExp) ?? throw_();
  const buttonMatches = line.matchAll(buttonRegExp).toArray();
  const [, joltageMatch] = line.match(joltageRegExp) ?? throw_();
  const buttons = buttonMatches.map(([, buttonsMatch]) =>
    buttonsMatch.split(",").map(Number)
  );

  return {
    targetState: (() => {
      let targetState = 0;
      for (const [i, char] of targetStateMatch.split("").entries()) {
        if (char === ".") continue;
        targetState |= 1 << i;
      }
      return asBitmask(targetState);
    })(),
    buttons,
    buttonBitmasks: buttons.map((bits) => {
      let button = 0;
      for (const bit of bits) {
        button |= 1 << bit;
      }
      return asBitmask(button);
    }),
    joltage: joltageMatch.split(",").map(Number),
  };
});

const part1 = () => {
  return sumOf(
    machines,
    (machine) => {
      const { previous } = dijkstras<Bitmask>(
        asBitmask(0),
        function* (state) {
          if (state === machine.targetState) return;
          for (const button of machine.buttonBitmasks) {
            yield asBitmask(state ^ button);
          }
        },
        () => 1,
      );
      const path = getPath(machine.targetState, previous);
      return path.length - 1;
    },
  );
};
console.log(part1());

const part2 = () => {
  return sumOf(machines, (machine) => {
    const solution = solve({
      direction: "minimize",
      objective: "presses",
      variables: new Map(
        machine.buttons.map((button, i) =>
          [
            `b${i}`,
            new Map(
              [
                ["presses", 1],
                ...button.map((joltage) => [`j${joltage}`, 1] as const),
              ],
            ),
          ] as const
        ),
      ),
      constraints: new Map(
        machine.joltage.map((joltage, i) =>
          [`j${i}`, equalTo(joltage)] as const
        ),
      ),
      integers: true,
    });
    if (solution.status !== "optimal") throw new Error("No solution found");
    return solution.result;
  });
};
console.log(part2());
