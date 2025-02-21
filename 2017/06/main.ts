import { maxBy } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
0	2	7	0
`
  : await getInput(2017, 6);

const initialBanks = input.trim().split("\t").map(Number);
const numberOfBanks = initialBanks.length;

const reallocationRoutine = (banks: number[]) => {
  const [maxBankIndex, maxBankValue] = maxBy(
    banks.entries(),
    ([, blocks]) => blocks,
  )!;

  banks[maxBankIndex] = 0;
  for (const i of range(1, maxBankValue)) {
    banks[(maxBankIndex + i) % numberOfBanks]++;
  }
};

const computeCycleLength = (banks: number[]) => {
  const seen = ObjectSet.from([banks]);

  let numberOfCycles = 0;
  while (true) {
    numberOfCycles++;

    reallocationRoutine(banks);

    if (seen.has(banks)) break;
    seen.add(banks);
  }

  return numberOfCycles;
};

const part1 = () => {
  const banks = [...initialBanks];
  return computeCycleLength(banks);
};
console.log(part1());

const part2 = () => {
  const banks = [...initialBanks];
  computeCycleLength(banks);
  return computeCycleLength(banks);
};
console.log(part2());
