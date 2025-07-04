import { I, Information, O, ownerSync } from "silentium";

/**
 * Helps to represent only last fresh value of some source, refreshing controls by shotSrc
 * https://silentium-lab.github.io/silentium-components/#/behaviors/shot
 */
export const shot = <T>(
  targetSrc: Information<T>,
  triggerSrc: Information,
): Information<T> => {
  return I((o) => {
    const targetSync = ownerSync(targetSrc);

    triggerSrc.value(
      O(() => {
        if (targetSync.filled()) {
          o.give(targetSync.syncValue());
        }
      }),
    );
  });
};
