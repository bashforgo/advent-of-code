import { minOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
dabAcCaCBAcCcaDA
`
  : await getInput(2018, 5);

const initialPolymer = input.trim();

const A_CHAR_CODE = "a".charCodeAt(0);
const Z_CHAR_CODE = "z".charCodeAt(0);

const REACT_REG_EXP = new RegExp(
  range(A_CHAR_CODE, Z_CHAR_CODE)
    .map((charCode) => {
      const char = String.fromCharCode(charCode);
      const upper = char.toUpperCase();
      return `${char}${upper}|${upper}${char}`;
    })
    .toArray()
    .join("|"),
  "g",
);

const react = (inputPolymer: string) => {
  let polymer = inputPolymer;
  while (true) {
    const newPolymer = polymer.replaceAll(REACT_REG_EXP, "");
    if (newPolymer === polymer) return polymer;
    polymer = newPolymer;
  }
};
const part1 = () => {
  return react(initialPolymer).length;
};
console.log(part1());

const part2 = () => {
  const units = range(A_CHAR_CODE, Z_CHAR_CODE)
    .map((charCode) => String.fromCharCode(charCode))
    .toArray();
  const reactionResultsByRemovingUnit = units.map((unit) => {
    const polymer = initialPolymer
      .replaceAll(new RegExp(unit, "gi"), "");
    return react(polymer);
  });
  return minOf(reactionResultsByRemovingUnit, (polymer) => polymer.length);
};
console.log(part2());
