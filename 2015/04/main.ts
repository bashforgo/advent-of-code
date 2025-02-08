import { getInput } from "@utilities/getInput.ts";
import { md5 } from "@utilities/md5.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
abcdef
`
  : await getInput(2015, 4);

const part1 = () => {
  for (let i = 0;; i++) {
    const hash = md5(`${input.trim()}${i}`);
    if (hash.startsWith("0".repeat(5))) return i;
  }
};
console.log(part1());

const part2 = () => {
  for (let i = 0;; i++) {
    const hash = md5(`${input.trim()}${i}`);
    if (hash.startsWith("0".repeat(6))) return i;
  }
};
console.log(part2());
