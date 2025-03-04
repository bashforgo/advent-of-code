import { unreachable } from "@std/assert";
import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
initial state: #..#.#..##......###...###

...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #
`
  : await getInput(2018, 12);

const [, initialState] = input.match(/initial state: (.*)/) ?? unreachable();

const rules = new Map(
  input
    .matchAll(/([.#]{5}) => ([.#])/g)
    .map(([, pattern, result]) => [pattern, result]),
);

interface Generation {
  offset: number;
  state: string;
}

const computeNextGeneration = (previous: Generation): Generation => {
  let prefix = "";
  for (const index of range(-3, -1)) {
    const startIndex = index - 2;
    const endIndex = index + 3;
    const slice = previous.state
      .slice(startIndex < 0 ? 0 : startIndex, endIndex)
      .padStart(5, ".");
    prefix = `${prefix}${rules.get(slice) ?? "."}`;
  }
  prefix = prefix.replace(/^\.+/, "");

  let state = "";
  for (const index of range(0, previous.state.length + 2)) {
    const startIndex = index - 2;
    const endIndex = index + 3;
    const slice = previous.state
      .slice(startIndex < 0 ? 0 : startIndex, endIndex)
      .padStart(startIndex < 0 ? 5 : 0, ".")
      .padEnd(5, ".");
    state = `${state}${rules.get(slice) ?? "."}`;
  }
  state = state.replace(/\.+$/, "");

  const nextState = `${prefix}${state}`;
  const padding = nextState.match(/^\.+/);

  if (padding == null) {
    return {
      offset: previous.offset - prefix.length,
      state: nextState,
    };
  } else {
    const paddingLength = padding[0].length;
    return {
      offset: previous.offset - prefix.length + paddingLength,
      state: nextState.slice(paddingLength),
    };
  }
};

const part1 = () => {
  let generation: Generation = {
    offset: 0,
    state: initialState,
  };
  for (const _ of range(1, 20)) {
    generation = computeNextGeneration(generation);
  }
  return sumOf(
    [...generation.state].entries(),
    ([i, char]) => (char === "#" ? i + generation.offset : 0),
  );
};
console.log(part1());

const computeLoopSize = (previous: Generation) => {
  interface Seen {
    i: number;
    generation: Generation;
  }
  const seen = new Map<string, Seen>();
  let generation = previous;

  for (const i of range(1, Infinity)) {
    generation = computeNextGeneration(generation);

    const maybeSeen = seen.get(generation.state);
    if (maybeSeen == null) {
      seen.set(generation.state, { i, generation });
    } else {
      const loopStartsAt = maybeSeen.i;
      const loopSize = i - loopStartsAt;
      const loopOffsetChange = generation.offset - maybeSeen.generation.offset;
      return {
        loopStartsAt,
        loopSize,
        loopOffsetChange,
        generationAfterOneLoop: generation,
      };
    }
  }

  unreachable();
};

const part2 = () => {
  const TARGET_GENERATION = 50_000_000_000;

  let {
    loopStartsAt,
    loopSize,
    loopOffsetChange,
    generationAfterOneLoop: generation,
  } = computeLoopSize({
    offset: 0,
    state: initialState,
  });

  const remainingGenerations = TARGET_GENERATION - loopStartsAt;

  const remainingLoops = Math.floor(remainingGenerations / loopSize) - 1;
  generation.offset += loopOffsetChange * remainingLoops;

  const remainder = remainingGenerations % loopSize;
  for (const _ of range(1, remainder)) {
    generation = computeNextGeneration(generation);
  }

  return sumOf(
    [...generation.state].entries(),
    ([i, char]) => (char === "#" ? i + generation.offset : 0),
  );
};
console.log(part2());
