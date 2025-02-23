export const circularSlice = (
  list: number[],
  start: number,
  length: number,
) => {
  if (start + length <= list.length) return list.slice(start, start + length);

  const endSlice = list.slice(start);
  const startSlice = list.slice(0, length - endSlice.length);
  return [...endSlice, ...startSlice];
};
