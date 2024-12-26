import { ADVENT_OF_CODE_SESSION, BASE_URL } from "@utilities/config.ts";

export const fetchAdventOfCode = async (relativeUrl: string) =>
  await fetch(`${BASE_URL}${relativeUrl}`, {
    headers: {
      cookie: `session=${ADVENT_OF_CODE_SESSION}`,
    },
  });
