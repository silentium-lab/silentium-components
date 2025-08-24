import { From, InformationType, OwnerType, TheInformation } from "silentium";

/**
 * Represents source what was changed at least once
 * https://silentium-lab.github.io/silentium-components/#/behaviors/only-changed
 */
export class OnlyChanged<T> extends TheInformation<T> {
  public constructor(private baseSrc: InformationType<T>) {
    super(baseSrc);
  }

  public value(o: OwnerType<T>): this {
    let firstValue = false;

    this.baseSrc.value(
      new From((v) => {
        if (firstValue === false) {
          firstValue = true;
        } else {
          o.give(v);
        }
      }),
    );

    return this;
  }
}
