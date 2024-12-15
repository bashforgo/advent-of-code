export const getNumberOfDigits = (num: number): number => {
  return Math.floor(Math.log10(num)) + 1;
};
