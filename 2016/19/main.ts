import { unreachable } from "@std/assert";
import { DoublyLinkedList } from "@utilities/DoublyLinkedList.ts";
import { getInput } from "@utilities/getInput.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
5
`
  : await getInput(2016, 19);

const numberOfElves = Number(input.trim());

// deno-lint-ignore no-unused-vars
const generalCaseJosephusSolver = (n: number, k: number): number => {
  if (n === 1) return 0;
  if (1 < n && n < k) return (generalCaseJosephusSolver(n - 1, k) + k) % n;
  if (k <= n) {
    const nDivK = Math.floor(n / k);
    const recursive = generalCaseJosephusSolver(n - nDivK, k);
    const nModK = n % k;

    return recursive < nModK
      ? recursive - nModK + n
      : Math.floor((k * (recursive - nModK)) / (k - 1));
  }
  unreachable();
};

const part1 = () => {
  let i = 1;
  const elves = new Set(range(1, numberOfElves));
  while (elves.size > 1) {
    for (const elf of elves) {
      if (i % 2 === 0) {
        elves.delete(elf);
      }
      i++;
    }
  }

  const [winningElf] = elves;
  return winningElf;
};
console.log(part1());

const part2 = () => {
  const left = new DoublyLinkedList<number>();
  const right = new DoublyLinkedList<number>();

  for (const i of range(1, numberOfElves)) {
    if (i < numberOfElves / 2) {
      left.push(i);
    } else {
      right.push(i);
    }
  }

  let numberOfElvesLeft = numberOfElves;
  while (true) {
    if (left.size > right.size) {
      left.pop();
    } else {
      right.shift();
    }

    numberOfElvesLeft--;
    if (numberOfElvesLeft === 1) break;

    left.push(right.shift()!.value);
    right.push(left.shift()!.value);
  }

  const [winningElf] = [...left, ...right];
  return winningElf;
};
console.log(part2());
