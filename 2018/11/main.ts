import { assertEquals } from "@std/assert";
import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { addPoints } from "@utilities/grid/addPoints.ts";
import { makeGrid } from "@utilities/grid/makeGrid.ts";
import { subGridValues } from "@utilities/grid/subGrid.ts";
import { identity } from "@utilities/identity.ts";
import { range } from "@utilities/range.ts";

const input = await getInput(2018, 11);
const serialNumber = Number(input);

const width = 300;
const height = 300;

const computePowerLevel = ({ x, y }: Point, serialNumber: number): number => {
  const rackId = x + 10;
  let powerLevel = rackId * y;
  powerLevel += serialNumber;
  powerLevel *= rackId;
  powerLevel = Math.floor((powerLevel % 1000) / 100);
  powerLevel -= 5;
  return powerLevel;
};

{
  Deno.test("computePowerLevel(3;5, 8)", () => {
    assertEquals(computePowerLevel(point(3, 5), 8), 4);
  });

  Deno.test("computePowerLevel(122;79, 57)", () => {
    assertEquals(computePowerLevel(point(122, 79), 57), -5);
  });

  Deno.test("computePowerLevel(217;196, 39)", () => {
    assertEquals(computePowerLevel(point(217, 196), 39), 0);
  });

  Deno.test("computePowerLevel(101;153, 71)", () => {
    assertEquals(computePowerLevel(point(101, 153), 71), 4);
  });
}

const computeCoordinateOfMax3x3Square = (serialNumber: number): Point => {
  const offset = point(1, 1);
  const grid = makeGrid(
    width,
    height,
    (point) => computePowerLevel(addPoints(point, offset), serialNumber),
  );

  let maxPower = Number.NEGATIVE_INFINITY;
  let maxPowerCoordinate = point(0, 0);
  for (const x of range(0, width - 3)) {
    for (const y of range(0, height - 3)) {
      const power = sumOf(
        subGridValues(grid, { x, y, width: 3, height: 3 }),
        identity,
      );
      if (power > maxPower) {
        maxPower = power;
        maxPowerCoordinate = point(x, y);
      }
    }
  }

  return addPoints(maxPowerCoordinate, offset);
};

{
  Deno.test("computeCoordinateOfMax3x3Square(18)", () => {
    assertEquals(computeCoordinateOfMax3x3Square(18), point(33, 45));
  });

  Deno.test("computeCoordinateOfMax3x3Square(42)", () => {
    assertEquals(computeCoordinateOfMax3x3Square(42), point(21, 61));
  });
}

const part1 = () => {
  const { x, y } = computeCoordinateOfMax3x3Square(serialNumber);
  return `${x},${y}`;
};
console.log(part1());

const part2 = () => {
};
console.log(part2());
