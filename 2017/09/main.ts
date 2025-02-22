import { assertEquals } from "@std/assert";
import { getInput } from "@utilities/getInput.ts";

const input = await getInput(2017, 9);

const stream = input.trim();

const computeScore = (stream: string) => {
  let score = 0;
  let depth = 0;
  let garbage = false;
  let canceled = false;

  for (const char of stream) {
    switch (true) {
      case canceled:
        canceled = false;
        break;
      case char === "!":
        canceled = true;
        break;
      case garbage:
        garbage = char !== ">";
        break;
      case char === "<":
        garbage = true;
        break;
      case char === "{":
        depth++;
        break;
      case char === "}":
        score += depth;
        depth--;
        break;
    }
  }

  return score;
};

Deno.test("{}", () => {
  assertEquals(computeScore("{}"), 1);
});

Deno.test("{{{}}}", () => {
  assertEquals(computeScore("{{{}}}"), 6);
});

Deno.test("{{},{}}", () => {
  assertEquals(computeScore("{{},{}}"), 5);
});

Deno.test("{{{},{},{{}}}}", () => {
  assertEquals(computeScore("{{{},{},{{}}}}"), 16);
});

Deno.test("{<a>,<a>,<a>,<a>}", () => {
  assertEquals(computeScore("{<a>,<a>,<a>,<a>}"), 1);
});

Deno.test("{{<ab>},{<ab>},{<ab>},{<ab>}}", () => {
  assertEquals(computeScore("{{<ab>},{<ab>},{<ab>},{<ab>}}"), 9);
});

Deno.test("{{<!!>},{<!!>},{<!!>},{<!!>}}", () => {
  assertEquals(computeScore("{{<!!>},{<!!>},{<!!>},{<!!>}}"), 9);
});

Deno.test("{{<a!>},{<a!>},{<a!>},{<ab>}}", () => {
  assertEquals(computeScore("{{<a!>},{<a!>},{<a!>},{<ab>}}"), 3);
});

const part1 = () => {
  return computeScore(stream);
};
console.log(part1());

const computeAmountOfGarbage = (stream: string) => {
  let amountOfGarbage = 0;
  let garbage = false;
  let canceled = false;

  for (const char of stream) {
    switch (true) {
      case canceled:
        canceled = false;
        break;
      case char === "!":
        canceled = true;
        break;
      case garbage:
        garbage = char !== ">";
        if (garbage) amountOfGarbage++;
        break;
      case char === "<":
        garbage = true;
        break;
    }
  }

  return amountOfGarbage;
};

Deno.test("<>", () => {
  assertEquals(computeAmountOfGarbage("<>"), 0);
});

Deno.test("<random characters>", () => {
  assertEquals(computeAmountOfGarbage("<random characters>"), 17);
});

Deno.test("<<<<>", () => {
  assertEquals(computeAmountOfGarbage("<<<<>"), 3);
});

Deno.test("<{!>}>", () => {
  assertEquals(computeAmountOfGarbage("<{!>}>"), 2);
});

Deno.test("<!!>", () => {
  assertEquals(computeAmountOfGarbage("<!!>"), 0);
});

Deno.test("<!!!>>", () => {
  assertEquals(computeAmountOfGarbage("<!!!>>"), 0);
});

Deno.test('<{o"i!a,<{i<a>', () => {
  assertEquals(computeAmountOfGarbage('<{o"i!a,<{i<a>'), 10);
});

const part2 = () => {
  return computeAmountOfGarbage(stream);
};
console.log(part2());
