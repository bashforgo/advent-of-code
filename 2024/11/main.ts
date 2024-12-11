import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
125 17
`
  : await getInput(11);

const stones = input.trim().split(" ").map(Number);

const getNumberOfDigits = (n: number) => {
  return String(n).length;
};
const splitNumber = (n: number, afterDigit: number) => {
  const nString = String(n);
  const firstPart = nString.slice(0, nString.length - afterDigit);
  const secondPart = nString.slice(nString.length - afterDigit);
  return [Number(firstPart), Number(secondPart)];
};

const blink = (stones: number[]) => {
  for (let i = 0; i < stones.length; i++) {
    const value = stones[i];

    if (value === 0) {
      stones[i] = 1;
      continue;
    }

    const numberOfDigits = getNumberOfDigits(value);
    if (numberOfDigits % 2 === 0) {
      const [leftStone, rightStone] = splitNumber(value, numberOfDigits / 2);
      stones.splice(i, 1, leftStone, rightStone);
      i++;
      continue;
    }

    stones[i] = value * 2024;
  }
};

for (let i = 0; i < 25; i++) {
  blink(stones);
}
console.log(stones.length);
