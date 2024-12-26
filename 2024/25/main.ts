import { partition, sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { transpose } from "@utilities/grid/transpose.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####
`
  : await getInput(2024, 25);

const locksAndKeys = input.split("\n\n");
const [locksStrings, keysStrings] = partition(
  locksAndKeys,
  (lockOrKey) => lockOrKey.startsWith("#####"),
);

const locks = locksStrings
  .map((s) => s.split("\n").map((row) => row.split("")))
  .map((lockGrid) => transpose(lockGrid))
  .map((transposedLock) =>
    transposedLock.map((row) => sumOf(row, (c) => c === "#" ? 1 : 0) - 1)
  );

const keys = keysStrings
  .map((s) => s.split("\n").map((row) => row.split("")))
  .map((keyGrid) => transpose(keyGrid))
  .map((transposedKey) =>
    transposedKey.map((row) => sumOf(row, (c) => c === "#" ? 1 : 0) - 1)
  );

const part1 = () => {
  const MAX_HEIGHT = 5;
  const WIDTH = 5;
  let numberOfFittingCombinations = 0;
  for (const lock of locks) {
    keys: for (const key of keys) {
      for (let i = 0; i < WIDTH; i++) {
        const fits = lock[i] + key[i] <= MAX_HEIGHT;
        if (!fits) continue keys;
      }
      numberOfFittingCombinations++;
    }
  }
  return numberOfFittingCombinations;
};
console.log(part1());
