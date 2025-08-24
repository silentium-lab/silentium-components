import { From, TheInformation, TheOwner } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
export class Not extends TheInformation<boolean> {
  public constructor(private baseSrc: TheInformation<boolean>) {
    super(baseSrc);
  }

  public value(o: TheOwner<boolean>): this {
    this.baseSrc.value(
      new From((v) => {
        o.give(!v);
      }),
    );
    return this;
  }
}
