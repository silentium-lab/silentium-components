import { all, DataType } from "silentium";

/**
 * Ability to mutate some object, helpful when integrate to procedure systems
 * https://silentium-lab.github.io/silentium-components/#/system/set
 */
export const set = <T extends Record<string, unknown>>(
  baseSrc: DataType<T>,
  keySrc: DataType<string>,
  valueSrc: DataType<unknown>,
): DataType<T> => {
  return (u) => {
    all(
      baseSrc,
      keySrc,
      valueSrc,
    )(([base, key, value]) => {
      (base as Record<string, unknown>)[key] = value;
      u(base);
    });
  };
};
