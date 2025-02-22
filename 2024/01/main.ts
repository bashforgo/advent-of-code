import { sumOf, unzip, zip } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { identity } from "@utilities/identity.ts";

const input = await getInput(2024, 1);

const [leftLocationIds, rightLocationIds] = unzip(
  input.split("\n").filter(Boolean).map((line) =>
    line.split(" ").filter(Boolean).map(Number) as [number, number]
  ),
);

leftLocationIds.sort();
rightLocationIds.sort();

const distances = zip(leftLocationIds, rightLocationIds).map(([left, right]) =>
  Math.abs(left - right)
);

console.log(sumOf(distances, identity));

const uniqueLeftLocationIds = Array.from(new Set(leftLocationIds));
const instancesOfRightLocationIds = Map.groupBy(rightLocationIds, identity);

let similarity = 0;
for (const location of uniqueLeftLocationIds) {
  similarity += location *
    (instancesOfRightLocationIds.get(location)?.length ?? 0);
}
console.log(similarity);
