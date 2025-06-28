import { I, Information, O } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/structures/hash-table
 */
export const hashTable = (base: Information<[string, unknown]>) => {
  return I((o) => {
    const record: Record<string, unknown> = {};

    base.value(
      O(([key, value]) => {
        record[key] = value;
        o.give(record);
      }),
    );
  });
};
