import { decodeBase64, encodeBase64 } from "@std/encoding";

export const readEncryptedFile = async (
  salt: string,
  plaintextKey: string,
  path: string,
): Promise<string> => {
  const contents = await Deno.readTextFile(path);
  const encryptedFileContents: EncryptedFileFormat = JSON.parse(contents);

  const key = await deriveKey(salt, plaintextKey);

  return await decrypt(
    decodeBase64(encryptedFileContents.ciphertext),
    decodeBase64(encryptedFileContents.nonce),
    key,
  );
};

export const writeEncryptedFile = async (
  salt: string,
  plaintextKey: string,
  plaintextContents: string,
  path: string,
): Promise<void> => {
  const key = await deriveKey(salt, plaintextKey);
  const { ciphertext, nonce } = await encrypt(plaintextContents, key);

  const encryptedFileContents = {
    ciphertext: encodeBase64(ciphertext),
    nonce: encodeBase64(nonce),
  } satisfies EncryptedFileFormat;

  await Deno.writeTextFile(
    path,
    JSON.stringify(encryptedFileContents, null, 2),
  );
};

export const deriveKey = async (salt: string, password: string) => {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: textEncoder.encode(salt),
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
};

export const encrypt = async (input: string, key: CryptoKey) => {
  const nonce = crypto.getRandomValues(new Uint8Array(96 / 8));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: nonce },
    key,
    textEncoder.encode(input),
  );
  return { ciphertext, nonce };
};

export const decrypt = async (
  ciphertext: ArrayBuffer,
  nonce: Uint8Array,
  key: CryptoKey,
) => {
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: nonce },
    key,
    ciphertext,
  );
  return textDecoder.decode(plaintext);
};

interface EncryptedFileFormat {
  ciphertext: string;
  nonce: string;
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
