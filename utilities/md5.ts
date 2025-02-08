import { crypto } from "@std/crypto";
import { encodeHex } from "@std/encoding";

export const md5 = (input: string) => {
  const buffer = new TextEncoder().encode(input);
  const resultBuffer = crypto.subtle.digestSync("MD5", buffer);
  return encodeHex(resultBuffer);
};
