import { getInput } from "@utilities/getInput.ts";
import { addPoints } from "@utilities/grid/addPoints.ts";
import {
  Direction,
  getNextDirectionClockwise,
  getNextDirectionCounterClockwise,
} from "@utilities/grid/Direction.ts";
import { getAdjacentPoint } from "@utilities/grid/getAdjacentPoint.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { gridEntries } from "@utilities/grid/gridEntries.ts";
import { point } from "@utilities/grid/Point.ts";
import { ObjectMap } from "@utilities/ObjectMap.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
..#
#..
...
`
  : await getInput(2017, 22);

enum Tile1 {
  Clean = 0,
  Infected = 1,
}

const initialGrid: Grid<Tile1> = input.trim()
  .split("\n")
  .map((row) =>
    row.split("").map((cell) => cell === "." ? Tile1.Clean : Tile1.Infected)
  );

const initialWidth = initialGrid[0].length;
const initialHeight = initialGrid.length;

const initialGridOffset = point(
  -1 * Math.floor(initialWidth / 2),
  -1 * Math.floor(initialHeight / 2),
);

const initialPosition = point(0, 0);

const initialDirection = Direction.North;

const part1 = () => {
  const grid = ObjectMap.from(
    gridEntries(initialGrid)
      .filter(([, tile]) => tile === Tile1.Infected)
      .map(([point, tile]) => [addPoints(point, initialGridOffset), tile]),
  );

  let position = initialPosition;
  let direction = initialDirection;

  let numberOfInfections = 0;

  const numberOfBursts = DEBUG ? 70 : 10000;
  for (const _ of range(1, numberOfBursts)) {
    const currentTile = grid.get(position) ?? Tile1.Clean;

    switch (currentTile) {
      case Tile1.Infected: {
        direction = getNextDirectionClockwise(direction);
        grid.delete(position);
        break;
      }
      case Tile1.Clean: {
        direction = getNextDirectionCounterClockwise(direction);
        grid.set(position, Tile1.Infected);
        numberOfInfections++;
        break;
      }
    }

    position = getAdjacentPoint(position, direction);
  }

  return numberOfInfections;
};
console.log(part1());

enum Tile2 {
  Clean = 0,
  Weakened = 1,
  Infected = 2,
  Flagged = 3,
}

const part2 = () => {
  const grid = ObjectMap.from(
    gridEntries(initialGrid)
      .filter(([, tile]) => tile === Tile1.Infected)
      .map(([point]) => [addPoints(point, initialGridOffset), Tile2.Infected]),
  );

  let position = initialPosition;
  let direction = initialDirection;

  let numberOfInfections = 0;

  const numberOfBursts = 10_000_000;
  for (const _ of range(1, numberOfBursts)) {
    const currentTile = grid.get(position) ?? Tile2.Clean;

    switch (currentTile) {
      case Tile2.Clean: {
        direction = getNextDirectionCounterClockwise(direction);
        grid.set(position, Tile2.Weakened);
        break;
      }
      case Tile2.Weakened: {
        grid.set(position, Tile2.Infected);
        numberOfInfections++;
        break;
      }
      case Tile2.Infected: {
        direction = getNextDirectionClockwise(direction);
        grid.set(position, Tile2.Flagged);
        break;
      }
      case Tile2.Flagged: {
        direction = getNextDirectionClockwise(direction);
        direction = getNextDirectionClockwise(direction);
        grid.delete(position);
        break;
      }
    }

    position = getAdjacentPoint(position, direction);
  }

  return numberOfInfections;
};
console.log(part2());
