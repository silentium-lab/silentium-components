import { give, GuestType, sourceCombined, SourceType } from "silentium";

/**
 * Returns record of data from record of sources
 * https://silentium-lab.github.io/silentium-components/#/structures/record
 */
export const record = (recordSrc: Record<string, SourceType>) => {
  const keys = Object.keys(recordSrc);
  return sourceCombined(...Object.values(recordSrc))(
    (g: GuestType<Record<string, any>>, ...entries: any[]) => {
      const record: Record<string, any> = {};
      entries.forEach((entry, index) => {
        record[keys[index]] = entry;
      });
      give(record, g);
    },
  );
};
