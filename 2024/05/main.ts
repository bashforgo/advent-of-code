import { partition, slidingWindows, sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
`
  : await getInput(2024, 5);

const [pageOrderingRulesString, pageUpdatesString] = input.trim().split("\n\n");

/** If `pageOrderingRules.get(A)?.has(B)` means page A should come before page B */
const pageOrderingRules = new Map(
  Map.groupBy(
    pageOrderingRulesString.split("\n").map((line) =>
      line.split("|").map(Number) as [number, number]
    ),
    ([a]) => a,
  ).entries().map(([a, bs]) => [a, new Set(bs.map(([, b]) => b))] as const),
);

const comparePages = (a: number, b: number) => {
  if (pageOrderingRules.get(a)?.has(b)) return -1;
  if (pageOrderingRules.get(b)?.has(a)) return 1;
  return 0;
};

const pageUpdates = pageUpdatesString.split("\n").map((line) =>
  line.split(",").map(Number)
);

const [pageUpdatesInCorrectOrder, pageUpdatesInWrongOrder] = partition(
  pageUpdates,
  (update) => {
    const pairs = slidingWindows(update, 2);
    return pairs.every(([a, b]) => comparePages(a, b) <= 0);
  },
);
console.log(
  sumOf(pageUpdatesInCorrectOrder, (update) => update.at(update.length / 2)!),
);

console.log(
  sumOf(
    pageUpdatesInWrongOrder,
    (update) => update.toSorted(comparePages).at(update.length / 2)!,
  ),
);
