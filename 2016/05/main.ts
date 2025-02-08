import { getInput } from "@utilities/getInput.ts";
import { md5 } from "@utilities/md5.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
abc
`
  : await getInput(2016, 5);

const doorId = input.trim();

const part1 = () => {
  let password = "";
  for (const i of range(0, Infinity)) {
    const hash = md5(`${doorId}${i}`);

    if (!hash.startsWith("00000")) continue;

    password = `${password}${hash[5]}`;
    if (password.length >= 8) break;
  }
  return password;
};
console.log(part1());

const part2 = () => {
  const PLACEHOLDER = "_";

  let password = PLACEHOLDER.repeat(8);
  for (const i of range(0, Infinity)) {
    const hash = md5(`${doorId}${i}`);

    if (!hash.startsWith("00000")) continue;

    const position = Number(hash[5]);
    if (Number.isNaN(position)) continue;
    if (position > 7) continue;
    if (password[position] !== PLACEHOLDER) continue;

    password = `${password.slice(0, position)}${hash[6]}${
      password.slice(position + 1)
    }`;
    if (!password.includes(PLACEHOLDER)) break;
  }
  return password;
};
console.log(part2());
