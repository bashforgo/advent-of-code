import { countBy } from "@utilities/countBy.ts";
import { getInput } from "@utilities/getInput.ts";
import { transpose } from "@utilities/grid/transpose.ts";
import { identity } from "@utilities/identity.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
eedadn
drvtee
eandsr
raavrd
atevrs
tsrnev
sdttsa
rasrtv
nssdts
ntnada
svetve
tesnvt
vntsnd
vrdear
dvrsen
enarar
`
  : await getInput(2016, 6);

const lines = input.trim().split("\n");
const characterArrays = lines.map((line) => line.split(""));

const part1 = () => {
  const positions = transpose(characterArrays);
  const positionCharacterFrequencies = positions.map((position) =>
    countBy(position, identity)
  );
  return positionCharacterFrequencies
    .map((frequency) => {
      const [[mostFrequentCharacter]] = frequency.entries()
        .toArray()
        .sort(([, a], [, b]) => b - a);
      return mostFrequentCharacter;
    })
    .join("");
};
console.log(part1());

const part2 = () => {
  const positions = transpose(characterArrays);
  const positionCharacterFrequencies = positions.map((position) =>
    countBy(position, identity)
  );
  return positionCharacterFrequencies
    .map((frequency) => {
      const [[leastFrequentCharacter]] = frequency.entries()
        .toArray()
        .sort(([, a], [, b]) => a - b);
      return leastFrequentCharacter;
    })
    .join("");
};
console.log(part2());
