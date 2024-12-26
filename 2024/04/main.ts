import { slidingWindows } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`
  : await getInput(2024, 4);

const matrix = input.trim().split("\n").map((line) => line.split(""));

function* iterate() {
  yield* rows();
  yield* columns();
  yield* diagonals();

  function* rows() {
    for (const row of matrix) {
      yield row;
    }
  }

  function* columns() {
    for (let i = 0; i < matrix.length; i++) {
      const column = [];
      for (const row of matrix) {
        column.push(row[i]);
      }
      yield column;
    }
  }

  function* diagonals() {
    for (let i = 0; i < matrix.length; i++) {
      const diagonal = [];
      for (let j = 0; j <= i; j++) {
        diagonal.push(matrix[i - j][j]);
      }
      yield diagonal;
    }
    for (let i = 1; i < matrix.length; i++) {
      const diagonal = [];
      for (let j = 0; j < matrix.length - i; j++) {
        diagonal.push(matrix[matrix.length - j - 1][i + j]);
      }
      yield diagonal;
    }

    for (let i = matrix.length - 1; i >= 0; i--) {
      const diagonal = [];
      for (let j = 0; j < matrix.length - i; j++) {
        diagonal.push(matrix[i + j][j]);
      }
      yield diagonal;
    }
    for (let i = 1; i < matrix.length; i++) {
      const diagonal = [];
      for (let j = 0; j < matrix.length - i; j++) {
        diagonal.push(matrix[j][i + j]);
      }
      yield diagonal;
    }
  }
}

const part1 = iterate()
  .flatMap((line) => slidingWindows(line, 4))
  .map((window) => window.join(""))
  .filter((word) => word === "XMAS" || word === "SAMX");
console.log(Array.from(part1).length);

function* iterate3x3() {
  for (let i = 0; i < matrix.length - 2; i++) {
    for (let j = 0; j < matrix.length - 2; j++) {
      const subMatrix = [
        matrix[i].slice(j, j + 3),
        matrix[i + 1].slice(j, j + 3),
        matrix[i + 2].slice(j, j + 3),
      ];
      yield subMatrix;
    }
  }
}
const part2 = iterate3x3()
  .map((subMatrix) => subMatrix.flat().join(""))
  .filter((word) =>
    /^(M...A...S|S...A...M)$/.test(word) &&
    /^(..M.A.S..|..S.A.M..)$/.test(word)
  );
console.log(Array.from(part2).length);
