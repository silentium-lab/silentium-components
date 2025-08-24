import { From, TheInformation, TheOwner } from "silentium";
import { Sync } from "./Sync";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
export class Branch<Then, Else> extends TheInformation<Then | Else> {
  public constructor(
    private conditionSrc: TheInformation<boolean>,
    private leftSrc: TheInformation<Then>,
    private rightSrc?: TheInformation<Else>,
  ) {
    super([conditionSrc, leftSrc, rightSrc]);
  }
  public value(o: TheOwner<Then | Else>): this {
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
