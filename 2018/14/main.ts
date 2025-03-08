import { assertEquals, unreachable } from "@std/assert";
import { zip } from "@std/collections";
import { DoublyLinkedList } from "@utilities/DoublyLinkedList.ts";
import { getInput } from "@utilities/getInput.ts";

const input = await getInput(2018, 14);

function* produceRecipes() {
  const list = new DoublyLinkedList<number>();
  let elf1 = list.push(3);
  let elf2 = list.push(7);

  while (true) {
    const newRecipe = elf1.value + elf2.value;
    if (newRecipe >= 10) {
      list.push(1);
      list.push(newRecipe % 10);
    } else {
      list.push(newRecipe);
    }
    [elf1] = list.clockwiseCircle(elf1)
      .drop(1 + elf1.value)
      .take(1);
    [elf2] = list.clockwiseCircle(elf2)
      .drop(1 + elf2.value)
      .take(1);
    yield list;
  }
}

const scoresOf10RecipesAfterN = (n: number) => {
  const list = produceRecipes()
    .find((list) => list.size >= n + 10)!;
  const walkBackBy = list.size - n - 1;
  const [firstScoringNode] = list.nodesReverse()
    .drop(walkBackBy)
    .take(1);
  return list.nodes(firstScoringNode)
    .take(10)
    .map((node) => node.value)
    .toArray();
};

{
  Deno.test("scoresOf10RecipesAfterN(9)", () => {
    assertEquals(
      scoresOf10RecipesAfterN(9),
      [5, 1, 5, 8, 9, 1, 6, 7, 7, 9],
    );
  });

  Deno.test("scoresOf10RecipesAfterN(5)", () => {
    assertEquals(
      scoresOf10RecipesAfterN(5),
      [0, 1, 2, 4, 5, 1, 5, 8, 9, 1],
    );
  });

  Deno.test("scoresOf10RecipesAfterN(18)", () => {
    assertEquals(
      scoresOf10RecipesAfterN(18),
      [9, 2, 5, 1, 0, 7, 1, 0, 8, 5],
    );
  });

  Deno.test("scoresOf10RecipesAfterN(2018)", () => {
    assertEquals(
      scoresOf10RecipesAfterN(2018),
      [5, 9, 4, 1, 4, 2, 9, 8, 8, 2],
    );
  });
}

const part1 = () => {
  const numberOfRecipes = Number(input.trim());
  return scoresOf10RecipesAfterN(numberOfRecipes).join("");
};
console.log(part1());

const findIndexOfPattern = (pattern: string) => {
  const reversePattern = pattern.split("")
    .reverse()
    .map(Number);

  for (const list of produceRecipes()) {
    const [last, secondToLast] = list.nodesReverse();

    if (last.value === reversePattern[0]) {
      const values = list.valuesReverse(last)
        .take(reversePattern.length)
        .toArray();
      const matches = zip(values, reversePattern)
        .every(([a, b]) => a === b);
      if (matches) {
        return {
          list,
          index: list.size - reversePattern.length,
        };
      }
    } else if (secondToLast.value === reversePattern[0]) {
      const values = list.valuesReverse(secondToLast)
        .take(reversePattern.length)
        .toArray();
      const matches = zip(values, reversePattern)
        .every(([a, b]) => a === b);
      if (matches) {
        return {
          list,
          index: list.size - reversePattern.length - 1,
        };
      }
    }
  }

  unreachable();
};

{
  Deno.test('findIndexOfPattern("51589")', () => {
    const result = findIndexOfPattern("51589");
    assertEquals(result.index, 9);
  });

  Deno.test('findIndexOfPattern("01245")', () => {
    const result = findIndexOfPattern("01245");
    assertEquals(result.index, 5);
  });

  Deno.test('findIndexOfPattern("92510")', () => {
    const result = findIndexOfPattern("92510");
    assertEquals(result.index, 18);
  });

  Deno.test('findIndexOfPattern("59414")', () => {
    const result = findIndexOfPattern("59414");
    assertEquals(result.index, 2018);
  });

  Deno.test('findIndexOfPattern("891")', () => {
    const result = findIndexOfPattern("891");
    assertEquals(result.index, 12);
  });
}

const part2 = () => {
  return findIndexOfPattern(input.trim()).index;
};
console.log(part2());
