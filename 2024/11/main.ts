import { memoize } from "@std/cache";
import { sumOf } from "@std/collections";
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

const blink = memoize((stone: number, times: number): number => {
  if (times === 0) return 1;

  if (stone === 0) return blink(1, times - 1);

  const numberOfDigits = getNumberOfDigits(stone);
  if (numberOfDigits % 2 === 0) {
    const [leftStone, rightStone] = splitNumber(stone, numberOfDigits / 2);
    return blink(leftStone, times - 1) + blink(rightStone, times - 1);
  }

  return blink(stone * 2024, times - 1);
});

console.log(sumOf(stones, (stone) => blink(stone, 75)));
