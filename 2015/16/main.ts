import { getInput } from "@utilities/getInput.ts";

const input = await getInput(2015, 16);

const lines = input.trim().split("\n");
interface Aunt {
  id: number;
  items: Map<string, number>;
}
const aunts = lines.map((line) => {
  const [, id, item1, item1Amount, item2, item2Amount, item3, item3Amount] =
    line.match(/Sue (\d+): (\w+): (\d+), (\w+): (\d+), (\w+): (\d+)/)!;
  return {
    id: Number(id),
    items: new Map([
      [item1, Number(item1Amount)],
      [item2, Number(item2Amount)],
      [item3, Number(item3Amount)],
    ]),
  } satisfies Aunt;
});

const target = new Map([
  ["children", 3],
  ["cats", 7],
  ["samoyeds", 2],
  ["pomeranians", 3],
  ["akitas", 0],
  ["vizslas", 0],
  ["goldfish", 5],
  ["trees", 3],
  ["cars", 2],
  ["perfumes", 1],
]);

const part1 = () => {
  return aunts.find((aunt) => {
    for (const [item, amount] of aunt.items) {
      if (target.get(item) !== amount) {
        return false;
      }
    }
    return true;
  })!.id;
};
console.log(part1());

const part2 = () => {
  const greaterThanItems = new Set(["cats", "trees"]);
  const lessThanItems = new Set(["pomeranians", "goldfish"]);
  const equalItems = new Set([
    "children",
    "samoyeds",
    "akitas",
    "vizslas",
    "cars",
    "perfumes",
  ]);

  return aunts.find((aunt) => {
    for (const [item, amount] of aunt.items) {
      const targetAmount = target.get(item)!;
      if (lessThanItems.has(item) && amount >= targetAmount) {
        return false;
      }
      if (greaterThanItems.has(item) && amount <= targetAmount) {
        return false;
      }
      if (equalItems.has(item) && amount !== targetAmount) {
        return false;
      }
    }
    return true;
  })!.id;
};
console.log(part2());
