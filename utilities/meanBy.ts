import { sumOf } from "@std/collections";

export const meanBy = <T>(
  items: T[],
  selector: (item: T) => number,
) => sumOf(items, selector) / items.length;
