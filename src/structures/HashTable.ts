import { EventType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/structures/hash-table
 */
export function HashTable<T>(
  baseSrc: EventType<[string, unknown]>,
): EventType<T> {
  return (user) => {
    const record: Record<string, unknown> = {};

    baseSrc(([key, value]) => {
      record[key] = value;
      user(record as T);
    });
  };
}
