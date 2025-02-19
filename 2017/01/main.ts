import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
12131415
`
  : await getInput(2017, 1);

const captcha = input.trim();

const part1 = () => {
  const circularCaptcha = `${captcha}${captcha[0]}`;
  return sumOf(
    circularCaptcha.matchAll(/(\d)(?=\1)/g),
    ([, digit]) => Number(digit),
  );
};
console.log(part1());

const part2 = () => {
  const halfLength = captcha.length / 2;
  const oneHalfCaptcha = `${captcha}${captcha.slice(0, halfLength)}`;
  const regExp = new RegExp(`(\\d)(?=.{${halfLength - 1}}\\1)`, "g");
  return sumOf(oneHalfCaptcha.matchAll(regExp), ([, digit]) => Number(digit));
};
console.log(part2());
