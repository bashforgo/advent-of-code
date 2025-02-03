import { maxOf, sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3
`
  : await getInput(2015, 15);

const lines = input.trim().split("\n");
const ingredients = new Map(lines.map((line) => {
  const [, name, capacity, durability, flavor, texture, calories] = line.match(
    /(\w+): capacity (-?\d+), durability (-?\d+), flavor (-?\d+), texture (-?\d+), calories (-?\d+)/,
  )!;
  return [name, {
    name,
    capacity: Number(capacity),
    durability: Number(durability),
    flavor: Number(flavor),
    texture: Number(texture),
    calories: Number(calories),
  }];
}));

const calculateScore = (recipe: Map<string, number>) => {
  const capacityScore = sumOf(
    recipe,
    ([name, amount]) => amount * ingredients.get(name)!.capacity,
  );
  const durabilityScore = sumOf(
    recipe,
    ([name, amount]) => amount * ingredients.get(name)!.durability,
  );
  const flavorScore = sumOf(
    recipe,
    ([name, amount]) => amount * ingredients.get(name)!.flavor,
  );
  const textureScore = sumOf(
    recipe,
    ([name, amount]) => amount * ingredients.get(name)!.texture,
  );
  return Math.max(0, capacityScore) *
    Math.max(0, durabilityScore) *
    Math.max(0, flavorScore) *
    Math.max(0, textureScore);
};

const calculateCalories = (recipe: Map<string, number>) => {
  return sumOf(
    recipe,
    ([name, amount]) => amount * ingredients.get(name)!.calories,
  );
};

function* weakCompositionsOfLength(
  x: number,
  length: number,
): Generator<number[]> {
  if (length === 1) {
    yield [x];
    return;
  }

  for (let i = 0; i <= x; i++) {
    const recursive = weakCompositionsOfLength(x - i, length - 1);
    for (const rest of recursive) {
      yield [i, ...rest];
    }
  }
}

const part1 = () => {
  const allRecipes = weakCompositionsOfLength(100, ingredients.size)
    .map((amounts) =>
      new Map(ingredients.keys().map((name, i) => [name, amounts[i]]))
    );
  return maxOf(allRecipes, (r) => calculateScore(r));
};
console.log(part1());

const part2 = () => {
  const allRecipes = weakCompositionsOfLength(100, ingredients.size)
    .map((amounts) =>
      new Map(ingredients.keys().map((name, i) => [name, amounts[i]]))
    )
    .filter((r) => calculateCalories(r) === 500);
  return maxOf(allRecipes, (r) => calculateScore(r));
};
console.log(part2());
