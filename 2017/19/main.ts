import { unreachable } from "@std/assert/unreachable";
import { getInput } from "@utilities/getInput.ts";
import {
  Direction,
  getNextDirectionClockwise,
  getNextDirectionCounterClockwise,
} from "@utilities/grid/Direction.ts";
import { getAdjacentPoint } from "@utilities/grid/getAdjacentPoint.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { gridEntries } from "@utilities/grid/gridEntries.ts";

const DEBUG = false;
const input = DEBUG
  ? [
    "     |          ",
    "     |  +--+    ",
    "     A  |  C    ",
    " F---|----E|--+ ",
    "     |  |  |  D ",
    "     +B-+  +--+ ",
  ].join("\n")
  : await getInput(2017, 19);

const lines = input.split("\n").filter(Boolean);

enum TileType {
  Empty = " ",
  Pipe = "#",
}

type Tile =
  | { type: TileType.Empty }
  | { type: TileType.Pipe; waypoint?: string };

const grid: Grid<Tile> = lines.map((line) =>
  line.split("").map((char) => {
    switch (char) {
      case " ":
        return { type: TileType.Empty };
      case "|":
      case "-":
      case "+":
        return { type: TileType.Pipe };
      default:
        return { type: TileType.Pipe, waypoint: char };
    }
  })
);
const emptyTile = () => ({ type: TileType.Empty });

const [startingPoint] =
  gridEntries(grid).find(([_, tile]) => tile.type === TileType.Pipe) ??
    unreachable();

let position = startingPoint;
let direction = Direction.South;
let path = "";
let numberOfSteps = 1;

while (true) {
  const tile = getPoint(grid, position) ?? unreachable();
  path = "waypoint" in tile ? `${path}${tile.waypoint}` : path;

  const nextPositionCandidate = getAdjacentPoint(position, direction);
  const nextTileCandidate = getPoint(grid, nextPositionCandidate) ??
    emptyTile();

  if (nextTileCandidate.type === TileType.Empty) {
    const nextDirection = (() => {
      const leftTurn = getNextDirectionCounterClockwise(direction);
      const leftPosition = getAdjacentPoint(position, leftTurn);
      const leftTile = getPoint(grid, leftPosition) ?? unreachable();
      if (leftTile.type === TileType.Pipe) return leftTurn;

      const rightTurn = getNextDirectionClockwise(direction);
      const rightPosition = getAdjacentPoint(position, rightTurn);
      const rightTile = getPoint(grid, rightPosition) ?? unreachable();
      if (rightTile.type === TileType.Pipe) return rightTurn;

      return null;
    })();
    if (nextDirection === null) break;
    direction = nextDirection;
  }

  position = getAdjacentPoint(position, direction);
  numberOfSteps++;
}

const part1 = () => {
  return path;
};
console.log(part1());

const part2 = () => {
  return numberOfSteps;
};
console.log(part2());
