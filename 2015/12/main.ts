import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
[1,"red",5]
`
  : await getInput(2015, 12);

const walk = (obj: unknown, cb: (value: unknown) => boolean) => {
  if (!cb(obj)) return;

  if (typeof obj === "object") {
    if (Array.isArray(obj)) {
      for (const value of obj) {
        walk(value, cb);
      }
    } else if (obj != null) {
      for (const value of Object.values(obj)) {
        walk(value, cb);
      }
    }
  }
};

const part1 = () => {
  const obj = JSON.parse(input);
  let sum = 0;
  walk(obj, (value) => {
    if (typeof value === "number") {
      sum += value;
    }
    return true;
  });
  return sum;
};
console.log(part1());

const part2 = () => {
  const obj = JSON.parse(input);
  let sum = 0;
  walk(obj, (value) => {
    const shouldIgnore = typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      Object.values(value).includes("red");
    if (shouldIgnore) return false;

    if (typeof value === "number") {
      sum += value;
    }
    return true;
  });
  return sum;
};
console.log(part2());
