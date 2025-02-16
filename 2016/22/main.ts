import { unreachable } from "@std/assert";
import { sumOf } from "@std/collections";
import { aStar } from "@utilities/aStar.ts";
import { getInput } from "@utilities/getInput.ts";
import { findPosition } from "@utilities/grid/findPosition.ts";
import { getAdjacentPointsInBounds } from "@utilities/grid/getAdjacentPoints.ts";
import { getManhattanDistance } from "@utilities/grid/getManhattanDistance.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { isSamePoint } from "@utilities/grid/isSamePoint.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { setPoint } from "@utilities/grid/setPoint.ts";
import { swap } from "@utilities/grid/swap.ts";
import { pickN } from "@utilities/pickN.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
root@ebhq-gridcenter# df -h
Filesystem            Size  Used  Avail  Use%
/dev/grid/node-x0-y0   10T    8T     2T   80%
/dev/grid/node-x0-y1   11T    6T     5T   54%
/dev/grid/node-x0-y2   32T   28T     4T   87%
/dev/grid/node-x1-y0    9T    7T     2T   77%
/dev/grid/node-x1-y1    8T    0T     8T    0%
/dev/grid/node-x1-y2   11T    7T     4T   63%
/dev/grid/node-x2-y0   10T    6T     4T   60%
/dev/grid/node-x2-y1    9T    8T     1T   88%
/dev/grid/node-x2-y2    9T    6T     3T   66%
`
  : await getInput(2016, 22);

const lines = input.trim().split("\n");
const dataLines = lines.slice(2);

interface Node {
  position: Point;
  size: number;
  used: number;
  available: number;
}

const nodes = dataLines.map((line) => {
  const match = line.match(
    /node-x(?<x>\d+)-y(?<y>\d+)\s+(?<size>\d+)T\s+(?<used>\d+)T\s+(?<available>\d+)T/,
  ) ?? unreachable();

  return {
    position: point(Number(match.groups!.x), Number(match.groups!.y)),
    size: Number(match.groups!.size),
    used: Number(match.groups!.used),
    available: Number(match.groups!.available),
  } as Node;
});

const part1 = () => {
  return sumOf(pickN(nodes, 2), ([a, b]) => {
    const [from, to] = a.available > b.available ? [b, a] : [a, b];
    if (from.used === 0) return 0;
    return from.used <= to.available ? 1 : 0;
  });
};
console.log(part1());

const part2 = () => {
  enum NodeType {
    Empty = "_",
    Filled = ".",
    Obstacle = "#",
    Goal = "G",
  }

  const freeNodeSize = nodes.find((node) => node.used === 0)!.size;
  const [width, height] = (() => {
    const lastNode = nodes.at(-1)!;
    return [lastNode.position.x + 1, lastNode.position.y + 1];
  })();
  const initialGoalPosition = point(width - 1, 0);
  const targetGoalPosition = point(0, 0);

  const grid: Grid<NodeType> = range(1, height)
    .map(() => range(1, width).map(() => NodeType.Empty).toArray())
    .toArray();
  for (const node of nodes) {
    const type = (() => {
      if (node.used === 0) return NodeType.Empty;
      if (node.used > freeNodeSize) return NodeType.Obstacle;

      return isSamePoint(node.position, initialGoalPosition)
        ? NodeType.Goal
        : NodeType.Filled;
    })();
    setPoint(grid, node.position, type);
  }

  const path = aStar(
    grid,
    function* (grid) {
      const emptyNodePosition = findPosition(
        grid,
        (n) => n === NodeType.Empty,
      )!;

      for (
        const adjacent of getAdjacentPointsInBounds(grid, emptyNodePosition)
      ) {
        const adjacentNode = getPoint(grid, adjacent);
        if (adjacentNode === NodeType.Obstacle) continue;

        yield swap(grid, emptyNodePosition, adjacent);
      }
    },
    () => 1,
    (grid) => getPoint(grid, targetGoalPosition) === NodeType.Goal,
    (grid) => {
      const currentGoalPosition = findPosition(
        grid,
        (n) => n === NodeType.Goal,
      )!;
      const emptyNodePosition = findPosition(
        grid,
        (n) => n === NodeType.Empty,
      )!;
      const goalDistance = getManhattanDistance(
        targetGoalPosition,
        currentGoalPosition,
      );
      const goalToEmptyDistance = getManhattanDistance(
        currentGoalPosition,
        emptyNodePosition,
      );
      return (5 * goalDistance) + goalToEmptyDistance;
    },
  );

  return path.length - 1;
};
console.log(part2());
