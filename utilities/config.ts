import "@std/dotenv/load";
import { throw_ } from "@utilities/throw.ts";

export const BASE_URL = "https://adventofcode.com";
export const ADVENT_OF_CODE_SESSION = Deno.env.get("ADVENT_OF_CODE_SESSION") ??
  throw_("ADVENT_OF_CODE_SESSION is not defined");
export const SALT = Deno.env.get("SALT") ?? throw_("SALT is not defined");
export const ENCRYPTION_KEY = Deno.env.get("ENCRYPTION_KEY") ??
  throw_("ENCRYPTION_KEY is not defined");
