import { minBy, slidingWindows, sumOf } from "@std/collections";
import { dijkstras, getPaths } from "@utilities/dijkstras.ts";
import { getInput } from "@utilities/getInput.ts";
import { Direction } from "@utilities/grid/Direction.ts";
import { directionFromAdjacent } from "@utilities/grid/directionFromAdjacent.ts";
import { getAdjacentPointsInBounds } from "@utilities/grid/getAdjacentPoints.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { point } from "@utilities/grid/Point.ts";
import { ObjectMap } from "@utilities/ObjectMap.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
029A
980A
179A
456A
379A
`
  : await getInput(2024, 21);

const codes = input.trim().split("\n");

enum NumberPadKey {
  _0 = "0",
  _1 = "1",
  _2 = "2",
  _3 = "3",
  _4 = "4",
  _5 = "5",
  _6 = "6",
  _7 = "7",
  _8 = "8",
  _9 = "9",
  _A = "A",
}

const numberPad: Grid<NumberPadKey | null> = [
  [NumberPadKey._7, NumberPadKey._8, NumberPadKey._9],
  [NumberPadKey._4, NumberPadKey._5, NumberPadKey._6],
  [NumberPadKey._1, NumberPadKey._2, NumberPadKey._3],
  [null, NumberPadKey._0, NumberPadKey._A],
];

const numberPadKeyToPoint = ObjectMap.from(
  numberPad.flatMap((row, y) =>
    row.flatMap((key, x) =>
      key == null ? [] as const : [[key, point(x, y)]] as const
    )
  ),
);

const numberPadPaths = new ObjectMap<
  [from: NumberPadKey, to: NumberPadKey],
  Direction[][]
>();
for (const from of Object.values(NumberPadKey)) {
  const { previous } = dijkstras(
    numberPadKeyToPoint.get(from)!,
    (current) => {
      return getAdjacentPointsInBounds(numberPad, current)
        .filter((point) => getPoint(numberPad, point) != null);
    },
    () => 1,
  );
  for (const to of Object.values(NumberPadKey)) {
    const result: Direction[][] = [];

    const paths = Array.from(getPaths(numberPadKeyToPoint.get(to)!, previous));
    for (const path of paths) {
      const directions = slidingWindows(path, 2).map(([fromPoint, toPoint]) =>
        directionFromAdjacent(fromPoint, toPoint)!
      );
      result.push(directions);
    }

    numberPadPaths.set([from, to], result);
  }
}

enum DirectionalPadKey {
  "^" = "^",
  "<" = "<",
  ">" = ">",
  "v" = "v",
  "A" = "A",
}

const directionalPad: Grid<DirectionalPadKey | null> = [
  [null, DirectionalPadKey["^"], DirectionalPadKey["A"]],
  [DirectionalPadKey["<"], DirectionalPadKey["v"], DirectionalPadKey[">"]],
];

const directionalPadKeyToPoint = ObjectMap.from(
  directionalPad.flatMap((row, y) =>
    row.flatMap((key, x) =>
      key == null ? [] as const : [[key, point(x, y)]] as const
    )
  ),
);

const directionalPadPaths = new ObjectMap<
  [from: DirectionalPadKey, to: DirectionalPadKey],
  Direction[][]
>();

for (const from of Object.values(DirectionalPadKey)) {
  const { previous } = dijkstras(
    directionalPadKeyToPoint.get(from)!,
    (current) => {
      return getAdjacentPointsInBounds(directionalPad, current)
        .filter((point) => getPoint(directionalPad, point) != null);
    },
    () => 1,
  );
  for (const to of Object.values(DirectionalPadKey)) {
    const result: Direction[][] = [];

    const paths = Array.from(
      getPaths(directionalPadKeyToPoint.get(to)!, previous),
    );
    for (const path of paths) {
      const directions = slidingWindows(path, 2).map(([fromPoint, toPoint]) =>
        directionFromAdjacent(fromPoint, toPoint)!
      );
      result.push(directions);
    }

    directionalPadPaths.set([from, to], result);
  }
}

const directionAsDirectionalPadKey = (
  direction: Direction,
): DirectionalPadKey => {
  switch (direction) {
    case Direction.North:
      return DirectionalPadKey["^"];
    case Direction.East:
      return DirectionalPadKey[">"];
    case Direction.South:
      return DirectionalPadKey["v"];
    case Direction.West:
      return DirectionalPadKey["<"];
  }
};

const getControlSequences = <T>(
  current: T,
  next: T,
  paths: ObjectMap<[from: T, to: T], Direction[][]>,
): DirectionalPadKey[][] => {
  const sequences = paths.get([current, next])!.map((p) =>
    p.map(directionAsDirectionalPadKey)
  );
  for (const sequence of sequences) {
    sequence.push(DirectionalPadKey["A"]);
  }
  return sequences;
};

const cache = new ObjectMap<unknown, number>();
const getControlSequenceLength = <T>(
  start: T,
  target: T[],
  numberOfControllers: number,
  paths: ObjectMap<[from: T, to: T], Direction[][]>,
): number => {
  const key = { start, target, numberOfControllers };
  if (cache.has(key)) return cache.get(key)!;

  let length = 0;

  let current = start;
  for (const next of target) {
    const sequences = getControlSequences(current, next, paths);
    if (numberOfControllers === 0) {
      const shortestSequence = minBy(sequences, (s) => s.length)!;
      length += shortestSequence.length;
    } else {
      const recursive = sequences.map((sequence) => {
        return getControlSequenceLength(
          DirectionalPadKey["A"],
          sequence,
          numberOfControllers - 1,
          directionalPadPaths,
        );
      });
      const shortestSequenceLength = minBy(recursive, (s) => s)!;
      length += shortestSequenceLength;
    }

    current = next;
  }

  cache.set(key, length);
  return length;
};

const part1 = () => {
  return sumOf(codes, (code) => {
    const length = getControlSequenceLength(
      NumberPadKey._A,
      code.split("") as NumberPadKey[],
      2,
      numberPadPaths,
    );
    return Number(code.slice(0, -1)) * length;
  });
};
console.log(part1());

const part2 = () => {
  return sumOf(codes, (code) => {
    const length = getControlSequenceLength(
      NumberPadKey._A,
      code.split("") as NumberPadKey[],
      25,
      numberPadPaths,
    );
    return Number(code.slice(0, -1)) * length;
  });
};
console.log(part2());
