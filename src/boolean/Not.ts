import { From, InformationType, OwnerType, TheInformation } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
export class Not extends TheInformation<boolean> {
  public constructor(private baseSrc: InformationType<boolean>) {
    super(baseSrc);
  }

  public value(o: OwnerType<boolean>): this {
    this.baseSrc.value(
      new From((v) => {
        o.give(!v);
      }),
    );
    return this;
  }
}
