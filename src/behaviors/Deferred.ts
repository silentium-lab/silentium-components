import { From, isFilled, TheInformation, TheOwner } from "silentium";
import { Sync } from "./Sync";

/**
 * Defer one source after another, gives values of baseSrc only once when triggerSrc responds
 * https://silentium-lab.github.io/silentium-components/#/behaviors/deferred
 */
export class Deferred<T> extends TheInformation<T> {
  public constructor(
    private baseSrc: TheInformation<T>,
    private triggerSrc: TheInformation<unknown>,
  ) {
    super();
  }

  public value(o: TheOwner<T>): this {
    const baseSync = new Sync(this.baseSrc);
    this.triggerSrc.value(
      new From(() => {
        if (isFilled(baseSync.valueSync())) {
          o.give(baseSync.valueSync());
        }
      }),
    );
    return this;
  }
}
