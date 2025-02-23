export const circularSplice = (
  list: number[],
  start: number,
  replacement: number[],
) => {
  const length = replacement.length;

  if (start + length <= list.length) {
    list.splice(start, length, ...replacement);
    return;
  }

  list.splice(
    start,
    list.length - start,
    ...replacement.slice(0, list.length - start),
  );
  list.splice(
    0,
    length - list.length + start,
    ...replacement.slice(list.length - start),
  );
};
