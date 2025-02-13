import { ascend } from "@std/data-structures";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
5-8
0-2
4-7
`
  : await getInput(2016, 20);

const lines = input.trim().split("\n");

interface Range {
  start: number;
  end: number;
}

const ranges = lines
  .map((line): Range => {
    const [start, end] = line.split("-").map(Number);
    return { start, end };
  })
  .toSorted((a, b) => ascend(a.start, b.start));

const findBlockingRange = (ip: number): Range | void => {
  return ranges.find(({ start, end }) => start <= ip && ip <= end);
};

const part1 = () => {
  let ip = 0;
  while (true) {
    const blockingRange = findBlockingRange(ip);
    if (blockingRange == null) return ip;
    ip = blockingRange.end + 1;
  }
};
console.log(part1());

const part2 = () => {
  let numberOfAllowedIps = 0;
  let ip = 0;
  while (ip < 2 ** 32) {
    const blockingRange = findBlockingRange(ip);
    if (blockingRange == null) {
      numberOfAllowedIps++;
      ip++;
    } else {
      ip = blockingRange.end + 1;
    }
  }
  return numberOfAllowedIps;
};
console.log(part2());
