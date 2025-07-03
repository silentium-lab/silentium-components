import { I, Information, O, ownerSync } from "silentium";

export const polling = <T>(
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
