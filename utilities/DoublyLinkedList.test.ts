import { expect } from "@std/expect";
import { beforeEach, describe, test } from "@std/testing/bdd";
import {
  DoublyLinkedList,
  HeadNode,
  TailNode,
  ValueNode,
} from "@utilities/DoublyLinkedList.ts";

describe("DoublyLinkedList", () => {
  let list: DoublyLinkedList<number>;
  let head: HeadNode<number>;
  let first: ValueNode<number>;
  let middle: ValueNode<number>;
  let last: ValueNode<number>;
  let tail: TailNode<number>;

  beforeEach(() => {
    list = new DoublyLinkedList<number>();
    first = list.push(1);
    head = first.prev as HeadNode<number>;
    tail = first.next as TailNode<number>;
    middle = list.push(2);
    last = list.push(3);
  });

  describe("insertBetween", () => {
    test("should insert a node between head and first node", () => {
      list.insertBetween(0, head, first);
      expect([...list]).toEqual([0, 1, 2, 3]);
      expect(list.size).toBe(4);
    });

    test("should insert a node between first and middle node", () => {
      list.insertBetween(1.5, first, middle);
      expect([...list]).toEqual([1, 1.5, 2, 3]);
      expect(list.size).toBe(4);
    });

    test("should insert a node between last and tail node", () => {
      list.insertBetween(4, last, tail);
      expect([...list]).toEqual([1, 2, 3, 4]);
      expect(list.size).toBe(4);
    });
  });

  describe("insertAfter", () => {
    test("should insert a node after head", () => {
      list.insertAfter(0, head);
      expect([...list]).toEqual([0, 1, 2, 3]);
      expect(list.size).toBe(4);
    });

    test("should insert a node after first node", () => {
      list.insertAfter(1.5, first);
      expect([...list]).toEqual([1, 1.5, 2, 3]);
      expect(list.size).toBe(4);
    });

    test("should insert a node after last node", () => {
      list.insertAfter(4, last);
      expect([...list]).toEqual([1, 2, 3, 4]);
      expect(list.size).toBe(4);
    });
  });

  describe("insertBefore", () => {
    test("should insert a node before first node", () => {
      list.insertBefore(0, first);
      expect([...list]).toEqual([0, 1, 2, 3]);
      expect(list.size).toBe(4);
    });

    test("should insert a node before middle node", () => {
      list.insertBefore(1.5, middle);
      expect([...list]).toEqual([1, 1.5, 2, 3]);
      expect(list.size).toBe(4);
    });

    test("should insert a node before tail", () => {
      list.insertBefore(4, tail);
      expect([...list]).toEqual([1, 2, 3, 4]);
      expect(list.size).toBe(4);
    });
  });

  describe("remove", () => {
    test("should remove the first node", () => {
      list.remove(first);
      expect([...list]).toEqual([2, 3]);
      expect(list.size).toBe(2);
    });

    test("should remove the middle node", () => {
      list.remove(middle);
      expect([...list]).toEqual([1, 3]);
      expect(list.size).toBe(2);
    });

    test("should remove the last node", () => {
      list.remove(last);
      expect([...list]).toEqual([1, 2]);
      expect(list.size).toBe(2);
    });
  });

  describe("push", () => {
    test("should add a node to the end of the list", () => {
      list.push(4);
      expect([...list]).toEqual([1, 2, 3, 4]);
      expect(list.size).toBe(4);
    });
  });

  describe("unshift", () => {
    test("should add a node to the beginning of the list", () => {
      list.unshift(0);
      expect([...list]).toEqual([0, 1, 2, 3]);
      expect(list.size).toBe(4);
    });
  });

  describe("pop", () => {
    test("should remove the last node from the list", () => {
      const node = list.pop();
      expect([...list]).toEqual([1, 2]);
      expect(node?.value).toBe(3);
      expect(list.size).toBe(2);
    });
  });

  describe("shift", () => {
    test("should remove the first node from the list", () => {
      const node = list.shift();
      expect([...list]).toEqual([2, 3]);
      expect(node?.value).toBe(1);
      expect(list.size).toBe(2);
    });
  });

  describe("nodes", () => {
    test("should iterate over all nodes in the list", () => {
      const values = [...list.nodes()].map((node) => node.value);

      expect(values).toEqual([1, 2, 3]);
    });
  });

  describe("nodesReverse", () => {
    test("should iterate over all nodes in the list in reverse order", () => {
      const values = [...list.nodesReverse()].map((node) => node.value);

      expect(values).toEqual([3, 2, 1]);
    });
  });

  describe("clockwiseCircle", () => {
    test("should iterate over all nodes in the list in a circular manner", () => {
      const values = list.clockwiseCircle()
        .take(4)
        .map((node) => node.value)
        .toArray();
      expect(values).toEqual([1, 2, 3, 1]);
    });
  });

  describe("counterClockwiseCircle", () => {
    test("should iterate over all nodes in the list in a circular manner in reverse order", () => {
      const values = list.counterClockwiseCircle()
        .take(4)
        .map((node) => node.value)
        .toArray();
      expect(values).toEqual([3, 2, 1, 3]);
    });
  });
});
