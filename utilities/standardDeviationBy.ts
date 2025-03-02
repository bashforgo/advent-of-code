import { meanBy } from "@utilities/meanBy.ts";
import { varianceBy } from "@utilities/varianceBy.ts";

export const standardDeviationBy = <T>(
  items: T[],
  selector: (item: T) => number,
  {
    mean = meanBy(items, selector),
    variance = varianceBy(items, selector, { mean }),
  } = {},
) => Math.sqrt(variance);
