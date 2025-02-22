import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
0: 3
1: 2
4: 4
6: 4
`
  : await getInput(2017, 13);

const lines = input.trim().split("\n");

interface Scanner {
  depth: number;
  range: number;
}

const scanners: Scanner[] = lines.map((line) => {
  const [depth, range] = line.split(": ").map(Number);
  return { depth, range };
});

const computeScannerDepthAtTime = (scanner: Scanner, time: number) => {
  const cycleTime = scanner.range * 2 - 2;
  const cyclePosition = time % cycleTime;
  return cyclePosition < scanner.range
    ? cyclePosition
    : cycleTime - cyclePosition;
};

const part1 = () => {
  return sumOf(
    scanners,
    (scanner) =>
      computeScannerDepthAtTime(scanner, scanner.depth) === 0
        ? scanner.depth * scanner.range
        : 0,
  );
};
console.log(part1());

const part2 = () => {
  return range(1, Infinity)
    .find((delay) =>
      scanners.every(
        (scanner) =>
          computeScannerDepthAtTime(scanner, scanner.depth + delay) !== 0,
      )
    );
};
console.log(part2());
