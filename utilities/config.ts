import "@std/dotenv/load";
import { throw_ } from "@utilities/throw.ts";

export const BASE_URL = "https://adventofcode.com";
export const ADVENT_OF_CODE_SESSION = Deno.env.get("ADVENT_OF_CODE_SESSION") ??
  throw_("ADVENT_OF_CODE_SESSION is not defined");
