import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { Direction } from "@utilities/grid/Direction.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { addPoints } from "@utilities/grid/addPoints.ts";
import { getDelta } from "@utilities/grid/getDelta.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { isInBounds } from "@utilities/grid/isInBounds.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`
  : await getInput(15);

const [mapString, movesString] = input.trim().split("\n\n");

enum Tile {
  Box = "O",
  Empty = ".",
  Wall = "#",
}

const parseMap = () => {
  const lines = mapString.split("\n");
  const map: Tile[][] = lines.map((line) =>
    line.split("").map((c) => {
      switch (c) {
        case "O":
          return Tile.Box;
        case "#":
          return Tile.Wall;
        default:
          return Tile.Empty;
      }
    })
  );
  const robotY = lines.findIndex((line) => line.includes("@"));
  const robotX = lines[robotY].indexOf("@");
  return { map, robot: point(robotX, robotY) };
};

const { map, robot } = parseMap();

const parseMoves = () => {
  return movesString.split("\n").flatMap((line) => line.split("")).map((c) => {
    switch (c) {
      case "^":
        return Direction.North;
      case ">":
        return Direction.East;
      case "v":
        return Direction.South;
      case "<":
        return Direction.West;
      default:
        throw new Error("Unreachable");
    }
  });
};

const moves = parseMoves();

const step = (map: Tile[][], robot: Point, direction: Direction) => {
  const ahead = Array.from(peek(map, robot, direction));

  const [[firstPoint, firstTile]] = ahead;
  if (firstTile === Tile.Empty) {
    return [map, addPoints(robot, getDelta(direction))] as const;
  }
  if (firstTile === Tile.Wall) {
    return [map, robot] as const;
  }

  const firstBox = firstPoint;
  let empty: Point | null = null;
  for (const [point, tile] of ahead) {
    if (tile === Tile.Box) {
      continue;
    }
    if (tile === Tile.Empty) {
      empty = point;
      break;
    }
    if (tile === Tile.Wall) {
      break;
    }
  }
  if (empty == null) {
    return [map, robot] as const;
  }

  const newMap = map.slice();

  const affectedRows = new Set([firstBox.y, empty.y]);
  for (const y of affectedRows) {
    newMap[y] = newMap[y].slice();
  }

  [
    newMap[firstBox.y][firstBox.x],
    newMap[empty.y][empty.x],
  ] = [
    Tile.Empty,
    Tile.Box,
  ];

  return [newMap, addPoints(robot, getDelta(direction))] as const;
};

function* peek(map: Tile[][], point: Point, direction: Direction) {
  let next = point;

  while (true) {
    next = addPoints(next, getDelta(direction));

    if (isInBounds(map, next)) {
      yield [next, getPoint(map, next)!] as const;
    } else {
      return;
    }
  }
}

const printMap = (map: Tile[][], robot: Point) => {
  const mapWithRobot = map.map((row, y) =>
    row.map((tile, x) => {
      if (x === robot.x && y === robot.y) {
        return "@";
      }
      return tile;
    })
  );
  console.log(mapWithRobot.map((row) => row.join("")).join("\n"));
};

{
  let currentMap = map;
  let currentRobot = robot;

  for (const move of moves) {
    [currentMap, currentRobot] = step(currentMap, currentRobot, move);
  }

  printMap(currentMap, currentRobot);
  console.log(sumOf(
    currentMap.flatMap((row, y) =>
      row.flatMap((tile, x) => tile === Tile.Box ? [point(x, y)] : [])
    ),
    (p) => p.x + 100 * p.y,
  ));
}
