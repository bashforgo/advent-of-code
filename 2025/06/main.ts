import { sumOf, takeWhile } from "@std/collections";
import { parse } from "@std/csv";
import { getInput } from "@utilities/getInput.ts";
import { transpose } from "@utilities/grid/transpose.ts";
import { identity } from "@utilities/identity.ts";
import { productOf } from "@utilities/productOf.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
123 328  51 64 \n\
 45 64  387 23 \n\
  6 98  215 314\n\
*   +   *   +  \n\
`
  : await getInput(2025, 6);

enum Operation {
  Add = "+",
  Multiply = "*",
}

interface Problem {
  numbers: number[];
  operation: Operation;
}

const computeProblem = ({ numbers, operation }: Problem): number => {
  switch (operation) {
    case Operation.Add:
      return sumOf(numbers, identity);
    case Operation.Multiply:
      return productOf(numbers, identity);
  }
};

const part1 = () => {
  const table = parse(
    input
      .trim()
      .replaceAll(/^[ ]*|[ ]*$/gm, "")
      .replaceAll(/[ ]+/g, " "),
    { separator: " " },
  );

  const problems = transpose(table)
    .map((row): Problem => {
      const numbers = row
        .slice(0, -1)
        .map((n) => Number(n));
      const operation = row.at(-1) as Operation;
      return { numbers, operation };
    });

  return sumOf(problems, (p) => computeProblem(p));
};
console.log(part1());

const part2 = () => {
  const table = input
    .replace(/\n$/, "")
    .split("\n")
    .map((line) => line.split(""));
  const transposed = transpose(table);

  let sum = 0;
  const lineIterator = transposed.values();
  while (true) {
    const problemSection = takeWhile(
      lineIterator,
      (line) => line.join("").trim() !== "",
    );
    if (problemSection.length === 0) break;
    const operation = problemSection.at(0)?.at(-1) as Operation;
    const numbers = problemSection.map((line) =>
      Number(
        line
          .slice(0, -1)
          .join("")
          .trim(),
      )
    );
    sum += computeProblem({ numbers, operation });
  }

  return sum;
};
console.log(part2());
