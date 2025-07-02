import { Information, O, of } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/loading
 */
export const loading = (
  loadingStartSource: Information<unknown>,
  loadingFinishSource: Information<unknown>,
) => {
  const [loadingSrc, lo] = of<boolean>();

  loadingSrc.executed(() => {
    loadingStartSource.value(
      O(() => {
        lo.give(true);
      }),
    );

    loadingFinishSource.value(
      O(() => {
        lo.give(false);
      }),
    );
  });

  return loadingSrc;
};
