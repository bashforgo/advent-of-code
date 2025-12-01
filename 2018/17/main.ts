import { maxBy, minBy } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { Direction } from "@utilities/grid/Direction.ts";
import { getAdjacentPoint } from "@utilities/grid/getAdjacentPoint.ts";
import { isInBoundsOfRectangle } from "@utilities/grid/isInBounds.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { Rectangle, rectangle } from "@utilities/grid/Rectangle.ts";
import { ObjectMap } from "@utilities/ObjectMap.ts";
import { range } from "@utilities/range.ts";

const DEBUG = true;
const input = DEBUG
  ? `\
x=495, y=2..7
y=7, x=495..501
x=501, y=3..7
x=498, y=2..4
x=506, y=1..2
x=498, y=10..13
x=504, y=10..13
y=13, x=498..504
`
  : await getInput(2018, 17);

enum Square {
  Clay = "#",
  Flow = "|",
  Water = "~",
}

type Map = ObjectMap<Point, Square>;

const parseInput = (input: string) => {
  const lines = input.trim().split("\n");

  const points = lines
    .values()
    .flatMap(function* (line) {
      const [, x0, x1, xValue] = line.match(/x=(\d+)\.\.(\d+)|x=(\d+)/)!;
      const [, y0, y1, yValue] = line.match(/y=(\d+)\.\.(\d+)|y=(\d+)/)!;

      const xRange = () =>
        xValue == null
          ? range(Number(x0), Number(x1))
          : range(Number(xValue), Number(xValue));
      const yRange = () =>
        yValue == null
          ? range(Number(y0), Number(y1))
          : range(Number(yValue), Number(yValue));

      for (const x of xRange()) {
        for (const y of yRange()) {
          yield point(x, y);
        }
      }
    })
    .toArray();

  const map: Map = ObjectMap.from(points.map((p) => [p, Square.Clay]));

  const xs = points.map((p) => p.x);
  const minX = minBy(xs, (x) => x)!;
  const maxX = maxBy(xs, (x) => x)!;

  const ys = points.map((p) => p.y);
  const minY = minBy(ys, (y) => y)!;
  const maxY = maxBy(ys, (y) => y)!;

  const width = maxX - minX + 1;
  const height = maxY - minY + 2;

  return { map, bounds: rectangle(minX, minY, width, height) };
};

const mapToString = (map: Map, bounds: Rectangle): string => {
  const { x, y, width, height } = bounds;

  return range(y, y + height)
    .map((y) =>
      range(x, x + width)
        .map((x) => map.get(point(x, y)) ?? " ")
        .toArray()
        .join("")
    )
    .toArray()
    .join("\n");
};

const fill = (map: Map, bounds: Rectangle, start: Point) => {
  const isInBounds = isInBoundsOfRectangle.bind(null, bounds);

  const bottom = flowUntilBottom();

  const leftTrap = isTrappedInDirection(bottom, Direction.West);
  const rightTrap = isTrappedInDirection(bottom, Direction.East);

  if (leftTrap != null && rightTrap != null) {
    const steps = stepsUntil(
      map,
      bounds,
      leftTrap,
      Direction.East,
      (square) => square === Square.Clay,
    );
    for (const point of steps) {
      map.set(point, Square.Water);
    }
  }

  function flowUntilBottom() {
    const steps = stepsUntil(
      map,
      bounds,
      start,
      Direction.South,
      (square) => square === Square.Clay || square === Square.Water,
    );
    let point: Point;
    for (point of steps) {
      map.set(point, Square.Flow);
    }
    return point!;
  }

  function isTrappedInDirection(point: Point, direction: Direction) {
    const steps = stepsUntil(
      map,
      bounds,
      point,
      direction,
      () => false,
    );

    return steps.find((p) => map.get(p) === Square.Clay);
  }
};

function* stepsUntil(
  map: Map,
  bounds: Rectangle,
  start: Point,
  direction: Direction,
  until: (square?: Square) => boolean,
) {
  let current = start;
  while (true) {
    const next = getAdjacentPoint(current, direction);
    const square = map.get(next);
    if (!isInBoundsOfRectangle(bounds, next)) return;
    if (until(square)) return;
    yield next;
    current = next;
  }
}

const part1 = () => {
  const { map, bounds } = parseInput(input);
  fill(map, bounds, point(500, 0));
  console.log(mapToString(map, bounds));
};
console.log(part1());

const part2 = () => {
};
console.log(part2());
