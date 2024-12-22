import { maxBy, slidingWindows, sumOf, unzip } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { ObjectMap } from "@utilities/ObjectMap.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
1
2
3
2024
`
  : await getInput(22);

const buyers = input.trim().split("\n").map(BigInt);

function* secretGenerator(initialSecret: bigint): Generator<bigint> {
  let secret = initialSecret;

  yield secret;

  while (true) {
    secret = mix(secret * 64n);
    secret = prune();

    secret = mix(secret / 32n);
    secret = prune();

    secret = mix(secret * 2048n);
    secret = prune();

    yield secret;
  }

  function mix(n: bigint) {
    return n ^ secret;
  }

  function prune() {
    return secret % 16777216n;
  }
}

console.log(
  sumOf(buyers, (b) => Number(secretGenerator(b).drop(2000).next().value)),
);

function* getPrices(
  initialSecret: bigint,
): Generator<[price: number, change: number]> {
  const getPrice = (secret: bigint) => Number(secret % 10n);

  const secrets = secretGenerator(initialSecret);

  let previousPrice: number | null = null;
  for (const secret of secrets) {
    const price = getPrice(secret);
    if (previousPrice != null) yield [price, price - previousPrice];
    previousPrice = price;
  }
}

const buyersPatternToPriceMap = buyers.map((b) => {
  const patternToPriceMap = new ObjectMap<number[], number>();
  const prices = Array.from(getPrices(b).take(2000));
  for (const pattern of slidingWindows(prices, 4)) {
    const [pricePattern, changePattern] = unzip(pattern);
    if (patternToPriceMap.has(changePattern)) continue;
    patternToPriceMap.set(changePattern, pricePattern.at(-1)!);
  }
  return patternToPriceMap;
});

const allPriceChangePatterns = ObjectSet.from(
  Iterator.from(buyersPatternToPriceMap).flatMap((m) => m.keys()),
);

const sellsByPattern = new ObjectMap<number[], number>();
for (const pattern of allPriceChangePatterns) {
  sellsByPattern.set(
    pattern,
    sumOf(buyersPatternToPriceMap, (m) => m.get(pattern) ?? 0),
  );
}
console.log(sellsByPattern);

const [bestPattern, sells] = maxBy(sellsByPattern, ([, sells]) => sells)!;
console.log(bestPattern, sells);
