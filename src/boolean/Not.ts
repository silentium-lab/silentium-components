import { DataType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
export const not = (baseSrc: DataType<boolean>): DataType<boolean> => {
  return (u) => {
    baseSrc((v) => {
      u(!v);
    });
  };
};
