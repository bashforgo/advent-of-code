import { unreachable } from "@std/assert";
import { maxBy } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
b inc 5 if a > 1
a inc 1 if b < 5
c dec -10 if a >= 1
c inc -20 if c == 10
`
  : await getInput(2017, 8);

const lines = input.trim().split("\n");

enum OperationType {
  inc = "inc",
  dec = "dec",
}

enum ComparisonType {
  GreaterThan = ">",
  LessThan = "<",
  GreaterThanOrEqual = ">=",
  LessThanOrEqual = "<=",
  Equal = "==",
  NotEqual = "!=",
}

interface Condition {
  register: string;
  comparison: ComparisonType;
  value: number;
}

interface Operation {
  register: string;
  type: OperationType;
  value: number;
  condition: Condition;
}

const operations: Operation[] = lines.map((line) => {
  const match = line.match(
    /(?<register>\w+) (?<type>inc|dec) (?<value>-?\d+) if (?<conditionRegister>\w+) (?<comparison>[><=!]+) (?<conditionValue>-?\d+)/,
  ) ?? unreachable();

  const {
    register,
    type,
    value,
    conditionRegister,
    comparison,
    conditionValue,
  } = match.groups ?? unreachable();
  return {
    register,
    type: type as OperationType,
    value: Number(value),
    condition: {
      register: conditionRegister,
      comparison: comparison as ComparisonType,
      value: Number(conditionValue),
    },
  };
});

function* interpret(operations: Operation[]) {
  const registers: Record<string, number> = {};
  const getRegister = (register: string) => {
    registers[register] ??= 0;
    return registers[register];
  };
  const updateRegister = (
    register: string,
    update: (value: number) => number,
  ) => {
    registers[register] = update(getRegister(register));
  };

  for (const operation of operations) {
    const { register, type, value, condition } = operation;

    const shouldExecute = (() => {
      const registerValue = getRegister(condition.register);
      switch (condition.comparison) {
        case ComparisonType.GreaterThan:
          return registerValue > condition.value;
        case ComparisonType.LessThan:
          return registerValue < condition.value;
        case ComparisonType.GreaterThanOrEqual:
          return registerValue >= condition.value;
        case ComparisonType.LessThanOrEqual:
          return registerValue <= condition.value;
        case ComparisonType.Equal:
          return registerValue === condition.value;
        case ComparisonType.NotEqual:
          return registerValue !== condition.value;
      }
    })();
    if (!shouldExecute) continue;

    updateRegister(register, (registerValue) => {
      switch (type) {
        case OperationType.inc:
          return registerValue + value;
        case OperationType.dec:
          return registerValue - value;
      }
    });

    yield registers;
  }
}

const part1 = () => {
  const registers = interpret(operations).reduce((_, x) => x, {});
  return maxBy(Object.values(registers), (x) => x);
};
console.log(part1());

const part2 = () => {
  const allValues = interpret(operations).flatMap((r) => Object.values(r));
  return maxBy(allValues, (x) => x);
};
console.log(part2());
