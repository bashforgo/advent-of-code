import { sumOf } from "@std/collections";
import { ObjectSet } from "@utilities/ObjectSet.ts";
import { getInput } from "@utilities/getInput.ts";
import {
  Direction,
  directions,
  getNextDirectionClockwise,
  getNextDirectionCounterClockwise,
} from "@utilities/grid/Direction.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { getAdjacentPoint } from "@utilities/grid/getAdjacentPoint.ts";
import {
  getAdjacentPoints,
  getAdjacentPointsInBounds,
} from "@utilities/grid/getAdjacentPoints.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";

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
  : await getInput(2024, 12);

const lines = input.trim().split("\n");
const map: Grid<string> = lines.map((line) => line.split(""));
const points = map.flatMap((row, y) => row.map((_, x) => point(x, y)));

const areas = [] as ObjectSet<Point>[];
const visited = new ObjectSet<Point>();
for (const point of points) {
  if (visited.has(point)) continue;
  const area = new ObjectSet<Point>();

  const visit = (point: Point) => {
    if (visited.has(point)) return;
    visited.add(point);
    area.add(point);

    const plant = getPoint(map, point);
    for (const adjacent of getAdjacentPointsInBounds(map, point)) {
      const adjacentPlant = getPoint(map, adjacent);
      if (plant === adjacentPlant) visit(adjacent);
    }
  };
  visit(point);

  areas.push(area);
}

const calculateArea = (area: ObjectSet<Point>) => area.size;
const calculatePerimeter = (area: ObjectSet<Point>) => {
  return sumOf(area, (point) => {
    return sumOf(getAdjacentPoints(point), (adjacent) => {
      return area.has(adjacent) ? 0 : 1;
    });
  });
};

console.log(
  sumOf(areas, (area) => calculateArea(area) * calculatePerimeter(area)),
);

function* walkDirection(
  start: Point,
  area: ObjectSet<Point>,
  direction: Direction,
) {
  let current = start;
  while (true) {
    const next = getAdjacentPoint(current, direction);
    if (!area.has(next)) break;
    yield next;
    current = next;
  }
}

const isPerimeterPoint = (point: Point, direction: Direction) => {
  const plant = getPoint(map, point);
  const adjacent = getAdjacentPoint(point, direction);
  const adjacentPlant = getPoint(map, adjacent);
  return plant !== adjacentPlant;
};

function* walkSide(
  start: Point,
  area: ObjectSet<Point>,
  perimeterCheckDirection: Direction,
) {
  yield start;

  const clockwiseDirection = getNextDirectionClockwise(
    perimeterCheckDirection,
  );
  const counterClockwiseDirection = getNextDirectionCounterClockwise(
    perimeterCheckDirection,
  );
  for (const point of walkDirection(start, area, clockwiseDirection)) {
    if (!isPerimeterPoint(point, perimeterCheckDirection)) break;
    yield point;
  }
  for (const point of walkDirection(start, area, counterClockwiseDirection)) {
    if (!isPerimeterPoint(point, perimeterCheckDirection)) break;
    yield point;
  }
}

const calculateNumberOfSides = (area: ObjectSet<Point>) => {
  let numberOfSides = 0;
  const seenByDirection = new Map(
    directions.map((direction) => [direction, new ObjectSet<Point>()]),
  );

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
