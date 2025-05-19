import { value, sourceAll, patron, sourceOf, patronOnce, guestCast, give, subSourceMany, sourceFiltered, subSource, sourceResettable, removePatronFromPools, guestDisposable, destroy, guestSync, sourceCombined, sourceAny, sourceChain } from 'silentium';

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

const tick = (baseSrc) => {
  const result = sourceOf();
  subSource(result, baseSrc);
  let microtaskScheduled = false;
  let lastValue = null;
  const scheduleMicrotask = () => {
    microtaskScheduled = true;
    queueMicrotask(() => {
      microtaskScheduled = false;
      if (lastValue !== null) {
        give(lastValue, result);
        lastValue = null;
      }
    });
  };
  value(
    baseSrc,
    patron((v) => {
      lastValue = v;
      if (!microtaskScheduled) {
        scheduleMicrotask();
      }
    })
  );
  return result;
};

const fork = (conditionSrc, predicate, thenSrc, elseSrc) => {
  const result = sourceOf();
  const reset = sourceOf();
  const resultResettable = sourceResettable(result, reset);
  let thenPatron;
  let elsePatron;
  value(
    conditionSrc,
    patron((v) => {
      reset.give(1);
      if (thenPatron) {
        removePatronFromPools(thenPatron);
      }
      if (elsePatron) {
        removePatronFromPools(elsePatron);
      }
      if (predicate(v)) {
        thenPatron = patronOnce(result);
        value(thenSrc, thenPatron);
      } else if (elseSrc) {
        elsePatron = patronOnce(result);
        value(elseSrc, elsePatron);
      }
    })
  );
  return resultResettable;
};

const deferred = (baseSrc, triggerSrc) => {
  const result = sourceResettable(sourceOf(), baseSrc);
  value(
    triggerSrc,
    patron(() => {
      value(baseSrc, result);
    })
  );
  return result.value;
};

const branch = (conditionSrc, thenSrc, elseSrc) => {
  const result = sourceOf();
  value(
    conditionSrc,
    patron((v) => {
      if (v === true) {
        value(
          thenSrc,
          patronOnce((v2) => {
            result.give(v2);
          })
        );
      } else if (elseSrc !== void 0) {
        value(
          elseSrc,
          patronOnce((v2) => {
            result.give(v2);
          })
        );
      }
    })
  );
  return result.value;
};

const memo = (baseSrc) => {
  const result = sourceOf();
  let lastValue = null;
  value(
    baseSrc,
    patron((v) => {
      if (v !== lastValue) {
        result.give(v);
        lastValue = v;
      }
    })
  );
  return result.value;
};

const lock = (baseSrc, lockSrc) => {
  const result = sourceOf();
  const resultResettable = sourceResettable(result, lockSrc);
  let locked = false;
  subSource(result, baseSrc);
  value(baseSrc, patron(guestDisposable(result.give, () => locked)));
  value(
    lockSrc,
    patronOnce(() => {
      locked = true;
      destroy([result]);
    })
  );
  return resultResettable.value;
};

const moment = (baseSrc, defaultValue) => {
  const guest = guestSync(defaultValue);
  value(baseSrc, guest);
  return (g) => {
    give(guest.value(), g);
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

const record = (recordSrc) => {
  const keys = Object.keys(recordSrc);
  return sourceCombined(...Object.values(recordSrc))(
    (g, ...entries) => {
      const record2 = {};
      entries.forEach((entry, index) => {
        record2[keys[index]] = entry;
      });
      give(record2, g);
    }
  );
};

const concatenated = (sources, joinPartSrc = "") => {
  const result = sourceCombined(
    joinPartSrc,
    ...sources
  )((g, joinPart, ...strings) => {
    give(strings.join(joinPart), g);
  });
  return result;
};

const regexpMatched = (patternSrc, valueSrc, flagsSrc = "") => sourceCombined(
  patternSrc,
  valueSrc,
  flagsSrc
)((g, pattern, value, flags) => {
  give(new RegExp(pattern, flags).test(value), g);
});

const router = (urlSrc, routesSrc, defaultSrc) => {
  const resultSrc = sourceOf();
  value(
    routesSrc,
    patron((routes) => {
      value(
        sourceAny([
          sourceChain(urlSrc, defaultSrc),
          ...routes.map(
            (r) => sourceChain(
              sourceFiltered(
                regexpMatched(r.pattern, urlSrc, r.patternFlags),
                Boolean
              ),
              r.template
            )
          )
        ]),
        patron(resultSrc)
      );
    })
  );
  return resultSrc.value;
};

const regexpReplaced = (valueSrc, patternSrc, replaceValueSrc, flagsSrc = "") => sourceCombined(
  patternSrc,
  valueSrc,
  replaceValueSrc,
  flagsSrc
)((g, pattern, value, replaceValue, flags) => {
  give(String(value).replace(new RegExp(pattern, flags), replaceValue), g);
});

const regexpMatch = (patternSrc, valueSrc, flagsSrc = "") => sourceCombined(
  patternSrc,
  valueSrc,
  flagsSrc
)((g, pattern, value, flags) => {
  const result = new RegExp(pattern, flags).exec(value);
  give(result ?? [], g);
});

const set = (baseSrc, keySrc, valueSrc) => {
  value(
    sourceAll([baseSrc, keySrc, valueSrc]),
    patron(([base, key, value2]) => {
      base[key] = value2;
    })
  );
  return baseSrc;
};

const and = (oneSrc, twoSrc) => {
  return sourceCombined(
    oneSrc,
    twoSrc
  )((guest, one, two) => {
    give(one && two, guest);
  });
};

const or = (oneSrc, twoSrc) => {
  return sourceCombined(
    oneSrc,
    twoSrc
  )((guest, one, two) => {
    give(one || two, guest);
  });
};

const not = (baseSrc) => {
  return (g) => {
    value(
      baseSrc,
      guestCast(g, (base) => {
        give(!base, g);
      })
    );
  };
};

export { and, branch, concatenated, deadline, deferred, dirty, fork, groupActiveClass, hashTable, loading, lock, memo, moment, not, or, path, record, regexpMatch, regexpMatched, regexpReplaced, router, set, tick };
//# sourceMappingURL=silentium-components.mjs.map
