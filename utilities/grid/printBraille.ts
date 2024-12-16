import { Grid } from "@utilities/grid/Grid.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";

export const printBraille = <T>(
  grid: Grid<T>,
  getPixel: (value: T, point: Point) => boolean,
) => {
  const width = grid[0].length;
  const height = grid.length;

  printBrailleRaw(
    width,
    height,
    (point) => getPixel(getPoint(grid, point)!, point),
  );
};

export const printBrailleRaw = (
  width: number,
  height: number,
  getPixel: (point: Point) => boolean,
) => {
  let string = "";
  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 2) {
      const braille: Braille = [
        [false, false],
        [false, false],
        [false, false],
        [false, false],
      ];
      for (let dy = 0; dy < 4; dy++) {
        for (let dx = 0; dx < 2; dx++) {
          if (getPixel(point(x + dx, y + dy))) {
            braille[dy][dx] = true;
          }
        }
      }
      string += getChar(braille);
    }
    string += "\n";
  }

  console.log(string);
};

type Braille = readonly [
  [boolean, boolean],
  [boolean, boolean],
  [boolean, boolean],
  [boolean, boolean],
];
const getChar = (
  [
    [_1, _4],
    [_2, _5],
    [_3, _6],
    [_7, _8],
  ]: Braille,
) => {
  const code = Number(_1) << 0 |
    Number(_2) << 1 |
    Number(_3) << 2 |
    Number(_4) << 3 |
    Number(_5) << 4 |
    Number(_6) << 5 |
    Number(_7) << 6 |
    Number(_8) << 7;
  return String.fromCharCode(0x2800 + code);
};
