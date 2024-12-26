import { memoize } from "@std/cache";
import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`
  : await getInput(2024, 19);

const [towelPatternsString, desiredDesignsString] = input.trim().split("\n\n");
const towelPatterns = towelPatternsString.split(", ");
const desiredDesigns = desiredDesignsString.split("\n");

const possiblePatternsRegExp = new RegExp(`^(${towelPatterns.join("|")})+$`);
const possiblePatterns = desiredDesigns.filter((line) =>
  possiblePatternsRegExp.test(line)
);

console.log(possiblePatterns.length);

const towelPatternsSet = new Set(towelPatterns);

// deno-lint-ignore no-unused-vars
function* allSplits(string: string): Generator<string[]> {
  yield [string];
  if (string.length === 0) {
    return;
  } else {
    for (let i = 1; i < string.length; i++) {
      const prefix = string.slice(0, i);
      const suffix = string.slice(i);
      for (const suffixSplits of allSplits(suffix)) {
        yield [prefix, ...suffixSplits];
      }
    }
  }
}

// deno-lint-ignore no-unused-vars
function* towelPatternSplits(string: string): Generator<string[]> {
  if (string.length === 0) {
    yield [];
  } else {
    if (towelPatternsSet.has(string)) yield [string];
    for (let i = 1; i < string.length; i++) {
      const prefix = string.slice(0, i);
      if (!towelPatternsSet.has(prefix)) continue;

      const suffix = string.slice(i);
      for (const suffixSplits of towelPatternSplits(suffix)) {
        yield [prefix, ...suffixSplits];
      }
    }
  }
}

const countTowelPatternSplits = memoize((string: string): number => {
  if (string.length === 0) return 0;

  let result = 0;
  if (towelPatternsSet.has(string)) result++;

  for (let i = 1; i < string.length; i++) {
    const prefix = string.slice(0, i);
    if (!towelPatternsSet.has(prefix)) continue;

    const suffix = string.slice(i);
    result += countTowelPatternSplits(suffix);
  }

  return result;
});

console.log(
  sumOf(
    desiredDesigns,
    (d) => countTowelPatternSplits(d),
  ),
);
