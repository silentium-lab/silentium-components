import {
  All,
  From,
  InformationType,
  OwnerType,
  TheInformation,
} from "silentium";

/**
 * Ability to mutate some object, helpful when integrate to procedure systems
 * https://silentium-lab.github.io/silentium-components/#/system/set
 */
export class Set<T extends Record<string, unknown>> extends TheInformation<T> {
  public constructor(
    private baseSrc: InformationType<T>,
    private keySrc: InformationType<string>,
    private valueSrc: InformationType<unknown>,
  ) {
    super(baseSrc, keySrc, valueSrc);
  }

  public value(o: OwnerType<T>): this {
    new All(this.baseSrc, this.keySrc, this.valueSrc).value(
      new From(([base, key, value]) => {
        (base as Record<string, unknown>)[key] = value;
        o.give(base);
      }),
    );
    return this;
  }
}
