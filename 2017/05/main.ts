import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
0
3
0
1
-3
`
  : await getInput(2017, 5);

const lines = input.trim().split("\n");
const initialInstructions = lines.map(Number);

const part1 = () => {
  const instructions = [...initialInstructions];
  let steps = 0;
  let pointer = 0;

  while (true) {
    const instruction = instructions[pointer];
    if (instruction == null) break;

    instructions[pointer] += 1;
    pointer += instruction;
    steps += 1;
  }

  return steps;
};
console.log(part1());

const part2 = () => {
  const instructions = [...initialInstructions];
  let steps = 0;
  let pointer = 0;

  while (true) {
    const instruction = instructions[pointer];
    if (instruction == null) break;

    instructions[pointer] += instruction >= 3 ? -1 : 1;
    pointer += instruction;
    steps += 1;
  }

  return steps;
};
console.log(part2());
