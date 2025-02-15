import { unreachable } from "@std/assert";
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

const Head = Symbol("Head");
const Tail = Symbol("Tail");
type HeadNode<T> = {
  value: typeof Head;
  prev: null;
  next: ValueNode<T> | TailNode<T>;
};
type ValueNode<T> = {
  value: T;
  prev: HeadNode<T> | ValueNode<T>;
  next: ValueNode<T> | TailNode<T>;
};
type TailNode<T> = {
  value: typeof Tail;
  prev: HeadNode<T> | ValueNode<T>;
  next: null;
};
type Node<T> = HeadNode<T> | ValueNode<T> | TailNode<T>;

class DoublyLinkedList<T> {
  #head: HeadNode<T>;
  #tail: TailNode<T>;
  size = 0;

  constructor() {
    const head = { value: Head, prev: null, next: null! } as HeadNode<T>;
    const tail = { value: Tail, prev: null!, next: null } as TailNode<T>;
    head.next = tail;
    tail.prev = head;
    this.#head = head;
    this.#tail = tail;
  }

  push(value: T) {
    const node = {
      value,
      prev: this.#tail.prev,
      next: this.#tail,
    } satisfies ValueNode<T>;

    this.#tail.prev = node;
    node.prev.next = node;
    this.size++;
  }

  unshift(value: T) {
    const node = {
      value,
      prev: this.#head,
      next: this.#head.next,
    } satisfies ValueNode<T>;

    this.#head.next = node;
    node.next.prev = node;
    this.size++;
  }

  pop() {
    const node = this.#tail.prev;
    if (DoublyLinkedList.#isHeadNode(node)) return null;

    node.prev.next = this.#tail;
    this.#tail.prev = node.prev;

    this.size--;

    return node.value;
  }

  shift() {
    const node = this.#head.next;
    if (DoublyLinkedList.#isTailNode(node)) return null;

    node.next.prev = this.#head;
    this.#head.next = node.next;

    this.size--;

    return node.value;
  }

  head() {
    return this.#head.next.value;
  }

  tail() {
    return this.#tail.prev.value;
  }

  *[Symbol.iterator]() {
    let current = this.#head.next;
    while (!DoublyLinkedList.#isTailNode(current)) {
      yield current.value;
      current = current.next;
    }
  }

  static #isHeadNode = <T>(node: Node<T>): node is HeadNode<T> =>
    node.value === Head;
  static #isTailNode = <T>(node: Node<T>): node is TailNode<T> =>
    node.value === Tail;
}

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

    left.push(right.shift()!);
    right.push(left.shift()!);
  }

  const [winningElf] = [...left, ...right];
  return winningElf;
};
console.log(part2());
