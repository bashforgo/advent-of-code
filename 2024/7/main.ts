import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`
  : await getInput(7);

const lines = input.trim().split("\n");
const equations = lines.map((line) => {
  const [testValue, operandsString] = line.split(": ");
  const operands = operandsString.split(" ").map(Number);
  return { testValue: Number(testValue), operands };
});

enum Operator {
  Add = "+",
  Multiply = "*",
  Concatenate = "||",
}
const operators = [Operator.Add, Operator.Multiply, Operator.Concatenate];

const reverseOperator = (operator: Operator, left: number, right: number) => {
  switch (operator) {
    case Operator.Add: {
      return left - right;
    }
    case Operator.Multiply: {
      const result = left / right;
      return Number.isInteger(result) ? result : NaN;
    }
    case Operator.Concatenate: {
      const rightLength = Math.floor(Math.log10(right)) + 1;
      const divisor = Math.pow(10, rightLength);
      return left % divisor === right ? Math.floor(left / divisor) : NaN;
    }
  }
};

const canMakeTestValue = (testValue: number, operands: number[]) => {
  if (operands.length === 1) {
    return operands[0] === testValue;
  }

  for (const operator of operators) {
    const operand = operands.at(-1)!;
    const rest = operands.slice(0, -1);
    const result = reverseOperator(operator, testValue, operand);

    if (Number.isNaN(result)) continue;
    if (canMakeTestValue(result, rest)) return true;
  }

  return false;
};

const validEquations = equations.filter(({ testValue, operands }) =>
  canMakeTestValue(testValue, operands)
);
console.log(sumOf(validEquations, ({ testValue }) => testValue));
