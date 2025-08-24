import {
  All,
  From,
  InformationType,
  OwnerType,
  TheInformation,
} from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/or
 */
export class Or extends TheInformation<boolean> {
  public constructor(
    private oneSrc: InformationType<boolean>,
    private twoSrc: InformationType<boolean>,
  ) {
    super(oneSrc, twoSrc);
  }

  public value(o: OwnerType<boolean>): this {
    new All(this.oneSrc, this.twoSrc).value(
      new From(([one, two]) => {
        o.give(one || two);
      }),
    );
    return this;
  }
}
