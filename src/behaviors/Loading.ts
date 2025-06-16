import {
  sourceOf,
  SourceType,
  subSourceMany,
  systemPatron,
  value,
} from "silentium";

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
    systemPatron(() => {
      loadingSrc.give(true);
    }),
  );
  value(
    loadingFinishSource,
    systemPatron(() => {
      loadingSrc.give(false);
    }),
  );

  return loadingSrc.value;
};
