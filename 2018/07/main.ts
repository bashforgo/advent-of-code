import { unreachable } from "@std/assert";
import { maxOf } from "@std/collections";
import { ascend, BinaryHeap } from "@std/data-structures";
import { getInput } from "@utilities/getInput.ts";
import { ObjectMap } from "@utilities/ObjectMap.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.
`
  : await getInput(2018, 7);

const dependencies = input
  .trim()
  .split("\n")
  .map((line) => {
    const [, dependency, step] =
      line.match(/Step (\w) must be finished before step (\w) can begin./) ??
        unreachable();
    return { dependency, step };
  });

// incoming edges by node
const initialGraph = ObjectMap
  .groupBy(dependencies, ({ step }) => step)
  .map((dependencies) =>
    new Set(dependencies
      .map(({ dependency }) => dependency)) as ReadonlySet<string>
  );

const steps = new Set(
  dependencies.flatMap(({ dependency, step }) => [dependency, step]),
);

const kahnsAlgorithm = () => {
  const graph = initialGraph.map((edges) => new Set(edges));
  const initialS = steps.difference(new Set(graph.keys()));

  const L: string[] = [];
  const S = new BinaryHeap<string>(ascend);
  S.push(...initialS);

  while (!S.isEmpty()) {
    const n = S.pop()!;
    L.push(n);

    for (const [m, edges] of graph) {
      if (!edges.has(n)) continue;
      edges.delete(n);
      if (edges.size === 0) {
        S.push(m);
        graph.delete(m);
      }
    }
  }

  if (graph.size > 0) unreachable();
  return L;
};

const part1 = () => {
  return kahnsAlgorithm().join("");
};
console.log(part1());

function* modifiedKahnsAlgorithm() {
  const graph = initialGraph.map((edges) => new Set(edges));
  const initialS = steps.difference(new Set(graph.keys()));

  const S = new BinaryHeap<string>(ascend);
  S.push(...initialS);

  while (true) {
    const n = S.pop();

    yield n == null ? null : [
      n,
      () => {
        for (const [m, edges] of graph) {
          if (!edges.has(n)) continue;
          edges.delete(n);
          if (edges.size === 0) {
            S.push(m);
            graph.delete(m);
          }
        }
      },
    ] as const;

    if (S.isEmpty() && graph.size === 0) return;
  }
}

const getTimeRequiredToCompleteStep = (step: string) => {
  const baseTime = DEBUG ? 0 : 60;
  const charCodeOfA = "A".charCodeAt(0);
  return baseTime + step.charCodeAt(0) - charCodeOfA + 1;
};

const part2 = () => {
  const numberOfWorkers = DEBUG ? 2 : 5;
  type Worker =
    | { busyUntil?: never; whenDone?: never }
    | { busyUntil: number; whenDone: () => void };

  const workers = range(1, numberOfWorkers).map((): Worker => ({})).toArray();
  const steps = modifiedKahnsAlgorithm();

  for (const time of range(0, Infinity)) {
    for (const worker of workers) {
      if (worker.busyUntil === time) worker.whenDone();
    }

    for (const worker of workers) {
      if (worker.busyUntil != null) continue;
      const step = steps.next();
      if (step.done) return maxOf(workers, (worker) => worker.busyUntil ?? -1);
      if (step.value == null) continue;
      const [n, completeTask] = step.value;
      Object.assign(worker, {
        busyUntil: time + getTimeRequiredToCompleteStep(n),
        whenDone: () => {
          completeTask();
          delete worker.busyUntil;
          delete worker.whenDone;
        },
      });
    }
  }
};
console.log(part2());
