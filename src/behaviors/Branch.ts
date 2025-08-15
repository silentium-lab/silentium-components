import { InformationType } from "silentium";
import { sync } from "./Sync";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
export const branch = <Then, Else>(
  condition: InformationType<boolean>,
  left: InformationType<Then>,
  right?: InformationType<Else>,
): InformationType<Then | Else> => {
  return (o) => {
    const leftSync = sync(left);
    let rightSync: { value: () => Else };

    if (right !== undefined) {
      rightSync = sync(right);
    }

    condition((v) => {
      if (v) {
        o(leftSync.value());
      } else if (rightSync) {
        o(rightSync.value());
      }
    });
  };
};
