import { circularSlice } from "@utilities/2017/knotHash/circularSlice.ts";
import { circularSplice } from "@utilities/2017/knotHash/circularSplice.ts";
import { range } from "@utilities/range.ts";

export const knotHashRound = (lengths: Iterable<number>) => {
  const list = range(0, 255).toArray();

  let position = 0;
  let skipSize = 0;

  for (const length of lengths) {
    const reversedSection = circularSlice(list, position, length).toReversed();
    circularSplice(list, position, reversedSection);

    position = (position + length + skipSize) % list.length;
    skipSize++;
  }

  return list;
};
