import { All, EventType } from "silentium";

type UnInformation<T> = T extends EventType<infer U> ? U : never;

/**
 * Returns record Of data from record Of sources
 * https://silentium-lab.github.io/silentium-components/#/structures/record
 */
export function RecordOf<T extends EventType>(
  recordSrc: Record<string, T>,
): EventType<Record<string, UnInformation<T>>> {
  return (user) => {
    const keys = Object.keys(recordSrc);
    All(...Object.values(recordSrc))((entries) => {
      const record: Record<string, any> = {};
      entries.forEach((entry, index) => {
        record[keys[index]] = entry;
      });
      user(record);
    });
  };
}
