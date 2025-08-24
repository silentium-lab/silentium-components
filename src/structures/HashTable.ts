import { From, InformationType, OwnerType, TheInformation } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/structures/hash-table
 */
export class HashTable<T> extends TheInformation<T> {
  public constructor(private baseSrc: InformationType<[string, unknown]>) {
    super(baseSrc);
  }

  public value(o: OwnerType<T>): this {
    const record: Record<string, unknown> = {};

    this.baseSrc.value(
      new From(([key, value]) => {
        record[key] = value;
        o.give(record as T);
      }),
    );

    return this;
  }
}
