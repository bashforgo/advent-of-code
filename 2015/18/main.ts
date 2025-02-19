import { getInput } from "@utilities/getInput.ts";
import { get8DirectionalAdjacentPoints } from "@utilities/grid/getAdjacentPoints.ts";
import { getPoint } from "@utilities/grid/getPoint.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { Point, point } from "@utilities/grid/Point.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
.#.#.#
...##.
#....#
..#...
#.#..#
####..
`
  : await getInput(2015, 18);

const lines = input.trim().split("\n");
const lights: Grid<boolean> = lines.map((line) =>
  line.split("").map((c) => c === "#")
);

const getNeighborStates = (lights: Grid<boolean>, p: Point) => {
  return get8DirectionalAdjacentPoints(p)
    .map((p) => getPoint(lights, p))
    .toArray();
};

const step = (lights: Grid<boolean>) => {
  return lights.map((row, y) =>
    row.map((light, x) => {
      const neighborStates = getNeighborStates(lights, point(x, y));
      const numberOfNeighborsOn = neighborStates.filter((s) => s).length;

      if (light) {
        const shouldStayOn = numberOfNeighborsOn === 2 ||
          numberOfNeighborsOn === 3;
        return shouldStayOn;
      } else {
        const shouldTurnOn = numberOfNeighborsOn === 3;
        return shouldTurnOn;
      }
    })
  );
};

// deno-lint-ignore no-unused-vars
const printLights = (lights: Grid<boolean>) => {
  console.log(
    lights.map((row) => row.map((l) => (l ? "#" : ".")).join("")).join("\n"),
  );
};

const part1 = () => {
  const numberOfSteps = DEBUG ? 4 : 100;
  let currentLights = lights;
  for (let i = 0; i < numberOfSteps; i++) {
    currentLights = step(currentLights);
  }
  return currentLights.flat().filter((l) => l).length;
};
console.log(part1());

const turnOnCorners = (lights: Grid<boolean>) => {
  return lights
    .with(0, lights.at(0)!.with(0, true).with(-1, true))
    .with(-1, lights.at(-1)!.with(0, true).with(-1, true));
};

const part2 = () => {
  const numberOfSteps = DEBUG ? 5 : 100;
  let currentLights = turnOnCorners(lights);
  for (let i = 0; i < numberOfSteps; i++) {
    currentLights = turnOnCorners(step(currentLights));
  }
  return currentLights.flat().filter((l) => l).length;
};
console.log(part2());
