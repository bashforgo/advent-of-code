import { dirname } from "@std/path";
import { ENCRYPTION_KEY, SALT } from "@utilities/config.ts";
import { readEncryptedFile, writeEncryptedFile } from "@utilities/crypto.ts";
import { fetchAdventOfCode } from "@utilities/fetchAdventOfCode.ts";

export const getInput = async (year: number, day: number): Promise<string> => {
  try {
    return await readCache(year, day);
  } catch {
    // ignored
  }

  const input = await fetchInput(year, day);

  try {
    await writeCache(year, day, input);
  } catch (e) {
    console.error(`Failed to write cache`, e);
  }

  return input;
};

const fetchInput = async (year: number, day: number) => {
  const response = await fetchAdventOfCode(`/${year}/day/${day}/input`);
  return await response.text();
};

const getCachePath = (year: number, day: number) => {
  const zeroPaddedDay = String(day).padStart(2, "0");
  return `./.cache/${year}-${zeroPaddedDay}.json`;
};

const readCache = async (year: number, day: number) => {
  return await readEncryptedFile(
    SALT,
    ENCRYPTION_KEY,
    getCachePath(year, day),
  );
};

const writeCache = async (year: number, day: number, input: string) => {
  await Deno.mkdir(dirname(getCachePath(year, day)), { recursive: true });
  await writeEncryptedFile(
    SALT,
    ENCRYPTION_KEY,
    input,
    getCachePath(year, day),
  );
};
