import "@std/dotenv/load";

export const getInput = async (year: number, day: number): Promise<string> => {
  const response = await fetch(
    `https://adventofcode.com/${year}/day/${day}/input`,
    {
      headers: {
        cookie: `session=${Deno.env.get("ADVENT_OF_CODE_SESSION")}`,
      },
    },
  );
  return await response.text();
};
