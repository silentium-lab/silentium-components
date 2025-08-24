import { All, From, TheInformation, TheOwner } from "silentium";

type UnInformation<T> = T extends TheInformation<infer U> ? U : never;

/**
 * Returns record of data from record of sources
 * https://silentium-lab.github.io/silentium-components/#/structures/record
 */
export class RecordOf<T extends TheInformation> extends TheInformation<
  Record<string, UnInformation<T>>
> {
  public constructor(private recordSrc: Record<string, T>) {
    super(...Object.values(recordSrc));
  }

  public value(o: TheOwner<Record<string, UnInformation<T>>>): this {
    const keys = Object.keys(this.recordSrc);
    new All(...Object.values(this.recordSrc)).value(
      new From((entries) => {
        const record: Record<string, any> = {};
        entries.forEach((entry, index) => {
          record[keys[index]] = entry;
        });
        o.give(record);
      }),
    );
    return this;
  }
}
