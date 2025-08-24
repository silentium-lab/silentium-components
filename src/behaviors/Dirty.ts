import {
  All,
  Applied,
  From,
  InformationType,
  Late,
  OwnerType,
  TheInformation,
} from "silentium";

/**
 * Takes source and remember it first value
 * returns new record, what will contain only fields what was changed
 * https://silentium-lab.github.io/silentium-components/#/behaviors/dirty
 */
export class Dirty<T> extends TheInformation<T> {
  private comparingSrc = new Late<T>();

  public constructor(
    private baseEntitySource: InformationType<T>,
    private alwaysKeep: string[] = [],
    private excludeKeys: string[] = [],
  ) {
    super([baseEntitySource]);
  }

  public value(o: OwnerType<T>): this {
    const comparingDetached = new Applied(this.comparingSrc, (value) =>
      JSON.parse(JSON.stringify(value)),
    );

    const allSrc = new All(comparingDetached, this.baseEntitySource).value(
      new From(([comparing, base]) => {
        if (!comparing) {
          return;
        }

        o.give(
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
        );
      }),
    );
    this.addDep(allSrc);

    return this;
  }

  public owner() {
    return this.comparingSrc.owner();
  }
}
