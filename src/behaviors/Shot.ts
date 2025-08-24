import { From, TheInformation, TheOwner } from "silentium";
import { Sync } from "./Sync";

/**
 * Helps to represent only last fresh value of some source, refreshing controls by shotSrc
 * https://silentium-lab.github.io/silentium-components/#/behaviors/shot
 */
export class Shot<T> extends TheInformation<T> {
  public constructor(
    private targetSrc: TheInformation<T>,
    private triggerSrc: TheInformation,
  ) {
    super(targetSrc, triggerSrc);
  }

  public value(o: TheOwner<T>): this {
    const targetSync = new Sync(this.targetSrc);
    targetSync.initOwner();

    this.triggerSrc.value(
      new From(() => {
        if (targetSync.valueExisted()) {
          o.give(targetSync.valueSync());
        }
      }),
    );

    return this;
  }
}
