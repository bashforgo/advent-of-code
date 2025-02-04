import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
3,4,3,1,2
`
  : await getInput(2021, 6);

const inputNumbers = input.trim().split(",").map(Number);

const lanternFishesByTimer = Map.groupBy(inputNumbers, (x) => x);

const numberOfLanternFishesByTimer = new Map(
  lanternFishesByTimer.entries().map((
    [counter, lanternFishes],
  ) => [counter, lanternFishes.length]),
);

const step = (fishes: Map<number, number>): Map<number, number> => {
  const nextFishes = new Map<number, number>();

  const timers = Array.from(fishes.keys()).sort((a, b) => b - a);

  for (const timer of timers) {
    const numberOfFishes = fishes.get(timer)!;

    if (timer === 0) {
      nextFishes.set(8, numberOfFishes);
      const sixes = nextFishes.get(6) ?? 0;
      nextFishes.set(6, sixes + numberOfFishes);
    } else {
      nextFishes.set(timer - 1, numberOfFishes);
    }
  }

  return nextFishes;
};

{
  let currentFishes = numberOfLanternFishesByTimer;
  for (let i = 0; i < 80; i++) {
    currentFishes = step(currentFishes);
  }
  console.log(sumOf(currentFishes.values(), (x) => x));
}

{
  let currentFishes = numberOfLanternFishesByTimer;
  for (let i = 0; i < 256; i++) {
    currentFishes = step(currentFishes);
  }
  console.log(sumOf(currentFishes.values(), (x) => x));
}
