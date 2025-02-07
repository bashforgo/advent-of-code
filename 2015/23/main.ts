import { unreachable } from "@std/assert";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
inc a
jio a, +2
tpl a
inc a
`
  : await getInput(2015, 23);

const lines = input.trim().split("\n");

enum InstructionType {
  hlf = "hlf",
  tpl = "tpl",
  inc = "inc",
  jmp = "jmp",
  jie = "jie",
  jio = "jio",
}

type Instruction =
  | { type: InstructionType.hlf; register: string }
  | { type: InstructionType.tpl; register: string }
  | { type: InstructionType.inc; register: string }
  | { type: InstructionType.jmp; offset: number }
  | { type: InstructionType.jie; register: string; offset: number }
  | { type: InstructionType.jio; register: string; offset: number };

const program = lines.map((line): Instruction => {
  const [, type, ...rest] = line.match(/^(hlf|tpl|inc) (a|b)$/) ??
    line.match(/^(jmp) ([+-]\d+)$/) ??
    line.match(/^(jie|jio) (a|b), ([+-]\d+)$/) ??
    unreachable();

  switch (type) {
    case InstructionType.hlf:
    case InstructionType.tpl:
    case InstructionType.inc: {
      const [register] = rest;
      return { type, register };
    }
    case InstructionType.jmp: {
      const [offset] = rest;
      return { type, offset: Number(offset) };
    }
    case InstructionType.jie:
    case InstructionType.jio: {
      const [register, offset] = rest;
      return { type, register, offset: Number(offset) };
    }
    default:
      unreachable();
  }
});

const interpret = (
  program: Instruction[],
  initialRegisters = { a: 0n, b: 0n } as Record<string, bigint>,
) => {
  const register = { ...initialRegisters };
  let pointer = 0;

  while (pointer < program.length) {
    const instruction = program[pointer];

    switch (instruction.type) {
      case InstructionType.hlf: {
        register[instruction.register] /= 2n;
        pointer++;
        break;
      }
      case InstructionType.tpl: {
        register[instruction.register] *= 3n;
        pointer++;
        break;
      }
      case InstructionType.inc: {
        register[instruction.register]++;
        pointer++;
        break;
      }
      case InstructionType.jmp: {
        pointer += instruction.offset;
        break;
      }
      case InstructionType.jie: {
        const isEven = register[instruction.register] % 2n === 0n;
        pointer += isEven ? instruction.offset : 1;
        break;
      }
      case InstructionType.jio: {
        const isOne = register[instruction.register] === 1n;
        pointer += isOne ? instruction.offset : 1;
        break;
      }
    }
  }

  return register;
};

const part1 = () => {
  return interpret(program).b;
};
console.log(part1());

const part2 = () => {
  return interpret(program, { a: 1n, b: 0n }).b;
};
console.log(part2());
