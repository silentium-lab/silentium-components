import { patron, sourceOf, SourceType, subSourceMany, value } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/loading
 */
export const loading = (
  loadingStartSource: SourceType<unknown>,
  loadingFinishSource: SourceType<unknown>,
) => {
  const loadingSrc = sourceOf<boolean>();
  subSourceMany(loadingSrc, [loadingStartSource, loadingFinishSource]);

  value(
    loadingStartSource,
    patron(() => {
      loadingSrc.give(true);
    }),
  );
  value(
    loadingFinishSource,
    patron(() => {
      loadingSrc.give(false);
    }),
  );

  return loadingSrc.value;
};
