import { applied, InformationType } from "silentium";

/**
 * Represents the first element of an array.
 */
export const first = <T extends Array<unknown>>(
  baseSrc: InformationType<T>,
): InformationType<T[0]> => {
  return applied(baseSrc, (a) => a[0]);
};
