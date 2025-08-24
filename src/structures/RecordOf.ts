import {
  All,
  From,
  InformationType,
  OwnerType,
  TheInformation,
} from "silentium";

type UnInformation<T> = T extends InformationType<infer U> ? U : never;

/**
 * Returns record of data from record of sources
 * https://silentium-lab.github.io/silentium-components/#/structures/record
 */
export class RecordOf<T extends InformationType> extends TheInformation<
  Record<string, UnInformation<T>>
> {
  public constructor(private recordSrc: Record<string, T>) {
    super(...Object.values(recordSrc));
  }

  public value(o: OwnerType<Record<string, UnInformation<T>>>): this {
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
