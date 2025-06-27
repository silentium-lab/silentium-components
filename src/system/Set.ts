import { all, I, Information, O } from "silentium";

/**
 * Ability to mutate some object, helpful when integrate to procedure systems
 * https://silentium-lab.github.io/silentium-components/#/system/set
 */
export const set = <T extends Record<string, unknown>>(
  baseSrc: Information<T>,
  keySrc: Information<string>,
  valueSrc: Information<unknown>,
) => {
  return I((o) => {
    all(baseSrc, keySrc, valueSrc).value(
      O(([base, key, value]) => {
        (base as Record<string, unknown>)[key] = value;
        o.give(base);
      }),
    );
  });
};
