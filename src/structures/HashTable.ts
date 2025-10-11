import { EventType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/structures/hash-table
 */
export const hashTable = <T>(
  baseSrc: EventType<[string, unknown]>,
): EventType<T> => {
  return (u) => {
    const record: Record<string, unknown> = {};

    baseSrc(([key, value]) => {
      record[key] = value;
      u(record as T);
    });
  };
};
