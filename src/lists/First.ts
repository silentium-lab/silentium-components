import { applied, DataType } from "silentium";

/**
 * Represents the first element of an array.
 */
export const first = <T extends Array<unknown>>(
  baseSrc: DataType<T>,
): DataType<T[0]> => {
  return (u) => {
    applied(baseSrc, (a) => a[0])(u);
  };
};
