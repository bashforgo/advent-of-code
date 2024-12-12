import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`
  : await getInput(12);

const lines = input.trim().split("\n");
const map = lines.map((line) => line.split(""));
const points = map.flatMap((row, y) => row.map((_, x) => ({ x, y })));

interface Point {
  readonly x: number;
  readonly y: number;
}

const isInBounds = ({ x, y }: Point) =>
  y >= 0 && y < map.length && x >= 0 && x < map[y].length;
function* adjacentPoints({ x, y }: Point, isInBoundsFn = isInBounds) {
  const north = { x, y: y - 1 };
  if (isInBoundsFn(north)) yield north;
  const east = { x: x + 1, y };
  if (isInBoundsFn(east)) yield east;
  const south = { x, y: y + 1 };
  if (isInBoundsFn(south)) yield south;
  const west = { x: x - 1, y };
  if (isInBoundsFn(west)) yield west;
}
const getPlant = ({ x, y }: Point) => map[y]?.[x];

const areas = [] as ObjectSet<Point>[];
const visited = new ObjectSet<Point>();
for (const point of points) {
  if (visited.has(point)) continue;
  const area = new ObjectSet<Point>();

  const visit = (point: Point) => {
    if (visited.has(point)) return;
    visited.add(point);
    area.add(point);

    const plant = getPlant(point);
    for (const adjacent of adjacentPoints(point)) {
      const adjacentPlant = getPlant(adjacent);
      if (plant === adjacentPlant) visit(adjacent);
    }
  };
  visit(point);

  areas.push(area);
}

const calculateArea = (area: ObjectSet<Point>) => area.size;
const calculatePerimeter = (area: ObjectSet<Point>) => {
  return sumOf(area, (point) => {
    return sumOf(adjacentPoints(point, () => true), (adjacent) => {
      return area.has(adjacent) ? 0 : 1;
    });
  });
};

console.log(
  sumOf(areas, (area) => calculateArea(area) * calculatePerimeter(area)),
);

enum Direction {
  North = "North",
  East = "East",
  South = "South",
  West = "West",
}
const directions = [
  Direction.North,
  Direction.East,
  Direction.South,
  Direction.West,
] as const;
const deltaPoints = new Map<Direction, Point>([
  [Direction.North, { x: 0, y: -1 }],
  [Direction.East, { x: 1, y: 0 }],
  [Direction.South, { x: 0, y: 1 }],
  [Direction.West, { x: -1, y: 0 }],
]) as ReadonlyMap<Direction, Point>;
const perpendicularDirections = new Map<Direction, [Direction, Direction]>([
  [Direction.North, [Direction.West, Direction.East]],
  [Direction.East, [Direction.North, Direction.South]],
  [Direction.South, [Direction.West, Direction.East]],
  [Direction.West, [Direction.North, Direction.South]],
]) as ReadonlyMap<Direction, [Direction, Direction]>;

function* walkDirection(
  start: Point,
  area: ObjectSet<Point>,
  direction: Direction,
) {
  let current = start;
  while (true) {
    const delta = deltaPoints.get(direction)!;
    const next = { x: current.x + delta.x, y: current.y + delta.y };
    if (!area.has(next)) break;
    yield next;
    current = next;
  }
}

const isPerimeterPoint = (point: Point, direction: Direction) => {
  const plant = getPlant(point);
  const delta = deltaPoints.get(direction)!;
  const adjacent = { x: point.x + delta.x, y: point.y + delta.y };
  const adjacentPlant = getPlant(adjacent);
  return plant !== adjacentPlant;
};

function* walkSide(
  start: Point,
  area: ObjectSet<Point>,
  perimeterCheckDirection: Direction,
) {
  yield start;

  const [leftDirection, rightDirection] = perpendicularDirections.get(
    perimeterCheckDirection,
  )!;
  for (const point of walkDirection(start, area, leftDirection)) {
    if (!isPerimeterPoint(point, perimeterCheckDirection)) break;
    yield point;
  }
  for (const point of walkDirection(start, area, rightDirection)) {
    if (!isPerimeterPoint(point, perimeterCheckDirection)) break;
    yield point;
  }
}

const calculateNumberOfSides = (area: ObjectSet<Point>) => {
  let numberOfSides = 0;
  const seenByDirection = new Map<Direction, ObjectSet<Point>>(
    directions.map((direction) => [direction, new ObjectSet<Point>()]),
  ) as ReadonlyMap<Direction, ObjectSet<Point>>;

  for (const point of area) {
    for (const direction of directions) {
      const seen = seenByDirection.get(direction)!;
      if (seen.has(point)) continue;
      if (isPerimeterPoint(point, direction)) {
        numberOfSides++;
        for (const sidePoint of walkSide(point, area, direction)) {
          seen.add(sidePoint);
        }
      }
    }
  }

  return numberOfSides;
};

console.log(
  sumOf(areas, (area) => calculateArea(area) * calculateNumberOfSides(area)),
);
