import { assertEquals } from "@std/assert";
import { knotHash } from "@utilities/2017/knotHash/knotHash.ts";

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
