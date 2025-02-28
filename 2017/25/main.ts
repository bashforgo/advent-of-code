import { associateBy, sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { identity } from "@utilities/identity.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
Begin in state A.
Perform a diagnostic checksum after 6 steps.

In state A:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state B.
  If the current value is 1:
    - Write the value 0.
    - Move one slot to the left.
    - Continue with state B.

In state B:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the left.
    - Continue with state A.
  If the current value is 1:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state A.
`
  : await getInput(2017, 25);

const [initialInstructions, ...rulesStrings] = input.trim().split("\n\n");
const [, initialState] = initialInstructions.match(/Begin in state (\w)./)!;
const [, stepsString] = initialInstructions.match(/after (\d+) steps./)!;
const steps = Number(stepsString);

interface Rule {
  state: string;
  when0: {
    write: number;
    move: number;
    nextState: string;
  };
  when1: {
    write: number;
    move: number;
    nextState: string;
  };
}

const rules: Rule[] = rulesStrings.map((ruleString) => {
  const [
    state,
    ,
    when0Write,
    when0Move,
    when0NextState,
    ,
    when1Write,
    when1Move,
    when1NextState,
  ] = ruleString.split("\n");
  return {
    state: state.match(/In state (\w):/)![1],
    when0: {
      write: Number(when0Write.match(/Write the value (\d)./)![1]),
      move: when0Move.includes("right") ? 1 : -1,
      nextState: when0NextState.match(/Continue with state (\w)./)![1],
    },
    when1: {
      write: Number(when1Write.match(/Write the value (\d)./)![1]),
      move: when1Move.includes("right") ? 1 : -1,
      nextState: when1NextState.match(/Continue with state (\w)./)![1],
    },
  };
});

const rulesByState = associateBy(rules, (rule) => rule.state);

const part1 = () => {
  const tape = new Map<number, number>();
  let cursor = 0;
  let state = initialState;
  for (const _ of range(1, steps)) {
    const rule = rulesByState[state];
    const current = tape.get(cursor) ?? 0;
    const { write, move, nextState } = current === 0 ? rule.when0 : rule.when1;
    tape.set(cursor, write);
    cursor += move;
    state = nextState;
  }
  return sumOf(tape.values(), identity);
};
console.log(part1());

const part2 = () => {
};
console.log(part2());
