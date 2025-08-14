import { all, InformationType } from "silentium";

type UnInformation<T> = T extends InformationType<infer U> ? U : never;

/**
 * Returns record of data from record of sources
 * https://silentium-lab.github.io/silentium-components/#/structures/record
 */
export const record = <T extends InformationType>(
  recordSrc: Record<string, T>,
): InformationType<Record<string, UnInformation<T>>> => {
  return (o) => {
    const keys = Object.keys(recordSrc);
    all(...Object.values(recordSrc))((entries) => {
      const record: Record<string, any> = {};
      entries.forEach((entry, index) => {
        record[keys[index]] = entry;
      });
      o(record);
    });
  };
};
