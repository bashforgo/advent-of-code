import { unreachable } from "@std/assert";
import { getInput } from "@utilities/getInput.ts";

const input = await getInput(2017, 23);

enum InstructionType {
  set = "set",
  sub = "sub",
  mul = "mul",
  jnz = "jnz",
}

type Instruction =
  | { type: InstructionType.set; x: string; y: string | number }
  | { type: InstructionType.sub; x: string; y: string | number }
  | { type: InstructionType.mul; x: string; y: string | number }
  | { type: InstructionType.jnz; x: string | number; y: string | number };

const instructions: Instruction[] = input.trim().split("\n").map((line) => {
  const match = line.match(/(?<type>set) (?<x>\w+) (?<y>-?\w+)/) ??
    line.match(/(?<type>sub) (?<x>\w+) (?<y>-?\w+)/) ??
    line.match(/(?<type>mul) (?<x>\w+) (?<y>-?\w+)/) ??
    line.match(/(?<type>jnz) (?<x>-?\w+) (?<y>-?\w+)/) ??
    unreachable();

  switch (match.groups?.type) {
    case InstructionType.set:
      return {
        type: InstructionType.set,
        x: match.groups.x,
        y: registerOrValue(match.groups.y),
      };
    case InstructionType.sub:
      return {
        type: InstructionType.sub,
        x: match.groups.x,
        y: registerOrValue(match.groups.y),
      };
    case InstructionType.mul:
      return {
        type: InstructionType.mul,
        x: match.groups.x,
        y: registerOrValue(match.groups.y),
      };
    case InstructionType.jnz:
      return {
        type: InstructionType.jnz,
        x: registerOrValue(match.groups.x),
        y: registerOrValue(match.groups.y),
      };
    default:
      unreachable();
  }

  function registerOrValue(s: string): string | number {
    const n = Number(s);
    return Number.isNaN(n) ? s : n;
  }
});

const part1 = () => {
  function interpret(instructions: Instruction[]) {
    const registers = new Map<string, number>();

    const getRegister = (x: string): number => {
      return registers.get(x) ?? (() => {
        setRegister(x, 0);
        return 0;
      })();
    };
    const setRegister = (x: string, value: number) => {
      registers.set(x, value);
    };

    const getRegisterOrValue = (x: string | number): number => {
      return typeof x === "string" ? getRegister(x) : x;
    };

    let pointer = 0;

    let numberOfMulInstructions = 0;

    while (true) {
      const instruction = instructions[pointer];
      if (instruction == null) break;

      switch (instruction.type) {
        case InstructionType.set: {
          setRegister(instruction.x, getRegisterOrValue(instruction.y));
          pointer++;
          break;
        }
        case InstructionType.sub: {
          const x = getRegister(instruction.x);
          const y = getRegisterOrValue(instruction.y);
          setRegister(instruction.x, x - y);
          pointer++;
          break;
        }
        case InstructionType.mul: {
          const x = getRegister(instruction.x);
          const y = getRegisterOrValue(instruction.y);
          setRegister(instruction.x, x * y);
          pointer++;
          numberOfMulInstructions++;
          break;
        }
        case InstructionType.jnz: {
          pointer += getRegisterOrValue(instruction.x) !== 0
            ? getRegisterOrValue(instruction.y)
            : 1;
          break;
        }
      }
    }

    return numberOfMulInstructions;
  }

  return interpret(instructions);
};
console.log(part1());

const part2 = () => {
  let h = 0;

  for (let b = 106_700; b <= 123_700; b += 17) {
    let f = 1;
    for (let d = 2; d * d <= b; d++) {
      if (b % d === 0) {
        f = 0;
        break;
      }
    }
    if (f === 0) {
      h++;
    }
  }

  return h;
};
console.log(part2());
