import { maxOf, minOf, sumOf } from "@std/collections";
import { ascend } from "@std/data-structures";
import { getInput } from "@utilities/getInput.ts";
import { pickN } from "@utilities/pickN.ts";
import { identity } from "@utilities/identity.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
5 9 2 8
9 4 7 3
3 8 6 5
`
  : await getInput(2017, 2);

const lines = input.trim().split("\n");
const cells = lines.map((line) => line.split(/\s+/).map((c) => Number(c)));

const part1 = () => {
  return sumOf(
    cells,
    (row) => {
      const min = minOf(row, identity)!;
      const max = maxOf(row, identity)!;
      return max - min;
    },
  );
};
console.log(part1());

const part2 = () => {
  return sumOf(
    cells,
    (row) => {
      const [low, high] = pickN(row.toSorted(ascend), 2).find(([low, high]) =>
        high % low === 0
      )!;
      return high / low;
    },
  );
};
console.log(part2());
