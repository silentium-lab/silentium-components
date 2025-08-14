import { all, InformationType } from "silentium";

/**
 * Ability to mutate some object, helpful when integrate to procedure systems
 * https://silentium-lab.github.io/silentium-components/#/system/set
 */
export const set = <T extends Record<string, unknown>>(
  baseSrc: InformationType<T>,
  keySrc: InformationType<string>,
  valueSrc: InformationType<unknown>,
): InformationType<T> => {
  return (o) => {
    all(
      baseSrc,
      keySrc,
      valueSrc,
    )(([base, key, value]) => {
      (base as Record<string, unknown>)[key] = value;
      o(base);
    });
  };
};
