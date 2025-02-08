import { getInput } from "@utilities/getInput.ts";
import { transpose } from "@utilities/grid/transpose.ts";

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
    new Map(
      Map.groupBy(position, (c) => c)
        .entries()
        .map(([c, cs]) => [c, cs.length]),
    )
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
    new Map(
      Map.groupBy(position, (c) => c)
        .entries()
        .map(([c, cs]) => [c, cs.length]),
    )
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
