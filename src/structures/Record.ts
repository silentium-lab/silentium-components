import { all, I, Information, O } from "silentium";

/**
 * Returns record of data from record of sources
 * https://silentium-lab.github.io/silentium-components/#/structures/record
 */
export const record = (recordSrc: Record<string, Information>) => {
  return I((o) => {
    const keys = Object.keys(recordSrc);
    all(...Object.values(recordSrc)).value(
      O((entries) => {
        const record: Record<string, any> = {};
        entries.forEach((entry, index) => {
          record[keys[index]] = entry;
        });
        o.give(record);
      }),
    );
  });
};
