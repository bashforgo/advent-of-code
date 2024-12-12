export class ObjectSet<T> {
  readonly #map = new Map<string, T>();

  add(value: T) {
    this.#map.set(this.#getKey(value), value);
  }

  has(value: T) {
    return this.#map.has(this.#getKey(value));
  }

  get size() {
    return this.#map.size;
  }

  [Symbol.iterator] = this.#map.values.bind(this.#map);

  #getKey(value: T) {
    return JSON.stringify(value);
  }
}
