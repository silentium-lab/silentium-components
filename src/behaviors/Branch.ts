import { From, InformationType, OwnerType, TheInformation } from "silentium";
import { Sync } from "./Sync";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
export class Branch<Then, Else> extends TheInformation<Then | Else> {
  public constructor(
    private conditionSrc: InformationType<boolean>,
    private leftSrc: InformationType<Then>,
    private rightSrc?: InformationType<Else>,
  ) {
    super([conditionSrc, leftSrc, rightSrc]);
  }
  public value(o: OwnerType<Then | Else>): this {
    const leftSync = new Sync(this.leftSrc).initOwner();
    let rightSync: Sync<Else>;

    if (this.rightSrc !== undefined) {
      rightSync = new Sync(this.rightSrc).initOwner();
    }

    this.conditionSrc.value(
      new From((v) => {
        if (v) {
          o.give(leftSync.valueSync());
        } else if (rightSync) {
          o.give(rightSync.valueSync());
        }
      }),
    );

    return this;
  }
}
