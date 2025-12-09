import { unreachable } from "@std/assert";
import { getInput } from "@utilities/getInput.ts";
import { range } from "@utilities/range.ts";

const input = await getInput(2016, 25);

const lines = input.trim().split("\n");

enum InstructionType {
  cpy = "cpy",
  inc = "inc",
  dec = "dec",
  jnz = "jnz",
  out = "out",
}

type Instruction =
  | { type: InstructionType.cpy; x: string | number; y: string }
  | { type: InstructionType.inc; x: string }
  | { type: InstructionType.dec; x: string }
  | { type: InstructionType.jnz; x: string | number; y: string | number }
  | { type: InstructionType.out; x: string | number };

const instructions = lines.map((line): Instruction => {
  const match = line.match(/(?<type>cpy) (?<x>[a-d]|-?\d+) (?<y>[a-d])/) ??
    line.match(/(?<type>inc|dec) (?<x>[a-d])/) ??
    line.match(/(?<type>jnz) (?<x>[a-d]|-?\d+) (?<y>[a-d]|-?\d+)/) ??
    line.match(/(?<type>out) (?<x>[a-d]|-?\d+)/) ??
    unreachable();

  const { type, x, y } = match.groups!;

  switch (type) {
    case InstructionType.cpy:
      return {
        type: InstructionType.cpy,
        x: stringOrNumber(x),
        y,
      };
    case InstructionType.inc:
      return { type: InstructionType.inc, x };
    case InstructionType.dec:
      return { type: InstructionType.dec, x };
    case InstructionType.jnz:
      return {
        type: InstructionType.jnz,
        x: stringOrNumber(x),
        y: stringOrNumber(y),
      };
    case InstructionType.out:
      return { type: InstructionType.out, x: stringOrNumber(x) };
  }

  unreachable();

  function stringOrNumber(x: string): string | number {
    const number = Number(x);
    return Number.isNaN(number) ? x : number;
  }
});

const matchesPlusEqualPattern = (
  A: Instruction,
  B: Instruction,
  C: Instruction,
) => {
  const endsWithJump = C.type === InstructionType.jnz;
  if (!endsWithJump) return null;

  const isJumpBack2 = C.y === -2;
  if (!isJumpBack2) return null;

  const isIncFirst = A.type === InstructionType.inc;
  const isDecFirst = A.type === InstructionType.dec;
  if (!isIncFirst && !isDecFirst) return null;

  const isOpposite =
    B.type === (isIncFirst ? InstructionType.dec : InstructionType.inc);
  if (!isOpposite) return null;

  return isIncFirst
    ? { registerToInc: A.x, registerToZero: B.x }
    : { registerToInc: B.x, registerToZero: A.x };
};

function* interpret(
  instructions: Instruction[],
  initialValues?: Record<string, number>,
) {
  const registers: Record<string, number> = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    ...initialValues,
  };
  let pointer = 0;

  const getRegisterOrValue = (x: string | number) =>
    typeof x === "string" ? registers[x] : x;

  while (pointer < instructions.length) {
    // x += y * z optimization
    (() => {
      if (pointer + 6 > instructions.length) return;

      const [A, B, C, D, E, F] = instructions.slice(pointer, pointer + 6);

      const endsWithJump = F.type === InstructionType.jnz;
      if (!endsWithJump) return;

      const isJumpBack2 = F.y === -5;
      if (!isJumpBack2) return;

      const pattern = matchesPlusEqualPattern(B, C, D);
      if (pattern == null) return;
      const { registerToInc, registerToZero } = pattern;

      const startsWithCopy = A.type === InstructionType.cpy;
      if (!startsWithCopy) return;

      const decrementsBeforeJump = E.type === InstructionType.dec;
      if (!decrementsBeforeJump) return;

      const matchesPlusEqualTarget = A.y === registerToZero;
      if (!matchesPlusEqualTarget) return;

      registers[registerToInc] += getRegisterOrValue(A.x) * registers[E.x];
      registers[registerToZero] = 0;
      registers[E.x] = 0;
      pointer += 6;
    })();

    // x += y optimization
    (() => {
      if (pointer + 3 > instructions.length) return;

      const [A, B, C] = instructions.slice(pointer, pointer + 3);

      const pattern = matchesPlusEqualPattern(A, B, C);
      if (pattern == null) return;

      const { registerToInc, registerToZero } = pattern;
      registers[registerToInc] += registers[registerToZero];
      registers[registerToZero] = 0;
      pointer += 3;
    })();

    if (pointer >= instructions.length) break;

    const instruction = instructions[pointer];

    switch (instruction.type) {
      case InstructionType.cpy:
        registers[instruction.y] = getRegisterOrValue(instruction.x);
        pointer++;
        break;
      case InstructionType.inc:
        registers[instruction.x]++;
        pointer++;
        break;
      case InstructionType.dec:
        registers[instruction.x]--;
        pointer++;
        break;
      case InstructionType.jnz:
        pointer += getRegisterOrValue(instruction.x) !== 0
          ? getRegisterOrValue(instruction.y)
          : 1;
        break;
      case InstructionType.out:
        yield getRegisterOrValue(instruction.x);
        pointer++;
        break;
    }
  }

  return registers;
}

const part1 = () => {
  outer: for (const i of range(1, Infinity)) {
    let expected = 0;

    for (const output of interpret(instructions, { a: i }).take(100)) {
      if (output !== expected) continue outer;

      expected = 1 - expected;
    }

    return i;
  }
};
console.log(part1());
