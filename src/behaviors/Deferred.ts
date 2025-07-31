import { InformationType, isFilled } from "silentium";
import { sync } from "./Sync";

/**
 * Defer one source after another, gives values of baseSrc only once when triggerSrc responds
 * https://silentium-lab.github.io/silentium-components/#/behaviors/deferred
 */
export const deferred = <T>(
  baseSrc: InformationType<T>,
  triggerSrc: InformationType<unknown>,
): InformationType<T> => {
  return (o) => {
    const baseSync = sync(baseSrc);

    triggerSrc(() => {
      if (isFilled(baseSync.value())) {
        o(baseSync.value());
      }
    });
  };
};
