import { assertEquals } from "@std/assert";
import { mapValues } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";

const input = await getInput(2016, 9);

const compressedString = input.trim();

const markerRegExp = /(?<marker>\((?<length>\d+)x(?<times>\d+)\))/gd;

const decompress = (input: string) => {
  let i = 0;
  let result = "";
  for (const match of input.matchAll(markerRegExp)) {
    if (match.index < i) continue;

    const { length, times } = mapValues(match.groups!, Number);
    const [markerStart, markerEnd] = match.indices!.groups!.marker;

    const beforeMarker = input.slice(i, markerStart);
    i = markerEnd + length;
    const stringToRepeat = input.slice(markerEnd, i);
    result = `${result}${beforeMarker}${stringToRepeat.repeat(times)}`;
  }

  result = `${result}${input.slice(i)}`;
  return result;
};

{
  Deno.test('decompress("ADVENT")', () => {
    assertEquals(decompress("ADVENT"), "ADVENT");
  });

  Deno.test('decompress("A(1x5)BC")', () => {
    assertEquals(decompress("A(1x5)BC"), "ABBBBBC");
  });

  Deno.test('decompress("(3x3)XYZ")', () => {
    assertEquals(decompress("(3x3)XYZ"), "XYZXYZXYZ");
  });

  Deno.test('decompress("A(2x2)BCD(2x2)EFG")', () => {
    assertEquals(decompress("A(2x2)BCD(2x2)EFG"), "ABCBCDEFEFG");
  });

  Deno.test('decompress("(6x1)(1x3)A")', () => {
    assertEquals(decompress("(6x1)(1x3)A"), "(1x3)A");
  });

  Deno.test('decompress("X(8x2)(3x3)ABCY")', () => {
    assertEquals(decompress("X(8x2)(3x3)ABCY"), "X(3x3)ABC(3x3)ABCY");
  });
}

const part1 = () => {
  return decompress(compressedString).length;
};
console.log(part1());

const decompressRecursive = (input: string): string => {
  let i = 0;
  let result = "";
  for (const match of input.matchAll(markerRegExp)) {
    if (match.index < i) continue;

    const { length, times } = mapValues(match.groups!, Number);
    const [markerStart, markerEnd] = match.indices!.groups!.marker;

    const beforeMarker = input.slice(i, markerStart);
    i = markerEnd + length;
    const stringToRepeat = decompressRecursive(input.slice(markerEnd, i));
    result = `${result}${beforeMarker}${stringToRepeat.repeat(times)}`;
  }

  result = `${result}${input.slice(i)}`;
  return result;
};

{
  Deno.test('decompressRecursive("(3x3)XYZ")', () => {
    assertEquals(decompressRecursive("(3x3)XYZ"), "XYZXYZXYZ");
  });

  Deno.test('decompressRecursive("X(8x2)(3x3)ABCY")', () => {
    assertEquals(
      decompressRecursive("X(8x2)(3x3)ABCY"),
      "XABCABCABCABCABCABCY",
    );
  });

  Deno.test('decompressRecursive("(27x12)(20x12)(13x14)(7x10)(1x12)A")', () => {
    assertEquals(
      decompressRecursive("(27x12)(20x12)(13x14)(7x10)(1x12)A"),
      "A".repeat(241920),
    );
  });

  Deno.test('decompressRecursive("(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN")', () => {
    assertEquals(
      decompressRecursive(
        "(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN",
      ).length,
      445,
    );
  });
}

const decompressRecursiveLength = (input: string): number => {
  let i = 0;
  let result = 0;
  for (const match of input.matchAll(markerRegExp)) {
    if (match.index < i) continue;

    const { length, times } = mapValues(match.groups!, Number);
    const [markerStart, markerEnd] = match.indices!.groups!.marker;

    const beforeMarker = input.slice(i, markerStart);
    i = markerEnd + length;
    const stringToRepeat = decompressRecursiveLength(input.slice(markerEnd, i));
    result += beforeMarker.length + stringToRepeat * times;
  }

  result += input.length - i;
  return result;
};

{
  Deno.test('decompressRecursiveLength("(3x3)XYZ")', () => {
    assertEquals(decompressRecursiveLength("(3x3)XYZ"), 9);
  });

  Deno.test('decompressRecursiveLength("X(8x2)(3x3)ABCY")', () => {
    assertEquals(decompressRecursiveLength("X(8x2)(3x3)ABCY"), 20);
  });

  Deno.test('decompressRecursiveLength("(27x12)(20x12)(13x14)(7x10)(1x12)A")', () => {
    assertEquals(
      decompressRecursiveLength("(27x12)(20x12)(13x14)(7x10)(1x12)A"),
      241920,
    );
  });

  Deno.test('decompressRecursiveLength("(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN")', () => {
    assertEquals(
      decompressRecursiveLength(
        "(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN",
      ),
      445,
    );
  });
}

const part2 = () => {
  return decompressRecursiveLength(compressedString);
};
console.log(part2());
