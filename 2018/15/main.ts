import { assertEquals, unreachable } from "@std/assert";
import { sumOf } from "@std/collections";
import { ascend } from "@std/data-structures";
import { dijkstras } from "@utilities/dijkstras.ts";
import { getInput } from "@utilities/getInput.ts";
import { comparePoints } from "@utilities/grid/comparePoints.ts";
import { getAdjacentPoints } from "@utilities/grid/getAdjacentPoints.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { gridEntries } from "@utilities/grid/gridEntries.ts";
import { mapGrid } from "@utilities/grid/mapGrid.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { ObjectMap } from "@utilities/ObjectMap.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";
import { range } from "@utilities/range.ts";

const input = await getInput(2018, 15);
const INITIAL_HIT_POINTS = 200;
const DEFAULT_ATTACK_POWER = 3;

enum Tile {
  Wall = "#",
  Open = ".",
}

type Map = Grid<Tile>;

enum UnitType {
  Elf = "E",
  Goblin = "G",
}

interface Unit {
  readonly type: UnitType;
  readonly position: Point;
  readonly hitPoints: number;
  readonly attackPower: number;
}

type Units = ObjectMap<Point, Unit>;

const parseInput = (input: string) => {
  const rawMap = input.trim().split("\n").map((line) => line.split(""));
  const map: Map = mapGrid(
    rawMap,
    (tile) => tile === Tile.Wall ? Tile.Wall : Tile.Open,
  );
  const units: Units = ObjectMap.from(
    gridEntries(rawMap)
      .flatMap(([position, tile]) => {
        switch (tile) {
          case UnitType.Elf:
          case UnitType.Goblin:
            return [{
              type: tile,
              position,
              hitPoints: INITIAL_HIT_POINTS,
              attackPower: DEFAULT_ATTACK_POWER,
            }];
          default:
            return [];
        }
      })
      .map((unit) => [unit.position, unit]),
  );
  return { map, units };
};

const NoTargets = Symbol("NoTargets");
const NoReachableTargets = Symbol("NoReachableTargets");

const move = (
  map: Map,
  units: Units,
  unit: Unit,
): Point | typeof NoTargets | typeof NoReachableTargets => {
  const targets = units.filter((target) => target.type !== unit.type);
  if (targets.size === 0) return NoTargets;

  const inRange = ObjectSet.from(
    targets
      .values()
      .flatMap((target) => getAdjacentPoints(target.position))
      .filter((p) => getPoint(map, p) === Tile.Open),
  );
  if (inRange.has(unit.position)) return unit.position;

  const { distances, previous } = dijkstras(
    unit.position,
    (point) =>
      getAdjacentPoints(point)
        .filter((p) => getPoint(map, p) === Tile.Open)
        .filter((p) => !units.has(p)),
    () => 1,
  );

  const canMove = inRange.values().some((p) => distances.has(p));
  if (!canMove) return NoReachableTargets;

  const [[chosen]] = Array.from(inRange)
    .map((p) => [p, distances.get(p) ?? Infinity] as const)
    .sort(([aPosition, aDistance], [bPosition, bDistance]) => {
      const distanceOrd = ascend(aDistance, bDistance);
      if (distanceOrd !== 0) return distanceOrd;
      return comparePoints(aPosition, bPosition);
    });

  const backwards = dijkstras(
    chosen,
    (point) => previous.get(point)?.values() ?? [],
    () => 1,
  );

  const [[nextPosition]] = getAdjacentPoints(unit.position)
    .flatMap((p) => {
      const distance = backwards.distances.get(p);
      if (distance == null) return [];
      return [[p, distance]] as const;
    })
    .toArray()
    .sort(([aPosition, aDistance], [bPosition, bDistance]) => {
      const distanceOrd = ascend(aDistance, bDistance);
      if (distanceOrd !== 0) return distanceOrd;
      return comparePoints(aPosition, bPosition);
    });

  return nextPosition;
};

{
  const example1 = parseInput(`\
#######
#E..G.#
#...#.#
#.G.#G#
#######
`);
  Deno.test("move(example 1, elf)", () => {
    const result = move(
      example1.map,
      example1.units,
      example1.units.get(point(1, 1))!,
    );
    assertEquals(result, point(2, 1));
  });

  Deno.test("move(example 1, corner goblin)", () => {
    const result = move(
      example1.map,
      example1.units,
      example1.units.get(point(5, 3))!,
    );
    assertEquals(result, NoReachableTargets);
  });

  const example2 = parseInput(`\
#######
#.E...#
#...?.#
#..?G?#
#######
`);
  Deno.test("move(example 2)", () => {
    const result = move(
      example2.map,
      example2.units,
      example2.units.get(point(2, 1))!,
    );
    assertEquals(result, point(3, 1));
  });

  const example3 = parseInput(`\
#########
#G..G..G#
#.......#
#.......#
#G..E..G#
#.......#
#.......#
#G..G..G#
#########
`);
  Deno.test("move(example 3)", () => {
    let { map, units } = example3;

    const moveAll = () => {
      for (const unit of getUnitsInTurnOrder(units)) {
        const nextPosition = move(map, units, unit);
        if (nextPosition === NoTargets || nextPosition === NoReachableTargets) {
          continue;
        }

        const nextUnits = ObjectMap.from(units);
        nextUnits.delete(unit.position);
        nextUnits.set(nextPosition, { ...unit, position: nextPosition });

        units = nextUnits;
      }
    };

    moveAll();
    assertEquals(
      stringifyState(map, units),
      `\
#########
#.G...G.#
#...G...#
#...E..G#
#.G.....#
#.......#
#G..G..G#
#.......#
#########`,
    );

    moveAll();
    assertEquals(
      stringifyState(map, units),
      `\
#########
#..G.G..#
#...G...#
#.G.E.G.#
#.......#
#G..G..G#
#.......#
#.......#
#########`,
    );

    moveAll();
    assertEquals(
      stringifyState(map, units),
      `\
#########
#.......#
#..GGG..#
#..GEG..#
#G..G...#
#......G#
#.......#
#.......#
#########`,
    );
  });
}

const getUnitsInTurnOrder = (units: Units) => {
  return Array.from(units.values()).sort((a, b) =>
    comparePoints(a.position, b.position)
  );
};

const attack = (units: Units, unit: Unit) => {
  const targets = units.filter((target) => target.type !== unit.type);

  const [target] = getAdjacentPoints(unit.position)
    .map((p) => targets.get(p))
    .filter((target) => target != null)
    .toArray()
    .sort((a, b) => {
      const hitPointsOrd = ascend(a.hitPoints, b.hitPoints);
      if (hitPointsOrd !== 0) return hitPointsOrd;
      return comparePoints(a.position, b.position);
    });

  if (target == null) return null;

  return {
    ...target,
    hitPoints: target.hitPoints - unit.attackPower,
  };
};

const round = (map: Map, units: Units) => {
  for (let unit of getUnitsInTurnOrder(units)) {
    const maybeUnit = units.get(unit.position);
    const isDead = maybeUnit == null;
    if (isDead) continue;
    unit = maybeUnit;

    const nextPosition = move(map, units, unit);
    if (nextPosition === NoTargets) return NoTargets;
    if (nextPosition === NoReachableTargets) continue;

    units.delete(unit.position);
    unit = { ...unit, position: nextPosition };
    units.set(nextPosition, unit);

    const attackedUnit = attack(units, unit);
    if (attackedUnit == null) continue;

    if (attackedUnit.hitPoints <= 0) {
      units.delete(attackedUnit.position);
    } else {
      units.set(attackedUnit.position, attackedUnit);
    }
  }
};

function* play(map: Map, units: Units) {
  while (true) {
    const result = round(map, units);
    yield result;
    if (result === NoTargets) return;
  }
}

const playUntilEnd = (map: Map, units: Units) => {
  units = ObjectMap.from(units);
  const gameEntries = play(map, units)
    .map((result, i) => [result, i] as const);
  for (const [result, i] of gameEntries) {
    if (result === NoTargets) return i;
  }
  unreachable();
};

{
  const example1 = parseInput(`\
#######
#.G...#
#...EG#
#.#.#G#
#..G#E#
#.....#
#######
`);
  Deno.test("playUntilEnd(example 1)", () => {
    const result = playUntilEnd(example1.map, example1.units);
    assertEquals(result, 47);
  });

  Deno.test("playUntilEnd(example 1) - 15 power", () => {
    const units = changeElfAttackPower(example1.units, 15);
    const result = playUntilEnd(example1.map, units);
    assertEquals(result, 29);
  });

  const example2 = parseInput(`\
#######
#G..#E#
#E#E.E#
#G.##.#
#...#E#
#...E.#
#######
`);
  Deno.test("playUntilEnd(example 2)", () => {
    const result = playUntilEnd(example2.map, example2.units);
    assertEquals(result, 37);
  });

  const example3 = parseInput(`\
#######
#E..EG#
#.#G.E#
#E.##E#
#G..#.#
#..E#.#
#######
`);
  Deno.test("playUntilEnd(example 3)", () => {
    const result = playUntilEnd(example3.map, example3.units);
    assertEquals(result, 46);
  });

  Deno.test("playUntilEnd(example 3) - 4 power", () => {
    const units = changeElfAttackPower(example3.units, 4);
    const result = playUntilEnd(example3.map, units);
    assertEquals(result, 33);
  });

  const example4 = parseInput(`\
#######
#E.G#.#
#.#G..#
#G.#.G#
#G..#.#
#...E.#
#######
`);
  Deno.test("playUntilEnd(example 4)", () => {
    const result = playUntilEnd(example4.map, example4.units);
    assertEquals(result, 35);
  });

  Deno.test("playUntilEnd(example 4) - 15 power", () => {
    const units = changeElfAttackPower(example4.units, 15);
    const result = playUntilEnd(example4.map, units);
    assertEquals(result, 37);
  });

  const example5 = parseInput(`\
#######
#.E...#
#.#..G#
#.###.#
#E#G#G#
#...#G#
#######
`);
  Deno.test("playUntilEnd(example 5)", () => {
    const result = playUntilEnd(example5.map, example5.units);
    assertEquals(result, 54);
  });

  Deno.test("playUntilEnd(example 5) - 12 power", () => {
    const units = changeElfAttackPower(example5.units, 12);
    const result = playUntilEnd(example5.map, units);
    assertEquals(result, 39);
  });

  const example6 = parseInput(`\
#########
#G......#
#.E.#...#
#..##..G#
#...##..#
#...#...#
#.G...G.#
#.....G.#
#########
`);
  Deno.test("playUntilEnd(example 6)", () => {
    const result = playUntilEnd(example6.map, example6.units);
    assertEquals(result, 20);
  });

  Deno.test("playUntilEnd(example 6) - 34 power", () => {
    const units = changeElfAttackPower(example6.units, 34);
    const result = playUntilEnd(example6.map, units);
    assertEquals(result, 30);
  });
}

const part1 = () => {
  const { map, units } = parseInput(input);
  const numberOfRounds = playUntilEnd(map, units);
  const outcome = numberOfRounds *
    sumOf(units.values(), (unit) => unit.hitPoints);
  return outcome;
};
console.log(part1());

const computeNumberOfElves = (units: Units) => {
  return sumOf(units.values(), (unit) => unit.type === UnitType.Elf ? 1 : 0);
};

const changeElfAttackPower = (units: Units, attackPower: number) => {
  return units.map((unit) => ({
    ...unit,
    attackPower: unit.type === UnitType.Elf ? attackPower : unit.attackPower,
  }));
};

const part2 = () => {
  const { map, units: initialUnits } = parseInput(input);
  const initialNumberOfElves = computeNumberOfElves(initialUnits);

  for (const attackPower of range(DEFAULT_ATTACK_POWER + 1, Infinity)) {
    const units = changeElfAttackPower(initialUnits, attackPower);

    const gameEntries = play(map, units)
      .map((result, i) => [result, i] as const);
    for (const [result, i] of gameEntries) {
      const numberOfElves = computeNumberOfElves(units);
      if (numberOfElves < initialNumberOfElves) break;

      if (result === NoTargets) {
        const outcome = i * sumOf(units.values(), (unit) => unit.hitPoints);
        return outcome;
      }
    }
  }
};
console.log(part2());

const stringifyState = (
  map: Map,
  units: Units,
  annotateRow?: (units: Unit[]) => string,
) => {
  return mapGrid(map, (tile, position) => {
    const unit = units.get(position);
    return unit == null ? tile : unit.type;
  }).map((row, y) => {
    const rowString = row.join("");
    if (annotateRow == null) return rowString;

    const unitsInRow = getUnitsInRow(units, y);
    return `${rowString} ${annotateRow(unitsInRow)}`;
  }).join("\n");
};

const getUnitsInRow = (units: Units, row: number) => {
  return units.filter((unit) => unit.position.y === row).values().toArray()
    .sort((a, b) => comparePoints(a.position, b.position));
};

// deno-lint-ignore no-unused-vars
const annotateRowWithHitPoints = (units: Unit[]) => {
  return units
    .map((unit) => `${unit.type}(${unit.hitPoints})`)
    .join(", ");
};
