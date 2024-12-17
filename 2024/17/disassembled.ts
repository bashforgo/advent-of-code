let A = BigInt(Deno.args[0]) || 0n;
let B = 0n;
let C = 0n;

do {
  B = A % 8n;
  B = B ^ 7n;
  C = A >> B;
  A = A >> 3n;
  B = B ^ 7n;
  B = B ^ C;
  console.log(B % 8n);
} while (A !== 0n);
