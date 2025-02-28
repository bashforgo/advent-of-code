import { unreachable } from "@std/assert/unreachable";
import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { identity } from "@utilities/identity.ts";
import { repeat } from "@utilities/repeat.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
+1
-2
+3
+1
`
  : await getInput(2018, 1);

const deltas = input.trim().split("\n").map(Number);

const part1 = () => {
  return sumOf(deltas, identity);
};
console.log(part1());

const part2 = () => {
  const repeatingDeltas = repeat(deltas, Infinity).flatMap(identity);
  const seen = new Set<number>();
  let sum = 0;
  for (const delta of repeatingDeltas) {
    sum += delta;
    if (seen.has(sum)) return sum;
    seen.add(sum);
  }
  unreachable();
};
console.log(part2());
