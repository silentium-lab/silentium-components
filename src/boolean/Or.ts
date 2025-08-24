import { All, From, TheInformation, TheOwner } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/or
 */
export class Or extends TheInformation<boolean> {
  public constructor(
    private oneSrc: TheInformation<boolean>,
    private twoSrc: TheInformation<boolean>,
  ) {
    super(oneSrc, twoSrc);
  }

  public value(o: TheOwner<boolean>): this {
    new All(this.oneSrc, this.twoSrc).value(
      new From(([one, two]) => {
        o.give(one || two);
      }),
    );
    return this;
  }
}
