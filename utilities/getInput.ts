export const getInput = async (day: number): Promise<string> => {
  const response = await fetch(
    `https://adventofcode.com/2024/day/${day}/input`,
    {
      headers: {
        cookie: `session=${Deno.env.get("ADVENT_OF_CODE_SESSION")}`,
      },
    },
  );
  return await response.text();
};
