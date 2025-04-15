import {
  give,
  GuestCast,
  GuestObjectType,
  GuestType,
  Patron,
  PatronOnce,
  SourceAll,
  SourceObjectType,
  SourceType,
  SourceWithPool,
  value,
} from "silentium";

/**
 * Takes source and remember it first value
 * returns new record, what will contain only fields what was changed
 */
export class Dirty<T extends object>
  implements SourceObjectType<Partial<T>>, GuestObjectType<T>
{
  private comparingSource = new SourceWithPool<T>();
  private all = new SourceAll<{ comparing: T | null; base: T }>();

  public constructor(
    baseEntitySource: SourceType<T>,
    private alwaysKeep: string[] = [],
    private excludeKeys: string[] = [],
    becomePatronAuto = false,
  ) {
    this.comparingSource.value(new Patron(this.all.guestKey("comparing")));
    value(baseEntitySource, new Patron(this.all.guestKey("base")));

    if (becomePatronAuto) {
      value(baseEntitySource, new PatronOnce(this));
    }
  }

  public give(value: T): this {
    give(JSON.parse(JSON.stringify(value)), this.comparingSource);
    return this;
  }

  public value(guest: GuestType<Partial<T>>): unknown {
    this.all.value(
      new GuestCast(guest, ({ comparing, base }) => {
        if (!comparing) {
          return;
        }

        give(
          Object.fromEntries(
            Object.entries(comparing).filter(([key, value]) => {
              if (this.alwaysKeep.includes(key)) {
                return true;
              }
              if (this.excludeKeys.includes(key)) {
                return false;
              }
              return value !== (base as any)[key];
            }),
          ) as T,
          guest,
        );
      }),
    );

    return this;
  }
}
