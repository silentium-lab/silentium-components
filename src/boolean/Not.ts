import { I, Information, O } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
export const not = (baseSrc: Information<boolean>) => {
  return I((o) => {
    baseSrc.value(
      O((v) => {
        o.give(!v);
      }),
    );
  });
};
