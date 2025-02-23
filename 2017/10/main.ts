import { knotHash } from "@utilities/2017/knotHash/knotHash.ts";
import { knotHashRound } from "@utilities/2017/knotHash/knotHashRound.ts";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
3,4,1,5
`
  : await getInput(2017, 10);

const part1 = () => {
  const lengths = input.split(",").map(Number);
  const [a, b] = knotHashRound(lengths);
  return a * b;
};
console.log(part1());

const part2 = () => {
  return knotHash(input.trim());
};
console.log(part2());
