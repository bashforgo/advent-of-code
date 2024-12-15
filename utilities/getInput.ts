import "@std/dotenv/load";

type Args = [year: number, day: number] | [day: number];
export const getInput = async (
  ...[yearOrDay, maybeDay]: Args
): Promise<string> => {
  const year = maybeDay == null ? new Date().getFullYear() : yearOrDay;
  const day = maybeDay == null ? yearOrDay : maybeDay;
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
