import { ObjectSet } from "@utilities/ObjectSet.ts";
import { getInput } from "@utilities/getInput.ts";
import { Direction } from "@utilities/grid/Direction.ts";
import { point } from "@utilities/grid/Point.ts";
import { getAdjacentPoint } from "@utilities/grid/getAdjacentPoint.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
^v^v^v^v^v
`
  : await getInput(2015, 3);
const directions = input.trim().split("").map((char) => {
  switch (char) {
    case "^":
      return Direction.North;
    case ">":
      return Direction.East;
    case "v":
      return Direction.South;
    case "<":
      return Direction.West;
  }
  throw new Error();
});

const part1 = () => {
  let current = point(0, 0);
  const visited = ObjectSet.from([current]);

  for (const direction of directions) {
    current = getAdjacentPoint(current, direction);
    visited.add(current);
  }

  return visited.size;
};
console.log(part1());

const part2 = () => {
  const current = [
    point(0, 0),
    point(0, 0),
  ];
  const visited = ObjectSet.from(current);

  for (let i = 0; i < directions.length; i++) {
    current[i % 2] = getAdjacentPoint(current[i % 2], directions[i]);
    visited.add(current[i % 2]);
  }

  return visited.size;
};
console.log(part2());
