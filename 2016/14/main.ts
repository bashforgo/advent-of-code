import { memoize } from "@std/cache";
import { getInput } from "@utilities/getInput.ts";
import { md5 } from "@utilities/md5.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
abc
`
  : await getInput(2016, 14);

const salt = input.trim();

const solve = (hashFunction: (input: string) => string) => {
  const checkNext1000HashesForPattern = (
    startIndex: number,
    pattern: string,
  ) => {
    return range(startIndex, startIndex + 999)
      .some((i) => {
        const hash = hashFunction(`${salt}${i}`);
        return hash.includes(pattern);
      });
  };

  return range(0, Infinity)
    .filter((i) => {
      const hash = hashFunction(`${salt}${i}`);
      const tripletMatch = hash.match(/(.)\1\1/);
      if (tripletMatch == null) return false;

      const [, repeatedCharacter] = tripletMatch;
      return checkNext1000HashesForPattern(i + 1, repeatedCharacter.repeat(5));
    })
    .drop(63)
    .take(1)
    .next()
    .value!;
};

const part1 = () => {
  return solve(memoize(md5));
};
console.log(part1());

const part2 = () => {
  return solve(memoize((input) => {
    let hash = input;
    for (const _ of range(1, 2017)) {
      hash = md5(hash);
    }
    return hash;
  }));
};
console.log(part2());
