import { BinaryHeap } from "@std/data-structures";
import { getInput } from "@utilities/getInput.ts";
import { mapMapValues } from "@utilities/mapMap.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
e => H
e => O
H => HO
H => OH
O => HH

HOHOHO
`
  : await getInput(2015, 19);

const [replacementsString, molecule] = input.trim().split("\n\n");
const replacementsEntries = replacementsString
  .split("\n")
  .map((line) => line.split(" => ") as [string, string]);

const replacements = mapMapValues(
  Map.groupBy(replacementsEntries, ([from]) => from),
  (tos) => tos.map(([, to]) => to),
);
const replacementsReverse = mapMapValues(
  Map.groupBy(replacementsEntries, ([, to]) => to),
  (froms) => froms.map(([from]) => from),
);

const generatePossibleMolecules = (molecule: string) => {
  const possibleMolecules = new Set<string>();
  for (const [from, tos] of replacements) {
    const regex = new RegExp(from, "g");
    for (const match of molecule.matchAll(regex)) {
      const prefix = molecule.slice(0, match.index);
      const suffix = molecule.slice(match.index + from.length);
      for (const to of tos) {
        const newMolecule = `${prefix}${to}${suffix}`;
        possibleMolecules.add(newMolecule);
      }
    }
  }
  return possibleMolecules;
};

const part1 = () => {
  const possibleMolecules = generatePossibleMolecules(molecule);
  return possibleMolecules.size;
};
console.log(part1());

const generatePossibleSourceMolecules = (targetMolecule: string) => {
  const possibleMolecules = new Set<string>();
  for (const [to, froms] of replacementsReverse) {
    const regex = new RegExp(to, "g");
    for (const match of targetMolecule.matchAll(regex)) {
      const prefix = targetMolecule.slice(0, match.index);
      const suffix = targetMolecule.slice(match.index + to.length);
      for (const from of froms) {
        const newMolecule = `${prefix}${from}${suffix}`;
        possibleMolecules.add(newMolecule);
      }
    }
  }
  return possibleMolecules;
};

const countTrickyElements = (molecule: string) => {
  const numberOfRns = molecule.match(/Rn/g)?.length ?? 0;
  const numberOfArs = molecule.match(/Ar/g)?.length ?? 0;
  const numberOfYs = molecule.match(/Y/g)?.length ?? 0;
  return numberOfRns + numberOfArs + numberOfYs;
};

const part2 = () => {
  const ELECTRON = "e";

  const open = new BinaryHeap<string>((a, b) =>
    countTrickyElements(a) - countTrickyElements(b)
  );
  open.push(molecule);
  const openSet = new Set([molecule]);

  const closed = new Set<string>();

  const parent = new Map<string, string>();

  while (open.length > 0) {
    const current = open.pop()!;
    openSet.delete(current);
    closed.add(current);

    if (current === ELECTRON) {
      break;
    }

    for (const next of generatePossibleSourceMolecules(current)) {
      if (closed.has(next)) {
        continue;
      }

      if (!openSet.has(next)) {
        open.push(next);
        openSet.add(next);
        parent.set(next, current);
      }
    }
  }

  let current = ELECTRON;
  const path: string[] = [];
  while (current != null) {
    path.push(current);
    current = parent.get(current)!;
  }

  return path.length - 1;
};
console.log(part2());
