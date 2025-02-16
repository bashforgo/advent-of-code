import "@std/dotenv";
import { dirname } from "@std/path";
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
  } catch (error) {
    console.error("Failed to write cache:", error);
  }

  return input;
};

const fetchInput = async (year: number, day: number) => {
  const response = await fetchAdventOfCode(`/${year}/day/${day}/input`);
  if (!response.ok) {
    throw new Error(`Failed to fetch input: ${response.status}`, {
      cause: await response.text(),
    });
  }
  return await response.text();
};

const getCachePath = (year: number, day: number): string => {
  const zeroPaddedDay = String(day).padStart(2, "0");
  return `.cache/${year}-${zeroPaddedDay}.txt`;
};

const readCache = async (year: number, day: number) => {
  return await Deno.readTextFile(getCachePath(year, day));
};

const writeCache = async (year: number, day: number, input: string) => {
  const path = getCachePath(year, day);
  await Deno.mkdir(dirname(path), { recursive: true });
  await Deno.writeTextFile(path, input);
};
