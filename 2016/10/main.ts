import { unreachable } from "@std/assert/unreachable";
import { associateBy } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { identity } from "@utilities/identity.ts";
import { productOf } from "@utilities/productOf.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
value 5 goes to bot 2
bot 2 gives low to bot 1 and high to bot 0
value 3 goes to bot 1
bot 1 gives low to output 1 and high to bot 0
bot 0 gives low to output 2 and high to output 0
value 2 goes to bot 2
`
  : await getInput(2016, 10);

const lines = input.trim().split("\n");

enum InstructionType {
  Input = "Input",
  Give = "Give",
}

enum GiveTargetType {
  Bot = "Bot",
  Output = "Output",
}

type GiveTarget =
  | { type: GiveTargetType.Bot; bot: number }
  | { type: GiveTargetType.Output; output: number };

interface InputInstruction {
  type: InstructionType.Input;
  value: number;
  bot: number;
}

interface GiveInstruction {
  type: InstructionType.Give;
  bot: number;
  low: GiveTarget;
  high: GiveTarget;
}

type Instruction =
  | InputInstruction
  | GiveInstruction;

const instructions = lines.map((line): Instruction => {
  const inputMatch = line.match(
    /value (?<value>\d+) goes to bot (?<bot>\d+)/,
  );
  if (inputMatch != null) {
    const { value, bot } = inputMatch.groups!;
    return {
      type: InstructionType.Input,
      value: Number(value),
      bot: Number(bot),
    };
  }

  const giveMatch = line.match(
    /bot (?<bot>\d+) gives low to (?<lowType>bot|output) (?<lowValue>\d+) and high to (?<highType>bot|output) (?<highValue>\d+)/,
  );
  if (giveMatch != null) {
    const { bot, lowType, lowValue, highType, highValue } = giveMatch.groups!;
    return {
      type: InstructionType.Give,
      bot: Number(bot),
      low: lowType === "bot"
        ? { type: GiveTargetType.Bot, bot: Number(lowValue) }
        : { type: GiveTargetType.Output, output: Number(lowValue) },
      high: highType === "bot"
        ? { type: GiveTargetType.Bot, bot: Number(highValue) }
        : { type: GiveTargetType.Output, output: Number(highValue) },
    };
  }

  unreachable();
});

const run = () => {
  const bots = new Map<number, number>();
  const botLog = new Map<
    number,
    { instruction: GiveInstruction; values: [number, number] }[]
  >();
  const outputs = new Map<number, number[]>();

  const giveInstructions = instructions.filter((i) =>
    i.type === InstructionType.Give
  );
  const giveInstructionsByBot = associateBy(
    giveInstructions,
    (instruction) => String(instruction.bot),
  );

  const inputInstructions = instructions.filter((i) =>
    i.type === InstructionType.Input
  );
  for (const { value, bot } of inputInstructions) {
    giveToBot(bot, value);
  }

  return { bots, botLog, outputs };

  function give(target: GiveTarget, value: number) {
    switch (target.type) {
      case GiveTargetType.Bot: {
        const { bot } = target;
        giveToBot(bot, value);
        break;
      }
      case GiveTargetType.Output: {
        const { output } = target;
        giveToOutput(output, value);
        break;
      }
    }
  }

  function giveToBot(bot: number, value: number) {
    const heldValue = bots.get(bot);

    if (heldValue == null) {
      bots.set(bot, value);
      return;
    }

    bots.delete(bot);

    const low = Math.min(heldValue, value);
    const high = Math.max(heldValue, value);

    const giveInstruction = giveInstructionsByBot[bot];
    give(giveInstruction.low, low);
    give(giveInstruction.high, high);

    const log = botLog.get(bot) ?? [];
    botLog.set(bot, [...log, {
      instruction: giveInstruction,
      values: [low, high],
    }]);
  }

  function giveToOutput(output: number, value: number) {
    const outputValues = outputs.get(output) ?? [];
    outputs.set(output, [...outputValues, value]);
  }
};

const part1 = () => {
  const { botLog } = run();
  const predicate = DEBUG
    ? (low: number, high: number) => low === 2 && high === 3
    : (low: number, high: number) => low === 17 && high === 61;
  const [targetBot] = botLog.entries()
    .find(([_, log]) => log.some(({ values: [l, h] }) => predicate(l, h)))!;
  return targetBot;
};
console.log(part1());

const part2 = () => {
  const { outputs } = run();
  return productOf([
    ...outputs.get(0)!,
    ...outputs.get(1)!,
    ...outputs.get(2)!,
  ], identity);
};
console.log(part2());
