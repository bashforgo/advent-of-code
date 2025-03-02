import { sumOf } from "@std/collections";
import { meanBy } from "@utilities/meanBy.ts";

export const varianceBy = <T>(
  items: T[],
  selector: (item: T) => number,
  {
    mean = meanBy(items, selector),
  } = {},
) => sumOf(items, (item) => (selector(item) - mean) ** 2) / items.length;
