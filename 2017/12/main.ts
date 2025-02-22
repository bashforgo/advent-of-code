import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
0 <-> 2
1 <-> 1
2 <-> 0, 3, 4
3 <-> 2, 4
4 <-> 2, 3, 6
5 <-> 6
6 <-> 4, 5
`
  : await getInput(2017, 12);

const lines = input.trim().split("\n");
const connections = new Map(
  lines.map((line) => {
    const [from, to] = line.split(" <-> ");
    return [Number(from), to.split(", ").map(Number)] as const;
  }),
);

const getGroup = (start: number) => {
  const open = new Set([start]);
  const closed = new Set<number>();

  while (open.size > 0) {
    const [current] = open;
    open.delete(current);
    closed.add(current);

    for (const connection of connections.get(current)!) {
      if (closed.has(connection)) continue;
      open.add(connection);
    }
  }

  return closed;
};

const part1 = () => {
  const group = getGroup(0);
  return group.size;
};
console.log(part1());

const part2 = () => {
  const open = new Set(connections.keys());
  let numberOfGroups = 0;
  while (open.size > 0) {
    const [start] = open;
    const group = getGroup(start);
    for (const member of group) {
      open.delete(member);
    }
    numberOfGroups++;
  }
  return numberOfGroups;
};
console.log(part2());
