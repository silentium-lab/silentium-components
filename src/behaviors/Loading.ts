import { DataType } from "silentium";

/**
 * Representation of loading process
 * first informatin source begins loading
 * second information source stops loading
 * https://silentium-lab.github.io/silentium-components/#/behaviors/loading
 */
export const loading = (
  loadingStartSrc: DataType<unknown>,
  loadingFinishSrc: DataType<unknown>,
): DataType<boolean> => {
  return (u) => {
    loadingStartSrc(() => u(true));
    loadingFinishSrc(() => u(false));
  };
};
