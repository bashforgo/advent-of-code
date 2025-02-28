import { unreachable } from "@std/assert";
import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { Rectangle } from "@utilities/grid/Rectangle.ts";
import { makeGrid } from "@utilities/grid/makeGrid.ts";
import { subGrid } from "@utilities/grid/subGrid.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2
`
  : await getInput(2018, 3);

const [width, height] = [1000, 1000];

interface Claim extends Rectangle {
  id: number;
}

const claims = input.trim().split("\n").map((line) => {
  const [, id, x, y, width, height] = line.match(
    /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/,
  ) ?? unreachable();
  return {
    id: Number(id),
    x: Number(x),
    y: Number(y),
    width: Number(width),
    height: Number(height),
  } as Claim;
});

const grid = makeGrid(width, height, () => new Set<number>());

for (const claim of claims) {
  for (const claimedBy of subGrid(grid, claim).flat()) {
    claimedBy.add(claim.id);
  }
}

const part1 = () => {
  return sumOf(grid.flat(), (x) => x.size > 1 ? 1 : 0);
};
console.log(part1());

const part2 = () => {
  const nonOverlappingClaimIds = new Set(claims.map((x) => x.id));
  for (const claimedBy of grid.flat()) {
    if (claimedBy.size > 1) {
      for (const claimId of claimedBy) {
        nonOverlappingClaimIds.delete(claimId);
      }
    }
  }

  console.assert(
    nonOverlappingClaimIds.size === 1,
    "Expected one non-overlapping claim",
  );

  const [nonOverlappingClaimId] = nonOverlappingClaimIds;
  return nonOverlappingClaimId;
};
console.log(part2());
