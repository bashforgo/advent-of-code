import { maxBy } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn
`
  : await getInput(23);

const connections = input
  .trim()
  .split("\n")
  .map((line) => line.split("-") as [string, string]);

if (DEBUG) connections.sort();

const computersSet = new Set(connections.flatMap((c) => c));
const connectionsSet = ObjectSet.from(
  connections.map((c) => c.toSorted() as [string, string]),
);
const neighborhood = new Map(
  computersSet.values().map((c) => [c, new Set<string>()]),
);
for (const [a, b] of connectionsSet) {
  neighborhood.get(a)!.add(b);
  neighborhood.get(b)!.add(a);
}

const part1 = () => {
  const computersThatStartWithT = ObjectSet.from(
    computersSet.values().filter((c) => c.startsWith("t")),
  );

  const triConnections = new ObjectSet<[string, string, string]>();
  for (const [a, b] of connectionsSet) {
    const aStartsWithT = computersThatStartWithT.has(a);
    const bStartsWithT = computersThatStartWithT.has(b);
    const hasComputerThatStartsWithT = aStartsWithT || bStartsWithT;
    if (!hasComputerThatStartsWithT) continue;

    for (const neighbor of neighborhood.get(a)!) {
      const isNeighborOfB = neighborhood.get(b)!.has(neighbor);
      if (!isNeighborOfB) continue;

      triConnections.add([a, b, neighbor].sort() as [string, string, string]);
    }
  }

  return triConnections.size;
};
console.log(part1());

const part2 = () => {
  function* BronKerbosch(
    R: ReadonlySet<string>,
    P: ReadonlySet<string>,
    X: ReadonlySet<string>,
    N: (vertex: string) => ReadonlySet<string>,
  ): Generator<ReadonlySet<string>> {
    if (P.size === 0 && X.size === 0) {
      yield R;
    }

    for (const vertex of P) {
      const vertexSet = new Set([vertex]);

      yield* BronKerbosch(
        R.union(vertexSet),
        P.intersection(N(vertex)),
        X.intersection(N(vertex)),
        N,
      );

      P = P.difference(vertexSet);
      X = X.union(vertexSet);
    }
  }

  const cliques = BronKerbosch(
    new Set(),
    computersSet,
    new Set(),
    (vertex) => neighborhood.get(vertex)!,
  );
  const maximumClique = maxBy(cliques, (clique) => clique.size)!;
  return Array.from(maximumClique).sort().join(",");
};
console.log(part2());
