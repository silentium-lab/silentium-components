import { From, TheInformation, TheOwner } from "silentium";

/**
 * Represents source what was changed at least once
 * https://silentium-lab.github.io/silentium-components/#/behaviors/only-changed
 */
export class OnlyChanged<T> extends TheInformation<T> {
  public constructor(private baseSrc: TheInformation<T>) {
    super(baseSrc);
  }

  public value(o: TheOwner<T>): this {
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
