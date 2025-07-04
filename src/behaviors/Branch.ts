import { I, Information, InfoSync, O, ownerSync } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
export const branch = <Then, Else>(
  condition: Information<boolean>,
  left: Information<Then>,
  right?: Information<Else>,
): Information<Then | Else> => {
  return I((o) => {
    const leftSync = ownerSync(left);
    let rightSync: InfoSync<Else> | undefined;

    if (right !== undefined) {
      rightSync = ownerSync(right);
    }

    condition.value(
      O((v) => {
        if (v) {
          o.give(leftSync.syncValue());
        } else if (rightSync) {
          o.give(rightSync.syncValue());
        }
      }),
    );
  });
};
