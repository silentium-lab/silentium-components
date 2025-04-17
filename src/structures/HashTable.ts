import {
  GuestType,
  Patron,
  SourceObjectType,
  SourceType,
  SourceWithPool,
  value,
} from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/structures/hash-table
 */
export class HashTable implements SourceObjectType<Record<string, unknown>> {
  private source = new SourceWithPool<Record<string, unknown>>({});

  public constructor(baseSource: SourceType<[string, unknown]>) {
    value(
      baseSource,
      new Patron(([key, value]) => {
        this.source.value((lastRecord) => {
          lastRecord[key] = value;
        });
      }),
    );
  }

  public value(guest: GuestType<Record<string, unknown>>) {
    value(this.source, guest);
    return this;
  }
}
