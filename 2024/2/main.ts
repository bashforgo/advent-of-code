import { slidingWindows } from "@std/collections";
import { sumOf } from "@std/collections/sum-of";
import { getInput } from "@utilities/getInput.ts";

const input = await getInput(2);

const reports = input.split("\n").filter(Boolean).map((line) =>
  line.split(" ").map(Number)
);

const isReportStrictlySafe = (levels: number[]): boolean => {
  // The levels are either all increasing or all decreasing.
  // Any two adjacent levels differ by at least one and at most three.

  const pairs = slidingWindows(levels, 2);
  const differences = pairs.map(([a, b]) => b - a);

  const direction = Math.sign(differences[0]);
  return differences.every((diff) =>
    direction === Math.sign(diff) && 1 <= Math.abs(diff) && Math.abs(diff) <= 3
  );
};

console.log(sumOf(reports, (r) => isReportStrictlySafe(r) ? 1 : 0));

const isReportAlmostSafe = (levels: number[]): boolean => {
  const isStrictlySafe = isReportStrictlySafe(levels);
  if (isStrictlySafe) return true;

  // Now, the same rules apply as before, except if removing a single level from an unsafe report
  // would make it safe, the report instead counts as safe.

  for (const i of levels.keys()) {
    const removed = [...levels];
    removed.splice(i, 1);
    if (isReportStrictlySafe(removed)) return true;
  }

  return false;
};

console.log(sumOf(reports, (r) => isReportAlmostSafe(r) ? 1 : 0));
