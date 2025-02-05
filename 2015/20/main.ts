import { assertEquals } from "@std/assert";
import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
150
`
  : await getInput(2015, 20);

const target = Number(input.trim());

function* divisorsOf(n: number) {
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i !== 0) continue;
    yield i;
  }
  for (let i = Math.floor(Math.sqrt(n)); i >= 1; i--) {
    if (n % i !== 0) continue;
    if (i * i === n) continue;
    yield n / i;
  }
}

Deno.test("divisorsOf", () => {
  assertEquals([...divisorsOf(1)], [1]);
  assertEquals([...divisorsOf(2)], [1, 2]);
  assertEquals([...divisorsOf(3)], [1, 3]);
  assertEquals([...divisorsOf(4)], [1, 2, 4]);
});

const part1 = () => {
  for (let house = 1;; house++) {
    const presents = sumOf(divisorsOf(house), (x) => x * 10);
    if (presents >= target) return house;
  }
};
console.log(part1());

const part2 = () => {
  for (let house = 1;; house++) {
    const presents = sumOf(
      divisorsOf(house).filter((x) => house / x <= 50),
      (x) => x * 11,
    );
    if (presents >= target) return house;
  }
};
console.log(part2());
