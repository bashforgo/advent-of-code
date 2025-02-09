import { DOMParser } from "@b-fuze/deno-dom";
import { fetchAdventOfCode } from "@utilities/fetchAdventOfCode.ts";
import { TurndownService } from "@utilities/turndown.ts";

const [year, day, level, answer] = Deno.args;
if (year == null || day == null || level == null || answer == null) {
  const message = `\
Usage:
  $ submit <year> <day> <level> <answer>
`;
  throw new Error(message);
}

const turndownService = new TurndownService({ codeBlockStyle: "fenced" });

const taskResponse = await fetchAdventOfCode(
  `/${year}/day/${day}/answer`,
  (r) => {
    r.method = "POST";
    r.headers.set("Content-Type", "application/x-www-form-urlencoded");
    r.body = new URLSearchParams({ level, answer });
  },
);
const taskHtml = await taskResponse.text();

const taskDocument = new DOMParser().parseFromString(taskHtml, "text/html");
const articles = taskDocument.querySelectorAll("article");
const articlesHtml = Array.from(articles)
  .map((article) => article.outerHTML)
  .join("\n");

const taskMarkdown = turndownService.turndown(articlesHtml);

console.log(taskMarkdown);
