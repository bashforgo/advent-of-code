import { ADVENT_OF_CODE_SESSION, BASE_URL } from "@utilities/config.ts";

type RequestInitWithHeaders = RequestInit & { headers: Headers };
export const fetchAdventOfCode = async (
  relativeUrl: string,
  customize?: (r: RequestInitWithHeaders) => void,
) => {
  const requestInit = {
    headers: new Headers({
      cookie: `session=${ADVENT_OF_CODE_SESSION}`,
    }),
  } satisfies RequestInitWithHeaders;
  customize?.(requestInit);

  return await fetch(`${BASE_URL}${relativeUrl}`, requestInit);
};
