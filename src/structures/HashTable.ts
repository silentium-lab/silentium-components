import { patron, sourceOf, SourceType, subSource, value } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/structures/hash-table
 */
export const hashTable = (baseSource: SourceType<[string, unknown]>) => {
  const result = sourceOf<Record<string, unknown>>({});
  subSource(result, baseSource);

  value(
    baseSource,
    patron(([key, value]) => {
      result.value((lastRecord) => {
        lastRecord[key] = value;
      });
    }),
  );

  return result.value;
};
