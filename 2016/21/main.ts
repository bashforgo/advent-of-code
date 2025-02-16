import { unreachable } from "@std/assert";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
swap position 4 with position 0
swap letter d with letter b
reverse positions 0 through 4
rotate left 1 step
move position 1 to position 4
move position 3 to position 0
rotate based on position of letter b
rotate based on position of letter d
`
  : await getInput(2016, 21);

const lines = input.trim().split("\n");

enum OperationType {
  SwapPosition = "SwapPosition",
  SwapLetter = "SwapLetter",
  RotateLeft = "RotateLeft",
  RotateRight = "RotateRight",
  RotateBasedOnPosition = "RotateBasedOnPosition",
  Reverse = "Reverse",
  Move = "Move",
}

type Operation =
  | { type: OperationType.SwapPosition; x: number; y: number }
  | { type: OperationType.SwapLetter; x: string; y: string }
  | { type: OperationType.RotateLeft; x: number }
  | { type: OperationType.RotateRight; x: number }
  | { type: OperationType.RotateBasedOnPosition; x: string }
  | { type: OperationType.Reverse; x: number; y: number }
  | { type: OperationType.Move; x: number; y: number };

const operations = lines.map((line): Operation => {
  let match: RegExpMatchArray | null = null;

  match = line.match(/^swap position (?<x>\d+) with position (?<y>\d+)$/);
  if (match != null) {
    return {
      type: OperationType.SwapPosition,
      x: Number(match.groups!.x),
      y: Number(match.groups!.y),
    };
  }

  match = line.match(/^swap letter (?<x>\w) with letter (?<y>\w)$/);
  if (match != null) {
    return {
      type: OperationType.SwapLetter,
      x: match.groups!.x,
      y: match.groups!.y,
    };
  }

  match = line.match(/^rotate left (?<x>\d+) steps?$/);
  if (match != null) {
    return {
      type: OperationType.RotateLeft,
      x: Number(match.groups!.x),
    };
  }

  match = line.match(/^rotate right (?<x>\d+) steps?$/);
  if (match != null) {
    return {
      type: OperationType.RotateRight,
      x: Number(match.groups!.x),
    };
  }

  match = line.match(/^rotate based on position of letter (?<x>\w)$/);
  if (match != null) {
    return {
      type: OperationType.RotateBasedOnPosition,
      x: match.groups!.x,
    };
  }

  match = line.match(/^reverse positions (?<x>\d+) through (?<y>\d+)$/);
  if (match != null) {
    return {
      type: OperationType.Reverse,
      x: Number(match.groups!.x),
      y: Number(match.groups!.y),
    };
  }

  match = line.match(/^move position (?<x>\d+) to position (?<y>\d+)$/);
  if (match != null) {
    return {
      type: OperationType.Move,
      x: Number(match.groups!.x),
      y: Number(match.groups!.y),
    };
  }

  unreachable();
});

const applySwapPosition = (s: string, x: number, y: number) => {
  const [start, end] = x < y ? [x, y] : [y, x];

  const prefix = s.slice(0, start);
  const letterStart = s[start];
  const middle = s.slice(start + 1, end);
  const letterEnd = s[end];
  const suffix = s.slice(end + 1);
  return `${prefix}${letterEnd}${middle}${letterStart}${suffix}`;
};

const applySwapLetter = (s: string, x: string, y: string) => {
  const NULL = "\0";
  return s.replaceAll(x, NULL).replaceAll(y, x).replaceAll(NULL, y);
};

const applyRotateLeft = (s: string, x: number) => {
  return `${s.slice(x)}${s.slice(0, x)}`;
};

const applyRotateRight = (s: string, x: number) => {
  return `${s.slice(-x)}${s.slice(0, -x)}`;
};

const applyRotateBasedOnPosition = (s: string, x: string) => {
  const index = s.indexOf(x);
  const steps = (1 + index + (index >= 4 ? 1 : 0)) % s.length;
  return applyRotateRight(s, steps);
};

const applyReverse = (s: string, x: number, y: number) => {
  const [start, end] = x < y ? [x, y] : [y, x];

  const prefix = s.slice(0, start);
  const middle = s.slice(start, end + 1).split("").reverse().join("");
  const suffix = s.slice(end + 1);
  return `${prefix}${middle}${suffix}`;
};

const applyMove = (s: string, x: number, y: number) => {
  const letterX = s[x];
  const withoutLetterX = `${s.slice(0, x)}${s.slice(x + 1)}`;
  return `${withoutLetterX.slice(0, y)}${letterX}${withoutLetterX.slice(y)}`;
};

const applyOperation = (s: string, operation: Operation) => {
  switch (operation.type) {
    case OperationType.SwapPosition:
      return applySwapPosition(s, operation.x, operation.y);
    case OperationType.SwapLetter:
      return applySwapLetter(s, operation.x, operation.y);
    case OperationType.RotateLeft:
      return applyRotateLeft(s, operation.x);
    case OperationType.RotateRight:
      return applyRotateRight(s, operation.x);
    case OperationType.RotateBasedOnPosition:
      return applyRotateBasedOnPosition(s, operation.x);
    case OperationType.Reverse:
      return applyReverse(s, operation.x, operation.y);
    case OperationType.Move:
      return applyMove(s, operation.x, operation.y);
  }
};

const part1 = () => {
  const plaintext = DEBUG ? "abcde" : "abcdefgh";

  let result = plaintext;
  for (const operation of operations) {
    result = applyOperation(result, operation);
  }
  return result;
};
console.log(part1());

const reverseSwapPosition = (s: string, x: number, y: number) => {
  return applySwapPosition(s, x, y);
};

const reverseSwapLetter = (s: string, x: string, y: string) => {
  return applySwapLetter(s, x, y);
};

const reverseRotateLeft = (s: string, x: number) => {
  return applyRotateRight(s, x);
};

const reverseRotateRight = (s: string, x: number) => {
  return applyRotateLeft(s, x);
};

const reverseRotateBasedOnPosition = (s: string, x: string) => {
  for (let i = 0; i < s.length; i++) {
    const rotated = applyRotateLeft(s, i);
    if (applyRotateBasedOnPosition(rotated, x) === s) {
      return rotated;
    }
  }
  unreachable();
};

const reverseReverse = (s: string, x: number, y: number) => {
  return applyReverse(s, x, y);
};

const reverseMove = (s: string, x: number, y: number) => {
  return applyMove(s, y, x);
};

const reverseOperation = (s: string, operation: Operation) => {
  switch (operation.type) {
    case OperationType.SwapPosition:
      return reverseSwapPosition(s, operation.x, operation.y);
    case OperationType.SwapLetter:
      return reverseSwapLetter(s, operation.x, operation.y);
    case OperationType.RotateLeft:
      return reverseRotateLeft(s, operation.x);
    case OperationType.RotateRight:
      return reverseRotateRight(s, operation.x);
    case OperationType.RotateBasedOnPosition:
      return reverseRotateBasedOnPosition(s, operation.x);
    case OperationType.Reverse:
      return reverseReverse(s, operation.x, operation.y);
    case OperationType.Move:
      return reverseMove(s, operation.x, operation.y);
  }
};

const part2 = () => {
  const scrambled = DEBUG ? "decab" : "fbgdceah";

  let result = scrambled;
  for (const operation of operations.toReversed()) {
    result = reverseOperation(result, operation);
  }
  return result;
};
console.log(part2());
