import { sumOf } from "@std/collections";
import { mapValues } from "@std/collections/map-values";
import { aStar } from "@utilities/aStar.ts";
import { getInput } from "@utilities/getInput.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";
import { pickN } from "@utilities/pickN.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.
The second floor contains a hydrogen generator.
The third floor contains a lithium generator.
The fourth floor contains nothing relevant.
`
  : await getInput(2016, 11);

const BOTTOM_FLOOR = 0;
const TOP_FLOOR = 3;

const lines = input.trim().split("\n");

type Element = string & { "ElementType": true };
interface State {
  elevator: number;
  generators: Record<Element, number>;
  microchips: Record<Element, number>;
}

const elements = new Set(
  input.matchAll(/(\w+) generator/g).map((match) => match[1] as Element),
);

const initialState = {
  elevator: BOTTOM_FLOOR,
  generators: Object.fromEntries(
    elements.values().map((
      element,
    ) => {
      const floor = lines.findIndex((line) =>
        line.includes(`${element} generator`)
      )!;
      return [element, floor];
    }),
  ),
  microchips: Object.fromEntries(
    elements.values().map((
      element,
    ) => {
      const floor = lines.findIndex((line) =>
        line.includes(`${element}-compatible microchip`)
      )!;
      return [element, floor];
    }),
  ),
} satisfies State;

const getItems = (state: State, floor: number) => {
  const generators = new Set(
    elements.values().filter((element) => state.generators[element] === floor),
  );
  const microchips = new Set(
    elements.values().filter((element) => state.microchips[element] === floor),
  );
  return { generators, microchips };
};

// deno-lint-ignore no-unused-vars
const formatState = (state: State) => {
  return range(BOTTOM_FLOOR, TOP_FLOOR)
    .map((floor) => {
      const elevator = state.elevator === floor ? "E" : ".";
      const { generators, microchips } = getItems(state, floor);
      const items = elements.values()
        .map((element) => {
          const key = element[0].toUpperCase();
          const generator = generators.has(element) ? `${key}G` : ".";
          const microchip = microchips.has(element) ? `${key}M` : ".";
          return `${generator}\t${microchip}`;
        })
        .toArray()
        .join("\t");
      return `F${floor + 1}\t${elevator}\t${items}`;
    })
    .toArray()
    .toReversed()
    .join("\n");
};

function* adjacentFloors(floor: number) {
  if (floor > BOTTOM_FLOOR) yield floor - 1;
  if (floor < TOP_FLOOR) yield floor + 1;
}

function* adjacentStates(state: State): Generator<State> {
  const { elevator, generators, microchips } = state;
  const movableItems = mapValues(
    getItems(state, elevator),
    (is) => Array.from(is),
  );
  for (const adjacentFloor of adjacentFloors(elevator)) {
    for (const generator of movableItems.generators) {
      yield {
        elevator: adjacentFloor,
        generators: { ...generators, [generator]: adjacentFloor },
        microchips: { ...microchips },
      };
    }

    for (const [g1, g2] of pickN(movableItems.generators, 2)) {
      yield {
        elevator: adjacentFloor,
        generators: { ...generators, [g1]: adjacentFloor, [g2]: adjacentFloor },
        microchips: { ...microchips },
      };
    }

    for (const microchip of movableItems.microchips) {
      yield {
        elevator: adjacentFloor,
        generators: { ...generators },
        microchips: { ...microchips, [microchip]: adjacentFloor },
      };
    }

    for (const [m1, m2] of pickN(movableItems.microchips, 2)) {
      yield {
        elevator: adjacentFloor,
        generators: { ...generators },
        microchips: { ...microchips, [m1]: adjacentFloor, [m2]: adjacentFloor },
      };
    }

    for (const generator of movableItems.generators) {
      for (const microchip of movableItems.microchips) {
        yield {
          elevator: adjacentFloor,
          generators: { ...generators, [generator]: adjacentFloor },
          microchips: { ...microchips, [microchip]: adjacentFloor },
        };
      }
    }
  }
}

const isValidState = (state: State) => {
  const generators = new Set(Object.values(state.generators));
  for (const element of elements) {
    const floor = state.microchips[element];
    const isWithGenerator = state.generators[element] === floor;
    const isWithOtherGenerators = generators.has(floor);
    const isFried = !isWithGenerator && isWithOtherGenerators;
    if (isFried) return false;
  }

  return true;
};

const part1 = () => {
  const path = aStar(
    initialState,
    (s) => adjacentStates(s).filter((s) => isValidState(s)),
    () => 1,
    (s) => {
      const allGeneratorsOnTopFloor = Object.values(s.generators)
        .every((f) => f === TOP_FLOOR);
      const allMicrochipsOnTopFloor = Object.values(s.microchips)
        .every((f) => f === TOP_FLOOR);
      return allGeneratorsOnTopFloor && allMicrochipsOnTopFloor;
    },
    (s) =>
      sumOf(Object.values(s.generators), (f) => TOP_FLOOR - f) +
      sumOf(Object.values(s.microchips), (f) => TOP_FLOOR - f),
  );

  return path.length - 1;
};
console.log(part1());

const part2 = () => {
  const elerium = "elerium" as Element;
  const dilithium = "dilithium" as Element;

  elements.add(elerium);
  elements.add(dilithium);

  const seen = new ObjectSet<State>();

  const path = aStar(
    {
      elevator: BOTTOM_FLOOR,
      generators: { ...initialState.generators, [elerium]: 0, [dilithium]: 0 },
      microchips: { ...initialState.microchips, [elerium]: 0, [dilithium]: 0 },
    } satisfies State,
    (s) => {
      seen.add(s);
      return adjacentStates(s)
        .filter((s) => isValidState(s))
        .filter((s) => !seen.has(s));
    },
    () => 1,
    (s) => {
      const allGeneratorsOnTopFloor = Object.values(s.generators)
        .every((f) => f === TOP_FLOOR);
      const allMicrochipsOnTopFloor = Object.values(s.microchips)
        .every((f) => f === TOP_FLOOR);
      return allGeneratorsOnTopFloor && allMicrochipsOnTopFloor;
    },
    (s) =>
      sumOf(Object.values(s.generators), (f) => TOP_FLOOR - f) +
      sumOf(Object.values(s.microchips), (f) => TOP_FLOOR - f),
  );

  return path.length - 1;
};
console.log(part2());
