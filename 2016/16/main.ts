import { assertEquals } from "@std/assert";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
10000
`
  : await getInput(2016, 16);

const initialState = input.trim();

const modifiedDragonCurve = (input: string) => {
  const a = input;
  let b = "";
  for (let i = a.length - 1; i >= 0; i--) {
    b = `${b}${a[i] === "0" ? "1" : "0"}`;
  }
  return `${a}0${b}`;
};

{
  Deno.test('modifiedDragonCurve("1")', () => {
    assertEquals(modifiedDragonCurve("1"), "100");
  });

  Deno.test('modifiedDragonCurve("0")', () => {
    assertEquals(modifiedDragonCurve("0"), "001");
  });

  Deno.test('modifiedDragonCurve("11111")', () => {
    assertEquals(modifiedDragonCurve("11111"), "11111000000");
  });

  Deno.test('modifiedDragonCurve("111100001010")', () => {
    assertEquals(
      modifiedDragonCurve("111100001010"),
      "1111000010100101011110000",
    );
  });
}

const generateData = (input: string, desiredLength: number) => {
  let data = input;
  while (data.length < desiredLength) {
    data = modifiedDragonCurve(data);
  }
  return data.slice(0, desiredLength);
};

const calculateChecksum = (data: string): string => {
  let checksum = "";
  for (let i = 0; i < data.length; i += 2) {
    checksum += data[i] === data[i + 1] ? "1" : "0";
  }

  return checksum.length % 2 === 0 ? calculateChecksum(checksum) : checksum;
};

{
  Deno.test('calculateChecksum("110010110100")', () => {
    assertEquals(calculateChecksum("110010110100"), "100");
  });

  Deno.test('calculateChecksum("110101")', () => {
    assertEquals(calculateChecksum("110101"), "100");
  });
}

const part1 = () => {
  const data = generateData(initialState, DEBUG ? 20 : 272);
  return calculateChecksum(data);
};
console.log(part1());

const part2 = () => {
  const data = generateData(initialState, DEBUG ? 20 : 35651584);
  return calculateChecksum(data);
};
console.log(part2());
