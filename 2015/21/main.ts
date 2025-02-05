import { unreachable } from "@std/assert";
import { sortBy, sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { pickN } from "@utilities/pickN.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
Hit Points: 12
Damage: 7
Armor: 2
`
  : await getInput(2015, 21);

interface CharacterStats {
  hitPoints: number;
  damage: number;
  armor: number;
}

const lines = input.trim().split("\n");
const bossStatsMap = new Map(
  lines.map((line) => {
    const [stat, value] = line.split(": ");
    return [stat, Number(value)] as const;
  }),
);
const bossStats: CharacterStats = {
  hitPoints: bossStatsMap.get("Hit Points")!,
  damage: bossStatsMap.get("Damage")!,
  armor: bossStatsMap.get("Armor")!,
};

interface ItemStats {
  name: string;
  cost: number;
  damage: number;
  armor: number;
}

const weapons: ItemStats[] = [
  { name: "Dagger", cost: 8, damage: 4, armor: 0 },
  { name: "Shortsword", cost: 10, damage: 5, armor: 0 },
  { name: "Warhammer", cost: 25, damage: 6, armor: 0 },
  { name: "Longsword", cost: 40, damage: 7, armor: 0 },
  { name: "Greataxe", cost: 74, damage: 8, armor: 0 },
];

const armors: ItemStats[] = [
  { name: "Leather", cost: 13, damage: 0, armor: 1 },
  { name: "Chainmail", cost: 31, damage: 0, armor: 2 },
  { name: "Splintmail", cost: 53, damage: 0, armor: 3 },
  { name: "Bandedmail", cost: 75, damage: 0, armor: 4 },
  { name: "Platemail", cost: 102, damage: 0, armor: 5 },
];

const rings: ItemStats[] = [
  { name: "Damage +1", cost: 25, damage: 1, armor: 0 },
  { name: "Damage +2", cost: 50, damage: 2, armor: 0 },
  { name: "Damage +3", cost: 100, damage: 3, armor: 0 },
  { name: "Defense +1", cost: 20, damage: 0, armor: 1 },
  { name: "Defense +2", cost: 40, damage: 0, armor: 2 },
  { name: "Defense +3", cost: 80, damage: 0, armor: 3 },
];

const calculateDamage = (
  attacker: CharacterStats,
  defender: CharacterStats,
) => {
  return Math.max(1, attacker.damage - defender.armor);
};

enum Winner {
  Player = "Player",
  Boss = "Boss",
}

function* itemCombinations() {
  function* weaponOptions() {
    for (const weapon of weapons) {
      yield [weapon];
    }
  }

  function* armorOptions() {
    yield [];
    for (const armor of armors) {
      yield [armor];
    }
  }

  function* ringOptions() {
    yield [];
    for (const ring of rings) {
      yield [ring];
    }
    for (const [ring1, ring2] of pickN(rings, 2)) {
      yield [ring1, ring2];
    }
  }

  for (const weapon of weaponOptions()) {
    for (const armor of armorOptions()) {
      for (const rings of ringOptions()) {
        yield [...weapon, ...armor, ...rings];
      }
    }
  }
}

const fight = (player: CharacterStats, boss: CharacterStats) => {
  let playerHitPoints = player.hitPoints;
  let bossHitPoints = boss.hitPoints;

  while (playerHitPoints > 0 && bossHitPoints > 0) {
    bossHitPoints -= calculateDamage(player, boss);
    if (bossHitPoints <= 0) {
      return Winner.Player;
    }

    playerHitPoints -= calculateDamage(boss, player);
    if (playerHitPoints <= 0) {
      return Winner.Boss;
    }
  }

  unreachable();
};

const part1 = () => {
  const itemCombinationsByCost = sortBy(
    Array.from(itemCombinations()),
    (is) => sumOf(is, (i) => i.cost),
  );
  for (const items of itemCombinationsByCost) {
    const damage = sumOf(items, (i) => i.damage);
    const armor = sumOf(items, (i) => i.armor);
    if (fight({ hitPoints: 100, damage, armor }, bossStats) === Winner.Player) {
      return sumOf(items, (i) => i.cost);
    }
  }
};
console.log(part1());

const part2 = () => {
  const itemCombinationsByInverseCost = sortBy(
    Array.from(itemCombinations()),
    (is) => -sumOf(is, (i) => i.cost),
  );
  for (const items of itemCombinationsByInverseCost) {
    const damage = sumOf(items, (i) => i.damage);
    const armor = sumOf(items, (i) => i.armor);
    if (fight({ hitPoints: 100, damage, armor }, bossStats) === Winner.Boss) {
      return sumOf(items, (i) => i.cost);
    }
  }
};
console.log(part2());
