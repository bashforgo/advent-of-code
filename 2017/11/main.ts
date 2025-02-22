import { assertEquals } from "@std/assert";
import { maxOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";

const input = await getInput(2017, 11);

enum Direction {
  North = "n",
  NorthEast = "ne",
  SouthEast = "se",
  South = "s",
  SouthWest = "sw",
  NorthWest = "nw",
}

const path = input.trim().split(",") as Direction[];

// https://www.redblobgames.com/grids/hexagons/

interface Cube {
  readonly q: number;
  readonly r: number;
  readonly s: number;
}
const cube = (q: number, r: number, s: number): Cube => ({ q, r, s });
const add = (a: Cube, b: Cube) => cube(a.q + b.q, a.r + b.r, a.s + b.s);
const subtract = (a: Cube, b: Cube) => cube(a.q - b.q, a.r - b.r, a.s - b.s);

const getDelta = (direction: Direction) => {
  switch (direction) {
    case Direction.North:
      return cube(0, -1, 1);
    case Direction.NorthEast:
      return cube(1, -1, 0);
    case Direction.SouthEast:
      return cube(1, 0, -1);
    case Direction.South:
      return cube(0, 1, -1);
    case Direction.SouthWest:
      return cube(-1, 1, 0);
    case Direction.NorthWest:
      return cube(-1, 0, 1);
  }
};
const move = (p: Cube, direction: Direction) => add(p, getDelta(direction));

const distance = (a: Cube, b: Cube) => {
  const vector = subtract(a, b);
  return (Math.abs(vector.q) + Math.abs(vector.r) + Math.abs(vector.s)) / 2;
};

function* positions(path: Direction[]) {
  let position = START_POSITION;
  yield position;

  for (const direction of path) {
    position = move(position, direction);
    yield position;
  }
}

const computeDistance = (path: Direction[]) => {
  const position = positions(path).reduce((_, p) => p);
  return distance(START_POSITION, position);
};

{
  Deno.test('computeDistance("ne,ne,ne") === 3', () => {
    assertEquals(
      computeDistance([
        Direction.NorthEast,
        Direction.NorthEast,
        Direction.NorthEast,
      ]),
      3,
    );
  });

  Deno.test('computeDistance("ne,ne,sw,sw") === 0', () => {
    assertEquals(
      computeDistance([
        Direction.NorthEast,
        Direction.NorthEast,
        Direction.SouthWest,
        Direction.SouthWest,
      ]),
      0,
    );
  });

  Deno.test('computeDistance("ne,ne,s,s") === 2', () => {
    assertEquals(
      computeDistance([
        Direction.NorthEast,
        Direction.NorthEast,
        Direction.South,
        Direction.South,
      ]),
      2,
    );
  });

  Deno.test('computeDistance("se,sw,se,sw,sw") === 3', () => {
    assertEquals(
      computeDistance([
        Direction.SouthEast,
        Direction.SouthWest,
        Direction.SouthEast,
        Direction.SouthWest,
        Direction.SouthWest,
      ]),
      3,
    );
  });
}

const START_POSITION = cube(0, 0, 0);

const part1 = () => {
  return computeDistance(path);
};
console.log(part1());

const part2 = () => {
  return maxOf(positions(path), (p) => distance(START_POSITION, p));
};
console.log(part2());
