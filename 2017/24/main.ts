import { maxOf, sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
0/2
2/2
2/3
3/4
3/5
0/1
10/1
9/10
`
  : await getInput(2017, 24);

interface Component {
  a: number;
  b: number;
}

const components = input.trim().split("\n").map((line) => {
  const [a, b] = line.split("/").map(Number);
  return { a, b };
});

const componentsByPort = new Map<number, Component[]>();
for (const component of components) {
  const aGroup = componentsByPort.get(component.a) ?? [];
  aGroup.push(component);
  componentsByPort.set(component.a, aGroup);

  const bGroup = componentsByPort.get(component.b) ?? [];
  bGroup.push(component);
  componentsByPort.set(component.b, bGroup);
}

function* bridges(
  currentPort: number = 0,
  availableComponents = ObjectSet.from(components),
): Generator<Component[]> {
  const availableComponentsForPort = componentsByPort.get(currentPort)
    ?.filter((component) => availableComponents.has(component)) ??
    [];
  for (const component of availableComponentsForPort) {
    const nextPort = component.a === currentPort ? component.b : component.a;
    const nextAvailableComponents = availableComponents.without(component);

    let hasMore = false;
    for (const bridge of bridges(nextPort, nextAvailableComponents)) {
      hasMore = true;
      yield [component, ...bridge];
    }

    if (!hasMore) yield [component];
  }
}
const bridgesArray = [...bridges()];

const part1 = () => {
  return maxOf(bridgesArray, (bridge) => sumOf(bridge, ({ a, b }) => a + b));
};
console.log(part1());

const part2 = () => {
  const maxLength = maxOf(bridgesArray, (bridge) => bridge.length);
  return maxOf(
    bridgesArray.filter((bridge) => bridge.length === maxLength),
    (bridge) => sumOf(bridge, ({ a, b }) => a + b),
  );
};
console.log(part2());
