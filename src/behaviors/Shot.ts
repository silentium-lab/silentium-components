import { InformationType, isFilled } from "silentium";
import { sync } from "./Sync";

/**
 * Helps to represent only last fresh value of some source, refreshing controls by shotSrc
 * https://silentium-lab.github.io/silentium-components/#/behaviors/shot
 */
export const shot = <T>(
  targetSrc: InformationType<T>,
  triggerSrc: InformationType,
): InformationType<T> => {
  return (o) => {
    const targetSync = sync(targetSrc);

    triggerSrc(() => {
      if (isFilled(targetSync.value())) {
        o(targetSync.value());
      }
    });
  };
};
