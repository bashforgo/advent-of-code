import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { identity } from "@utilities/identity.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124
`
  : await getInput(2025, 2);

interface Range {
  start: number;
  end: number;
}

const ranges = input
  .split(",")
  .map((part): Range => {
    const [start, end] = part.split("-").map(Number);
    return { start, end };
  });

const allIDs = ranges
  .flatMap(({ start, end }) => Array.from(range(start, end)));

const part1 = () => {
  const invalidIDRegExp = /^(\d+)\1$/;
  const invalidIDs = allIDs
    .filter((id) => invalidIDRegExp.test(String(id)));
  return sumOf(invalidIDs, identity);
};
console.log(part1());

const part2 = () => {
  const invalidIDRegExp = /^(\d+)\1{1,}$/;
  const invalidIDs = allIDs
    .filter((id) => invalidIDRegExp.test(String(id)));
  return sumOf(invalidIDs, identity);
};
console.log(part2());
