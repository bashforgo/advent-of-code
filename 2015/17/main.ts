import { minOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
20
15
10
5
5
`
  : await getInput(2015, 17);

const lines = input.trim().split("\n");
const containers = lines.map(Number).sort((a, b) => b - a);

function* compositions(
  x: number,
  ys: number[],
): Generator<number[]> {
  const ysThatFit = ys.filter((y) => y <= x);
  if (ysThatFit.length === 0) {
    return;
  }

  for (let i = 0; i < ysThatFit.length; i++) {
    const y = ysThatFit[i];
    if (y === x) {
      yield [y];
    } else {
      const withoutY = ysThatFit.slice(i + 1);
      for (const rest of compositions(x - y, withoutY)) {
        yield [y, ...rest];
      }
    }
  }
}

const part1 = () => {
  const target = DEBUG ? 25 : 150;
  const combinations = Array.from(compositions(target, containers));
  return combinations.length;
};
console.log(part1());

const part2 = () => {
  const target = DEBUG ? 25 : 150;
  const combinations = Array.from(compositions(target, containers));
  const minimumNumberOfContainers = minOf(combinations, (c) => c.length);
  return combinations.filter((c) => c.length === minimumNumberOfContainers)
    .length;
};
console.log(part2());
