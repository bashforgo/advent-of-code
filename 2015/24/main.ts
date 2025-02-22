import { minOf, sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { identity } from "@utilities/identity.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
1
2
3
4
5
7
8
9
10
11
`
  : await getInput(2015, 24);

const lines = input.trim().split("\n");
const packages = lines.map(Number).sort((a, b) => b - a);

const totalWeight = sumOf(packages, identity);

function* pickPackages(
  packages: number[],
  target: number,
): Generator<[picked: number[], rest: number[]]> {
  for (const [i, package_] of packages.entries()) {
    if (package_ === target) {
      yield [[package_], packages.toSpliced(i, 1)];
    } else if (package_ < target) {
      const prefix = packages.slice(0, i);
      const suffix = packages.slice(i + 1);
      for (const [picked, rest] of pickPackages(suffix, target - package_)) {
        yield [[package_, ...picked], [...prefix, ...rest]];
      }
    }
  }
}

const part1 = () => {
  const target = totalWeight / 3;

  const arrangementForPassengerCompartment = [
    ...pickPackages(packages, target),
  ];
  const arrangementsByLegRoom = Map.groupBy(
    arrangementForPassengerCompartment,
    ([picked]) => picked.length,
  );
  const bestLegRoomKeys = [...arrangementsByLegRoom.keys()]
    .sort((a, b) => a - b);
  for (const legRoom of bestLegRoomKeys) {
    const validArrangements = arrangementsByLegRoom.get(legRoom)!
      .filter(([picked, rest]) =>
        isValidPassengerCompartmentPick(picked, rest)
      );
    if (validArrangements.length <= 0) continue;
    const bestArrangementQuantumEntanglement = minOf(
      validArrangements,
      ([picked]) => picked.reduce((a, b) => a * b),
    );
    return bestArrangementQuantumEntanglement;
  }

  function isValidPassengerCompartmentPick(pick: number[], rest: number[]) {
    const someArrangementForOtherCompartments = pickPackages(rest, target);
    return someArrangementForOtherCompartments
      .some(([left, right]) =>
        pick.length <= left.length && pick.length <= right.length
      );
  }
};
console.log(part1());

const part2 = () => {
  const target = totalWeight / 4;

  const arrangementForPassengerCompartment = [
    ...pickPackages(packages, target),
  ];
  const arrangementsByLegRoom = Map.groupBy(
    arrangementForPassengerCompartment,
    ([picked]) => picked.length,
  );
  const bestLegRoomKeys = [...arrangementsByLegRoom.keys()]
    .sort((a, b) => a - b);

  for (const legRoom of bestLegRoomKeys) {
    const validArrangements = arrangementsByLegRoom.get(legRoom)!
      .filter(([picked, rest]) =>
        isValidPassengerCompartmentPick(picked, rest)
      );
    if (validArrangements.length <= 0) continue;
    const bestArrangementQuantumEntanglement = minOf(
      validArrangements,
      ([picked]) => picked.reduce((a, b) => a * b),
    );
    return bestArrangementQuantumEntanglement;
  }

  function isValidPassengerCompartmentPick(
    passenger: number[],
    restOfPassenger: number[],
  ) {
    for (const [left, restOfLeft] of pickPackages(restOfPassenger, target)) {
      for (const [right, trunk] of pickPackages(restOfLeft, target)) {
        if (left.length < passenger.length) continue;
        if (right.length < passenger.length) continue;
        if (trunk.length < passenger.length) continue;
        return true;
      }
    }
    return false;
  }
};
console.log(part2());
