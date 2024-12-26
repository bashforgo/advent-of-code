import { getInput } from "@utilities/getInput.ts";
import { throw_ } from "@utilities/throw.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj
`
  : await getInput(2024, 24);

const [wiresString, gatesString] = input.split("\n\n");
const inputWires = wiresString
  .trim()
  .split("\n")
  .map((line) => {
    const [, id, value] = line.match(/(\w+): (\d+)/) ?? throw_();
    return [id, Number(value)] as const;
  });

enum Operator {
  AND = "AND",
  OR = "OR",
  XOR = "XOR",
}

interface Gate {
  readonly left: string;
  readonly operator: Operator;
  readonly right: string;
  readonly output: string;
}

const gates = gatesString.trim().split("\n").map((line) => {
  const [, left, operator, right, output] = line.match(
    /(\w+) (AND|OR|XOR) (\w+) -> (\w+)/,
  ) ?? throw_();
  return { left, operator, right, output } as Gate;
});

const z10 = gates.find((gate) => gate.output === "z10")!;
const gpr = gates.find((gate) => gate.output === "gpr")!;
Object.assign(z10, { output: "gpr" });
Object.assign(gpr, { output: "z10" });

const z33 = gates.find((gate) => gate.output === "z33")!;
const ghp = gates.find((gate) => gate.output === "ghp")!;
Object.assign(z33, { output: "ghp" });
Object.assign(ghp, { output: "z33" });

const krs = gates.find((gate) => gate.output === "krs")!;
const cpm = gates.find((gate) => gate.output === "cpm")!;
Object.assign(krs, { output: "cpm" });
Object.assign(cpm, { output: "krs" });

const nks = gates.find((gate) => gate.output === "nks")!;
const z21 = gates.find((gate) => gate.output === "z21")!;
Object.assign(nks, { output: "z21" });
Object.assign(z21, { output: "nks" });

const gatesByOutput = new Map(
  gates.map((gate) => [gate.output, gate]),
) as ReadonlyMap<string, Gate>;

const gateWires = new Set(
  gates.flatMap((gate) => [gate.left, gate.right, gate.output]),
);
const wireMap = new Map([
  ...gateWires.values().map((wire) => [wire, null] as const),
  ...inputWires,
]);

function getWireValue(wire: string): number {
  const maybeValue = wireMap.get(wire);
  return maybeValue ?? computeGate(gatesByOutput.get(wire)!);
}

function computeGate(gate: Gate): number {
  const leftValue = getWireValue(gate.left);
  const rightValue = getWireValue(gate.right);
  let result: number;
  switch (gate.operator) {
    case Operator.AND:
      result = leftValue & rightValue;
      break;
    case Operator.OR:
      result = leftValue | rightValue;
      break;
    case Operator.XOR:
      result = leftValue ^ rightValue;
      break;
  }
  wireMap.set(gate.output, result);
  return result;
}

// deno-lint-ignore no-unused-vars
const part1 = () => {
  const wiresThatStartWithZ = wireMap.keys().filter((id) => id.startsWith("z"));
  const values = wiresThatStartWithZ.map((id) => [id, getWireValue(id)]);
  const binaryString = Array.from(values)
    .sort()
    .reverse()
    .map(([, v]) => v)
    .join("");
  return parseInt(binaryString, 2);
};
// console.log(part1());

const diagramViaMermaid = () => {
  const ZWNJ = "\u200C";
  const getShape = (operator: Operator) => {
    switch (operator) {
      case Operator.AND:
        return `{ shape: delay, label: "${ZWNJ}" }`;
      case Operator.OR:
        return `{ shape: odd, label: "${ZWNJ}" }`;
      case Operator.XOR:
        return `{ shape: lin-rect, label: "${ZWNJ}" }`;
    }
  };

  return `\
flowchart LR

${inputWires.map(([id, value]) => `${id}("${value}")`).join("\n")}

${
    gates
      .toSorted((a, b) => a.operator.localeCompare(b.operator))
      .map(({ left, operator, right, output }) =>
        `\
_${output}@${getShape(operator)}
${left}@{ shape: f-circ } -- ${left} --> _${output}
${right}@{ shape: f-circ } -- ${right} --> _${output}
_${output} --> ${output}
`
      ).join("\n")
  }
`;
};
console.log(diagramViaMermaid());

const part2 = () => {
  const xs = wireMap.keys().filter((id) => id.startsWith("x"));
  const x = parseInt(
    [...xs].sort().reverse().map((id) => getWireValue(id)).join(""),
    2,
  );
  const ys = wireMap.keys().filter((id) => id.startsWith("y"));
  const y = parseInt(
    [...ys].sort().reverse().map((id) => getWireValue(id)).join(""),
    2,
  );
  const xy = x + y;

  const zs = wireMap.keys().filter((id) => id.startsWith("z"));
  const z = parseInt(
    [...zs].sort().reverse().map((id) => getWireValue(id)).join(""),
    2,
  );
  console.log({ xy, z });

  return [
    "z10",
    "gpr",
    "z33",
    "ghp",
    "krs",
    "cpm",
    "nks",
    "z21",
  ].sort().join(",");
};
console.log(part2());
