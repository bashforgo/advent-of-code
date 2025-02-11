import { assertEquals } from "@std/assert";
import { resolvesNext, stub } from "@std/testing/mock";
import {
  decrypt,
  deriveKey,
  encrypt,
  readEncryptedFile,
  writeEncryptedFile,
} from "@utilities/crypto.ts";

Deno.test("encrypt and decrypt", async () => {
  const password = crypto.randomUUID();
  const salt = crypto.randomUUID();

  const key = await deriveKey(salt, password);
  const plaintext = "Hello, World!";

  const { ciphertext, nonce } = await encrypt(plaintext, key);
  const decrypted = await decrypt(ciphertext, nonce, key);

  assertEquals(decrypted, plaintext);
});

Deno.test("write and read encrypted file", async () => {
  const writeTextFileStub = stub(Deno, "writeTextFile");

  const salt = crypto.randomUUID();
  const password = crypto.randomUUID();

  const plaintext = "Hello, World!";
  const path = "/tmp/test.json";

  await writeEncryptedFile(salt, password, plaintext, path);

  const contents = writeTextFileStub.calls[0].args[1] as string;
  stub(Deno, "readTextFile", resolvesNext([contents]));

  const decryptedPlaintext = await readEncryptedFile(salt, password, path);
  assertEquals(decryptedPlaintext, plaintext);
});
