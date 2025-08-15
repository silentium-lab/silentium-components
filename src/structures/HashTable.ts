import { InformationType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/structures/hash-table
 */
export const hashTable = <T>(
  base: InformationType<[string, unknown]>,
): InformationType<T> => {
  return (o) => {
    const record: Record<string, unknown> = {};

    base(([key, value]) => {
      record[key] = value;
      o(record as T);
    });
  };
};
