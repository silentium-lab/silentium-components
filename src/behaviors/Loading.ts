import { EventType } from "silentium";

/**
 * Representation Of loading process
 * first informatin source begins loading
 * second information source stops loading
 * https://silentium-lab.github.io/silentium-components/#/behaviors/loading
 */
export function Loading(
  loadingStartSrc: EventType<unknown>,
  loadingFinishSrc: EventType<unknown>,
): EventType<boolean> {
  return (user) => {
    loadingStartSrc(() => user(true));
    loadingFinishSrc(() => user(false));
  };
}
