import { maxOf, permutations, slidingWindows, sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { identity } from "@utilities/identity.ts";
import { ObjectMap } from "@utilities/ObjectMap.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
Alice would gain 54 happiness units by sitting next to Bob.
Alice would lose 79 happiness units by sitting next to Carol.
Alice would lose 2 happiness units by sitting next to David.
Bob would gain 83 happiness units by sitting next to Alice.
Bob would lose 7 happiness units by sitting next to Carol.
Bob would lose 63 happiness units by sitting next to David.
Carol would lose 62 happiness units by sitting next to Alice.
Carol would gain 60 happiness units by sitting next to Bob.
Carol would gain 55 happiness units by sitting next to David.
David would gain 46 happiness units by sitting next to Alice.
David would lose 7 happiness units by sitting next to Bob.
David would gain 41 happiness units by sitting next to Carol.
`
  : await getInput(2015, 13);

const lines = input.trim().split("\n");
const happinessIndex = ObjectMap.from(
  lines.map((line) => {
    const [, a, gainOrLose, amount, b] = line.match(
      /(\w+) would (gain|lose) (\d+) happiness units by sitting next to (\w+)/,
    )!;
    return [[a, b], Number(amount) * (gainOrLose === "gain" ? 1 : -1)] as const;
  }),
);
const attendees = new Set(happinessIndex.keys().flatMap(identity));

const calculateHappiness = (seating: string[]) => {
  const neighbors = slidingWindows(seating, 2)
    .concat([[seating.at(-1)!, seating.at(0)!]]) as [string, string][];

  return sumOf(
    neighbors,
    ([a, b]) =>
      (happinessIndex.get([a, b]) ?? 0) + (happinessIndex.get([b, a]) ?? 0),
  );
};

const part1 = () => {
  const [firstAttendee, ...rest] = [...attendees];
  const seatings = permutations(rest).map((x) => [firstAttendee, ...x]);
  const maxHappiness = maxOf(seatings, (s) => calculateHappiness(s));
  return maxHappiness;
};
console.log(part1());

const part2 = () => {
  const seatings = permutations(attendees).map((x) => ["Me", ...x]);
  const maxHappiness = maxOf(seatings, (s) => calculateHappiness(s));
  return maxHappiness;
};
console.log(part2());
