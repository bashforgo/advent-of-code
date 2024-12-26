import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
ugknbfddgicrmopn
aaa
jchzalrnumimnmhp
haegwjzuvuyypxyu
dvszwmarrgswjxmb
`
  : await getInput(2015, 5);

const words = input.trim().split("\n");

const part1 = () => {
  const hasThreeVowelsRegExp = /(.*[aeiou]){3}/;
  const hasDoubleLetterRegExp = /(.)\1/;
  const hasDisallowedStringsRegExp = /ab|cd|pq|xy/;

  return sumOf(words, (word) => {
    const isNice = hasThreeVowelsRegExp.test(word) &&
      hasDoubleLetterRegExp.test(word) &&
      !hasDisallowedStringsRegExp.test(word);
    return isNice ? 1 : 0;
  });
};
console.log(part1());

const part2 = () => {
  const pairRepeatsRegExp = /(..).*\1/;
  const letterRepeatsWithGapRegExp = /(.).\1/;

  return sumOf(words, (word) => {
    const isNice = pairRepeatsRegExp.test(word) &&
      letterRepeatsWithGapRegExp.test(word);
    return isNice ? 1 : 0;
  });
};
console.log(part2());
