import { memoize } from "@std/cache";
import { associateBy, sumOf } from "@std/collections";
import { descend } from "@std/data-structures";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)
`
  : await getInput(2017, 7);

const lines = input.trim().split("\n");

interface Program {
  name: string;
  weight: number;
  children: string[];
}

const programs: Program[] = lines.map((line) => {
  const match = line.match(
    /(?<name>\w+) \((?<weight>\d+)\)(?: -> (?<children>.+))?/,
  )!;
  return {
    name: match.groups!.name,
    weight: Number(match.groups!.weight),
    children: match.groups!.children ? match.groups!.children.split(", ") : [],
  };
});

const part1 = () => {
  const programNames = new Set(programs.map((p) => p.name));
  for (const program of programs) {
    for (const child of program.children) {
      programNames.delete(child);
    }
  }
  const [root] = programNames;
  return root;
};
console.log(part1());

const programsByName = associateBy(programs, (p) => p.name);

const computeWeight = memoize((name: string): number => {
  const program = programsByName[name];
  return program.weight + sumOf(program.children, (p) => computeWeight(p));
});

const parents = new Map(
  programs.flatMap((parent) =>
    parent.children.map((child) => [child, parent.name])
  ),
);

const computeLevel = memoize((name: string): number => {
  if (!parents.has(name)) return 0;
  return 1 + computeLevel(parents.get(name)!);
});

const isBalanced = (name: string): boolean => {
  const program = programsByName[name];
  if (program.children.length === 0) return true;
  const weights = new Set(program.children.map((p) => computeWeight(p)));
  return weights.size === 1;
};

const part2 = () => {
  const programsSortedByLevel = programs.toSorted((a, b) =>
    descend(computeLevel(a.name), computeLevel(b.name))
  );
  for (const program of programsSortedByLevel) {
    if (isBalanced(program.name)) continue;

    const weightsByProgram = Map.groupBy(
      program.children,
      (p) => computeWeight(p),
    );

    const [outlierWeight, [outlierProgram]] = weightsByProgram.entries()
      .find(([_, v]) => v.length === 1)!;
    const [correctWeight] = weightsByProgram.entries()
      .find(([_, v]) => v.length > 1)!;

    const diff = correctWeight - outlierWeight;
    return programsByName[outlierProgram].weight + diff;
  }
};
console.log(part2());
