import { unreachable } from "@std/assert";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
snd 1
snd 2
snd p
rcv a
rcv b
rcv c
rcv d
`
  : await getInput(2017, 18);

const lines = input.trim().split("\n");

enum InstructionType {
  snd = "snd",
  set = "set",
  add = "add",
  mul = "mul",
  mod = "mod",
  rcv = "rcv",
  jgz = "jgz",
}

type Instruction =
  | { type: InstructionType.snd; x: string | number }
  | { type: InstructionType.set; x: string; y: string | number }
  | { type: InstructionType.add; x: string; y: string | number }
  | { type: InstructionType.mul; x: string; y: string | number }
  | { type: InstructionType.mod; x: string; y: string | number }
  | { type: InstructionType.rcv; x: string }
  | { type: InstructionType.jgz; x: string | number; y: string | number };

const instructions: Instruction[] = lines.map((line) => {
  const match = line.match(/(?<type>snd) (?<x>-?\w+)/) ??
    line.match(/(?<type>set) (?<x>\w+) (?<y>-?\w+)/) ??
    line.match(/(?<type>add) (?<x>\w+) (?<y>-?\w+)/) ??
    line.match(/(?<type>mul) (?<x>\w+) (?<y>-?\w+)/) ??
    line.match(/(?<type>mod) (?<x>\w+) (?<y>-?\w+)/) ??
    line.match(/(?<type>rcv) (?<x>\w+)/) ??
    line.match(/(?<type>jgz) (?<x>-?\w+) (?<y>-?\w+)/) ??
    unreachable();

  switch (match.groups?.type) {
    case InstructionType.snd:
      return { type: InstructionType.snd, x: registerOrValue(match.groups.x) };
    case InstructionType.set:
      return {
        type: InstructionType.set,
        x: match.groups.x,
        y: registerOrValue(match.groups.y),
      };
    case InstructionType.add:
      return {
        type: InstructionType.add,
        x: match.groups.x,
        y: registerOrValue(match.groups.y),
      };
    case InstructionType.mul:
      return {
        type: InstructionType.mul,
        x: match.groups.x,
        y: registerOrValue(match.groups.y),
      };
    case InstructionType.mod:
      return {
        type: InstructionType.mod,
        x: match.groups.x,
        y: registerOrValue(match.groups.y),
      };
    case InstructionType.rcv:
      return { type: InstructionType.rcv, x: match.groups.x };
    case InstructionType.jgz:
      return {
        type: InstructionType.jgz,
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

function* interpret(instructions: Instruction[]) {
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

  let lastPlayedSound = 0;

  let pointer = 0;

  while (true) {
    const instruction = instructions[pointer];
    if (instruction == null) break;

    switch (instruction.type) {
      case InstructionType.snd: {
        lastPlayedSound = getRegisterOrValue(instruction.x);
        pointer++;
        break;
      }
      case InstructionType.set: {
        setRegister(instruction.x, getRegisterOrValue(instruction.y));
        pointer++;
        break;
      }
      case InstructionType.add: {
        const x = getRegister(instruction.x);
        const y = getRegisterOrValue(instruction.y);
        setRegister(instruction.x, x + y);
        pointer++;
        break;
      }
      case InstructionType.mul: {
        const x = getRegister(instruction.x);
        const y = getRegisterOrValue(instruction.y);
        setRegister(instruction.x, x * y);
        pointer++;
        break;
      }
      case InstructionType.mod: {
        const x = getRegister(instruction.x);
        const y = getRegisterOrValue(instruction.y);
        setRegister(instruction.x, x % y);
        pointer++;
        break;
      }
      case InstructionType.rcv: {
        if (getRegisterOrValue(instruction.x) !== 0) yield lastPlayedSound;
        pointer++;
        break;
      }
      case InstructionType.jgz: {
        pointer += getRegisterOrValue(instruction.x) > 0
          ? getRegisterOrValue(instruction.y)
          : 1;
        break;
      }
    }
  }
}

const part1 = () => {
  return interpret(instructions).next().value;
};
console.log(part1());

function* interpret2(
  instructions: Instruction[],
  receive: Generator<number>,
  initialRegisters?: Map<string, number>,
): Generator<number> {
  const registers = new Map(initialRegisters);

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

  while (true) {
    const instruction = instructions[pointer];
    if (instruction == null) break;

    switch (instruction.type) {
      case InstructionType.snd: {
        yield getRegisterOrValue(instruction.x);
        pointer++;
        break;
      }
      case InstructionType.set: {
        setRegister(instruction.x, getRegisterOrValue(instruction.y));
        pointer++;
        break;
      }
      case InstructionType.add: {
        const x = getRegister(instruction.x);
        const y = getRegisterOrValue(instruction.y);
        setRegister(instruction.x, x + y);
        pointer++;
        break;
      }
      case InstructionType.mul: {
        const x = getRegister(instruction.x);
        const y = getRegisterOrValue(instruction.y);
        setRegister(instruction.x, x * y);
        pointer++;
        break;
      }
      case InstructionType.mod: {
        const x = getRegister(instruction.x);
        const y = getRegisterOrValue(instruction.y);
        setRegister(instruction.x, x % y);
        pointer++;
        break;
      }
      case InstructionType.rcv: {
        const { done, value } = receive.next();
        if (done) return;
        setRegister(instruction.x, value);
        pointer++;
        break;
      }
      case InstructionType.jgz: {
        pointer += getRegisterOrValue(instruction.x) > 0
          ? getRegisterOrValue(instruction.y)
          : 1;
        break;
      }
    }
  }
}

const part2 = () => {
  const program1SentValues: number[] = [];
  let numberOfProgram1SentValues = 0;

  const program1 = interpret2(
    instructions,
    interpret2(
      instructions,
      (function* () {
        while (program1SentValues.length > 0) {
          yield program1SentValues.shift()!;
        }
      })(),
      new Map([["p", 0]]),
    ),
    new Map([["p", 1]]),
  );

  for (const value of program1) {
    program1SentValues.push(value);
    numberOfProgram1SentValues++;
  }

  return numberOfProgram1SentValues;
};
console.log(part2());
