export class ObjectMap<TKey, TValue> {
  static from<T, U>(iterable: Iterable<readonly [T, U]>) {
    const map = new ObjectMap<T, U>();
    for (const [key, value] of iterable) {
      map.set(key, value);
    }
    return map;
  }

  static groupBy<T, U>(
    iterable: Iterable<T>,
    keySelector: (value: T) => U,
  ): ObjectMap<U, T[]> {
    const map = new ObjectMap<U, T[]>();
    for (const value of iterable) {
      const key = keySelector(value);
      const group = map.get(key) ?? [];
      group.push(value);
      map.set(key, group);
    }
    return map;
  }

  readonly #map = new Map<string, [TKey, TValue]>();

  set(key: TKey, value: TValue) {
    this.#map.set(this.#getKey(key), [key, value]);
  }

  has(key: TKey) {
    return this.#map.has(this.#getKey(key));
  }

  get(key: TKey) {
    return this.#map.get(this.#getKey(key))?.[1];
  }

  delete(key: TKey) {
    return this.#map.delete(this.#getKey(key));
  }

  get size() {
    return this.#map.size;
  }

  *keys() {
    for (const [, [key]] of this.#map) {
      yield key;
    }
  }

  *values() {
    for (const [, [, value]] of this.#map) {
      yield value;
    }
  }

  *entries() {
    for (const [, entry] of this.#map) {
      yield entry;
    }
  }

  *[Symbol.iterator]() {
    yield* this.entries();
  }

  #getKey(value: TKey) {
    return JSON.stringify(value);
  }
}
