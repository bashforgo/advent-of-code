import { maxOf, minBy, minOf, sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { getAdjacentPoints } from "@utilities/grid/getAdjacentPoints.ts";
import { getManhattanDistance } from "@utilities/grid/getManhattanDistance.ts";
import { isInBoundsOfRectangle } from "@utilities/grid/isInBounds.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { Rectangle, rectangle } from "@utilities/grid/Rectangle.ts";
import { identity } from "@utilities/identity.ts";
import { ObjectMap } from "@utilities/ObjectMap.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
1, 1
1, 6
8, 3
3, 4
5, 5
8, 9
`
  : await getInput(2018, 6);

const points = ObjectSet.from(
  input
    .trim()
    .split("\n")
    .map((line): Point => {
      const [x, y] = line.split(", ").map(Number);
      return { x, y };
    }),
);

const minX = minOf(points, (p) => p.x)! - 1;
const minY = minOf(points, (p) => p.y)! - 1;
const maxX = maxOf(points, (p) => p.x)! + 1;
const maxY = maxOf(points, (p) => p.y)! + 1;
const width = maxX - minX + 1;
const height = maxY - minY + 1;

const getClosestPoints = (from: Point) => {
  const pointsByDistance = Map.groupBy(
    points,
    (to) => getManhattanDistance(from, to),
  );
  const minDistance = minBy(pointsByDistance.keys(), identity)!;
  return pointsByDistance.get(minDistance)!;
};

const floodFill = (
  bounds: Rectangle,
  from: Point,
  predicate?: (point: Point) => boolean,
): ObjectSet<Point> => {
  const filled = new ObjectSet<Point>();

  const stack = [from];
  while (stack.length > 0) {
    const point = stack.pop()!;

    const shouldFill = predicate?.(point) ?? true;
    if (!shouldFill) continue;

    if (filled.has(point)) continue;

    filled.add(point);

    stack.push(
      ...getAdjacentPoints(point)
        .filter((p) => isInBoundsOfRectangle(bounds, p)),
    );
  }

  return filled;
};

const isPerimeter = (point: Point) =>
  point.x === minX || point.x === maxX || point.y === minY || point.y === maxY;

const part1 = () => {
  const bounds = rectangle(minX, minY, width, height);

  const floodFillPredicate = (from: Point) => (to: Point) => {
    const closest = getClosestPoints(to);
    if (closest.length !== 1) return false;

    const [closestPoint] = closest;
    return closestPoint === from;
  };
  const floodFillFrom = (from: Point) =>
    floodFill(bounds, from, floodFillPredicate(from));

  const areas = ObjectMap.from(
    points
      .values()
      .map((from) => [from, floodFillFrom(from)] as const)
      .filter(([, area]) => !area.values().some((p) => isPerimeter(p))),
  );

  return maxOf(areas.values(), (area) => area.size);
};
console.log(part1());

const part2 = () => {
  const maxDistance = DEBUG ? 32 : 10000;

  const bounds = rectangle(minX, minY, width, height);

  const floodFillPredicate = (to: Point) => {
    const distance = sumOf(points, (from) => getManhattanDistance(from, to));
    return distance < maxDistance;
  };

  const floodFillFrom = (from: Point) =>
    floodFill(bounds, from, floodFillPredicate);

  const center = point(
    Math.round((minX + maxX) / 2),
    Math.round((minY + maxY) / 2),
  );

  const area = floodFillFrom(center);

  return area.size;
};
console.log(part2());
