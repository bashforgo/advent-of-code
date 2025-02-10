import { getInput } from "@utilities/getInput.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
Disc #1 has 5 positions; at time=0, it is at position 4.
Disc #2 has 2 positions; at time=0, it is at position 1.
`
  : await getInput(2016, 15);

const lines = input.trim().split("\n");

interface Disc {
  readonly index: number;
  readonly numberOfPositions: number;
  readonly initialPosition: number;
}

const discs = lines.map((line) => {
  const [, index, numberOfPositions, initialPosition] = line.match(
    /Disc #(\d+) has (\d+) positions; at time=0, it is at position (\d+)\./,
  )!;
  return {
    index: Number(index),
    numberOfPositions: Number(numberOfPositions),
    initialPosition: Number(initialPosition),
  } satisfies Disc;
});

const getPositionAtTime = (
  { numberOfPositions, initialPosition }: Disc,
  time: number,
) => {
  return (initialPosition + time) % numberOfPositions;
};

const canPassDiscIfDroppedAtTime = (disc: Disc, time: number) => {
  return getPositionAtTime(disc, time + disc.index) === 0;
};

const part1 = () => {
  const [firstDisc, ...restOfDiscs] = discs;
  const firstTimeFirstDiscCanBePassed = firstDisc.numberOfPositions -
    firstDisc.initialPosition - 1;
  for (
    const time of range(
      firstTimeFirstDiscCanBePassed,
      Infinity,
      firstDisc.numberOfPositions,
    )
  ) {
    if (
      restOfDiscs.every((disc) => canPassDiscIfDroppedAtTime(disc, time))
    ) {
      return time;
    }
  }
};
console.log(part1());

const part2 = () => {
  const secondToLastDisc = discs.at(-1)!;
  const [firstDisc, ...restOfDiscs] = discs.concat({
    index: secondToLastDisc.index + 1,
    numberOfPositions: 11,
    initialPosition: 0,
  });

  const firstTimeFirstDiscCanBePassed = firstDisc.numberOfPositions -
    firstDisc.initialPosition - 1;
  for (
    const time of range(
      firstTimeFirstDiscCanBePassed,
      Infinity,
      firstDisc.numberOfPositions,
    )
  ) {
    if (
      restOfDiscs.every((disc) => canPassDiscIfDroppedAtTime(disc, time))
    ) {
      return time;
    }
  }
};
console.log(part2());
