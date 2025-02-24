import { minBy } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { ObjectMap } from "@utilities/ObjectMap.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";
import { range } from "@utilities/range.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
p=<3,0,0>, v=<2,0,0>, a=<-1,0,0>
p=<4,0,0>, v=<0,0,0>, a=<-2,0,0>
`
  : await getInput(2017, 20);

const lines = input.trim().split("\n");

interface V3 {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

interface Particle {
  readonly p: V3;
  readonly v: V3;
  readonly a: V3;
}

const particles: Particle[] = lines.map((line) => {
  const [, px, py, pz, vx, vy, vz, ax, ay, az] = line.match(
    /p=<(-?\d+),(-?\d+),(-?\d+)>, v=<(-?\d+),(-?\d+),(-?\d+)>, a=<(-?\d+),(-?\d+),(-?\d+)>/,
  )!.map(Number);
  return {
    p: { x: px, y: py, z: pz },
    v: { x: vx, y: vy, z: vz },
    a: { x: ax, y: ay, z: az },
  };
});

const computeParticlePositionAtTime = (
  particle: Particle,
  time: number,
): V3 => {
  const { p, v, a } = particle;
  return {
    x: p.x + v.x * time + (a.x * time * (time + 1)) / 2,
    y: p.y + v.y * time + (a.y * time * (time + 1)) / 2,
    z: p.z + v.z * time + (a.z * time * (time + 1)) / 2,
  };
};

const getDistance = (v: V3): number =>
  Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z);

const part1 = () => {
  const futureParticlePositions = particles.map((particle) => {
    return computeParticlePositionAtTime(particle, 999_999);
  });

  const [closestParticleId] = minBy(
    futureParticlePositions.entries(),
    ([, pos]) => getDistance(pos),
  )!;
  return closestParticleId;
};
console.log(part1());

const part2 = () => {
  const particlesSet = ObjectSet.from(particles);

  for (const i of range(1, 999)) {
    const particlesByPosition = ObjectMap.groupBy(
      particlesSet,
      (p) => computeParticlePositionAtTime(p, i),
    );
    for (const [, particles] of particlesByPosition) {
      if (particles.length > 1) {
        for (const particle of particles) {
          particlesSet.delete(particle);
        }
      }
    }
  }

  return particlesSet.size;
};
console.log(part2());
