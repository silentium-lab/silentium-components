import { All, EventType } from "silentium";

type UnInformation<T> = T extends EventType<infer U> ? U : never;

/**
 * Returns record Of data from record Of sources
 * https://silentium-lab.github.io/silentium-components/#/structures/record
 */
export const recordOf = <T extends EventType>(
  recordSrc: Record<string, T>,
): EventType<Record<string, UnInformation<T>>> => {
  return (u) => {
    const keys = Object.keys(recordSrc);
    All(...Object.values(recordSrc))((entries) => {
      const record: Record<string, Any> = {};
      entries.forEach((entry, index) => {
        record[keys[index]] = entry;
      });
      u(record);
    });
  };
};
