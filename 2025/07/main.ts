import { memoize } from "@std/cache";
import { ObjectSet } from "@utilities/ObjectSet.ts";
import { getInput } from "@utilities/getInput.ts";
import { Direction } from "@utilities/grid/Direction.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { Point } from "@utilities/grid/Point.ts";
import { getAdjacentPoint } from "@utilities/grid/getAdjacentPoint.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { gridEntries } from "@utilities/grid/gridEntries.ts";
import { isInBounds } from "@utilities/grid/isInBounds.ts";
import { throw_ } from "@utilities/throw.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............
`
  : await getInput(2025, 7);

enum Tile {
  Empty = ".",
  Start = "S",
  Splitter = "^",
}

const grid = input
  .trim()
  .split("\n")
  .map((line) => line.split("")) as Grid<Tile>;

const [start] = gridEntries(grid)
  .find(([, tile]) => tile === Tile.Start) ?? throw_();

const part1 = () => {
  const usedSplitters = new ObjectSet<Point>();
  const open = new ObjectSet<Point>();
  const closed = new ObjectSet<Point>();

  open.add(start);

  while (open.size > 0) {
    const [current] = Iterator.from(open).take(1);

    open.delete(current);
    closed.add(current);

    const tile = getPoint(grid, current) ?? throw_();

    switch (tile) {
      case Tile.Start:
      case Tile.Empty: {
        const next = getAdjacentPoint(current, Direction.South);
        if (!isInBounds(grid, next)) break;
        if (!closed.has(next)) open.add(next);
        break;
      }
      case Tile.Splitter: {
        usedSplitters.add(current);

        const east = getAdjacentPoint(current, Direction.East);
        if (!closed.has(east)) open.add(east);

        const west = getAdjacentPoint(current, Direction.West);
        if (!closed.has(west)) open.add(west);

        break;
      }
    }
  }

  return usedSplitters.size;
};
console.log(part1());

const part2 = () => {
  type Path = Direction[];
  function* _pathsFrom(point: Point, prefix: Path = []): Generator<Path> {
    const tile = getPoint(grid, point) ?? throw_();
    switch (tile) {
      case Tile.Start:
      case Tile.Empty: {
        const next = getAdjacentPoint(point, Direction.South);
        if (isInBounds(grid, next)) {
          yield* _pathsFrom(next, prefix);
        } else {
          yield prefix;
        }

        break;
      }
      case Tile.Splitter: {
        const east = getAdjacentPoint(point, Direction.East);
        yield* _pathsFrom(east, [...prefix, Direction.East]);

        const west = getAdjacentPoint(point, Direction.West);
        yield* _pathsFrom(west, [...prefix, Direction.West]);

        break;
      }
    }
  }

  const numberOfPathsFrom = memoize((point: Point): number => {
    const tile = getPoint(grid, point) ?? throw_();
    switch (tile) {
      case Tile.Start:
      case Tile.Empty: {
        const next = getAdjacentPoint(point, Direction.South);
        if (isInBounds(grid, next)) {
          return numberOfPathsFrom(next);
        } else {
          return 1;
        }
      }
      case Tile.Splitter: {
        const east = getAdjacentPoint(point, Direction.East);
        const west = getAdjacentPoint(point, Direction.West);
        return numberOfPathsFrom(east) + numberOfPathsFrom(west);
      }
    }
  }, { getKey: ({ x, y }) => `${x},${y}` });

  return numberOfPathsFrom(start);
};
console.log(part2());
