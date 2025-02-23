import { sumOf } from "@std/collections/sum-of";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
Generator A starts with 65
Generator B starts with 8921
`
  : await getInput(2017, 15);

const [configForA, configForB] = input.trim().split("\n");
const initialValueForA = Number(configForA.slice(24));
const initialValueForB = Number(configForB.slice(24));

const getLeastSignificant16Bits = (value: number) => value & 0xffff;

function* zip<T, U>(a: Iterable<T>, b: Iterable<U>) {
  const aIterator = Iterator.from(a);
  const bIterator = Iterator.from(b);
  while (true) {
    const a = aIterator.next();
    const b = bIterator.next();
    if (a.done || b.done) {
      break;
    }
    yield [a.value, b.value] as [T, U];
  }
}

const part1 = () => {
  function* getGenerator(magicValue: number, initialValue: number) {
    let value = initialValue;
    while (true) {
      value = (value * magicValue) % 2147483647;
      yield value;
    }
  }

  const A = getGenerator(16_807, initialValueForA);
  const B = getGenerator(48_271, initialValueForB);

  return sumOf(
    zip(A, B).take(40_000_000),
    ([a, b]) =>
      getLeastSignificant16Bits(a) === getLeastSignificant16Bits(b) ? 1 : 0,
  );
};
console.log(part1());

const part2 = () => {
  function* getGenerator(
    magicValue: number,
    filter: number,
    initialValue: number,
  ) {
    let value = initialValue;
    while (true) {
      value = (value * magicValue) % 2147483647;
      if (value % filter === 0) yield value;
    }
  }

  const A = getGenerator(16_807, 4, initialValueForA);
  const B = getGenerator(48_271, 8, initialValueForB);

  return sumOf(
    zip(A, B).take(5_000_000),
    ([a, b]) =>
      getLeastSignificant16Bits(a) === getLeastSignificant16Bits(b) ? 1 : 0,
  );
};
console.log(part2());
