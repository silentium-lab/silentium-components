import { All, EventType } from "silentium";

/**
 * Ability to mutate some object, helpful when integrate to procedure systems
 * https://silentium-lab.github.io/silentium-components/#/system/set
 */
export function Set<T extends Record<string, unknown>>(
  baseSrc: EventType<T>,
  keySrc: EventType<string>,
  valueSrc: EventType<unknown>,
): EventType<T> {
  return (user) => {
    All(
      baseSrc,
      keySrc,
      valueSrc,
    )(([base, key, value]) => {
      (base as Record<string, unknown>)[key] = value;
      user(base);
    });
  };
}
