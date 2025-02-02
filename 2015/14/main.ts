import { maxOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.
`
  : await getInput(2015, 14);

const lines = input.trim().split("\n");
const reindeers = lines.map((line) => {
  const [, name, flySpeed, flyTime, restTime] = line.match(
    /(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\./,
  )!;
  return {
    name,
    flySpeed: Number(flySpeed),
    flyTime: Number(flyTime),
    restTime: Number(restTime),
  };
});

const raceTime = DEBUG ? 1000 : 2503;

const part1 = () => {
  return maxOf(reindeers, ({ flySpeed, flyTime, restTime }) => {
    const cycleTime = flyTime + restTime;
    const numberOfCycles = Math.floor(raceTime / cycleTime);
    const remainingTime = raceTime % cycleTime;
    return numberOfCycles * flySpeed * flyTime +
      Math.min(flyTime, remainingTime) * flySpeed;
  });
};
console.log(part1());

const part2 = () => {
  interface ReindeerState {
    distance: number;
    isFlying: boolean;
    until: number;
    points: number;
  }
  const reindeerStates = new Map<string, ReindeerState>(
    reindeers.map(({ name, flyTime }) => [name, {
      distance: 0,
      isFlying: true,
      until: flyTime,
      points: 0,
    }]),
  );

  let maxDistance = 0;
  for (let i = 1; i <= raceTime; i++) {
    for (const reindeer of reindeers) {
      const state = reindeerStates.get(reindeer.name)!;
      if (state.isFlying) state.distance += reindeer.flySpeed;

      if (state.until === i) {
        state.isFlying = !state.isFlying;
        state.until += state.isFlying ? reindeer.flyTime : reindeer.restTime;
      }

      maxDistance = Math.max(maxDistance, state.distance);
    }
    for (const state of reindeerStates.values()) {
      if (state.distance === maxDistance) state.points++;
    }
  }

  return maxOf(reindeerStates.values(), ({ points }) => points);
};
console.log(part2());
