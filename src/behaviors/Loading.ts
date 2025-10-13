import { EventType } from "silentium";

/**
 * Representation Of loading process
 * first informatin source begins loading
 * second information source stops loading
 * https://silentium-lab.github.io/silentium-components/#/behaviors/loading
 */
export const loading = (
  loadingStartSrc: EventType<unknown>,
  loadingFinishSrc: EventType<unknown>,
): EventType<boolean> => {
  return (u) => {
    loadingStartSrc(() => u(true));
    loadingFinishSrc(() => u(false));
  };
};
