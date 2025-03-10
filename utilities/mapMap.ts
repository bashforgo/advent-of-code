export const mapMapEntries = <TKey, TValue, TMappedKey, TMappedValue>(
  map: Map<TKey, TValue>,
  mapper: (entry: [TKey, TValue]) => [TMappedKey, TMappedValue],
): Map<TMappedKey, TMappedValue> => {
  return new Map(map.entries().map(mapper));
};

export const mapMapValues = <TKey, TValue, TMappedValue>(
  map: Map<TKey, TValue>,
  mapper: (value: TValue, key: TKey) => TMappedValue,
): Map<TKey, TMappedValue> => {
  return mapMapEntries(map, ([key, value]) => [key, mapper(value, key)]);
};
