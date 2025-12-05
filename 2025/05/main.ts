import { sumOf } from "@std/collections";
import { ascend } from "@std/data-structures";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
3-5
10-14
16-20
12-18

1
5
8
11
17
32
`
  : await getInput(2025, 5);

interface Range {
  start: number;
  end: number;
}

const [inputFreshRanges, inputIngredients] = input
  .trim()
  .split("\n\n");

const freshRanges = inputFreshRanges
  .split("\n")
  .map((line): Range => {
    const [start, end] = line.split("-").map(Number);
    return { start, end };
  });

const freshRangesSortedByStart = freshRanges
  .toSorted((a, b) => ascend(a.start, b.start) || ascend(a.end, b.end));

const ingredients = inputIngredients
  .split("\n")
  .map(Number);

const findFreshRange = (ingredient: number) =>
  freshRangesSortedByStart
    .values()
    .filter(({ start }) => start <= ingredient)
    .find(({ end }) => end >= ingredient);

const part1 = () => {
  return sumOf(
    ingredients,
    (ingredient) => findFreshRange(ingredient) != null ? 1 : 0,
  );
};
console.log(part1());

const part2 = () => {
  let ingredient = freshRangesSortedByStart[0].start;
  let numberOfFreshIngredients = 0;

  while (true) {
    const range = findFreshRange(ingredient);

    if (range == null) {
      const nextRange = freshRangesSortedByStart
        .find(({ start }) => start > ingredient);
      if (nextRange == null) break;
      ingredient = nextRange.start;
    } else {
      numberOfFreshIngredients += range.end - ingredient + 1;
      ingredient = range.end + 1;
    }
  }

  return numberOfFreshIngredients;
};
console.log(part2());
