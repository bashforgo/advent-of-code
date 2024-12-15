export const splitNumber = (
  num: number,
  afterDigit: number,
): [number, number] => {
  const divisor = Math.pow(10, afterDigit);
  const firstPart = Math.floor(num / divisor);
  const secondPart = num % divisor;
  return [firstPart, secondPart];
};
