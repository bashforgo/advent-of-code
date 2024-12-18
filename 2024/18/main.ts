import { dijkstras } from "@utilities/dijkstras.ts";
import { getInput } from "@utilities/getInput.ts";
import { getAdjacentPoints } from "@utilities/grid/getAdjacentPoints.ts";
import { isInBoundsRaw } from "@utilities/grid/isInBounds.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";

const DEBUG = false;
const [size, input] = DEBUG
  ? [
    6,
    `\
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0
`,
  ] as const
  : [70, await getInput(18)] as const;

const bytes = input.trim().split("\n").map((line) => {
  const [x, y] = line.split(",").map(Number);
  return point(x, y);
});

const printMap = (points: Point[]) => {
  const width = size + 1;
  const height = size + 1;

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push(points.some((p) => p.x === x && p.y === y) ? "#" : ".");
    }
    console.log(row.join(""));
  }
};

const getDistances = (bytes: Point[]) => {
  const set = ObjectSet.from(bytes);

  const { distances } = dijkstras(
    point(0, 0),
    (p) =>
      Array.from(getAdjacentPoints(p))
        .filter((p) => isInBoundsRaw(size + 1, size + 1, p))
        .filter((p) => !set.has(p)),
    () => 1,
  );

  return distances;
};

if (DEBUG) {
  const first12Bytes = bytes.slice(0, 12);
  printMap(first12Bytes);
  const distances = getDistances(first12Bytes);
  console.log(distances.get(point(size, size)));
} else {
  const firstKiloByte = bytes.slice(0, 1024);
  const distances = getDistances(firstKiloByte);
  console.log(distances.get(point(size, size)));
}

for (let nBytes = bytes.length; nBytes > 0; nBytes--) {
  const subset = bytes.slice(0, nBytes);
  const distances = getDistances(subset);
  const distance = distances.get(point(size, size));
  if (distance != null) {
    console.log(bytes.at(nBytes));
    break;
  }
}
