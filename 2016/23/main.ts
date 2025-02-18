import { unreachable } from "@std/assert/unreachable";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
cpy 2 a
tgl a
tgl a
tgl a
cpy 1 a
dec a
dec a
`
  : await getInput(2016, 23);

const lines = input.trim().split("\n");

enum InstructionType {
  cpy = "cpy",
  inc = "inc",
  dec = "dec",
  jnz = "jnz",
  tgl = "tgl",
}

type Instruction =
  | { type: InstructionType.cpy; x: string | number; y: string }
  | {
    type: InstructionType.cpy;
    x: string | number;
    y: number;
    isInvalid: true;
  }
  | { type: InstructionType.inc; x: string }
  | { type: InstructionType.inc; x: number; isInvalid: true }
  | { type: InstructionType.dec; x: string }
  | { type: InstructionType.dec; x: number; isInvalid: true }
  | { type: InstructionType.jnz; x: string | number; y: string | number }
  | { type: InstructionType.tgl; x: string | number };

const initialInstructions = lines.map((line): Instruction => {
  const match = line.match(/(?<type>cpy) (?<x>[a-d]|-?\d+) (?<y>[a-d])/) ??
    line.match(/(?<type>inc|dec) (?<x>[a-d])/) ??
    line.match(/(?<type>jnz) (?<x>[a-d]|-?\d+) (?<y>[a-d]|-?\d+)/) ??
    line.match(/(?<type>tgl) (?<x>[a-d]|-?\d+)/) ??
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
    case InstructionType.tgl:
      return {
        type: InstructionType.tgl,
        x: stringOrNumber(x),
      };
  }

  unreachable();

  function stringOrNumber(x: string): string | number {
    const number = Number(x);
    return Number.isNaN(number) ? x : number;
  }
});

const isInvalidInstruction = (
  instruction: Instruction,
): instruction is Instruction & { isInvalid: true } =>
  "isInvalid" in instruction;

const matchesPlusEqualPattern = (
  A: Instruction,
  B: Instruction,
  C: Instruction,
) => {
  const endsWithJump = C.type === InstructionType.jnz;
  if (!endsWithJump) return null;

  const isJumpBack2 = C.y === -2;
  if (!isJumpBack2) return null;

  if (isInvalidInstruction(A)) return null;

  const isIncFirst = A.type === InstructionType.inc;
  const isDecFirst = A.type === InstructionType.dec;
  if (!isIncFirst && !isDecFirst) return null;

  if (isInvalidInstruction(B)) return null;

  const isOpposite =
    B.type === (isIncFirst ? InstructionType.dec : InstructionType.inc);
  if (!isOpposite) return null;

  return isIncFirst
    ? { registerToInc: A.x, registerToZero: B.x }
    : { registerToInc: B.x, registerToZero: A.x };
};

const interpret = (
  instructions: Instruction[],
  initialValues?: Record<string, number>,
) => {
  const _registers: Record<string, number> = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    ...initialValues,
  };
  const registers = new Proxy(_registers, {
    set: (target, prop, value) => {
      return Reflect.set(target, prop, value);
    },
  });
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

    if (isInvalidInstruction(instruction)) {
      pointer++;
      continue;
    }

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
      case InstructionType.tgl: {
        const target = pointer + getRegisterOrValue(instruction.x);
        if (target < 0 || target >= instructions.length) {
          pointer++;
          break;
        }

        const targetInstruction = instructions[target];
        switch (targetInstruction.type) {
          case InstructionType.cpy:
            instructions[target] = {
              type: InstructionType.jnz,
              x: targetInstruction.x,
              y: targetInstruction.y,
            };
            break;
          case InstructionType.inc:
            instructions[target] = typeof targetInstruction.x === "string"
              ? {
                type: InstructionType.dec,
                x: targetInstruction.x,
              }
              : {
                type: InstructionType.dec,
                x: targetInstruction.x,
                isInvalid: true,
              };
            break;
          case InstructionType.dec:
            instructions[target] = typeof targetInstruction.x === "string"
              ? {
                type: InstructionType.inc,
                x: targetInstruction.x,
              }
              : {
                type: InstructionType.inc,
                x: targetInstruction.x,
                isInvalid: true,
              };
            break;
          case InstructionType.jnz:
            instructions[target] = typeof targetInstruction.y === "string"
              ? {
                type: InstructionType.cpy,
                x: targetInstruction.x,
                y: targetInstruction.y,
              }
              : {
                type: InstructionType.cpy,
                x: targetInstruction.x,
                y: targetInstruction.y,
                isInvalid: true,
              };
            break;
          case InstructionType.tgl:
            instructions[target] = typeof targetInstruction.x === "string"
              ? {
                type: InstructionType.inc,
                x: targetInstruction.x,
              }
              : {
                type: InstructionType.inc,
                x: targetInstruction.x,
                isInvalid: true,
              };
            break;
        }

        pointer++;
        break;
      }
    }
  }

  return registers;
};

// deno-lint-ignore no-unused-vars
const stringifyInstructions = (instructions: Instruction[]) =>
  instructions.map((instruction) => {
    switch (instruction.type) {
      case InstructionType.cpy:
        return `cpy ${instruction.x} ${instruction.y}`;
      case InstructionType.inc:
        return `inc ${instruction.x}`;
      case InstructionType.dec:
        return `dec ${instruction.x}`;
      case InstructionType.jnz:
        return `jnz ${instruction.x} ${instruction.y}`;
      case InstructionType.tgl:
        return `tgl ${instruction.x}`;
    }
  }).join("\n");

const part1 = () => {
  const registers = interpret([...initialInstructions], { a: 7 });
  return registers.a;
};
console.log(part1());

const part2 = () => {
  const registers = interpret([...initialInstructions], { a: 12 });
  return registers.a;
};
console.log(part2());
