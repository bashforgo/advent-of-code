const Head = Symbol("Head");
const Tail = Symbol("Tail");

export type HeadNode<T> = {
  value: typeof Head;
  prev: null;
  next: ValueNode<T> | TailNode<T>;
};
export type ValueNode<T> = {
  value: T;
  prev: HeadNode<T> | ValueNode<T>;
  next: ValueNode<T> | TailNode<T>;
};
export type TailNode<T> = {
  value: typeof Tail;
  prev: HeadNode<T> | ValueNode<T>;
  next: null;
};
export type Node<T> = HeadNode<T> | ValueNode<T> | TailNode<T>;

export class DoublyLinkedList<T> {
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

  insertBetween(
    value: T,
    prev: HeadNode<T> | ValueNode<T>,
    next: ValueNode<T> | TailNode<T>,
  ) {
    const node: ValueNode<T> = {
      value,
      prev,
      next,
    };

    prev.next = node;
    next.prev = node;
    this.size++;

    return node;
  }

  insertAfter(value: T, node: HeadNode<T> | ValueNode<T>) {
    return this.insertBetween(value, node, node.next);
  }

  insertBefore(value: T, node: ValueNode<T> | TailNode<T>) {
    return this.insertBetween(value, node.prev, node);
  }

  remove(node: ValueNode<T>) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    this.size--;
  }

  push(value: T) {
    return this.insertBefore(value, this.#tail);
  }

  unshift(value: T) {
    return this.insertAfter(value, this.#head);
  }

  pop() {
    const node = this.#tail.prev;
    if (DoublyLinkedList.#isHeadNode(node)) return null;

    this.remove(node);

    return node;
  }

  shift() {
    const node = this.#head.next;
    if (DoublyLinkedList.#isTailNode(node)) return null;

    this.remove(node);

    return node;
  }

  *values(from = this.#head.next) {
    for (const node of this.nodes(from)) {
      yield node.value;
    }
  }

  *valuesReverse(from = this.#tail.prev) {
    for (const node of this.nodesReverse(from)) {
      yield node.value;
    }
  }

  *nodes(from = this.#head.next) {
    let current = from;
    while (!DoublyLinkedList.#isTailNode(current)) {
      yield current;
      current = current.next;
    }
  }

  *nodesReverse(from = this.#tail.prev) {
    let current = from;
    while (!DoublyLinkedList.#isHeadNode(current)) {
      yield current;
      current = current.prev;
    }
  }

  *clockwiseCircle(from = this.#head.next) {
    if (DoublyLinkedList.#isTailNode(this.#head.next)) return;

    let current = from as ValueNode<T>;
    while (true) {
      yield current;
      const { next } = current;
      current = DoublyLinkedList.#isTailNode(next) ? this.#head.next : next;
    }
  }

  *counterClockwiseCircle(from = this.#tail.prev) {
    if (DoublyLinkedList.#isHeadNode(this.#tail.prev)) return;

    let current = from as ValueNode<T>;
    while (true) {
      yield current;
      const { prev } = current;
      current = DoublyLinkedList.#isHeadNode(prev) ? this.#tail.prev : prev;
    }
  }

  *[Symbol.iterator]() {
    yield* this.values();
  }

  static #isHeadNode = <T>(node: Node<T>): node is HeadNode<T> =>
    node.value === Head;
  static #isTailNode = <T>(node: Node<T>): node is TailNode<T> =>
    node.value === Tail;
}
