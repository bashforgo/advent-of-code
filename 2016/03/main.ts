import { chunk } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { transpose } from "@utilities/grid/transpose.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
101 301 501
102 302 502
103 303 503
201 401 601
202 402 602
203 403 603
`
  : await getInput(2016, 3);

const lines = input.trim().split("\n");
const triangleCandidates = lines.map((line) =>
  line.trim().split(/\s+/g).map(Number)
);

const part1 = () => {
  return triangleCandidates
    .filter(([a, b, c]) => a + b > c && a + c > b && b + c > a)
    .length;
};
console.log(part1());

const part2 = () => {
  const verticalTriangleCandidates = chunk(
    transpose(triangleCandidates).flat(),
    3,
  );
  return verticalTriangleCandidates
    .filter(([a, b, c]) => a + b > c && a + c > b && b + c > a)
    .length;
};
console.log(part2());
