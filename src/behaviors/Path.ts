import {
  give,
  GuestCast,
  GuestType,
  SourceAll,
  SourceObjectType,
  SourceType,
  value,
} from "silentium";

export class Path<T extends Record<string, unknown>, K extends string>
  implements SourceObjectType<T[K]>
{
  public constructor(
    private baseSource: SourceType<T>,
    private keyType: SourceType<K>,
  ) {}

  public value(guest: GuestType<T[K]>) {
    const all = new SourceAll<{ base: T; key: K }>(["base", "key"]);
    value(this.baseSource, new GuestCast(guest, all.guestKey("base")));
    value(this.keyType, new GuestCast(guest, all.guestKey("key")));
    all.value(
      new GuestCast(guest, ({ base, key }) => {
        const keyChunks = key.split(".");
        let value: unknown = base;
        keyChunks.forEach((keyChunk) => {
          value = (value as T)[keyChunk];
        });

        if (value !== undefined && value !== base) {
          give(value as T[K], guest);
        }
      }),
    );
    return this;
  }
}
