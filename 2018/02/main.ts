import { slidingWindows, zip } from "@std/collections";
import { levenshteinDistance } from "@std/text";
import { countBy } from "@utilities/countBy.ts";
import { getInput } from "@utilities/getInput.ts";
import { identity } from "@utilities/identity.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
abcdef
bababc
abbcde
abcccd
aabcdd
abcdee
ababab
`
  : await getInput(2018, 2);

const ids = input.trim().split("\n");

const part1 = () => {
  const counts = ids.map((id) => countBy(id, identity));
  const twos =
    counts.filter((c) => c.entries().some(([, v]) => v === 2)).length;
  const threes =
    counts.filter((c) => c.entries().some(([, v]) => v === 3)).length;
  return twos * threes;
};
console.log(part1());

const part2 = () => {
  const sorted = [...ids].sort();
  const [[a, b]] = slidingWindows(sorted, 2)
    .filter(([a, b]) => levenshteinDistance(a, b) === 1);
  return zip(a.split(""), b.split(""))
    .filter(([a, b]) => a === b)
    .map(([a]) => a)
    .join("");
};
console.log(part2());
