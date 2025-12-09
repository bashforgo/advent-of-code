import { maxOf, minOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { addPoints } from "@utilities/grid/addPoints.ts";
import { getManhattanDistance } from "@utilities/grid/getManhattanDistance.ts";
import { makeGrid } from "@utilities/grid/makeGrid.ts";
import { multiplyPoint } from "@utilities/grid/multiplyPoint.ts";
import { Point, point } from "@utilities/grid/Point.ts";
import { identity } from "@utilities/identity.ts";
import { meanBy } from "@utilities/meanBy.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";
import { standardDeviationBy } from "@utilities/standardDeviationBy.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
position=< 9,  1> velocity=< 0,  2>
position=< 7,  0> velocity=<-1,  0>
position=< 3, -2> velocity=<-1,  1>
position=< 6, 10> velocity=<-2, -1>
position=< 2, -4> velocity=< 2,  2>
position=<-6, 10> velocity=< 2, -2>
position=< 1,  8> velocity=< 1, -1>
position=< 1,  7> velocity=< 1,  0>
position=<-3, 11> velocity=< 1, -2>
position=< 7,  6> velocity=<-1, -1>
position=<-2,  3> velocity=< 1,  0>
position=<-4,  3> velocity=< 2,  0>
position=<10, -3> velocity=<-1,  1>
position=< 5, 11> velocity=< 1, -2>
position=< 4,  7> velocity=< 0, -1>
position=< 8, -2> velocity=< 0,  1>
position=<15,  0> velocity=<-2,  0>
position=< 1,  6> velocity=< 1,  0>
position=< 8,  9> velocity=< 0, -1>
position=< 3,  3> velocity=<-1,  1>
position=< 0,  5> velocity=< 0, -1>
position=<-2,  2> velocity=< 2,  0>
position=< 5, -2> velocity=< 1,  2>
position=< 1,  4> velocity=< 2,  1>
position=<-2,  7> velocity=< 2, -2>
position=< 3,  6> velocity=<-1, -1>
position=< 5,  0> velocity=< 1,  0>
position=<-6,  0> velocity=< 2,  0>
position=< 5,  9> velocity=< 1, -2>
position=<14,  7> velocity=<-2,  0>
position=<-3,  6> velocity=< 2, -1>
`
  : await getInput(2018, 10);

interface Particle {
  position: Point;
  velocity: Point;
}

const initialParticles = input.trim()
  .split("\n")
  .map((line) => {
    const [x, y, vx, vy] = line
      .match(/-?\d+/g)!
      .map(Number);
    return {
      position: point(x, y),
      velocity: point(vx, vy),
    };
  });

const particlesToGrid = (particles: Particle[]) => {
  const points = ObjectSet.from(particles.map((p) => p.position));

  const minX = minOf(particles, (p) => p.position.x)!;
  const maxX = maxOf(particles, (p) => p.position.x)!;

  const minY = minOf(particles, (p) => p.position.y)!;
  const maxY = maxOf(particles, (p) => p.position.y)!;

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  return makeGrid(
    width,
    height,
    ({ x, y }) => points.has(point(x + minX, y + minY)) ? "#" : ".",
  );
};

const tick = (particles: Particle[], times = 1) => {
  return particles.map(({ position, velocity }) => ({
    position: addPoints(position, multiplyPoint(velocity, times)),
    velocity,
  }));
};

const computeParticleSpread = (particles: Particle[]) => {
  const meanPoint = point(
    meanBy(particles, (p) => p.position.x),
    meanBy(particles, (p) => p.position.y),
  );

  const distances = particles.map((p) =>
    getManhattanDistance(meanPoint, p.position)
  );

  return standardDeviationBy(distances, identity);
};

const INVPHI = (Math.sqrt(5) - 1) / 2;
const integerGoldenSectionSearch = (
  f: (x: number) => number,
  a: number,
  b: number,
) => {
  while (b - a > 2) {
    const c = Math.floor(b - (b - a) * INVPHI);
    const d = Math.ceil(a + (b - a) * INVPHI);
    if (f(c) < f(d)) {
      b = d;
    } else {
      a = c;
    }
  }

  return (a + b) / 2;
};

const minSpreadTime = integerGoldenSectionSearch(
  (x) => computeParticleSpread(tick(initialParticles, x)),
  0,
  99_999,
);

const part1 = () => {
  const particles = tick(initialParticles, minSpreadTime);

  const grid = particlesToGrid(particles);
  return grid.map((row) => row.join("")).join("\n");
};
console.log(part1());

const part2 = () => {
  return minSpreadTime;
};
console.log(part2());
