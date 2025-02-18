export class ObjectSet<T> {
  static from<T>(iterable: Iterable<T>) {
    const set = new ObjectSet<T>();
    for (const value of iterable) {
      set.add(value);
    }
    return set;
  }

  readonly #map = new Map<string, T>();

  add(value: T) {
    this.#map.set(this.#getKey(value), value);
  }

  has(value: T) {
    return this.#map.has(this.#getKey(value));
  }

  delete(value: T) {
    return this.#map.delete(this.#getKey(value));
  }

  get size() {
    return this.#map.size;
  }

  isEmpty() {
    return this.size === 0;
  }

  *values() {
    yield* this.#map.values();
  }

  *[Symbol.iterator]() {
    yield* this.values();
  }

  with(value: T) {
    if (this.has(value)) return this;

    const copy = ObjectSet.from(this);
    copy.add(value);
    return copy;
  }

  without(value: T) {
    if (!this.has(value)) return this;

    const copy = ObjectSet.from(this);
    copy.delete(value);
    return copy;
  }

  toJSON() {
    return Array.from(this.values());
  }

  #getKey(value: T) {
    return JSON.stringify(value);
  }
}
