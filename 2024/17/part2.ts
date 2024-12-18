const machine = function* (input: number) {
  let A = BigInt(input);
  let B = BigInt(0);
  let C = BigInt(0);

  do {
    B = A % 8n;
    B = B ^ 7n;
    C = A >> B;
    A = A >> 3n;
    B = B ^ 7n;
    B = B ^ C;
    yield B % 8n;
  } while (A !== 0n);
};

const expectedOutput = [2, 4, 1, 7, 7, 5, 0, 3, 1, 7, 4, 1, 5, 5, 3, 0].map(
  BigInt,
);

const octalDigits = [0, 1, 2, 3, 4, 5, 6, 7];

const possibleNextDigit = function* (
  prefixBits: number,
  expectedOutput: bigint[],
) {
  for (const digit of octalDigits) {
    const input = (prefixBits * 8) + digit;
    const outputs = machine(input);
    const matchesExpectedOutput = outputs
      .every((output, i) => output === expectedOutput[i]);
    if (matchesExpectedOutput) yield digit;
  }
};

function* possiblePrefixes(expectedOutput: bigint[]): Generator<number> {
  if (expectedOutput.length === 1) {
    yield* possibleNextDigit(0, expectedOutput);
  } else {
    for (const prefix of possiblePrefixes(expectedOutput.slice(1))) {
      for (const suffix of possibleNextDigit(prefix, expectedOutput)) {
        yield (prefix * 8) + suffix;
      }
    }
  }
}

console.log(...possiblePrefixes(expectedOutput));
