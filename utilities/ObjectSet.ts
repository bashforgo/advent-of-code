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

    const clone = this.clone();
    clone.add(value);
    return clone;
  }

  without(value: T) {
    if (!this.has(value)) return this;

    const clone = this.clone();
    clone.delete(value);
    return clone;
  }

  clone() {
    const clone = new ObjectSet<T>();
    for (const [key, value] of this.#map) {
      clone.#map.set(key, value);
    }
    return clone;
  }

  union<U>(other: ObjectSet<U>): ObjectSet<T | U> {
    const [smaller, larger] = this.size < other.size
      ? [this, other]
      : [other, this];

    if (smaller.isEmpty()) return larger;

    const clone = larger.clone() as ObjectSet<T | U>;
    for (const [key, value] of smaller.#map) {
      clone.#map.set(key, value);
    }
    return clone;
  }

  toJSON() {
    return Array.from(this.values());
  }

  #getKey(value: T) {
    return JSON.stringify(value);
  }
}
