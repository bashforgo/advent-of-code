import { getInput } from "@utilities/getInput.ts";

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
const map = lines.map((line) => line.split(""));
const frequencies = new Set(
  map.flatMap((row) => row).filter((cell) => cell !== "."),
);
const coordinates = map.flatMap((row, y) => row.flatMap((_, x) => [{ x, y }]));
const antennaCoordinates = coordinates.filter(({ x, y }) => map[y][x] !== ".");
const antennaCoordinatesByFrequency = Map.groupBy(
  antennaCoordinates,
  ({ x, y }) => map[y][x],
);

const part1AntinodeCoordinates = coordinates.filter(
  ({ x, y }) => {
    for (const frequency of frequencies) {
      const antennas = antennaCoordinatesByFrequency.get(frequency) ?? [];
      for (const antenna of antennas) {
        const dx = antenna.x - x;
        const dy = antenna.y - y;
        if (dx === 0 && dy === 0) continue;

        const doubleDistanceX = x + dx * 2;
        const doubleDistanceY = y + dy * 2;
        const isSameFrequencyDoubleDistance =
          map[doubleDistanceY]?.[doubleDistanceX] === frequency;
        if (isSameFrequencyDoubleDistance) return true;
      }
    }
  },
);
console.log(part1AntinodeCoordinates.length);

function* allPairs<T>(array: T[]) {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      yield [array[i], array[j]] as const;
    }
  }
}

const frequencyLines = Array.from(frequencies).flatMap((frequency) =>
  Array.from(allPairs(antennaCoordinatesByFrequency.get(frequency)!))
);

const part2AntinodeCoordinates = coordinates.filter(
  ({ x, y }) => {
    for (const [antenna1, antenna2] of frequencyLines) {
      const intersectsLine = (x - antenna1.x) * (antenna2.y - antenna1.y) ===
        (y - antenna1.y) * (antenna2.x - antenna1.x);
      if (intersectsLine) return true;
    }
  },
);
console.log(part2AntinodeCoordinates.length);
