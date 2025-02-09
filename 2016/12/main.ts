import { unreachable } from "@std/assert";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
cpy 41 a
inc a
inc a
dec a
jnz a 2
dec a
`
  : await getInput(2016, 12);

const lines = input.trim().split("\n");

enum InstructionType {
  cpy = "cpy",
  inc = "inc",
  dec = "dec",
  jnz = "jnz",
}

type Instruction =
  | { type: InstructionType.cpy; x: string | number; y: string }
  | { type: InstructionType.inc; x: string }
  | { type: InstructionType.dec; x: string }
  | { type: InstructionType.jnz; x: string | number; y: number };

const instructions = lines.map((line): Instruction => {
  const match = line.match(/(?<type>cpy) (?<x>[a-d]|-?\d+) (?<y>[a-d])/) ??
    line.match(/(?<type>inc|dec) (?<x>[a-d])/) ??
    line.match(/(?<type>jnz) (?<x>[a-d]|-?\d+) (?<y>-?\d+)/) ??
    unreachable();

  const { type, x, y } = match.groups!;

  switch (type) {
    case InstructionType.cpy:
      return {
        type: InstructionType.cpy,
        x: ((nx) => Number.isNaN(nx) ? x : nx)(Number(x)),
        y,
      };
    case InstructionType.inc:
      return { type: InstructionType.inc, x };
    case InstructionType.dec:
      return { type: InstructionType.dec, x };
    case InstructionType.jnz:
      return { type: InstructionType.jnz, x, y: Number(y) };
  }

  unreachable();
});

const interpret = (
  instructions: Instruction[],
  initialValues?: Record<string, number>,
) => {
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
        pointer += getRegisterOrValue(instruction.x) !== 0 ? instruction.y : 1;
        break;
    }
  }

  return registers;
};
const part1 = () => {
  return interpret(instructions).a;
};
console.log(part1());

const part2 = () => {
  return interpret(instructions, { c: 1 }).a;
};
console.log(part2());
