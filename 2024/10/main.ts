import { sumOf } from "@std/collections/sum-of";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`
  : await getInput(10);

const lines = input.trim().split("\n");
const map = lines.map((line) => line.split("").map(Number));
const points = map.flatMap((row, y) => row.map((_, x) => ({ x, y })));

interface Point {
  readonly x: number;
  readonly y: number;
}

const isInBounds = ({ x, y }: Point) =>
  y >= 0 && y < map.length && x >= 0 && x < map[y].length;
function* adjacentPoints({ x, y }: Point) {
  const north = { x, y: y - 1 };
  if (isInBounds(north)) yield north;
  const east = { x: x + 1, y };
  if (isInBounds(east)) yield east;
  const south = { x, y: y + 1 };
  if (isInBounds(south)) yield south;
  const west = { x: x - 1, y };
  if (isInBounds(west)) yield west;
}
const getHeight = ({ x, y }: Point) => map[y][x];

const isTrailhead = (point: Point) => {
  const height = getHeight(point);
  return height === 0;
};

const reachablePeaks = (point: Point) => {
  const height = getHeight(point);

  function* inner(point: Point, nextHeight: number): Generator<Point> {
    for (const adjacent of adjacentPoints(point)) {
      const adjacentHeight = getHeight(adjacent);
      if (adjacentHeight === 9 && 9 === nextHeight) yield adjacent;
      if (adjacentHeight === nextHeight) yield* inner(adjacent, nextHeight + 1);
    }
  }

  const set = new Set<string>();
  const result: Point[] = [];
  for (const peak of inner(point, height + 1)) {
    const key = `${peak.x},${peak.y}`;
    if (!set.has(key)) {
      set.add(key);
      result.push(peak);
    }
  }

  return result;
};

const trailheads = points.filter(isTrailhead);
console.log(sumOf(trailheads, (p) => reachablePeaks(p).length));

function* trails(point: Point): Generator<Point[]> {
  const height = getHeight(point);

  if (height === 9) {
    yield [point];
    return;
  }

  for (const adjacent of adjacentPoints(point)) {
    const adjacentHeight = getHeight(adjacent);
    if (adjacentHeight !== height + 1) continue;

    for (const trail of trails(adjacent)) {
      yield [...trail, point];
    }
  }
}

console.log(sumOf(trailheads, (p) => Array.from(trails(p)).length));
