import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
""
"abc"
"aaa\\"aaa"
"\\x27"
`
  : await getInput(2015, 8);

const strings = input.trim().split("\n");

const part1 = () => {
  const codeSpace = sumOf(strings, (string) => string.length);
  const memorySpace = sumOf(
    strings,
    (string) =>
      JSON.parse(string.replaceAll(/\\x([\da-f]{2})/g, "\\u00$1")).length,
  );
  return codeSpace - memorySpace;
};
console.log(part1());

const part2 = () => {
  const codeSpace = sumOf(strings, (string) => string.length);
  const encodedSpace = sumOf(
    strings,
    (string) => JSON.stringify(string).length,
  );
  return encodedSpace - codeSpace;
};
console.log(part2());
