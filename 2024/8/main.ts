import { getInput } from "@utilities/getInput.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { point } from "@utilities/grid/Point.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`
  : await getInput(8);

const lines = input.trim().split("\n");
const map: Grid<string> = lines.map((line) => line.split(""));
const points = map.flatMap((row, y) => row.flatMap((_, x) => [point(x, y)]));
const antennas = points.filter((p) => getPoint(map, p) !== ".");
const antennasByFrequency = Map.groupBy(antennas, (p) => getPoint(map, p)!);

const part1Antinodes = points.filter(
  ({ x, y }) => {
    for (const [frequency, antennas] of antennasByFrequency) {
      for (const antenna of antennas) {
        const dx = antenna.x - x;
        const dy = antenna.y - y;
        if (dx === 0 && dy === 0) continue;

        const doubleDistance = point(x + dx * 2, y + dy * 2);
        const isSameFrequencyDoubleDistance =
          getPoint(map, doubleDistance) === frequency;
        if (isSameFrequencyDoubleDistance) return true;
      }
    }
  },
);
console.log(part1Antinodes.length);

function* allPairs<T>(array: T[]) {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      yield [array[i], array[j]] as const;
    }
  }
}

const frequencyLines = Array.from(
  antennasByFrequency.values().flatMap((antennas) => allPairs(antennas)),
);

const part2AntinodeCoordinates = points.filter(
  ({ x, y }) => {
    for (const [antenna1, antenna2] of frequencyLines) {
      const intersectsLine = (x - antenna1.x) * (antenna2.y - antenna1.y) ===
        (y - antenna1.y) * (antenna2.x - antenna1.x);
      if (intersectsLine) return true;
    }
  },
);
console.log(part2AntinodeCoordinates.length);
