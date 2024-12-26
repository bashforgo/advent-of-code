import { crypto } from "@std/crypto";
import { encodeHex } from "@std/encoding";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
abcdef
`
  : await getInput(2015, 4);

const md5 = (input: string) => {
  const buffer = new TextEncoder().encode(input);
  const resultBuffer = crypto.subtle.digestSync("MD5", buffer);
  return encodeHex(resultBuffer);
};

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
