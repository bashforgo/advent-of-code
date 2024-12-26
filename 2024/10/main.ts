import { sumOf } from "@std/collections/sum-of";
import { getInput } from "@utilities/getInput.ts";
import { Direction } from "@utilities/grid/Direction.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { getAdjacentPoint } from "@utilities/grid/getAdjacentPoint.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { isInBounds } from "@utilities/grid/isInBounds.ts";

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
  : await getInput(2024, 10);

const lines = input.trim().split("\n");
const map: Grid<number> = lines.map((line) => line.split("").map(Number));
const points = map.flatMap((row, y) => row.map((_, x) => point(x, y)));

function* adjacentPoints(point: Point) {
  const north = getAdjacentPoint(point, Direction.North);
  if (isInBounds(map, north)) yield north;
  const east = getAdjacentPoint(point, Direction.East);
  if (isInBounds(map, east)) yield east;
  const south = getAdjacentPoint(point, Direction.South);
  if (isInBounds(map, south)) yield south;
  const west = getAdjacentPoint(point, Direction.West);
  if (isInBounds(map, west)) yield west;
}

const isTrailhead = (point: Point) => {
  const height = getPoint(map, point);
  return height === 0;
};

const reachablePeaks = (point: Point) => {
  const height = getPoint(map, point)!;

  function* inner(point: Point, nextHeight: number): Generator<Point> {
    for (const adjacent of adjacentPoints(point)) {
      const adjacentHeight = getPoint(map, adjacent);
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
  const height = getPoint(map, point)!;

  if (height === 9) {
    yield [point];
    return;
  }

  for (const adjacent of adjacentPoints(point)) {
    const adjacentHeight = getPoint(map, adjacent);
    if (adjacentHeight !== height + 1) continue;

    for (const trail of trails(adjacent)) {
      yield [...trail, point];
    }
  }
}

console.log(sumOf(trailheads, (p) => Array.from(trails(p)).length));
