import { InformationType, TheInformation } from "silentium";

/**
 * Representation of loading process
 * first informatin source begins loading
 * second information source stops loading
 * https://silentium-lab.github.io/silentium-components/#/behaviors/loading
 */
export const loading = (
  loadingStartSource: InformationType<unknown>,
  loadingFinishSource: InformationType<unknown>,
): InformationType<boolean> => {
  return (o) => {
    loadingStartSource(() => {
      o(true);
    });

    loadingFinishSource(() => {
      o(false);
    });
  };
};

export class Loading<T> extends TheInformation<T> {}
