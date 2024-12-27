import { getInput } from "@utilities/getInput.ts";
import { throw_ } from "@utilities/throw.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
123 -> x
456 -> y
x AND y -> d
x OR y -> e
x LSHIFT 2 -> f
y RSHIFT 2 -> g
NOT x -> h
NOT y -> i
`
  : await getInput(2015, 7);

enum InstructionType {
  Value = "Value",
  And = "And",
  Or = "Or",
  LShift = "LShift",
  RShift = "RShift",
  Not = "Not",
  Passthrough = "Passthrough",
}

type Instruction =
  | { type: InstructionType.Value; value: string; output: string }
  | {
    type: InstructionType.And | InstructionType.Or;
    left: string;
    right: string;
    output: string;
  }
  | {
    type: InstructionType.LShift | InstructionType.RShift;
    input: string;
    value: number;
    output: string;
  }
  | { type: InstructionType.Not; input: string; output: string };

const instructions = input
  .trim()
  .split("\n")
  .map((line): Instruction => {
    let match = line.match(/^(\w+) -> (\w+)$/);
    if (match != null) {
      const [, value, output] = match;
      return { type: InstructionType.Value, value, output };
    }

    match = line.match(/^(\w+) (AND|OR) (\w+) -> (\w+)$/);
    if (match != null) {
      const [, left, type, right, output] = match;
      return {
        type: type === "AND" ? InstructionType.And : InstructionType.Or,
        left,
        right,
        output,
      };
    }

    match = line.match(/^(\w+) (LSHIFT|RSHIFT) (\d+) -> (\w+)$/);
    if (match != null) {
      const [, input, type, value, output] = match;
      return {
        type: type === "LSHIFT"
          ? InstructionType.LShift
          : InstructionType.RShift,
        input,
        value: Number(value),
        output,
      };
    }

    match = line.match(/^NOT (\w+) -> (\w+)$/);
    if (match != null) {
      const [, input, output] = match;
      return { type: InstructionType.Not, input, output };
    }

    throw new Error();
  });

const wires = new Map<string, number>();

const instructionsByOutput = new Map(
  instructions.map((instruction) => [instruction.output, instruction]),
);

const getWireValue = (wire: string): number => {
  const staticValue = Number(wire);
  if (!Number.isNaN(staticValue)) return staticValue;
  return wires.get(wire) ?? computeWireValue(wire);
};

const computeWireValue = (wire: string): number => {
  const instruction = instructionsByOutput.get(wire) ?? throw_();

  const value = (() => {
    switch (instruction.type) {
      case InstructionType.Value: {
        return getWireValue(instruction.value);
      }
      case InstructionType.And: {
        const left = getWireValue(instruction.left);
        const right = getWireValue(instruction.right);
        return left & right;
      }
      case InstructionType.Or: {
        const left = getWireValue(instruction.left);
        const right = getWireValue(instruction.right);
        return left | right;
      }
      case InstructionType.LShift: {
        const input = getWireValue(instruction.input);
        return input << instruction.value;
      }
      case InstructionType.RShift: {
        const input = getWireValue(instruction.input);
        return input >> instruction.value;
      }
      case InstructionType.Not: {
        const input = getWireValue(instruction.input);
        return ~input;
      }
    }
  })();

  wires.set(wire, value);
  return value;
};

const part1 = () => {
  return getWireValue("a");
};
const part1Result = part1();
console.log(part1Result);

const part2 = () => {
  wires.clear();
  wires.set("b", part1Result);
  return getWireValue("a");
};
console.log(part2());
