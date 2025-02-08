import { randomIntegerBetween } from "@std/random";

const getBenchData = () => {
  const right = randomIntegerBetween(1, 99_999_999_999);
  const rightLength = Math.floor(Math.log10(right)) + 1;
  const left = randomIntegerBetween(0, 1) === 1
    ? Number(String(right).slice(-1 * randomIntegerBetween(1, rightLength)))
    : randomIntegerBetween(1, 99_999_999_999);
  return { left, right };
};

Deno.bench("string concatenate reversal", (b) => {
  const { left, right } = getBenchData();

  b.start();
  for (let i = 0; i < 1_000_000; i++) {
    const leftString = String(left);
    const rightString = String(right);
    const _result = leftString.endsWith(rightString)
      ? Number(leftString.slice(0, -rightString.length))
      : NaN;
  }
  b.end();
});

Deno.bench("math concatenate reversal", (b) => {
  const { left, right } = getBenchData();

  b.start();
  for (let i = 0; i < 1_000_000; i++) {
    const rightLength = Math.floor(Math.log10(right)) + 1;
    const divisor = Math.pow(10, rightLength);
    const _result = left % divisor === right ? Math.floor(left / divisor) : NaN;
  }
  b.end();
});
