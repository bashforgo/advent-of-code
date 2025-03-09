import { unreachable } from "@std/assert";
import { getInput } from "@utilities/getInput.ts";
import { comparePoints } from "@utilities/grid/comparePoints.ts";
import {
  Direction,
  getNextDirectionClockwise,
  getNextDirectionCounterClockwise,
  perpendicularDirections,
} from "@utilities/grid/Direction.ts";
import { getAdjacentPoint } from "@utilities/grid/getAdjacentPoint.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { gridEntries } from "@utilities/grid/gridEntries.ts";
import { mapGrid } from "@utilities/grid/mapGrid.ts";
import { Point } from "@utilities/grid/Point.ts";
import { ObjectMap } from "@utilities/ObjectMap.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";

const DEBUG = false;
const input = DEBUG
  ? [
    "┌->-┐        ",
    "|   |  ┌----┐",
    "| ┌-+--+-┐  |",
    "| | |  | v  |",
    "└-+-┘  └-+--┘",
    "  └------┘   ",
    "",
  ].join("\n")
    .replaceAll("└", "\\")
    .replaceAll("┌", "/")
    .replaceAll("┐", "\\")
    .replaceAll("┘", "/")
  : await getInput(2018, 13);

const normalizedInput = input
  .replaceAll(/(?<=[-+<>])\\/g, "┐")
  .replaceAll(/(?<=[-+<>])\//g, "┘")
  .replaceAll(/\\(?=[-+<>])/g, "└")
  .replaceAll(/\/(?=[-+<>])/g, "┌");

const rawMap = normalizedInput
  .split("\n")
  .filter(Boolean)
  .map((line) => line.split(""));

enum Track {
  Vertical = "|",
  Horizontal = "-",
  Intersection = "+",
  CurveNorthEast = "└",
  CurveSouthEast = "┌",
  CurveSouthWest = "┐",
  CurveNorthWest = "┘",
  Nothing = " ",
}

const map = mapGrid(rawMap, (cell) => {
  switch (cell) {
    case Track.Vertical:
    case Track.Horizontal:
    case Track.Intersection:
    case Track.CurveNorthEast:
    case Track.CurveSouthEast:
    case Track.CurveSouthWest:
    case Track.CurveNorthWest:
    case Track.Nothing:
      return cell;
    case "^":
    case "v":
      return Track.Vertical;
    case "<":
    case ">":
      return Track.Horizontal;
    default:
      unreachable();
  }
});

enum Turn {
  Left = "Left",
  Straight = "Straight",
  Right = "Right",
}

const getNextTurn = (currentTurn: Turn): Turn => {
  switch (currentTurn) {
    case Turn.Left:
      return Turn.Straight;
    case Turn.Straight:
      return Turn.Right;
    case Turn.Right:
      return Turn.Left;
  }
};

const DEFAULT_TURN = Turn.Left;

interface Cart {
  position: Point;
  direction: Direction;
  nextTurn: Turn;
}

const initialCarts: Cart[] = gridEntries(rawMap)
  .flatMap(([position, cell]) => {
    switch (cell) {
      case "^":
        return [{
          position,
          direction: Direction.North,
          nextTurn: DEFAULT_TURN,
        }];
      case "v":
        return [{
          position,
          direction: Direction.South,
          nextTurn: DEFAULT_TURN,
        }];
      case "<":
        return [{
          position,
          direction: Direction.West,
          nextTurn: DEFAULT_TURN,
        }];
      case ">":
        return [{
          position,
          direction: Direction.East,
          nextTurn: DEFAULT_TURN,
        }];
      default:
        return [];
    }
  })
  .toArray();

const tickCart = (cart: Cart): Cart => {
  const nextPosition = getAdjacentPoint(cart.position, cart.direction);
  const nextTrack = getPoint(map, nextPosition);
  switch (nextTrack) {
    case Track.Vertical:
    case Track.Horizontal: {
      return {
        position: nextPosition,
        direction: cart.direction,
        nextTurn: cart.nextTurn,
      };
    }
    case Track.CurveNorthEast:
    case Track.CurveSouthEast:
    case Track.CurveSouthWest:
    case Track.CurveNorthWest: {
      const nextDirection = changeDirection(cart.direction, nextTrack);
      return {
        position: nextPosition,
        direction: nextDirection,
        nextTurn: cart.nextTurn,
      };
    }
    case Track.Intersection: {
      const nextDirection = {
        [Turn.Left]: getNextDirectionCounterClockwise(cart.direction),
        [Turn.Straight]: cart.direction,
        [Turn.Right]: getNextDirectionClockwise(cart.direction),
      }[cart.nextTurn];
      const nextTurn = getNextTurn(cart.nextTurn);
      return {
        position: nextPosition,
        direction: nextDirection,
        nextTurn,
      };
    }
    default: {
      return unreachable();
    }
  }
};

const changeDirection = (
  currentDirection: Direction,
  curve:
    | Track.CurveNorthEast
    | Track.CurveSouthEast
    | Track.CurveSouthWest
    | Track.CurveNorthWest,
): Direction => {
  const curveDirections = {
    [Track.CurveNorthEast]: [Direction.North, Direction.East],
    [Track.CurveSouthEast]: [Direction.South, Direction.East],
    [Track.CurveSouthWest]: [Direction.South, Direction.West],
    [Track.CurveNorthWest]: [Direction.North, Direction.West],
  }[curve];
  const nextDirectionCandidates = perpendicularDirections[currentDirection];
  return nextDirectionCandidates.find((direction) =>
    curveDirections.includes(direction)
  ) ?? unreachable();
};

const tick = (carts: Cart[]): [ok: Cart[], collided: Cart[]] => {
  const sortedCarts = carts.toSorted((a, b) =>
    comparePoints(a.position, b.position)
  );

  const occupiedPositions = ObjectMap.groupBy(
    sortedCarts,
    (cart) => cart.position,
  );

  const ok = new ObjectSet<Cart>();
  const collided = new ObjectSet<Cart>();

  for (const cart of sortedCarts) {
    if (collided.has(cart)) continue;

    const nextCart = tickCart(cart);
    const occupiedBy = occupiedPositions.get(nextCart.position);
    if (occupiedBy == null) {
      ok.add(nextCart);
      occupiedPositions.set(nextCart.position, [nextCart]);
    } else {
      for (const other of occupiedBy) {
        collided.add(other);
        ok.delete(other);
      }
      collided.add(nextCart);
      occupiedBy.push(nextCart);
    }
    occupiedPositions.delete(cart.position);
  }

  return [ok.values().toArray(), collided.values().toArray()];
};

// deno-lint-ignore no-unused-vars
const stringifyState = (carts: Cart[]): string => {
  const cartMap = ObjectMap.groupBy(carts, (cart) => cart.position);
  return mapGrid(map, (cell, position) => {
    const [cart, ...rest] = cartMap.get(position) ?? [];
    if (rest.length > 0) return "X";
    switch (cart?.direction) {
      case Direction.North:
        return "^";
      case Direction.South:
        return "v";
      case Direction.West:
        return "<";
      case Direction.East:
        return ">";
      default:
        return cell;
    }
  }).map((line) => line.join("")).join("\n");
};

const part1 = () => {
  let carts = initialCarts;
  while (true) {
    const [nextCarts, collided] = tick(carts);
    if (collided.length > 0) {
      const [{ position }] = collided;
      return `${position.x},${position.y}`;
    }
    carts = nextCarts;
  }
};
console.log(part1());

const part2 = () => {
  let carts = initialCarts;
  while (true) {
    const [nextCarts] = tick(carts);
    if (nextCarts.length === 1) {
      const [{ position }] = nextCarts;
      return `${position.x},${position.y}`;
    }
    carts = nextCarts;
  }
};
console.log(part2());
