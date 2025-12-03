import { maxBy, sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { range } from "@utilities/range.ts";
import { throw_ } from "@utilities/throw.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
987654321111111
811111111111119
234234234234278
818181911112111
`
  : await getInput(2025, 3);

const banks = input
  .trim()
  .split("\n");

const part1 = () => {
  function* regExpsGenerator() {
    for (let i = 99; i >= 11; i--) {
      const digits = String(i).split("").join(".*");
      yield [i, new RegExp(digits)] as const;
    }
  }
  const regExps = Array.from(regExpsGenerator());

  return sumOf(
    banks,
    (bank) => regExps.find(([_, re]) => re.test(bank))?.[0] ?? throw_(),
  );
};
console.log(part1());

const part2 = () => {
  const NUMBER_OF_PICKS = 12;
  const length = banks[0].length;

  return sumOf(banks, (bank) => {
    const digits = bank.split("").map(Number);

    let lastPickedIndex = -1;
    const pickedDigits: number[] = [];
    for (const pick of range(1, NUMBER_OF_PICKS)) {
      const [pickedIndex, pickedDigit] = maxBy(
        digits
          .entries()
          .drop(lastPickedIndex + 1)
          .take(length - (NUMBER_OF_PICKS - pick) - lastPickedIndex - 1),
        ([_, digit]) => digit,
      ) ?? throw_();
      lastPickedIndex = pickedIndex;
      pickedDigits.push(pickedDigit);
    }

    return Number(pickedDigits.join(""));
  });
};
console.log(part2());
