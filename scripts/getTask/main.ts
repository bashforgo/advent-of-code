/// <reference lib="dom" />

import { DOMParser } from "@b-fuze/deno-dom";
import { ensureDir } from "@std/fs";
import { dirname } from "@std/path";
import { fetchAdventOfCode } from "@utilities/fetchAdventOfCode.ts";
import { TurndownService } from "@utilities/turndown.ts";

const [year, day] = Deno.args;
if (year == null || day == null) {
  const message = `\
Usage:
  $ getTask <year> <day>
`;
  throw new Error(message);
}

const turndownService = new TurndownService({ codeBlockStyle: "fenced" });
turndownService.keep((node) => node.hasAttribute("title"));

const taskResponse = await fetchAdventOfCode(`/${year}/day/${day}`);
const taskHtml = await taskResponse.text();

const taskDocument = new DOMParser().parseFromString(taskHtml, "text/html");
const articles = taskDocument.querySelectorAll("article");
const articlesHtml = Array.from(articles)
  .map((article) => article.outerHTML)
  .join("\n");

const taskMarkdown = turndownService.turndown(articlesHtml);

const dayWithLeadingZero = day.padStart(2, "0");
const path = `./${year}/${dayWithLeadingZero}/task.md`;
await ensureDir(dirname(path));
await Deno.writeTextFile(path, taskMarkdown);

console.log(path);
