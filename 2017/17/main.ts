import { getInput } from "@utilities/getInput.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
3
`
  : await getInput(2017, 17);

const stepAheadBy = Number(input.trim());

const part1 = () => {
  const buffer = [0];
  let currentPosition = 0;
  for (const i of range(1, 2017)) {
    currentPosition = (currentPosition + stepAheadBy) % buffer.length + 1;
    buffer.splice(currentPosition, 0, i);
  }
  return buffer[(currentPosition + 1) % buffer.length];
};
console.log(part1());

const part2 = () => {
  let currentPosition = 0;
  let valueAfterZero = 0;
  for (const i of range(1, 50_000_000)) {
    currentPosition = (currentPosition + stepAheadBy) % i + 1;
    if (currentPosition === 1) {
      valueAfterZero = i;
    }
  }
  return valueAfterZero;
};
console.log(part2());
