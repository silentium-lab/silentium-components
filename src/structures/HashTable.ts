import { DataType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/structures/hash-table
 */
export const hashTable = <T>(
  baseSrc: DataType<[string, unknown]>,
): DataType<T> => {
  return (u) => {
    const record: Record<string, unknown> = {};

    baseSrc(([key, value]) => {
      record[key] = value;
      u(record as T);
    });
  };
};
