import "@std/dotenv";
import { fetchAdventOfCode } from "@utilities/fetchAdventOfCode.ts";

export const getInput = async (year: number, day: number): Promise<string> => {
  const response = await fetchAdventOfCode(`/${year}/day/${day}/input`);
  return await response.text();
};
