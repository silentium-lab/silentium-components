import { value, sourceAll, patron, sourceOf, patronOnce, guestCast, give, subSourceMany, sourceFiltered, subSource } from 'silentium';

const groupActiveClass = (activeClassSrc, activeElementSrc, groupElementsSrc) => {
  value(
    sourceAll([activeClassSrc, activeElementSrc, groupElementsSrc]),
    patron(([activeClass, activeElement, groupElements]) => {
      groupElements.forEach((el) => {
        if (el.classList) {
          el.classList.remove(activeClass);
        }
      });
      activeElement.classList.add(activeClass);
    })
  );
  return groupElementsSrc;
};

const dirty = (baseEntitySource, becomePatronAuto = false, alwaysKeep = [], excludeKeys = []) => {
  const comparingSrc = sourceOf();
  const all = sourceAll([comparingSrc, baseEntitySource]);
  const result = {
    give(value2) {
      give(JSON.parse(JSON.stringify(value2)), comparingSrc);
      return result;
    },
    value(guest) {
      value(
        all,
        guestCast(guest, ([comparing, base]) => {
          if (!comparing) {
            return;
          }
          give(
            Object.fromEntries(
              Object.entries(comparing).filter(([key, value2]) => {
                if (alwaysKeep.includes(key)) {
                  return true;
                }
                if (excludeKeys.includes(key)) {
                  return false;
                }
                return value2 !== base[key];
              })
            ),
            guest
          );
        })
      );
      return result;
    }
  };
  if (becomePatronAuto) {
    value(baseEntitySource, patronOnce(result));
  }
  return result;
};

const loading = (loadingStartSource, loadingFinishSource) => {
  const loadingSrc = sourceOf();
  subSourceMany(loadingSrc, [loadingStartSource, loadingFinishSource]);
  value(
    loadingStartSource,
    patron(() => {
      loadingSrc.give(true);
    })
  );
  value(
    loadingFinishSource,
    patron(() => {
      loadingSrc.give(false);
    })
  );
  return loadingSrc.value;
};

const path = (baseSrc, keySrc) => {
  const pathSrc = sourceOf();
  subSourceMany(pathSrc, [baseSrc, keySrc]);
  value(
    sourceAll([baseSrc, keySrc]),
    patron(([base, key]) => {
      const keyChunks = key.split(".");
      let value2 = base;
      keyChunks.forEach((keyChunk) => {
        value2 = value2[keyChunk];
      });
      if (value2 !== void 0 && value2 !== base) {
        give(value2, pathSrc);
      }
    })
  );
  return pathSrc.value;
};

const deadline = (error, baseSrc, timeoutSrc) => {
  let timerHead = null;
  return (g) => {
    value(
      timeoutSrc,
      guestCast(g, (timeout) => {
        if (timerHead) {
          clearTimeout(timerHead);
        }
        let timeoutReached = false;
        timerHead = setTimeout(() => {
          if (timeoutReached) {
            return;
          }
          timeoutReached = true;
          give(new Error("Timeout reached in Deadline class"), error);
        }, timeout);
        value(
          sourceFiltered(baseSrc, () => !timeoutReached),
          g
        );
        value(
          baseSrc,
          patronOnce(() => {
            timeoutReached = true;
          })
        );
      })
    );
  };
};

const hashTable = (baseSource) => {
  const result = sourceOf({});
  subSource(result, baseSource);
  value(
    baseSource,
    patron(([key, value2]) => {
      result.value((lastRecord) => {
        lastRecord[key] = value2;
      });
    })
  );
  return result.value;
};

export { deadline, dirty, groupActiveClass, hashTable, loading, path };
//# sourceMappingURL=silentium-components.js.map
