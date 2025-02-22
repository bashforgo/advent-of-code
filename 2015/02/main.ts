import { minBy, sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { identity } from "@utilities/identity.ts";

const input = await getInput(2015, 2);
const boxes = input.trim().split("\n").map((line) => {
  const [length, width, height] = line.split("x").map(Number);
  return { length, width, height };
});

const part1 = () => {
  return sumOf(boxes, ({ length, width, height }) => {
    const sides = [length * width, width * height, height * length];
    const smallestSide = minBy(sides, identity)!;
    return sumOf(sides, (x) => 2 * x) + smallestSide;
  });
};
console.log(part1());

const part2 = () => {
  return sumOf(boxes, ({ length, width, height }) => {
    const [shortestPerimeter] = [
      2 * (length + width),
      2 * (width + height),
      2 * (height + length),
    ].sort((a, b) => a - b);
    const volume = length * width * height;
    return shortestPerimeter + volume;
  });
};
console.log(part2());
