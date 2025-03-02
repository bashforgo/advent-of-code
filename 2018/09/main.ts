import { assertEquals } from "@std/assert";
import { maxBy } from "@std/collections";
import { DoublyLinkedList } from "@utilities/DoublyLinkedList.ts";
import { getInput } from "@utilities/getInput.ts";
import { identity } from "@utilities/identity.ts";
import { range } from "@utilities/range.ts";

const input = await getInput(2018, 9);
const [, numberOfPlayers, lastMarbleNumber] = input.match(
  /(\d+) players; last marble is worth (\d+) points/,
)!.map(Number);

const play = (
  numberOfPlayers: number,
  lastMarbleNumber: number,
) => {
  const scoreBoard = range(1, numberOfPlayers)
    .map(() => 0)
    .toArray();
  const marbles = new DoublyLinkedList<number>();
  marbles.push(0);

  let currentPlayer = 0;
  let [currentMarbleNode] = marbles.nodes();
  let nextMarbleNumber = 1;

  function takeTurn() {
    let score: number;

    if (nextMarbleNumber % 23 === 0) {
      const [removedMarbleNode] = marbles
        .counterClockwiseCircle(currentMarbleNode)
        .drop(7);
      [currentMarbleNode] = marbles
        .clockwiseCircle(removedMarbleNode)
        .drop(1);
      marbles.remove(removedMarbleNode);

      score = nextMarbleNumber + removedMarbleNode.value;
    } else {
      const [insertAfterNode] = marbles
        .clockwiseCircle(currentMarbleNode)
        .drop(1);
      currentMarbleNode = marbles.insertAfter(
        nextMarbleNumber,
        insertAfterNode,
      );

      score = 0;
    }

    nextMarbleNumber++;

    scoreBoard[currentPlayer] += score;
    currentPlayer = (currentPlayer + 1) % numberOfPlayers;

    return score;
  }

  do {
    takeTurn();
  } while (nextMarbleNumber <= lastMarbleNumber);

  return scoreBoard;
};

Deno.test("play(9, 25)", () => {
  const scoreBoard = play(9, 25);
  const maxScore = maxBy(scoreBoard, identity);
  assertEquals(maxScore, 32);
});

Deno.test("play(10, 1618)", () => {
  const scoreBoard = play(10, 1618);
  const maxScore = maxBy(scoreBoard, identity);
  assertEquals(maxScore, 8317);
});

Deno.test("play(13, 7999)", () => {
  const scoreBoard = play(13, 7999);
  const maxScore = maxBy(scoreBoard, identity);
  assertEquals(maxScore, 146373);
});

Deno.test("play(17, 1104)", () => {
  const scoreBoard = play(17, 1104);
  const maxScore = maxBy(scoreBoard, identity);
  assertEquals(maxScore, 2764);
});

Deno.test("play(21, 6111)", () => {
  const scoreBoard = play(21, 6111);
  const maxScore = maxBy(scoreBoard, identity);
  assertEquals(maxScore, 54718);
});

Deno.test("play(30, 5807)", () => {
  const scoreBoard = play(30, 5807);
  const maxScore = maxBy(scoreBoard, identity);
  assertEquals(maxScore, 37305);
});

const part1 = () => {
  const scoreBoard = play(numberOfPlayers, lastMarbleNumber);
  return maxBy(scoreBoard, identity);
};
console.log(part1());

const part2 = () => {
  const scoreBoard = play(numberOfPlayers, lastMarbleNumber * 100);
  return maxBy(scoreBoard, identity);
};
console.log(part2());
