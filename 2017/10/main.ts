import { assertEquals } from "@std/assert";
import { chunk } from "@std/collections";
import { encodeHex } from "@std/encoding";
import { getInput } from "@utilities/getInput.ts";
import { identity } from "@utilities/identity.ts";
import { range } from "@utilities/range.ts";
import { repeat } from "@utilities/repeat.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
3,4,1,5
`
  : await getInput(2017, 10);

const knotHashRound = (lengths: Iterable<number>) => {
  const list = range(0, DEBUG ? 4 : 255).toArray();

  let position = 0;
  let skipSize = 0;

  for (const length of lengths) {
    const reversedSection = circularSlice(list, position, length).toReversed();
    circularSplice(list, position, reversedSection);

    position = (position + length + skipSize) % list.length;
    skipSize++;
  }

  return list;
};

const circularSlice = (list: number[], start: number, length: number) => {
  if (start + length <= list.length) return list.slice(start, start + length);

  const endSlice = list.slice(start);
  const startSlice = list.slice(0, length - endSlice.length);
  return [...endSlice, ...startSlice];
};

{
  Deno.test("circularSlice([0, 1, 2, 3, 4], 0, 3) === [0, 1, 2]", () => {
    assertEquals(circularSlice([0, 1, 2, 3, 4], 0, 3), [0, 1, 2]);
  });

  Deno.test("circularSlice([2, 1, 0, 3, 4], 3, 4) === [3, 4, 2, 1]", () => {
    assertEquals(circularSlice([2, 1, 0, 3, 4], 3, 4), [3, 4, 2, 1]);
  });

  Deno.test("circularSlice([4, 3, 0, 1, 2], 1, 5) === [3, 0, 1, 2, 4]", () => {
    assertEquals(circularSlice([4, 3, 0, 1, 2], 1, 5), [3, 0, 1, 2, 4]);
  });
}

const circularSplice = (
  list: number[],
  start: number,
  replacement: number[],
) => {
  const length = replacement.length;

  if (start + length <= list.length) {
    list.splice(start, length, ...replacement);
    return;
  }

  list.splice(
    start,
    list.length - start,
    ...replacement.slice(0, list.length - start),
  );
  list.splice(
    0,
    length - list.length + start,
    ...replacement.slice(list.length - start),
  );
};

{
  Deno.test("circularSplice([0, 1, 2, 3, 4], 0, [2, 1, 0]) === [2, 1, 0, 3, 4]", () => {
    const list = [0, 1, 2, 3, 4];
    circularSplice(list, 0, [2, 1, 0]);
    assertEquals(list, [2, 1, 0, 3, 4]);
  });

  Deno.test("circularSplice([2, 1, 0, 3, 4], 3, [1, 2, 4, 3]) === [4, 3, 0, 1, 2]", () => {
    const list = [2, 1, 0, 3, 4];
    circularSplice(list, 3, [1, 2, 4, 3]);
    assertEquals(list, [4, 3, 0, 1, 2]);
  });

  Deno.test("circularSplice([4, 3, 0, 1, 2], 1, [4, 2, 1, 0, 3]) === [3, 4, 2, 1, 0]", () => {
    const list = [4, 3, 0, 1, 2];
    circularSplice(list, 1, [4, 2, 1, 0, 3]);
    assertEquals(list, [3, 4, 2, 1, 0]);
  });
}

const part1 = () => {
  const lengths = input.split(",").map(Number);
  const [a, b] = knotHashRound(lengths);
  return a * b;
};
console.log(part1());

const knotHash = (input: string) => {
  const bytes = [...new TextEncoder().encode(input)];
  const lengths = [...bytes, 17, 31, 73, 47, 23];
  const sparseHash = knotHashRound(repeat(lengths, 64).flatMap(identity));
  const denseHash = chunk(sparseHash, 16).map((block) =>
    block.reduce((a, b) => a ^ b)
  );
  return encodeHex(new Uint8Array(denseHash));
};

{
  Deno.test('knotHash("") === "a2582a3a0e66e6e86e3812dcb672a272"', () => {
    assertEquals(knotHash(""), "a2582a3a0e66e6e86e3812dcb672a272");
  });

  Deno.test('knotHash("AoC 2017") === "33efeb34ea91902bb2f59c9920caa6cd"', () => {
    assertEquals(knotHash("AoC 2017"), "33efeb34ea91902bb2f59c9920caa6cd");
  });

  Deno.test('knotHash("1,2,3") === "3efbe78a8d82f29979031a4aa0b16a9d"', () => {
    assertEquals(knotHash("1,2,3"), "3efbe78a8d82f29979031a4aa0b16a9d");
  });

  Deno.test('knotHash("1,2,4") === "63960835bcdc130f0b66d7ff4f6a5a8e"', () => {
    assertEquals(knotHash("1,2,4"), "63960835bcdc130f0b66d7ff4f6a5a8e");
  });
}

const part2 = () => {
  return knotHash(input.trim());
};
console.log(part2());
