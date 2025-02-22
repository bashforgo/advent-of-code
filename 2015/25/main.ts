import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { identity } from "@utilities/identity.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
To continue, please consult the code grid in the manual.  Enter the code at row 4, column 2.
`
  : await getInput(2015, 25);

const [, row, column] = input.match(/row (\d+), column (\d+)/)!.map(Number);

const rcToOrdinal = (row: number, column: number) => {
  const nthDiagonal = row + column - 1;
  const topValueInDiagonal = sumOf(range(1, nthDiagonal), identity);
  const distanceFromTop = row - 1;
  return topValueInDiagonal - distanceFromTop;
};

function* codeGenerator() {
  let code = 20151125;
  while (true) {
    yield code;
    code = (code * 252533) % 33554393;
  }
}

const part1 = () => {
  return codeGenerator().drop(rcToOrdinal(row, column) - 1).next().value;
};
console.log(part1());
