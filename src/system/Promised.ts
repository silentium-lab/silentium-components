import { firstVisit, give, GuestType, sourceOf } from "silentium";

/**
 * Turn promise into source
 * https://silentium-lab.github.io/silentium-components/#/system/promised
 */
export const promised = <T>(
  promise: Promise<T>,
  errorGuest: GuestType<Error>,
) => {
  const resultSrc = sourceOf<T>();

  const visited = firstVisit(() => {
    promise.then(resultSrc.give).catch((e) => {
      give(e, errorGuest);
    });
  });

  return (g: GuestType<T>) => {
    visited();
    resultSrc.value(g);
  };
};
