import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";

const input = await getInput(2015, 1);

const part1 = () => {
  const ups = sumOf(input.trim(), (char) => char === "(" ? 1 : 0);
  const downs = sumOf(input.trim(), (char) => char === ")" ? 1 : 0);
  return ups - downs;
};
console.log(part1());

const part2 = () => {
  let floor = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === "(") {
      floor++;
    }
    if (char === ")") {
      floor--;
    }
    if (floor === -1) {
      return i + 1;
    }
  }
};
console.log(part2());
