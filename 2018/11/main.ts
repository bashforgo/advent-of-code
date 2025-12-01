import { assertEquals } from "@std/assert";
import { maxBy } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { gridEntries } from "@utilities/grid/gridEntries.ts";
import { makeGrid } from "@utilities/grid/makeGrid.ts";
import { mapGrid } from "@utilities/grid/mapGrid.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { Rectangle, rectangle } from "@utilities/grid/Rectangle.ts";
import { range } from "@utilities/range.ts";

const input = await getInput(2018, 11);
const serialNumber = Number(input);

const width = 300;
const height = 300;

const computePowerLevel = ({ x, y }: Point, serialNumber: number): number => {
  if (x === 0) return 0;
  if (y === 0) return 0;

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

const computeGrid = (serialNumber: number): Grid<number> => {
  return makeGrid(
    width + 1,
    height + 1,
    ({ x, y }) => computePowerLevel(point(x, y), serialNumber),
  );
};

const computeSummedAreaTable = (grid: Grid<number>): Grid<number> => {
  return mapGrid(grid, (value, { x, y }, partialSummedAreaTable) =>
    value +
    (getPoint(partialSummedAreaTable, point(x, y - 1)) ?? 0) +
    (getPoint(partialSummedAreaTable, point(x - 1, y)) ?? 0) -
    (getPoint(partialSummedAreaTable, point(x - 1, y - 1)) ?? 0));
};

{
  Deno.test("computeSummedAreaTable(wikipedia example)", () => {
    const matrix: Grid<number> = [
      [3, 1, 4, 1, 5, 9],
      [2, 6, 5, 3, 5, 8],
      [9, 7, 9, 3, 2, 3],
      [8, 4, 6, 2, 6, 4],
      [3, 3, 8, 3, 2, 7],
      [9, 5, 0, 2, 8, 8],
    ];
    const summedAreaTable = computeSummedAreaTable(matrix);
    assertEquals(summedAreaTable, [
      [3, 4, 8, 9, 14, 23],
      [5, 12, 21, 25, 35, 52],
      [14, 28, 46, 53, 65, 85],
      [22, 40, 64, 73, 91, 115],
      [25, 46, 78, 90, 110, 141],
      [34, 60, 92, 106, 134, 173],
    ]);
  });
}

const computeSum = (
  summedAreaTable: Grid<number>,
  { x, y, width, height }: Rectangle,
) => {
  const x0 = x - 1;
  const y0 = y - 1;
  const x1 = x + width - 1;
  const y1 = y + height - 1;
  const A = getPoint(summedAreaTable, point(x0, y0)) ?? 0;
  const B = getPoint(summedAreaTable, point(x1, y0)) ?? 0;
  const C = getPoint(summedAreaTable, point(x0, y1)) ?? 0;
  const D = getPoint(summedAreaTable, point(x1, y1)) ?? 0;
  return D + A - B - C;
};

{
  Deno.test("computeSum(#18, 3x3@33;45)", () => {
    const grid = computeGrid(18);
    const summedAreaTable = computeSummedAreaTable(grid);
    assertEquals(
      computeSum(summedAreaTable, rectangle(33, 45, 3, 3)),
      29,
    );
  });

  Deno.test("computeSum(#42, 3x3@21;61)", () => {
    const grid = computeGrid(42);
    const summedAreaTable = computeSummedAreaTable(grid);
    assertEquals(
      computeSum(summedAreaTable, rectangle(21, 61, 3, 3)),
      30,
    );
  });
}

const computeMaxSquare = (
  grid: Grid<number>,
  summedAreaTable: Grid<number>,
  size = 3,
) => {
  return maxBy(
    gridEntries(grid)
      .filter(([{ x, y }]) => x + size <= width && y + size <= height)
      .map(([point]) => ({
        point,
        power: computeSum(
          summedAreaTable,
          rectangle(point.x, point.y, size, size),
        ),
      })),
    ({ power }) => power,
  )!;
};

{
  Deno.test("computeMaxSquare(#18)", () => {
    const grid = computeGrid(18);
    const summedAreaTable = computeSummedAreaTable(grid);
    const maxSquare = computeMaxSquare(grid, summedAreaTable);
    assertEquals(maxSquare.point, point(33, 45));
  });

  Deno.test("computeMaxSquare(#42)", () => {
    const grid = computeGrid(42);
    const summedAreaTable = computeSummedAreaTable(grid);
    const maxSquare = computeMaxSquare(grid, summedAreaTable);
    assertEquals(maxSquare.point, point(21, 61));
  });
}

const grid = computeGrid(serialNumber);
const summedAreaTable = computeSummedAreaTable(grid);

const part1 = () => {
  const { point } = computeMaxSquare(grid, summedAreaTable);
  return `${point.x},${point.y}`;
};
console.log(part1());

const computeMaxSquareOfAnySize = (
  grid: Grid<number>,
  summedAreaTable: Grid<number>,
) => {
  return maxBy(
    range(1, 300)
      .map((size) => ({
        size,
        ...computeMaxSquare(grid, summedAreaTable, size),
      })),
    ({ power }) => power,
  )!;
};

{
  Deno.test("computeMaxSquareOfAnySize(#18)", () => {
    const grid = computeGrid(18);
    const summedAreaTable = computeSummedAreaTable(grid);
    const maxSquare = computeMaxSquareOfAnySize(grid, summedAreaTable);
    assertEquals(maxSquare, { point: point(90, 269), power: 113, size: 16 });
  });

  Deno.test("computeMaxSquareOfAnySize(#42)", () => {
    const grid = computeGrid(42);
    const summedAreaTable = computeSummedAreaTable(grid);
    const maxSquare = computeMaxSquareOfAnySize(grid, summedAreaTable);
    assertEquals(maxSquare, { point: point(232, 251), power: 119, size: 12 });
  });
}

const part2 = () => {
  const maxSquare = computeMaxSquareOfAnySize(grid, summedAreaTable);
  return `${maxSquare.point.x},${maxSquare.point.y},${maxSquare.size}`;
};
console.log(part2());
