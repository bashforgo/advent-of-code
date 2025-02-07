import { partition } from "@std/collections";
import { aStar } from "@utilities/aStar.ts";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
Hit Points: 14
Damage: 8
`
  : await getInput(2015, 22);

const bossStats = {
  hitPoints: Number(input.match(/Hit Points: (\d+)/)![1]),
  damage: Number(input.match(/Damage: (\d+)/)![1]),
};

interface GameState {
  turn: number;
  boss: {
    hitPoints: number;
    damage: number;
  };
  player: {
    hitPoints: number;
    mana: number;
    armor: number;
  };
  effects: {
    id: string;
    turns: number;
    onTurnStart?: ApplyEffect;
    onEnd?: ApplyEffect;
  }[];
}

const copy = (gameState: GameState): GameState => ({
  turn: gameState.turn,
  boss: { ...gameState.boss },
  player: { ...gameState.player },
  effects: [...gameState.effects],
});

type ApplyEffect = (gameState: GameState) => void;

enum Action {
  MagicMissile = "Magic Missile",
  Drain = "Drain",
  Shield = "Shield",
  Poison = "Poison",
  Recharge = "Recharge",
  BossAttack = "Boss Attack",
}

const actionCosts = new Map([
  [Action.MagicMissile, 53],
  [Action.Drain, 73],
  [Action.Shield, 113],
  [Action.Poison, 173],
  [Action.Recharge, 229],
  [Action.BossAttack, 0],
]);

const checkMana = (gameState: GameState) => {
  if (gameState.player.mana < 0) throw new Error("Not enough mana");
};

const magicMissile: ApplyEffect = (gameState) => {
  gameState.player.mana -= actionCosts.get(Action.MagicMissile)!;
  checkMana(gameState);

  gameState.boss.hitPoints -= 4;
};

const drain: ApplyEffect = (gameState) => {
  gameState.player.mana -= actionCosts.get(Action.Drain)!;
  checkMana(gameState);

  gameState.boss.hitPoints -= 2;
  gameState.player.hitPoints += 2;
};

const shield: ApplyEffect = (gameState) => {
  if (gameState.effects.some((effect) => effect.id === Action.Shield)) {
    throw new Error("Shield already active");
  }

  gameState.player.mana -= actionCosts.get(Action.Shield)!;
  checkMana(gameState);

  gameState.player.armor += 7;

  gameState.effects.push({
    id: Action.Shield,
    turns: 6,
    onEnd: (gameState) => {
      gameState.player.armor -= 7;
    },
  });
};

const poison: ApplyEffect = (gameState) => {
  if (gameState.effects.some((effect) => effect.id === Action.Poison)) {
    throw new Error("Poison already active");
  }

  gameState.player.mana -= actionCosts.get(Action.Poison)!;
  checkMana(gameState);

  gameState.effects.push({
    id: Action.Poison,
    turns: 6,
    onTurnStart: (gameState) => {
      gameState.boss.hitPoints -= 3;
    },
  });
};

const recharge: ApplyEffect = (gameState) => {
  if (gameState.effects.some((effect) => effect.id === Action.Recharge)) {
    throw new Error("Recharge already active");
  }

  gameState.player.mana -= actionCosts.get(Action.Recharge)!;
  checkMana(gameState);

  gameState.effects.push({
    id: Action.Recharge,
    turns: 5,
    onTurnStart: (gameState) => {
      gameState.player.mana += 101;
    },
  });
};

const bossAttack: ApplyEffect = (gameState) => {
  if (gameState.boss.hitPoints <= 0) return gameState;

  gameState.player.hitPoints -= Math.max(
    1,
    bossStats.damage - gameState.player.armor,
  );
};

const applyAction = (gameState: GameState, action: Action) => {
  const newGameState = copy(gameState);
  switch (action) {
    case Action.MagicMissile:
      magicMissile(newGameState);
      break;
    case Action.Drain:
      drain(newGameState);
      break;
    case Action.Shield:
      shield(newGameState);
      break;
    case Action.Poison:
      poison(newGameState);
      break;
    case Action.Recharge:
      recharge(newGameState);
      break;
    case Action.BossAttack:
      bossAttack(newGameState);
      break;
  }
  return newGameState;
};

enum Character {
  Player = "Player",
  Boss = "Boss",
}

const takeTurn = (
  gameState: GameState,
  action: Action,
): [winner: Character | null, gameState: GameState] => {
  let winner: Character | null = null;
  let newGameState = copy(gameState);
  newGameState.turn++;

  // Effects
  {
    for (const effect of newGameState.effects) {
      if (effect.onTurnStart == null) continue;
      newGameState = copy(newGameState);
      effect.onTurnStart(newGameState);

      winner = checkWinner();
      if (winner != null) return [winner, newGameState];
    }
  }

  // Expire effects
  {
    const [activeEffects, expiredEffects] = partition(
      newGameState.effects.map((effect) => ({
        ...effect,
        turns: effect.turns - 1,
      })),
      (effect) => effect.turns > 0,
    );

    for (const effect of expiredEffects) {
      if (effect.onEnd == null) continue;
      newGameState = copy(newGameState);
      effect.onEnd(newGameState);

      winner = checkWinner();
      if (winner != null) return [winner, newGameState];
    }

    newGameState = { ...newGameState, effects: activeEffects };
  }

  // Character actions
  {
    newGameState = applyAction(newGameState, action);

    winner = checkWinner();
    return [winner, newGameState];
  }

  function checkWinner() {
    if (newGameState.player.hitPoints <= 0) return Character.Boss;
    if (newGameState.boss.hitPoints <= 0) return Character.Player;
    return null;
  }
};

interface State {
  gameState: GameState;
  action?: Action;
  manaSpent: number;
  winner: Character | null;
}

const solve = (initialState: State) => {
  return aStar<State>(
    initialState,
    function* (state) {
      if (state.winner != null) return;

      for (
        const action of [
          Action.MagicMissile,
          Action.Drain,
          Action.Shield,
          Action.Poison,
          Action.Recharge,
        ]
      ) {
        try {
          let [winner, newGameState] = takeTurn(state.gameState, action);
          const manaSpent = state.manaSpent + actionCosts.get(action)!;

          if (winner == null) {
            [winner, newGameState] = takeTurn(newGameState, Action.BossAttack);
          }

          yield { gameState: newGameState, action, manaSpent, winner };
        } catch {
          // ignored
        }
      }
    },
    (a, b) => b.manaSpent - a.manaSpent,
    (state) => state.winner === Character.Player,
    (state) => state.gameState.boss.hitPoints,
  );
};

const part1 = () => {
  const initialState: State = {
    gameState: {
      turn: -1,
      boss: { ...bossStats },
      player: { hitPoints: 50, mana: 500, armor: 0 },
      effects: [],
    },
    manaSpent: 0,
    winner: null,
  };

  const path = solve(initialState);
  return path.at(-1)!.manaSpent;
};
console.log(part1());

const part2 = () => {
  const initialState: State = {
    gameState: {
      turn: -1,
      boss: { ...bossStats },
      player: { hitPoints: 50, mana: 500, armor: 0 },
      effects: [{
        id: "Hard",
        turns: Infinity,
        onTurnStart: (gameState) => {
          if (gameState.turn % 2 === 0) gameState.player.hitPoints--;
        },
      }],
    },
    manaSpent: 0,
    winner: null,
  };

  const path = solve(initialState);
  return path.at(-1)!.manaSpent;
};
console.log(part2());
