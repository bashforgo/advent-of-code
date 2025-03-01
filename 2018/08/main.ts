import { memoize } from "@std/cache";
import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { identity } from "@utilities/identity.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2
`
  : await getInput(2018, 8);

const licenseFile = input.trim().split(" ").map(Number);

interface Node {
  children: Node[];
  metadata: number[];
}

const parseNode = (licenseFile: number[]): Node => {
  const [quantityOfChildNodes, quantityOfMetadata] = licenseFile
    .splice(0, 2);

  const children = quantityOfChildNodes === 0
    ? []
    : range(1, quantityOfChildNodes)
      .map(() => parseNode(licenseFile))
      .toArray();

  const metadata = licenseFile.splice(0, quantityOfMetadata);

  return { children, metadata };
};

const root = parseNode([...licenseFile]);

function* allMetadata(node: Node): Generator<number> {
  yield* node.metadata;

  for (const child of node.children) {
    yield* allMetadata(child);
  }
}

const part1 = () => {
  return sumOf(allMetadata(root), identity);
};
console.log(part1());

const getValue = memoize((node: Node): number => {
  return node.children.length === 0 ? sumOf(node.metadata, identity) : sumOf(
    node.metadata.map((ordinal) => {
      const index = ordinal - 1;
      const child = node.children.at(index);
      return child == null ? 0 : getValue(child);
    }),
    identity,
  );
});

const part2 = () => {
  return getValue(root);
};
console.log(part2());
