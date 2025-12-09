import { chunk } from "@std/collections";
import { encodeHex } from "@std/encoding";
import { knotHashRound } from "@utilities/2017/knotHash/knotHashRound.ts";
import { identity } from "@utilities/identity.ts";
import { repeat } from "@utilities/repeat.ts";

export const knotHash = (input: string) => {
  const bytes = [...new TextEncoder().encode(input)];
  const lengths = [...bytes, 17, 31, 73, 47, 23];
  const sparseHash = knotHashRound(repeat(lengths, 64).flatMap(identity));
  const denseHash = chunk(sparseHash, 16).map((block) =>
    block.reduce((a, b) => a ^ b)
  );
  return encodeHex(new Uint8Array(denseHash));
};
