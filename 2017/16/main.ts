import { unreachable } from "@std/assert";
import { getInput } from "@utilities/getInput.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
s1,x3/4,pe/b
`
  : await getInput(2017, 16);

const initialPrograms = DEBUG
  ? "abcde".split("")
  : "abcdefghijklmnop".split("");

enum MoveType {
  Spin = "s",
  Exchange = "x",
  Partner = "p",
}

type Move =
  | { type: MoveType.Spin; x: number }
  | { type: MoveType.Exchange; a: number; b: number }
  | { type: MoveType.Partner; a: string; b: string };

const moves: Move[] = input.split(",").map((move) => {
  const match = move.match(/(?<type>s)(?<x>\d+)/) ??
    move.match(/(?<type>x)(?<a>\d+)\/(?<b>\d+)/) ??
    move.match(/(?<type>p)(?<a>\w+)\/(?<b>\w+)/) ??
    unreachable();

  switch (match.groups?.type) {
    case MoveType.Spin:
      return { type: MoveType.Spin, x: Number(match.groups.x) };
    case MoveType.Exchange:
      return {
        type: MoveType.Exchange,
        a: Number(match.groups.a),
        b: Number(match.groups.b),
      };
    case MoveType.Partner:
      return { type: MoveType.Partner, a: match.groups.a, b: match.groups.b };
  }
  unreachable();
});

const applyMove = (programs: string[], move: Move): void => {
  switch (move.type) {
    case MoveType.Spin: {
      programs.unshift(...programs.splice(-move.x));
      break;
    }
    case MoveType.Exchange: {
      [programs[move.a], programs[move.b]] = [
        programs[move.b],
        programs[move.a],
      ];
      break;
    }
    case MoveType.Partner: {
      const a = programs.indexOf(move.a);
      const b = programs.indexOf(move.b);
      [programs[a], programs[b]] = [programs[b], programs[a]];
      break;
    }
  }
};

const part1 = () => {
  const programs = [...initialPrograms];
  for (const move of moves) {
    applyMove(programs, move);
  }
  return programs.join("");
};
console.log(part1());

const computeCycleSize = (programs: string[]): number => {
  const seen = ObjectSet.from([programs]);
  while (true) {
    for (const move of moves) {
      applyMove(programs, move);
    }
    if (seen.has(programs)) return seen.size;
    seen.add(programs);
  }
};

const part2 = () => {
  const programs = [...initialPrograms];
  const cycleSize = computeCycleSize(programs);
  const remaining = 1_000_000_000 % cycleSize;
  for (const _ of range(1, remaining)) {
    for (const move of moves) {
      applyMove(programs, move);
    }
  }
  return programs.join("");
};
console.log(part2());
