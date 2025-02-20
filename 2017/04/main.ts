import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
aa bb cc dd ee
aa bb cc dd aa
aa bb cc dd aaa
abcde fghij
abcde xyz ecdab
a ab abc abd abf abj
iiii oiii ooii oooi oooo
oiii ioii iioi iiio
`
  : await getInput(2017, 4);

const passphrases = input.trim().split("\n");

const part1 = () => {
  const isPassphraseValid = (passphrase: string) => {
    const words = passphrase.split(" ");
    const seen = new Set<string>();
    for (const word of words) {
      if (seen.has(word)) return false;
      seen.add(word);
    }
    return true;
  };

  return passphrases.filter((passphrase) => isPassphraseValid(passphrase))
    .length;
};
console.log(part1());

const part2 = () => {
  const isPassphraseValid = (passphrase: string) => {
    const words = passphrase.split(" ");
    const seen = new Set<string>();
    for (const word of words) {
      const sortedWord = word.split("").sort().join("");
      if (seen.has(sortedWord)) return false;
      seen.add(sortedWord);
    }
    return true;
  };

  return passphrases.filter((passphrase) => isPassphraseValid(passphrase))
    .length;
};
console.log(part2());
