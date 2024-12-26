import { getInput } from "@utilities/getInput.ts";
import { throw_ } from "@utilities/throw.ts";

const DEBUG = false;
const input = DEBUG
  ? [
    `\
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`,
    `\
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
`,
  ][1]
  : await getInput(2024, 17);

const [registerString, programString] = input.split("\n\n");
const registerLines = registerString.split("\n");
const initialRegisters = new Map(
  registerLines.map((line) => {
    const [, register, value] = line.match(/Register (\w+): (\d+)/) ?? throw_();
    return [register, Number(value)];
  }),
) as ReadonlyMap<string, number>;
const rawProgram = programString
  .replace(/Program: /, "")
  .split(",")
  .map(Number) as readonly number[];

enum Instruction {
  /**
  The adv instruction (opcode 0) performs division. The numerator is the value
  in the A register. The denominator is found by raising 2 to the power of the
  instruction's combo operand. (So, an operand of 2 would divide A by 4 (2^2);
  an operand of 5 would divide A by 2^B.) The result of the division operation
  is truncated to an integer and then written to the A register.
  */
  adv = 0,

  /**
  The bxl instruction (opcode 1) calculates the bitwise XOR of register B and
  the instruction's literal operand, then stores the result in register B.
  */
  bxl = 1,

  /**
  The bst instruction (opcode 2) calculates the value of its combo operand
  modulo 8 (thereby keeping only its lowest 3 bits), then writes that value to
  the B register.
  */
  bst = 2,

  /**
  The jnz instruction (opcode 3) does nothing if the A register is 0. However,
  if the A register is not zero, it jumps by setting the instruction pointer to
  the value of its literal operand; if this instruction jumps, the instruction
  pointer is not increased by 2 after this instruction.
  */
  jnz = 3,

  /**
  The bxc instruction (opcode 4) calculates the bitwise XOR of register B and
  register C, then stores the result in register B. (For legacy reasons, this
  instruction reads an operand but ignores it.)
  */
  bxc = 4,

  /**
  The out instruction (opcode 5) calculates the value of its combo operand
  modulo 8, then outputs that value. (If a program outputs multiple values, they
  are separated by commas.)
  */
  out = 5,

  /**
  The bdv instruction (opcode 6) works exactly like the adv instruction except
  that the result is stored in the B register. (The numerator is still read from
  the A register.)
  */
  bdv = 6,

  /**
  The cdv instruction (opcode 7) works exactly like the adv instruction except
  that the result is stored in the C register. (The numerator is still read from
  the A register.)
  */
  cdv = 7,
}

interface Machine {
  getRegister(register: string): number;
  setRegister(register: string, value: number): void;
  program: number[];
  instructionPointer: number;
  output: number[];
}

const newMachine = (
  initialRegisters: ReadonlyMap<string, number>,
  initialProgram: readonly number[],
): Machine => {
  const registers = new Map(initialRegisters);
  const program = initialProgram.slice();
  return {
    getRegister: (register: string) => registers.get(register) ?? throw_(),
    setRegister: (register: string, value: number) =>
      registers.set(register, value),
    program,
    instructionPointer: 0,
    output: [],
  };
};

const readComboOperand = (machine: Machine, operand: number) => {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return operand;
    case 4:
      return machine.getRegister("A");
    case 5:
      return machine.getRegister("B");
    case 6:
      return machine.getRegister("C");
    default:
      throw new Error("Unreachable");
  }
};

const readLiteralOperand = (operand: number) => operand;

const execute = {
  [Instruction.adv]: (machine: Machine, operand: number) => {
    const numerator = machine.getRegister("A");
    const denominator = 2 ** readComboOperand(machine, operand);
    const result = Math.trunc(numerator / denominator);
    machine.setRegister("A", result);
    return [false];
  },
  [Instruction.bxl]: (machine: Machine, operand: number) => {
    const result = machine.getRegister("B") ^ readLiteralOperand(operand);
    machine.setRegister("B", result);
    return [false];
  },
  [Instruction.bst]: (machine: Machine, operand: number) => {
    const result = readComboOperand(machine, operand) % 8;
    machine.setRegister("B", result);
    return [false];
  },
  [Instruction.jnz]: (machine: Machine, operand: number) => {
    const a = machine.getRegister("A");
    if (a === 0) return [false];

    machine.instructionPointer = readLiteralOperand(operand);
    return [true];
  },
  [Instruction.bxc]: (machine: Machine, _operand: number) => {
    const b = machine.getRegister("B");
    const c = machine.getRegister("C");
    const result = b ^ c;
    machine.setRegister("B", result);
    return [false];
  },
  [Instruction.out]: (machine: Machine, operand: number) => {
    const result = readComboOperand(machine, operand) % 8;
    machine.output.push(result);
    return [false];
  },
  [Instruction.bdv]: (machine: Machine, operand: number) => {
    const numerator = machine.getRegister("A");
    const denominator = 2 ** readComboOperand(machine, operand);
    const result = Math.trunc(numerator / denominator);
    machine.setRegister("B", result);
    return [false];
  },
  [Instruction.cdv]: (machine: Machine, operand: number) => {
    const numerator = machine.getRegister("A");
    const denominator = 2 ** readComboOperand(machine, operand);
    const result = Math.trunc(numerator / denominator);
    machine.setRegister("C", result);
    return [false];
  },
} satisfies Record<
  Instruction,
  (machine: Machine, operand: number) => [didJump: boolean]
>;

const formatComboOperand = (operand: number) => {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return String(operand);
    case 4:
      return "A";
    case 5:
      return "B";
    case 6:
      return "C";
    default:
      throw new Error("Unreachable");
  }
};

const printAssembly = () => {
  let assembly = "";

  for (let i = 0; i < rawProgram.length; i += 2) {
    const instruction = rawProgram[i] as Instruction;
    const rawOperand = rawProgram[i + 1];

    const isLiteralOperand = [Instruction.bxl, Instruction.jnz].includes(
      instruction,
    );

    if (isLiteralOperand) {
      assembly += `${Instruction[instruction]} ${rawOperand}`;
    } else {
      assembly += `${Instruction[instruction]} ${
        formatComboOperand(rawOperand)
      }`;
    }

    assembly += "\n";
  }

  console.log(assembly);
};
printAssembly();

const debugMachine = (machine: Machine) => {
  let debugString = "";
  for (const register of ["A", "B", "C"]) {
    const value = machine.getRegister(register);
    const decimal = String(value).padStart(8, " ");
    const octal = value.toString(8).padStart(12, " ");
    const binary = value.toString(2).padStart(32, " ");
    debugString += `${register} = ${decimal} 0o${octal} 0b${binary}`;
    debugString += "\n";
  }

  debugString += "\n";

  for (let i = 0; i < machine.program.length; i += 2) {
    const instruction = machine.program[i] as Instruction;
    const isCurrentInstruction = i === machine.instructionPointer;
    if (isCurrentInstruction) debugString += "> ";

    const rawOperand = machine.program[i + 1];

    switch (instruction) {
      case Instruction.adv:
        debugString += `A = A // 2 ** ${formatComboOperand(rawOperand)}`;
        break;
      case Instruction.bxl:
        debugString += `B = B xor ${rawOperand}`;
        break;
      case Instruction.bst:
        debugString += `B = ${formatComboOperand(rawOperand)} mod 8`;
        break;
      case Instruction.jnz:
        debugString += `if A != 0 goto ${rawOperand}`;
        break;
      case Instruction.bxc:
        debugString += `B = B xor C`;
        break;
      case Instruction.out:
        debugString += `output ${formatComboOperand(rawOperand)} mod 8`;
        break;
      case Instruction.bdv:
        debugString += `B = A // 2 ** ${formatComboOperand(rawOperand)}`;
        break;
      case Instruction.cdv:
        debugString += `C = A // 2 ** ${formatComboOperand(rawOperand)}`;
        break;
    }

    debugString += "\n";
  }

  debugString += "\n";

  debugString += "output: ";
  debugString += machine.output.join(", ");
  debugString += "\n";

  console.log(debugString);
};

{
  const machine = newMachine(initialRegisters, rawProgram);

  while (machine.instructionPointer < machine.program.length) {
    debugMachine(machine);

    const instruction = machine
      .program[machine.instructionPointer] as Instruction;
    const operand = machine.program[machine.instructionPointer + 1];

    const [didJump] = execute[instruction](machine, operand);
    if (!didJump) machine.instructionPointer += 2;
  }

  console.log(machine.output.join(","));
}
