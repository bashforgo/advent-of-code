import { range } from "@utilities/range.ts";

export function* repeat<T>(value: T, times: number): Generator<T> {
  for (const _ of range(1, times)) {
    yield value;
  }
}
