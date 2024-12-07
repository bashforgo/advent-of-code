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

const evaluateOperation = (operator: Operator, a: number, b: number) => {
  switch (operator) {
    case Operator.Add:
      return a + b;
    case Operator.Multiply:
      return a * b;
    case Operator.Concatenate:
      return Number(`${a}${b}`);
  }
};

const evaluateEquation = (operands: number[], operators: Operator[]) => {
  let result = operands[0];
  for (let i = 1; i < operands.length; i++) {
    result = evaluateOperation(operators[i - 1], result, operands[i]);
  }
  return result;
};

const getNOperatorCombinations = (n: number): Operator[][] => {
  if (n === 1) {
    return operators.map((operator) => [operator]);
  }
  const subCombinations = getNOperatorCombinations(n - 1);
  return operators.flatMap((operator) =>
    subCombinations.map((subCombination) => [...subCombination, operator])
  );
};

const result = equations.filter(({ testValue, operands }) =>
  getNOperatorCombinations(operands.length).some((operators) =>
    evaluateEquation(operands, operators) === testValue
  )
);
console.log(sumOf(result, ({ testValue }) => testValue));
