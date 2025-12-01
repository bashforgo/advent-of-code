import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
L68
L30
R48
L5
R60
L55
L1
L99
R14
L82
`
  : await getInput(2025, 1);

const STARTING_POSITION = 50;
const PASSWORD_POSITION = 0;
const FIRST_POSITION = 0;
const LAST_POSITION = 99;

enum Direction {
  LEFT = "L",
  RIGHT = "R",
}

interface Rotation {
  direction: Direction;
  amount: number;
}

const rotations = input
  .trim()
  .split("\n")
  .map((line): Rotation => {
    const direction = line.charAt(0) as Direction;
    const amount = Number(line.slice(1));
    return { direction, amount };
  });

const part1 = () => {
  let currentPosition = STARTING_POSITION;
  let numberOfClicksAtPasswordPosition = 0;

  for (const rotation of rotations) {
    const direction = rotation.direction === Direction.LEFT ? -1 : 1;

    for (let i = 0; i < rotation.amount; i++) {
      currentPosition += direction;

      if (currentPosition < FIRST_POSITION) {
        currentPosition = LAST_POSITION;
      } else if (currentPosition > LAST_POSITION) {
        currentPosition = FIRST_POSITION;
      }
    }

    if (currentPosition === PASSWORD_POSITION) {
      numberOfClicksAtPasswordPosition++;
    }
  }

  return numberOfClicksAtPasswordPosition;
};
console.log(part1());

const part2 = () => {
  let currentPosition = STARTING_POSITION;
  let numberOfClicksAtPasswordPosition = 0;

  for (const rotation of rotations) {
    const direction = rotation.direction === Direction.LEFT ? -1 : 1;

    for (let i = 0; i < rotation.amount; i++) {
      currentPosition += direction;

      if (currentPosition < FIRST_POSITION) {
        currentPosition = LAST_POSITION;
      } else if (currentPosition > LAST_POSITION) {
        currentPosition = FIRST_POSITION;
      }

      if (currentPosition === PASSWORD_POSITION) {
        numberOfClicksAtPasswordPosition++;
      }
    }
  }

  return numberOfClicksAtPasswordPosition;
};
console.log(part2());
