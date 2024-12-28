import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
1
`
  : await getInput(2015, 10);

const lookAndSay = (input: string) => {
  let result = "";
  let current = input[0];
  let count = 1;
  for (let i = 1; i < input.length; i++) {
    if (input[i] === current) {
      count++;
    } else {
      result += `${count}${current}`;
      current = input[i];
      count = 1;
    }
  }
  result += `${count}${current}`;

  return result;
};

const part1 = () => {
  let current = input.trim();
  for (let i = 0; i < 40; i++) {
    current = lookAndSay(current);
  }

  return current.length;
};
console.log(part1());

const part2 = () => {
  let current = input.trim();
  for (let i = 0; i < 50; i++) {
    current = lookAndSay(current);
  }

  return current.length;
};
console.log(part2());
