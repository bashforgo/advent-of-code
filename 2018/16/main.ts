import { assertEquals } from "@std/assert";
import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { mapMapValues } from "@utilities/mapMap.ts";

const input = await getInput(2018, 16);

type Registers = [number, number, number, number];
type Instruction = [opcode: number, A: number, B: number, C: number];

interface Sample {
  before: Registers;
  instruction: Instruction;
  after: Registers;
}

const parseInput = (input: string): [Sample[], Instruction[]] => {
  const [samplesString, programString = ""] = input.split("\n\n\n\n");

  const samples = samplesString
    .trim()
    .split("\n\n")
    .filter(Boolean)
    .map((samplesString): Sample => {
      const [beforeString, instructionString, afterString] = samplesString
        .split("\n");

      const before = JSON.parse(beforeString.slice("Before: ".length));
      const instruction = instructionString
        .split(" ")
        .map(Number) as Instruction;
      const after = JSON.parse(afterString.slice("After:  ".length));

      return { before, instruction, after };
    });

  const program = programString
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((instructionString) =>
      instructionString.split(" ").map(Number) as Instruction
    );

  return [samples, program];
};

{
  const example = `\
Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1]
`;
  Deno.test("parseInput(example)", () => {
    const [samples, program] = parseInput(example);
    assertEquals(samples, [
      {
        before: [3, 2, 1, 1],
        instruction: [9, 2, 1, 2],
        after: [3, 2, 2, 1],
      },
    ]);
    assertEquals(program, []);
  });
}

enum Opcode {
  addr = "addr",
  addi = "addi",
  mulr = "mulr",
  muli = "muli",
  banr = "banr",
  bani = "bani",
  borr = "borr",
  bori = "bori",
  setr = "setr",
  seti = "seti",
  gtir = "gtir",
  gtri = "gtri",
  gtrr = "gtrr",
  eqir = "eqir",
  eqri = "eqri",
  eqrr = "eqrr",
}

type Operation = (
  registers: Registers,
  A: number,
  B: number,
  C: number,
) => void;

const operations: Readonly<Record<Opcode, Operation>> = {
  addr: (r, A, B, C) => {
    r[C] = r[A] + r[B];
  },
  addi: (r, A, B, C) => {
    r[C] = r[A] + B;
  },
  mulr: (r, A, B, C) => {
    r[C] = r[A] * r[B];
  },
  muli: (r, A, B, C) => {
    r[C] = r[A] * B;
  },
  banr: (r, A, B, C) => {
    r[C] = r[A] & r[B];
  },
  bani: (r, A, B, C) => {
    r[C] = r[A] & B;
  },
  borr: (r, A, B, C) => {
    r[C] = r[A] | r[B];
  },
  bori: (r, A, B, C) => {
    r[C] = r[A] | B;
  },
  setr: (r, A, _B, C) => {
    r[C] = r[A];
  },
  seti: (r, A, _B, C) => {
    r[C] = A;
  },
  gtir: (r, A, B, C) => {
    r[C] = A > r[B] ? 1 : 0;
  },
  gtri: (r, A, B, C) => {
    r[C] = r[A] > B ? 1 : 0;
  },
  gtrr: (r, A, B, C) => {
    r[C] = r[A] > r[B] ? 1 : 0;
  },
  eqir: (r, A, B, C) => {
    r[C] = A === r[B] ? 1 : 0;
  },
  eqri: (r, A, B, C) => {
    r[C] = r[A] === B ? 1 : 0;
  },
  eqrr: (r, A, B, C) => {
    r[C] = r[A] === r[B] ? 1 : 0;
  },
};
const opcodes = Object.keys(operations) as Opcode[];

const doesOperationMatchSample = (
  operation: Operation,
  sample: Sample,
): boolean => {
  const { before, instruction: [, A, B, C], after } = sample;
  const output = [...before] as Registers;
  operation(output, A, B, C);
  return output.every((value, index) => value === after[index]);
};

function* possibleOpcodesForSample(sample: Sample) {
  yield* opcodes
    .values()
    .filter((opcode) => doesOperationMatchSample(operations[opcode], sample))
    .map((opcode) => opcode);
}

{
  const [[example]] = parseInput(`\
Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1]
`);
  Deno.test("possibleOpcodesForSample(example)", () => {
    assertEquals([...possibleOpcodesForSample(example)], [
      Opcode.addi,
      Opcode.mulr,
      Opcode.seti,
    ]);
  });
}

const part1 = () => {
  const [samples] = parseInput(input);

  return samples
    .filter((sample) =>
      sumOf(possibleOpcodesForSample(sample).take(3), () => 1) >= 3
    )
    .length;
};
console.log(part1());

const computePossibleOpcodes = (
  samples: Sample[],
): Map<number, Set<Opcode>> => {
  const samplesByOpcodeNumber = Map.groupBy(
    samples,
    ({ instruction: [opcodeNumber] }) => opcodeNumber,
  );
  return mapMapValues(samplesByOpcodeNumber, (samples) =>
    new Set(
      opcodes.filter((opcode) =>
        samples.every((s) => doesOperationMatchSample(operations[opcode], s))
      ),
    ));
};

const interpret = (
  opcodeNumberToOperation: (opcodeNumber: number) => Operation,
  program: Instruction[],
) => {
  const registers: Registers = [0, 0, 0, 0];

  for (const [opcodeNumber, A, B, C] of program) {
    const operation = opcodeNumberToOperation(opcodeNumber);
    operation(registers, A, B, C);
  }

  return registers;
};

const part2 = () => {
  const [samples, program] = parseInput(input);
  const opcodeNumberToPossibleOpcodes = computePossibleOpcodes(samples);
  const opcodeNumberToOpcode = new Map<number, Opcode>();
  while (opcodeNumberToPossibleOpcodes.size > 0) {
    for (
      const [opcodeNumber, possibleOpcodes] of opcodeNumberToPossibleOpcodes
    ) {
      if (possibleOpcodes.size !== 1) continue;
      const [opcode] = possibleOpcodes;
      opcodeNumberToOpcode.set(opcodeNumber, opcode);
      opcodeNumberToPossibleOpcodes.delete(opcodeNumber);

      for (
        const otherPossibleOpcodes of opcodeNumberToPossibleOpcodes.values()
      ) {
        otherPossibleOpcodes.delete(opcode);
      }
    }
  }

  const opcodeNumberToOperation = (opcodeNumber: number) =>
    operations[opcodeNumberToOpcode.get(opcodeNumber)!];

  const [_0] = interpret(opcodeNumberToOperation, program);
  return _0;
};
console.log(part2());
