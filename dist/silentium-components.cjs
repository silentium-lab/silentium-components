'use strict';

var silentium = require('silentium');

const groupActiveClass = (activeClassSrc, activeElementSrc, groupElementsSrc) => {
  silentium.value(
    silentium.sourceAll([activeClassSrc, activeElementSrc, groupElementsSrc]),
    silentium.systemPatron(([activeClass, activeElement, groupElements]) => {
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
  const comparingSrc = silentium.sourceOf();
  const all = silentium.sourceAll([comparingSrc, baseEntitySource]);
  const result = {
    give(value2) {
      silentium.give(JSON.parse(JSON.stringify(value2)), comparingSrc);
      return result;
    },
    value(guest) {
      silentium.value(
        all,
        silentium.guestCast(guest, ([comparing, base]) => {
          if (!comparing) {
            return;
          }
          silentium.give(
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
    silentium.value(baseEntitySource, silentium.patronOnce(result));
  }
  return result;
};

const loading = (loadingStartSource, loadingFinishSource) => {
  const loadingSrc = silentium.sourceOf();
  silentium.subSourceMany(loadingSrc, [loadingStartSource, loadingFinishSource]);
  silentium.value(
    loadingStartSource,
    silentium.systemPatron(() => {
      loadingSrc.give(true);
    })
  );
  silentium.value(
    loadingFinishSource,
    silentium.systemPatron(() => {
      loadingSrc.give(false);
    })
  );
  return loadingSrc.value;
};

const path = (baseSrc, keySrc) => {
  const pathSrc = silentium.sourceOf();
  silentium.subSourceMany(pathSrc, [baseSrc, keySrc]);
  silentium.value(
    silentium.sourceAll([baseSrc, keySrc]),
    silentium.systemPatron(([base, key]) => {
      const keyChunks = key.split(".");
      let value2 = base;
      keyChunks.forEach((keyChunk) => {
        value2 = value2[keyChunk];
      });
      if (value2 !== void 0 && value2 !== base) {
        silentium.give(value2, pathSrc);
      }
    })
  );
  return pathSrc.value;
};

const deadline = (error, baseSrc, timeoutSrc) => {
  let timerHead = null;
  return (g) => {
    silentium.value(
      timeoutSrc,
      silentium.guestCast(g, (timeout) => {
        if (timerHead) {
          clearTimeout(timerHead);
        }
        let timeoutReached = false;
        timerHead = setTimeout(() => {
          if (timeoutReached) {
            return;
          }
          timeoutReached = true;
          silentium.give(new Error("Timeout reached in Deadline class"), error);
        }, timeout);
        silentium.value(
          silentium.sourceFiltered(baseSrc, () => !timeoutReached),
          g
        );
        silentium.value(
          baseSrc,
          silentium.patronOnce(() => {
            timeoutReached = true;
          })
        );
      })
    );
  };
};

const tick = (baseSrc) => {
  const result = silentium.sourceOf();
  silentium.subSource(result, baseSrc);
  let microtaskScheduled = false;
  let lastValue = null;
  const scheduleMicrotask = () => {
    microtaskScheduled = true;
    queueMicrotask(() => {
      microtaskScheduled = false;
      if (lastValue !== null) {
        silentium.give(lastValue, result);
        lastValue = null;
      }
    });
  };
  silentium.value(
    baseSrc,
    silentium.systemPatron((v) => {
      lastValue = v;
      if (!microtaskScheduled) {
        scheduleMicrotask();
      }
    })
  );
  return result;
};

const fork = (conditionSrc, predicate, thenSrc, elseSrc) => {
  const result = silentium.sourceOf();
  const reset = silentium.sourceOf();
  const resultResettable = silentium.sourceResettable(result, reset);
  let thenPatron;
  let elsePatron;
  silentium.value(
    conditionSrc,
    silentium.systemPatron((v) => {
      reset.give(1);
      if (thenPatron) {
        silentium.removePatronFromPools(thenPatron);
      }
      if (elsePatron) {
        silentium.removePatronFromPools(elsePatron);
      }
      if (predicate(v)) {
        thenPatron = silentium.patronOnce(result);
        silentium.value(thenSrc, thenPatron);
      } else if (elseSrc) {
        elsePatron = silentium.patronOnce(result);
        silentium.value(elseSrc, elsePatron);
      }
    })
  );
  return resultResettable;
};

const deferred = (baseSrc, triggerSrc) => {
  const result = silentium.sourceResettable(silentium.sourceOf(), baseSrc);
  const visited = silentium.firstVisit(() => {
    silentium.value(
      triggerSrc,
      silentium.systemPatron(() => {
        silentium.value(baseSrc, result);
      })
    );
  });
  return (g) => {
    visited();
    silentium.value(result, g);
  };
};

const branch = (conditionSrc, thenSrc, elseSrc) => {
  const resetSrc = silentium.sourceOf();
  const result = silentium.sourceOf();
  const resultSrc = silentium.sourceResettable(result, resetSrc);
  const visited = silentium.firstVisit(() => {
    silentium.value(
      conditionSrc,
      silentium.systemPatron((v) => {
        resetSrc.give(1);
        if (v === true) {
          silentium.value(thenSrc, silentium.patronOnce(result.give));
        } else if (elseSrc !== void 0) {
          silentium.value(elseSrc, silentium.patronOnce(result.give));
        }
      })
    );
  });
  return (g) => {
    visited();
    resultSrc.value(g);
  };
};

const memo = (baseSrc) => {
  const result = silentium.sourceOf();
  let lastValue = null;
  silentium.value(
    baseSrc,
    silentium.systemPatron((v) => {
      if (v !== lastValue) {
        result.give(v);
        lastValue = v;
      }
    })
  );
  return result.value;
};

const lock = (baseSrc, lockSrc) => {
  const result = silentium.sourceOf();
  const resultResettable = silentium.sourceResettable(result, lockSrc);
  let locked = false;
  silentium.subSource(result, baseSrc);
  silentium.value(baseSrc, silentium.systemPatron(silentium.guestDisposable(result.give, () => locked)));
  silentium.value(
    lockSrc,
    silentium.patronOnce(() => {
      locked = true;
      silentium.destroy([result]);
    })
  );
  return resultResettable;
};

const moment = (baseSrc, defaultValue) => {
  const guest = silentium.guestSync(defaultValue);
  silentium.value(baseSrc, guest);
  return (g) => {
    silentium.give(guest.value(), g);
  };
};

const shot = (baseSrc, shotSrc) => {
  const resetResult = silentium.sourceOf();
  const result = silentium.sourceOf();
  const baseSrcSync = silentium.sourceSync(baseSrc, null);
  silentium.value(
    shotSrc,
    silentium.systemPatron(() => {
      if (baseSrcSync.syncValue() !== null) {
        result.give(baseSrcSync.syncValue());
        resetResult.give(1);
      }
    })
  );
  return silentium.sourceResettable(result, resetResult);
};

const onlyChanged = (baseSrc) => {
  let firstValue = false;
  return silentium.source((g) => {
    silentium.value(
      baseSrc,
      silentium.guestCast(g, (v) => {
        if (firstValue === false) {
          firstValue = true;
        } else {
          silentium.give(v, g);
        }
      })
    );
  });
};

const hashTable = (baseSource) => {
  const result = silentium.sourceOf({});
  silentium.subSource(result, baseSource);
  silentium.value(
    baseSource,
    silentium.systemPatron(([key, value2]) => {
      result.value((lastRecord) => {
        lastRecord[key] = value2;
      });
    })
  );
  return result.value;
};

const record = (recordSrc) => {
  const keys = Object.keys(recordSrc);
  return silentium.sourceCombined(...Object.values(recordSrc))(
    (g, ...entries) => {
      const record2 = {};
      entries.forEach((entry, index) => {
        record2[keys[index]] = entry;
      });
      silentium.give(record2, g);
    }
  );
};

const concatenated = (sources, joinPartSrc = "") => {
  const result = silentium.sourceCombined(
    joinPartSrc,
    ...sources
  )((g, joinPart, ...strings) => {
    silentium.give(strings.join(joinPart), g);
  });
  return result;
};

const polling = (targetSrc, triggerSrc) => {
  const resultSrc = silentium.sourceOf();
  const visited = silentium.firstVisit(() => {
    silentium.value(
      triggerSrc,
      silentium.systemPatron(() => {
        silentium.value(targetSrc, resultSrc);
      })
    );
  });
  return (g) => {
    visited();
    resultSrc.value(g);
  };
};

const priority = (sources) => {
  return (g) => {
    let highestPriorityIndex = 0;
    let highestPriorityResult;
    sources.forEach((source, index) => {
      silentium.value(source, (v) => {
        if (highestPriorityIndex <= index) {
          highestPriorityIndex = index;
          highestPriorityResult = v;
        }
      });
    });
    if (highestPriorityResult !== void 0) {
      silentium.give(highestPriorityResult, g);
    }
  };
};

const regexpMatched = (patternSrc, valueSrc, flagsSrc = "") => silentium.sourceCombined(
  patternSrc,
  valueSrc,
  flagsSrc
)((g, pattern, value, flags) => {
  silentium.give(new RegExp(pattern, flags).test(value), g);
});

const router = (urlSrc, routesSrc, defaultSrc) => {
  const resultSrc = silentium.sourceOf();
  const visited = silentium.firstVisit(() => {
    silentium.value(
      routesSrc,
      silentium.patronOnce((routes) => {
        const prioritySrc = priority([
          defaultSrc,
          ...routes.map(
            (r) => silentium.value(
              branch(
                regexpMatched(r.pattern, urlSrc, r.patternFlags),
                r.template
              ),
              silentium.systemPatron((v) => {
                return v;
              })
            )
          )
        ]);
        const pollingSrc = polling(prioritySrc, urlSrc);
        silentium.value(pollingSrc, silentium.systemPatron(resultSrc));
      })
    );
  });
  return (g) => {
    visited();
    resultSrc.value(g);
  };
};

const regexpReplaced = (valueSrc, patternSrc, replaceValueSrc, flagsSrc = "") => silentium.sourceCombined(
  patternSrc,
  valueSrc,
  replaceValueSrc,
  flagsSrc
)((g, pattern, value, replaceValue, flags) => {
  silentium.give(String(value).replace(new RegExp(pattern, flags), replaceValue), g);
});

const regexpMatch = (patternSrc, valueSrc, flagsSrc = "") => silentium.sourceCombined(
  patternSrc,
  valueSrc,
  flagsSrc
)((g, pattern, value, flags) => {
  const result = new RegExp(pattern, flags).exec(value);
  silentium.give(result ?? [], g);
});

const set = (baseSrc, keySrc, valueSrc) => {
  silentium.value(
    silentium.sourceAll([baseSrc, keySrc, valueSrc]),
    silentium.systemPatron(([base, key, value2]) => {
      base[key] = value2;
    })
  );
  return baseSrc;
};

const promised = (promise, errorGuest) => {
  const resultSrc = silentium.sourceOf();
  const visited = silentium.firstVisit(() => {
    promise.then(resultSrc.give).catch((e) => {
      silentium.give(e, errorGuest);
    });
  });
  return (g) => {
    visited();
    resultSrc.value(g);
  };
};

const and = (oneSrc, twoSrc) => {
  return silentium.sourceCombined(
    oneSrc,
    twoSrc
  )((guest, one, two) => {
    silentium.give(one && two, guest);
  });
};

const or = (oneSrc, twoSrc) => {
  return silentium.sourceCombined(
    oneSrc,
    twoSrc
  )((guest, one, two) => {
    silentium.give(one || two, guest);
  });
};

const not = (baseSrc) => {
  return (g) => {
    silentium.value(
      baseSrc,
      silentium.guestCast(g, (base) => {
        silentium.give(!base, g);
      })
    );
  };
};

exports.and = and;
exports.branch = branch;
exports.concatenated = concatenated;
exports.deadline = deadline;
exports.deferred = deferred;
exports.dirty = dirty;
exports.fork = fork;
exports.groupActiveClass = groupActiveClass;
exports.hashTable = hashTable;
exports.loading = loading;
exports.lock = lock;
exports.memo = memo;
exports.moment = moment;
exports.not = not;
exports.onlyChanged = onlyChanged;
exports.or = or;
exports.path = path;
exports.promised = promised;
exports.record = record;
exports.regexpMatch = regexpMatch;
exports.regexpMatched = regexpMatched;
exports.regexpReplaced = regexpReplaced;
exports.router = router;
exports.set = set;
exports.shot = shot;
exports.tick = tick;
//# sourceMappingURL=silentium-components.cjs.map
