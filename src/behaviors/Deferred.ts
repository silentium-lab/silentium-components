import {
  From,
  InformationType,
  isFilled,
  OwnerType,
  TheInformation,
} from "silentium";
import { Sync } from "./Sync";

/**
 * Defer one source after another, gives values of baseSrc only once when triggerSrc responds
 * https://silentium-lab.github.io/silentium-components/#/behaviors/deferred
 */
export class Deferred<T> extends TheInformation<T> {
  public constructor(
    private baseSrc: InformationType<T>,
    private triggerSrc: InformationType<unknown>,
  ) {
    super();
  }

  public value(o: OwnerType<T>): this {
    const baseSync = new Sync(this.baseSrc).initOwner();
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
