import { I, Information, O, ownerSync } from "silentium";

/**
 * Defer one source after another, gives values of baseSrc only once when triggerSrc responds
 * https://silentium-lab.github.io/silentium-components/#/behaviors/deferred
 */
export const deferred = <T>(
  baseSrc: Information<T>,
  triggerSrc: Information<unknown>,
) => {
  return I((o) => {
    const baseSync = ownerSync(baseSrc);

    triggerSrc.value(
      O(() => {
        if (
          baseSync.syncValue() !== null &&
          baseSync.syncValue() !== undefined
        ) {
          o.give(baseSync.syncValue());
        }
      }),
    );
  });
};
