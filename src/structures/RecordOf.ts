import { all, EventType } from "silentium";

type UnInformation<T> = T extends EventType<infer U> ? U : never;

/**
 * Returns record of data from record of sources
 * https://silentium-lab.github.io/silentium-components/#/structures/record
 */
export const recordOf = <T extends EventType>(
  recordSrc: Record<string, T>,
): EventType<Record<string, UnInformation<T>>> => {
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
