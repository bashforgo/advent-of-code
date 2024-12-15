import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { addPoints } from "@utilities/grid/addPoints.ts";
import { Direction } from "@utilities/grid/Direction.ts";
import { getAdjacentPoint } from "@utilities/grid/getAdjacentPoint.ts";
import { getDelta } from "@utilities/grid/getDelta.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { isInBounds } from "@utilities/grid/isInBounds.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";

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
  //   ? `\
  // #######
  // #...#.#
  // #.....#
  // #..OO@#
  // #..O..#
  // #.....#
  // #######

  // <vv<<^^<<^^
  // `
  : await getInput(15);

const [mapString, movesString] = input.trim().split("\n\n");

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

{
  enum Tile {
    Box = "O",
    Empty = ".",
    Wall = "#",
  }

  const parseMap = () => {
    const lines = mapString.split("\n");
    const map: Grid<Tile> = lines.map((line) =>
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

  const step = (map: Grid<Tile>, robot: Point, direction: Direction) => {
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

    function* peek(map: Grid<Tile>, point: Point, direction: Direction) {
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
  };

  const printMap = (map: Grid<Tile>, robot: Point) => {
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

{
  enum Tile {
    BoxWest = "[",
    BoxEast = "]",
    Empty = ".",
    Wall = "#",
  }

  const wideMapString = mapString
    .replace(/#/g, "##")
    .replace(/O/g, "[]")
    .replace(/\./g, "..")
    .replace(/@/g, "@.");

  const parseMap = () => {
    const lines = wideMapString.split("\n");
    const map: Grid<Tile> = lines.map((line) =>
      line.split("").map((c) => {
        switch (c) {
          case "[":
            return Tile.BoxWest;
          case "]":
            return Tile.BoxEast;
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

  const step = (map: Grid<Tile>, robot: Point, direction: Direction) => {
    const nextRobot = addPoints(robot, getDelta(direction));
    const nextTile = getPoint(map, nextRobot);

    if (nextTile === Tile.Empty) {
      return [map, nextRobot] as const;
    }
    if (nextTile === Tile.Wall) {
      return [map, robot] as const;
    }

    const affectedPoints = new ObjectSet<Point>();
    const addAffectedPoints = (point: Point): void => {
      const tile = getPoint(map, point)!;
      switch (tile) {
        case Tile.Empty: {
          affectedPoints.add(point);
          break;
        }
        case Tile.Wall: {
          affectedPoints.add(point);
          break;
        }
        case Tile.BoxWest: {
          const boxPoints = [point, getAdjacentPoint(point, Direction.East)];
          const nonBoxPoints = new ObjectSet<Point>();
          for (const boxPoint of boxPoints) {
            const nonBoxPoint = getAdjacentPoint(boxPoint, direction);
            nonBoxPoints.add(nonBoxPoint);
          }
          for (const boxPoint of boxPoints) {
            nonBoxPoints.delete(boxPoint);
          }
          for (const boxPoint of boxPoints) {
            affectedPoints.add(boxPoint);
          }
          for (const nonBoxPoint of nonBoxPoints) {
            addAffectedPoints(nonBoxPoint);
          }
          break;
        }
        case Tile.BoxEast: {
          const boxPoints = [point, getAdjacentPoint(point, Direction.West)];
          const nonBoxPoints = new ObjectSet<Point>();
          for (const boxPoint of boxPoints) {
            const nonBoxPoint = getAdjacentPoint(boxPoint, direction);
            nonBoxPoints.add(nonBoxPoint);
          }
          for (const boxPoint of boxPoints) {
            nonBoxPoints.delete(boxPoint);
          }
          for (const boxPoint of boxPoints) {
            affectedPoints.add(boxPoint);
          }
          for (const nonBoxPoint of nonBoxPoints) {
            addAffectedPoints(nonBoxPoint);
          }
          break;
        }
      }
    };

    addAffectedPoints(nextRobot);
    const affectedPointsArray = Array.from(affectedPoints);

    const canMove = affectedPointsArray.every((point) =>
      getPoint(map, point) !== Tile.Wall
    );

    if (!canMove) {
      return [map, robot] as const;
    }

    const affectedBoxes = affectedPointsArray.filter((point) => {
      const tile = getPoint(map, point)!;
      return tile === Tile.BoxWest || tile === Tile.BoxEast;
    });

    const safeSwappingOrder = {
      [Direction.North]: (a: Point, b: Point) => a.y - b.y, // north to south
      [Direction.East]: (a: Point, b: Point) => b.x - a.x, // east to west
      [Direction.South]: (a: Point, b: Point) => b.y - a.y, // south to north
      [Direction.West]: (a: Point, b: Point) => a.x - b.x, // west to east
    }[direction];
    const affectedBoxesInSafeSwappingOrder = affectedBoxes
      .toSorted((a, b) => safeSwappingOrder(a, b));

    const nextMap = map.map((row) => row.slice());
    for (const point of affectedBoxesInSafeSwappingOrder) {
      const swapWith = getAdjacentPoint(point, direction);
      [
        nextMap[point.y][point.x],
        nextMap[swapWith.y][swapWith.x],
      ] = [
        nextMap[swapWith.y][swapWith.x],
        nextMap[point.y][point.x],
      ];
    }

    return [nextMap, nextRobot] as const;
  };

  const printMap = (map: Grid<Tile>, robot: Point) => {
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

  let currentMap = map;
  let currentRobot = robot;

  for (const move of moves) {
    [currentMap, currentRobot] = step(currentMap, currentRobot, move);
    printMap(currentMap, currentRobot);
  }

  console.log(sumOf(
    currentMap.flatMap((row, y) =>
      row.flatMap((tile, x) => tile === Tile.BoxWest ? [point(x, y)] : [])
    ),
    (p) => p.x + 100 * p.y,
  ));
}
