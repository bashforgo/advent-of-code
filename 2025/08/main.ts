import { parse } from "@std/csv";
import { ascend, BinaryHeap, descend } from "@std/data-structures";
import { getInput } from "@utilities/getInput.ts";
import { productOf } from "@utilities/productOf.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689
`
  : await getInput(2025, 8);

interface Point3D {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

interface DistanceBetweenPoints {
  readonly a: Point3D;
  readonly b: Point3D;
  readonly distance: number;
}

const table = parse(input.trim());

const junctionBoxes: Point3D[] = table.map(([x, y, z]) => ({
  x: Number(x),
  y: Number(y),
  z: Number(z),
}));

const computeDistance = (a: Point3D, b: Point3D): number => {
  return Math.sqrt(
    (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2,
  );
};

const readonlyDistances = new BinaryHeap<DistanceBetweenPoints>((a, b) =>
  ascend(a.distance, b.distance)
);
for (
  const distance of junctionBoxes
    .entries()
    .flatMap(([i, a]) =>
      junctionBoxes
        .values()
        .drop(i + 1)
        .map((b): DistanceBetweenPoints => ({
          a,
          b,
          distance: computeDistance(a, b),
        }))
    )
) {
  readonlyDistances.push(distance);
}

const part1 = () => {
  const NUMBER_OF_CONNECTIONS_TO_MAKE = DEBUG ? 10 : 1000;
  const distances = BinaryHeap.from(readonlyDistances);

  const circuits = new Map(
    junctionBoxes.map((box) => [box, new Set([box])]),
  );
  for (const _ of range(1, NUMBER_OF_CONNECTIONS_TO_MAKE)) {
    const { a, b } = distances.pop()!;

    const circuitA = circuits.get(a)!;
    const circuitB = circuits.get(b)!;

    if (circuitA === circuitB) continue;

    const mergedCircuit = circuitA.union(circuitB);
    for (const box of mergedCircuit) {
      circuits.set(box, mergedCircuit);
    }
  }

  const uniqueCircuits = new Set(
    circuits
      .values()
      .filter((c) => c.size > 1),
  );
  const uniqueCircuitsSortedBySize = Array.from(uniqueCircuits)
    .sort((a, b) => descend(a.size, b.size));
  return productOf(uniqueCircuitsSortedBySize.values().take(3), (c) => c.size);
};
console.log(part1());

const part2 = () => {
  const distances = BinaryHeap.from(readonlyDistances);

  const circuits = new Map(
    junctionBoxes.map((box) => [box, new Set([box])]),
  );
  const uniqueCircuits = new Set(circuits.values());
  while (true) {
    const { a, b } = distances.pop()!;

    const circuitA = circuits.get(a)!;
    const circuitB = circuits.get(b)!;

    if (circuitA === circuitB) continue;

    const mergedCircuit = circuitA.union(circuitB);
    for (const box of mergedCircuit) {
      circuits.set(box, mergedCircuit);
    }

    uniqueCircuits.delete(circuitA);
    uniqueCircuits.delete(circuitB);
    uniqueCircuits.add(mergedCircuit);

    if (uniqueCircuits.size === 1) {
      return a.x * b.x;
    }
  }
};
console.log(part2());
