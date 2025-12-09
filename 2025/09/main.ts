import { unreachable } from "@std/assert";
import { maxOf, slidingWindows } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { pickN } from "@utilities/pickN.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3
`
  : await getInput(2025, 9);

interface Rectangle {
  readonly a: Point;
  readonly b: Point;
  readonly area: number;
}

type Edge = [Point, Point];

const lines = input.trim().split("\n");

const redTilePoints = lines.map((line) => {
  const [x, y] = line.split(",").map(Number);
  return point(Number(x), Number(y));
});

const rectangles = () =>
  pickN(redTilePoints, 2)
    .map(([a, b]): Rectangle => {
      const area = (Math.abs(b.x - a.x) + 1) * (Math.abs(b.y - a.y) + 1);
      return { a, b, area };
    });

const part1 = () => {
  return maxOf(rectangles(), (area) => area.area)!;
};
console.log(part1());

const doesEdgeIntersectRectangle = (
  [p, q]: Edge,
  a: Point,
  b: Point,
) => {
  const minX = Math.min(a.x, b.x);
  const maxX = Math.max(a.x, b.x);
  const minY = Math.min(a.y, b.y);
  const maxY = Math.max(a.y, b.y);

  if (p.x === q.x) {
    if (p.x <= minX) return false;
    if (p.x >= maxX) return false;
    if (Math.max(p.y, q.y) <= minY) return false;
    if (Math.min(p.y, q.y) >= maxY) return false;
    return true;
  }

  if (p.y === q.y) {
    if (p.y <= minY) return false;
    if (p.y >= maxY) return false;
    if (Math.max(p.x, q.x) <= minX) return false;
    if (Math.min(p.x, q.x) >= maxX) return false;
    return true;
  }

  unreachable();
};

const part2 = () => {
  const edges = slidingWindows(
    (function* () {
      yield* redTilePoints;
      yield redTilePoints[0];
    })(),
    2,
  ) as Edge[];

  return maxOf(
    rectangles()
      .filter(({ a, b }) =>
        edges.every((edge) => !doesEdgeIntersectRectangle(edge, a, b))
      ),
    (area) => area.area,
  )!;
};
console.log(part2());
