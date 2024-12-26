import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";

const input = await getInput(2024, 3);

const mulExpressionRegex = /mul\((\d{1,3}),(\d{1,3})\)/;
const doExpressionRegex = /do\(\)/;
const doNotExpressionRegex = /don't\(\)/;
const expressionRegex = new RegExp(
  `(${mulExpressionRegex.source}|${doExpressionRegex.source}|${doNotExpressionRegex.source})`,
  "g",
);

const expressions = input.match(expressionRegex)!;

let isEnabled = true;
const enabledMulExpressions = expressions.filter((expression) => {
  if (expression.match(doNotExpressionRegex)) {
    isEnabled = false;
  }

  if (expression.match(doExpressionRegex)) {
    isEnabled = true;
  }

  return isEnabled && expression.match(mulExpressionRegex);
});

const sum = sumOf(enabledMulExpressions, (expression) => {
  const [, a, b] = expression.match(mulExpressionRegex)!;
  return Number(a) * Number(b);
});
console.log(sum);
