import { sourceAll, SourceType, systemPatron, value } from "silentium";

/**
 * Ability to mutate some object, helpful when integrate to procedure systems
 * https://silentium-lab.github.io/silentium-components/#/system/set
 */
export const set = <T extends Record<string, unknown>>(
  baseSrc: SourceType<T>,
  keySrc: SourceType<string>,
  valueSrc: SourceType<unknown>,
) => {
  value(
    sourceAll([baseSrc, keySrc, valueSrc]),
    systemPatron(([base, key, value]) => {
      (base as Record<string, unknown>)[key] = value;
    }),
  );

  return baseSrc;
};
