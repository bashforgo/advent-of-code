import { getInput } from "@utilities/getInput.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { printBrailleRaw } from "@utilities/grid/printBraille.ts";

const DEBUG = false;
const [width, height, input] = DEBUG
  ? [
    11,
    7,
    `\
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
`,
  ] as const
  : [101, 103, await getInput(14)] as const;

interface Robot {
  readonly position: Point;
  readonly velocity: Point;
}

const robots = input.trim().split("\n").map((line): Robot => {
  const [, px, py, vx, vy] = line.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/)!;
  return {
    position: point(Number(px), Number(py)),
    velocity: point(Number(vx), Number(vy)),
  };
});

const step = ({ position, velocity }: Robot): Robot => {
  const nextPosition = point(
    (position.x + velocity.x + width) % width,
    (position.y + velocity.y + height) % height,
  );
  return { position: nextPosition, velocity };
};

// deno-lint-ignore no-unused-vars
const print = (robots: readonly Robot[]) => {
  const robotsByPosition = Map.groupBy(
    robots,
    (robot) => `${robot.position.x},${robot.position.y}`,
  );

  let map = "";
  for (let y = 0; y < height; y++) {
    let line = "";
    for (let x = 0; x < width; x++) {
      line += robotsByPosition.get(`${x},${y}`)?.length ?? ".";
    }
    map += line + "\n";
  }
  console.log(map);
};

const getRobotsByQuadrant = (robots: readonly Robot[]) => {
  const getQuadrant = (point: Point): number => {
    const verticalCenter = (height / 2) | 0;
    const horizontalCenter = (width / 2) | 0;

    if (point.x < horizontalCenter && point.y < verticalCenter) return 1;
    if (point.x > horizontalCenter && point.y < verticalCenter) return 2;
    if (point.x > horizontalCenter && point.y > verticalCenter) return 3;
    if (point.x < horizontalCenter && point.y > verticalCenter) return 4;

    return NaN;
  };

  const robotsByQuadrant = Map.groupBy(
    robots,
    (robot) => getQuadrant(robot.position),
  );
  robotsByQuadrant.delete(NaN);

  return robotsByQuadrant;
};

{
  let updatedRobots = robots;
  for (let i = 0; i < 100; i++) {
    updatedRobots = updatedRobots.map(step);
  }

  const robotsByQuadrant = getRobotsByQuadrant(updatedRobots);
  console.log(
    Array
      .from(robotsByQuadrant.values())
      .map((robots) => robots.length)
      .reduce((a, b) => a * b),
  );
}

{
  let i = 0;
  let updatedRobots = robots;
  while (++i) {
    updatedRobots = updatedRobots.map(step);
    const robotsByQuadrant = getRobotsByQuadrant(updatedRobots);
    const isOddDistribution = Array
      .from(robotsByQuadrant.values())
      .some((robots) => robots.length > 215);
    if (isOddDistribution) break;
  }
  {
    const robotsByPosition = Map.groupBy(
      updatedRobots,
      (robot) => `${robot.position.x},${robot.position.y}`,
    );
    printBrailleRaw(
      width,
      height,
      (point) => robotsByPosition.has(`${point.x},${point.y}`),
    );
  }
  console.log(i);
}
