const compiledMachine = function* (input: number) {
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

type Suffix = number;
const possibleNextDigits = function* (
  prefixBits: number,
  expectedOutput: bigint[],
): Generator<Suffix> {
  for (const digit of octalDigits) {
    const input = (prefixBits * 8) + digit;
    const machine = compiledMachine(input);
    const matchesExpectedOutput = machine
      .every((output, i) => output === expectedOutput[i]);
    if (matchesExpectedOutput) yield digit;
  }
};

const _1 = possibleNextDigits(0, expectedOutput.slice(-1));

const _2 = _1.flatMap((prefix) =>
  possibleNextDigits(prefix, expectedOutput.slice(-2)).map((suffix) =>
    (prefix * 8) + suffix
  )
);

const _3 = _2.flatMap((prefix) =>
  possibleNextDigits(prefix, expectedOutput.slice(-3)).map((suffix) =>
    (prefix * 8) + suffix
  )
);

const _4 = _3.flatMap((prefix) =>
  possibleNextDigits(prefix, expectedOutput.slice(-4)).map((suffix) =>
    (prefix * 8) + suffix
  )
);

const _5 = _4.flatMap((prefix) =>
  possibleNextDigits(prefix, expectedOutput.slice(-5)).map((suffix) =>
    (prefix * 8) + suffix
  )
);

const _6 = _5.flatMap((prefix) =>
  possibleNextDigits(prefix, expectedOutput.slice(-6)).map((suffix) =>
    (prefix * 8) + suffix
  )
);

const _7 = _6.flatMap((prefix) =>
  possibleNextDigits(prefix, expectedOutput.slice(-7)).map((suffix) =>
    (prefix * 8) + suffix
  )
);

const _8 = _7.flatMap((prefix) =>
  possibleNextDigits(prefix, expectedOutput.slice(-8)).map((suffix) =>
    (prefix * 8) + suffix
  )
);

const _9 = _8.flatMap((prefix) =>
  possibleNextDigits(prefix, expectedOutput.slice(-9)).map((suffix) =>
    (prefix * 8) + suffix
  )
);

const _10 = _9.flatMap((prefix) =>
  possibleNextDigits(prefix, expectedOutput.slice(-10)).map((suffix) =>
    (prefix * 8) + suffix
  )
);

const _11 = _10.flatMap((prefix) =>
  possibleNextDigits(prefix, expectedOutput.slice(-11)).map((suffix) =>
    (prefix * 8) + suffix
  )
);

const _12 = _11.flatMap((prefix) =>
  possibleNextDigits(prefix, expectedOutput.slice(-12)).map((suffix) =>
    (prefix * 8) + suffix
  )
);

const _13 = _12.flatMap((prefix) =>
  possibleNextDigits(prefix, expectedOutput.slice(-13)).map((suffix) =>
    (prefix * 8) + suffix
  )
);

const _14 = _13.flatMap((prefix) =>
  possibleNextDigits(prefix, expectedOutput.slice(-14)).map((suffix) =>
    (prefix * 8) + suffix
  )
);

const _15 = _14.flatMap((prefix) =>
  possibleNextDigits(prefix, expectedOutput.slice(-15)).map((suffix) =>
    (prefix * 8) + suffix
  )
);

const _16 = _15.flatMap((prefix) =>
  possibleNextDigits(prefix, expectedOutput.slice(-16)).map((suffix) =>
    (prefix * 8) + suffix
  )
);

console.log(..._16.take(1));
