import { slidingWindows } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
ghijklmn
`
  : await getInput(2015, 11);

const PASSWORD_LENGTH = 8;

const increasingStraightPolicy = (password: string) => {
  const charCodes = password.split("").map((c) => c.charCodeAt(0));
  const charCodeTriplets = slidingWindows(charCodes, 3);
  return charCodeTriplets.some(([a, b, c]) => a + 1 === b && b + 1 === c);
};

const forbiddenLettersPolicy = (password: string) => {
  return !/[iol]/.test(password);
};

const twoDoubleLetterPairsPolicy = (password: string) => {
  const doubleLetterRegex = /([a-z])\1/g;
  const doubleLetterMatches = password.match(doubleLetterRegex) ?? [];
  return doubleLetterMatches.length >= 2;
};

const isValidPassword = (password: string) => {
  return (
    increasingStraightPolicy(password) &&
    forbiddenLettersPolicy(password) &&
    twoDoubleLetterPairsPolicy(password)
  );
};

const incrementPassword = (password: string) => {
  const passwordChars = password.split("");
  for (let i = PASSWORD_LENGTH - 1; i >= 0; i--) {
    const char = passwordChars[i];
    if (char === "z") {
      passwordChars[i] = "a";
    } else {
      passwordChars[i] = String.fromCharCode(char.charCodeAt(0) + 1);
      break;
    }
  }
  return passwordChars.join("");
};

const part1 = () => {
  let password = input.trim();
  while (!isValidPassword(password)) {
    password = incrementPassword(password);
  }
  return password;
};
console.log(part1());

const part2 = () => {
  let password = part1();
  password = incrementPassword(password);
  while (!isValidPassword(password)) {
    password = incrementPassword(password);
  }
  return password;
};
console.log(part2());
