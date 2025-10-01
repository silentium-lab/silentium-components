import { all, DataType } from "silentium";

type UnInformation<T> = T extends DataType<infer U> ? U : never;

/**
 * Returns record of data from record of sources
 * https://silentium-lab.github.io/silentium-components/#/structures/record
 */
export const recordOf = <T extends DataType>(
  recordSrc: Record<string, T>,
): DataType<Record<string, UnInformation<T>>> => {
  return (u) => {
    const keys = Object.keys(recordSrc);
    all(...Object.values(recordSrc))((entries) => {
      const record: Record<string, any> = {};
      entries.forEach((entry, index) => {
        record[keys[index]] = entry;
      });
      u(record);
    });
  };
};
